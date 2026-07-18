"use client";

import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function LoomThreads() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const rows = 32;
    const cols = 48;
    const positions: number[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const x1 = (c / cols - 0.5) * 6;
        const y1 = (r / rows - 0.5) * 4;
        const x2 = ((c + 1) / cols - 0.5) * 6;
        positions.push(x1, y1, 0, x2, y1, 0);
      }
    }

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 1; r++) {
        const x1 = (c / cols - 0.5) * 6;
        const y1 = (r / rows - 0.5) * 4;
        const y2 = ((r + 1) / rows - 0.5) * 4;
        positions.push(x1, y1, 0, x1, y2, 0);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    const t = state.clock.elapsedTime;
    linesRef.current.rotation.y = Math.sin(t * 0.2) * 0.25;
    linesRef.current.rotation.x = Math.cos(t * 0.15) * 0.12;
    linesRef.current.position.z = Math.sin(t * 0.3) * 0.2;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#c9a962" transparent opacity={0.65} linewidth={1} />
    </lineSegments>
  );
}

export function LoomThreadsScene() {
  return (
    <>
      <color attach="background" args={["#1a1410"]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 0, 4]} intensity={0.8} color="#c9a962" />
      <LoomThreads />
      <Sparkles count={60} scale={8} size={2} speed={0.25} color="#6b2d3c" />
    </>
  );
}
