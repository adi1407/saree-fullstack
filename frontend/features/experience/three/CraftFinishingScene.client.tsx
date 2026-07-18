"use client";

import { Float, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FoldedSaree() {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.15) * 0.3;
    ref.current.rotation.x = -0.2 + Math.cos(t * 0.12) * 0.08;
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.2 + Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <Float speed={1.2} floatIntensity={0.3}>
      <mesh ref={ref} scale={[2.8, 0.35, 1.6]}>
        <boxGeometry args={[2, 0.3, 1.2, 8, 2, 4]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#6b2d3c"
          emissive="#c9a962"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
    </Float>
  );
}

function ZariRings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        radius: 1.6 + i * 0.45,
        opacity: 0.5 - i * 0.12,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[ring.radius, 0.01, 8, 96]} />
          <meshBasicMaterial color="#c9a962" transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  );
}

export function CraftFinishingScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 1, 4]} intensity={1.1} color="#c9a962" />
      <pointLight position={[-2, -1, 2]} intensity={0.4} color="#6b2d3c" />
      <ZariRings />
      <FoldedSaree />
      <Sparkles count={90} scale={6} size={2} speed={0.28} color="#c9a962" />
    </>
  );
}
