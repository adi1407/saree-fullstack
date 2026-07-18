"use client";

import { Float, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function CocoonCluster() {
  const groupRef = useRef<THREE.Group>(null);

  const cocoons = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1.2,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.2,
      rot: Math.random() * Math.PI,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <group ref={groupRef}>
      {cocoons.map((c, i) => (
        <mesh key={i} position={c.position} rotation={[c.rot, c.rot * 0.5, 0]} scale={c.scale}>
          <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
          <meshStandardMaterial
            color="#f5e6c8"
            emissive="#c9a962"
            emissiveIntensity={0.15}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function SilkStrands() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const r = 1.8;
      positions.push(0, 0, 0, Math.cos(angle) * r, Math.sin(angle) * r * 0.6, Math.sin(angle) * 0.5);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#c9a962" transparent opacity={0.45} />
    </lineSegments>
  );
}

export function CraftLoomScene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 5]} intensity={1} color="#e8dcc4" />
      <pointLight position={[-2, 0, 3]} intensity={0.5} color="#6b2d3c" />
      <Float speed={1.8} floatIntensity={0.35}>
        <CocoonCluster />
      </Float>
      <SilkStrands />
      <Sparkles count={40} scale={5} size={1.5} speed={0.25} color="#c9a962" />
    </>
  );
}
