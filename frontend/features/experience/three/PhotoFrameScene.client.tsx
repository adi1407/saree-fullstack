"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface PhotoFrameMeshProps {
  imageUrl: string;
}

function PhotoFrameMesh({ imageUrl }: PhotoFrameMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(imageUrl);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
    groupRef.current.rotation.x = Math.cos(t * 0.25) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[2.2, 3.2, 0.08]} />
        <meshStandardMaterial color="#c9a962" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}

interface PhotoFrameSceneProps {
  imageUrl: string;
}

export function PhotoFrameScene({ imageUrl }: PhotoFrameSceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={0.7} />
      <PhotoFrameMesh imageUrl={imageUrl} />
    </>
  );
}
