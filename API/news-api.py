from flask import Flask, request, jsonify
from flask_cors import CORS 
import requests
import uuid
import json
import os
import ollama
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

NYT_API_BASE = "https://api.nytimes.com/svc/search/v2/articlesearch.json"
NYT_API_KEY = "7cDso5LdRi2ufMkXWwWm6nhkNK13cO7I"  # Replace this with your NYT API key

RELATION_MAP = {
    "subject": "DESCRIBES",
    "organization": "MENTIONED_IN",
    "person": "MENTIONED_IN",
    "location": "LOCATED_IN"
}

def get_or_create_node_id(key, node_ids):
    """Return a UUID for a given semantic key, generate if not existing"""
    if key not in node_ids:
        node_ids[key] = str(uuid.uuid4())
    return node_ids[key]

def get_top_keywords(articles):
    """Extract top keywords from articles"""
    keywords = {}
    for article in articles:
        for keyword in article.get("keywords", []):
            keyword_value = keyword["value"]
            if keyword_value not in keywords:
                keywords[keyword_value] = {
                    "type": keyword["name"],
                    "count": 0
                }
                keywords[keyword_value]["count"] = 0
            keywords[keyword_value]["count"] += 1
    return keywords

def build_graph_from_articles(docs):
    nodes = []
    links = []
    node_ids = {}

    for article in docs:
        if not article.get("headline") or not article.get("abstract"):
            continue  # Skip articles missing essential fields

        article_key = f"article:{article['_id']}"
        article_uuid = get_or_create_node_id(article_key, node_ids)

        # Add article node
        nodes.append({
            "id": article_uuid,
            "type": "article",
            "label": article["headline"]["main"],
            "content": article["abstract"]
        })

        # Add keyword nodes and links
        for keyword in article.get("keywords", []):
            keyword_key = f"{keyword['name']}:{keyword['value']}"
            keyword_uuid = get_or_create_node_id(keyword_key, node_ids)

            # Only add node if it hasn't already been added
            if keyword_uuid not in [n["id"] for n in nodes]:
                nodes.append({
                    "id": keyword_uuid,
                    "type": keyword["name"].lower(),
                    "label": keyword["value"],
                    "content": keyword["value"]
                })

            links.append({
                "source": article_uuid,
                "relation": RELATION_MAP[keyword["name"].lower()],
                "target": keyword_uuid
            })

    return {"nodes": nodes, "links": links}

# Build knowledge sentences from graph
def extract_knowledge_sentences(graph_data):
    nodes = {node["id"]: node for node in graph_data["nodes"] if "id" in node}
    sentences = []
    for link in graph_data["links"]:
        source = nodes.get(link["source"], {"name": link["source"]})
        target = nodes.get(link["target"], {"name": link["target"]})
        relation = link.get("relation", "RELATED_TO").replace("_", " ").lower()
        sentence = f"{source.get('content', source['id'])} {relation} {target.get('content', target['id'])}."
        sentences.append(sentence)
    return sentences

# Simple retrieval + generation
def answer_question(question, graph_data, top_k=5):
    knowledge_sentences = extract_knowledge_sentences(graph_data)

    # Embed sentences using sentence-transformers
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    corpus_embeddings = embedder.encode(knowledge_sentences, convert_to_tensor=True)

    question_embedding = embedder.encode(question, convert_to_tensor=True)
    hits = util.semantic_search(question_embedding, corpus_embeddings, top_k=top_k)[0]

    # Get top matching sentences
    retrieved = [knowledge_sentences[hit["corpus_id"]] for hit in hits]
    print(retrieved)
    context = "\n".join(retrieved)

    # Create prompt
    prompt = f"""You are a helpful assistant answering questions based on context only.
    Structure your answers with specifics and details.
    Context:
    {context}

    Question: {question}
    Answer:"""

    # Use Ollama to query the local LLM
    response = ollama.chat(model="llama3.2", messages=[
        {"role": "user", "content": prompt}
    ])

    return response['message']['content'].strip()

def analyze_graph_data_llm(query, filter_query, graph_data):
    if query and filter_query:
        relation_query = filter_query.split(":")[1]
        relation_type = filter_query.split(":")[0].split('.')[1]
        question = "Describe the data, relations, impact & anything else that can be infered from the provided context?"
        return answer_question(question, graph_data)
    else:
        return ""

@app.route("/nyt-graph", methods=["GET"])
def nyt_graph():
    # Extract query parameters
    query = request.args.get("q", "")
    begin_date = request.args.get("begin_date")
    end_date = request.args.get("end_date")
    fq = request.args.get("fq")

    # Build NYT API request
    params = {
        "q": query,
        "api-key": NYT_API_KEY
    }
    if begin_date:
        params["begin_date"] = begin_date
    if end_date:
        params["end_date"] = end_date
    if fq:
        params["fq"] = fq

    
    # Make the request to NYT API
    try:
        response = requests.get(NYT_API_BASE, params=params)
        response.raise_for_status()
        nyt_data = response.json()

        articles = nyt_data.get("response", {}).get("docs", [])
        graph_data = build_graph_from_articles(articles)
        keywords = get_top_keywords(articles)
        
        response_data = {
            "graph": graph_data,
            "keywords": keywords,
            "analysis": analyze_graph_data_llm(query, fq, graph_data)
        }

        return jsonify(response_data)

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
