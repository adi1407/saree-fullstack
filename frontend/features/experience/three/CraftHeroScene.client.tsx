"use client";

import { Float, Sparkles, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function WarpThreads() {
  const groupRef = useRef<THREE.Group>(null);
  const count = 64;

  const lines = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1) - 0.5) * 5.5;
      positions.push(x, -2.2, 0, x, 2.2, 0);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#e8dcc4" transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

function WeftBand() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.8) * 1.6;
    ref.current.scale.x = 1 + Math.sin(t * 1.6) * 0.02;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[5.6, 0.04, 0.08]} />
      <meshStandardMaterial
        color="#6b2d3c"
        emissive="#6b2d3c"
        emissiveIntensity={0.35}
        metalness={0.6}
        roughness={0.35}
      />
    </mesh>
  );
}

function Shuttle() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 1.4) * 2.6;
    ref.current.rotation.z = Math.sin(t * 1.4) * 0.15;
  });

  return (
    <Float speed={2} floatIntensity={0.15}>
      <mesh ref={ref}>
        <boxGeometry args={[0.55, 0.18, 0.35]} />
        <meshStandardMaterial color="#c9a962" metalness={0.85} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function LoomFrame() {
  const frameRef = useRef<THREE.Group>(null);

  const frameGeo = useMemo(() => {
    const positions: number[] = [];
    const corners = [
      [-2.9, -2.4, 0],
      [2.9, -2.4, 0],
      [2.9, 2.4, 0],
      [-2.9, 2.4, 0],
    ];
    for (let i = 0; i < 4; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % 4];
      positions.push(...a, ...b);
    }
    positions.push(-2.9, -2.4, 0, -2.9, 2.4, -0.6);
    positions.push(2.9, -2.4, 0, 2.9, 2.4, -0.6);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!frameRef.current) return;
    frameRef.current.rotation.x = -0.12 + Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <group ref={frameRef}>
      <lineSegments geometry={frameGeo}>
        <lineBasicMaterial color="#c9a962" transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useFrame(() => {
    scrollRef.current = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollNorm = Math.min(scrollRef.current / window.innerHeight, 1);
    const targetZ = 5.5 + scrollNorm * 2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, scrollNorm * 0.5, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function CraftHeroScene() {
  return (
    <>
      <color attach="background" args={["#0d0a09"]} />
      <fog attach="fog" args={["#0d0a09", 5, 13]} />
      <CameraRig />
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#f5e6c8" />
      <pointLight position={[-3, 1, 3]} intensity={0.7} color="#6b2d3c" />
      <pointLight position={[2, -1, 2]} intensity={0.45} color="#c9a962" />
      <Stars radius={35} depth={25} count={800} factor={2.5} saturation={0.15} fade speed={0.35} />
      <LoomFrame />
      <WarpThreads />
      <WeftBand />
      <Shuttle />
      <Sparkles count={140} scale={10} size={2.5} speed={0.4} color="#c9a962" opacity={0.8} />
      <Sparkles count={50} scale={6} size={1.2} speed={0.2} color="#6b2d3c" opacity={0.45} />
    </>
  );
}
