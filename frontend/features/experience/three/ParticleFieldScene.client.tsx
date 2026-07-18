"use client";

import { Sparkles } from "@react-three/drei";

export function ParticleFieldScene() {
  return (
    <>
      <color attach="background" args={["#1a1410"]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 2, 4]} intensity={1.2} color="#c9a962" />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#6b2d3c" />
      <Sparkles count={200} scale={12} size={3} speed={0.5} color="#c9a962" />
      <Sparkles count={80} scale={8} size={1.5} speed={0.3} color="#6b2d3c" />
    </>
  );
}
