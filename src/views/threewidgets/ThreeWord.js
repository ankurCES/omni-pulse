import * as THREE from "three";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, TrackballControls } from "@react-three/drei";
import { generate } from "random-words";

function Word({ children, ...props }) {
  const color = new THREE.Color();
  const colorPallet = {
    Location: "#FFB30F",
    Subject: "#D8F793",
    Person: "#ED6A5A",
    Organization: "#A8F9FF",
    Article: "#3066BE",
  };
  const fontProps = {
    font: "/Inter-Bold.woff",
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const over = (e) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);
  // Change the mouse cursor on hover¨
  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => (document.body.style.cursor = "auto");
  }, [hovered]);
  // Tie component to the render-loop
  useFrame(({ camera }) => {
    ref.current.material.color.lerp(
      color.set(hovered ? "#A8F9FF" : colorPallet[props.type]),
      0.1
    );
  });
  return (
    <Billboard {...props}>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        onClick={() => console.log("clicked")}
        {...fontProps}
        children={children}
      />
    </Billboard>
  );
}

function Cloud({ count = 4, radius = 20, keywords }) {
  // Create a count x count random words with spherical distribution
  const words = useMemo(() => {
    const temp = [];
    const topicList = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (Object.keys(keywords).length + 1);
    const thetaSpan = (Math.PI * 2) / Object.keys(keywords).length;

    for (let i = 1; i < Object.keys(keywords).length + 1; i++) {
      for (let j = 0; j < Object.keys(keywords).length; j++) {
        let topic = Object.keys(keywords)[i - 1];
        let type = keywords[topic].type;
        let size = keywords[topic].count;
        if (topicList.indexOf(topic) === -1) {
          temp.push([
            new THREE.Vector3().setFromSpherical(
              spherical.set(
                radius,
                phiSpan * i,
                thetaSpan * j + size * Math.random(0, 1)
              )
            ),
            topic,
            type,
            size,
          ]);
          topicList.push(topic);
        }
      }
    }

    return temp;
  }, [count, radius]);
  return words.map(([pos, word, type, size], index) => (
    <Word key={index} position={pos} children={word} type={type} size={size} />
  ));
}

export default function ThreeWord({ count, radius, keywords }) {
  return (
    <div style={{ width: "80vw", height: "50vh", marginLeft: "1vh" }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
        <fog attach="fog" args={["#202025", 0, 80]} />
        <Suspense fallback={null}>
          <group rotation={[10, 10.5, 10]}>
            <Cloud count={count} radius={radius} keywords={keywords} />
          </group>
        </Suspense>
        <TrackballControls />
      </Canvas>
    </div>
  );
}
