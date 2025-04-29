import ForceGraph3D from "react-force-graph-3d";

function ForeGraph({ blocks }) {
  const colorPallet = {
    location: "#FFB30F",
    subject: "#D8F793",
    person: "#ED6A5A",
    organization: "#A8F9FF",
    article: "#3066BE",
  };

  return (
    <ForceGraph3D
      linkDirectionalArrowLength={3}
      linkDirectionalArrowRelPos={1}
      graphData={blocks}
      className="newsfeed"
      nodeColor={(node) => {
        return colorPallet[node.type] || "#A8F9FF";
      }}
      clientHeight={100}
      clientWidth={100}
      nodeLabel={(node) => {
        return node.label;
      }}
      onNodeClick={(node) => {
        console.log("clicked", node);
      }}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      }}
    />
  );
}

export default function R3Graph({ blocks }) {
  return <ForeGraph blocks={blocks} />;
}
