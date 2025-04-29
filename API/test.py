import json
import os
import ollama
from sentence_transformers import SentenceTransformer, util

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
def answer_question(question, top_k=5):
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

# Load your graph data
with open("graphdata.json", "r") as f:
    graph_data = json.load(f)
knowledge_sentences = extract_knowledge_sentences(graph_data)

# Embed sentences using sentence-transformers
embedder = SentenceTransformer("all-MiniLM-L6-v2")
corpus_embeddings = embedder.encode(knowledge_sentences, convert_to_tensor=True)

question = "US trade tarrif relation to European Union ?"
print("Q:", question)
print("A:", answer_question(question))
