"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface LookbookSlideSceneProps {
  primary: string;
  secondary: string;
  accent: string;
}

function SlideSculpture({ primary, secondary }: { primary: string; secondary: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <torusKnotGeometry args={[1, 0.28, 128, 24]} />
          <meshStandardMaterial
            color={primary}
            metalness={0.7}
            roughness={0.25}
            emissive={secondary}
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.5]}>
        <ringGeometry args={[1.6, 1.65, 64]} />
        <meshBasicMaterial color={secondary} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function LookbookSlideScene({ primary, secondary, accent }: LookbookSlideSceneProps) {
  return (
    <>
      <color attach="background" args={["#1a1410"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} color={accent} />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color={secondary} />
      <SlideSculpture primary={primary} secondary={secondary} />
      <Sparkles count={80} scale={6} size={2} speed={0.3} color={accent} />
    </>
  );
}
