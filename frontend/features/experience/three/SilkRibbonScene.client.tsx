"use client";

import { Float, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  silkRibbonFragmentShader,
  silkRibbonVertexShader,
} from "@/features/experience/three/shaders/silkRibbon.glsl";

export function SilkRibbonMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.15) * 0.2;
      meshRef.current.rotation.z = Math.cos(t * 0.12) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} rotation={[-0.4, 0.3, 0]} scale={[4.5, 3.2, 1]}>
        <planeGeometry args={[5, 4, 128, 128]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={silkRibbonVertexShader}
          fragmentShader={silkRibbonFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export function SilkRibbonScene() {
  return (
    <>
      <color attach="background" args={["#1a1410"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1} color="#e8dcc4" />
      <pointLight position={[-2, -1, 3]} intensity={0.5} color="#6b2d3c" />
      <SilkRibbonMesh />
      <Sparkles count={100} scale={10} size={2.5} speed={0.35} color="#c9a962" />
    </>
  );
}
