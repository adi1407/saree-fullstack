"use client";

import { Float, Sparkles, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  aboutSilkFragmentShader,
  aboutSilkVertexShader,
} from "@/features/experience/three/shaders/aboutSilk.glsl";

function SilkDrape() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      mouseTarget.current.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y),
        0.06
      );
      materialRef.current.uniforms.uMouse.value.copy(mouseTarget.current);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.12) * 0.35 + mouseTarget.current.x * 0.15;
      meshRef.current.rotation.x = -0.35 + Math.cos(t * 0.1) * 0.1 + mouseTarget.current.y * 0.08;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={[5.5, 4.2, 1]}>
        <planeGeometry args={[6, 5, 200, 200]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={aboutSilkVertexShader}
          fragmentShader={aboutSilkFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function GoldenRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.z = t * 0.04;
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2 + i * 0.3, i * 0.8, 0]}
          position={[0, 0, -0.8 - i * 0.4]}
        >
          <torusGeometry args={[2.2 + i * 0.6, 0.012, 16, 128]} />
          <meshStandardMaterial
            color="#c9a962"
            emissive="#c9a962"
            emissiveIntensity={0.35}
            metalness={0.9}
            roughness={0.15}
            transparent
            opacity={0.55 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingThreads() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const angle = (i / 120) * Math.PI * 2;
      const r = 2.5 + Math.random() * 2;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = Math.sin(angle) * r - 1;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={120} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#e8dcc4" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useFrame((state) => {
    scrollRef.current = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollNorm = Math.min(scrollRef.current / window.innerHeight, 1);
    const targetZ = 5 + scrollNorm * 2.5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, scrollNorm * 0.8, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function AboutHeroScene() {
  return (
    <>
      <color attach="background" args={["#0d0a09"]} />
      <fog attach="fog" args={["#0d0a09", 6, 14]} />
      <CameraRig />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#f5e6c8" />
      <pointLight position={[-4, 2, 3]} intensity={0.8} color="#6b2d3c" />
      <pointLight position={[3, -2, 2]} intensity={0.5} color="#c9a962" />
      <Stars radius={40} depth={30} count={1200} factor={3} saturation={0.2} fade speed={0.4} />
      <GoldenRings />
      <FloatingThreads />
      <SilkDrape />
      <Sparkles count={180} scale={12} size={2.8} speed={0.45} color="#c9a962" opacity={0.85} />
      <Sparkles count={60} scale={8} size={1.2} speed={0.2} color="#6b2d3c" opacity={0.5} />
    </>
  );
}
