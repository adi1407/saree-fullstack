"use client";

import { Float, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function GoldenKnot() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
  });

  return (
    <Float speed={1.5} floatIntensity={0.4}>
      <mesh ref={ref} scale={1.1}>
        <torusKnotGeometry args={[1, 0.22, 200, 32]} />
        <meshStandardMaterial
          color="#c9a962"
          emissive="#6b2d3c"
          emissiveIntensity={0.25}
          metalness={0.85}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

function WireHalo() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = -state.clock.elapsedTime * 0.06;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.2, 0.008, 8, 128]} />
      <meshBasicMaterial color="#c9a962" transparent opacity={0.4} />
    </mesh>
  );
}

export function AboutPhilosophyScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 4]} intensity={1.2} color="#c9a962" />
      <pointLight position={[-3, 2, 1]} intensity={0.4} color="#6b2d3c" />
      <WireHalo />
      <GoldenKnot />
      <Sparkles count={100} scale={7} size={2} speed={0.3} color="#c9a962" />
    </>
  );
}
