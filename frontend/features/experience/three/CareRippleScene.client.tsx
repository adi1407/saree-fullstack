"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * Care guide — a length of silk resting on still water.
 * A gently undulating surface with ripples spreading outward, evoking
 * the calm, careful handling a handwoven saree deserves.
 */
function SilkSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(12, 7, 64, 40), []);
  const base = useMemo(
    () => Float32Array.from(geometry.attributes.position.array as Float32Array),
    [geometry]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z =
        Math.sin(x * 0.55 + t * 0.7) * 0.2 +
        Math.cos(y * 0.7 + t * 0.5) * 0.16 +
        Math.sin((x + y) * 0.35 + t * 0.9) * 0.12;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.4, 0]}>
      <meshStandardMaterial
        color="#2d5c4e"
        emissive="#c9a962"
        emissiveIntensity={0.07}
        wireframe
        transparent
        opacity={0.5}
        metalness={0.4}
        roughness={0.6}
      />
    </mesh>
  );
}

function Ripples() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const delays = useMemo(() => [0, 1.5, 3, 4.5], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    delays.forEach((delay, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const cycle = ((t + delay) % 6) / 6;
      const scale = 0.5 + cycle * 4.5;
      mesh.scale.set(scale, scale, scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.45;
    });
  });

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.35, 0.02]}>
      {delays.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <ringGeometry args={[0.95, 1, 96]} />
          <meshBasicMaterial color="#c9a962" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function Droplet() {
  const dropRef = useRef<THREE.Mesh>(null);
  const FALL = 3.4; // seconds per drop
  const TOP = 2.6;
  const SURFACE = -0.3;

  useFrame((state) => {
    const mesh = dropRef.current;
    if (!mesh) return;
    const cycle = (state.clock.elapsedTime % FALL) / FALL;
    // ease-in fall, then hide just below the surface before the next drop
    const fall = cycle * cycle;
    mesh.position.y = TOP - fall * (TOP - SURFACE);
    const visible = cycle < 0.92;
    mesh.visible = visible;
    mesh.scale.y = 1 + cycle * 1.4; // stretches as it accelerates
  });

  return (
    <mesh ref={dropRef} position={[0.4, 2.6, 0.3]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color="#c9a962" emissive="#c9a962" emissiveIntensity={0.7} />
    </mesh>
  );
}

export function CareRippleScene() {
  return (
    <>
      <color attach="background" args={["#10100c"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 4]} intensity={1.1} color="#c9a962" />
      <pointLight position={[-3, 1, 2]} intensity={0.5} color="#2d5c4e" />
      <SilkSurface />
      <Ripples />
      <Droplet />
      <Sparkles count={50} scale={[10, 4, 6]} size={1.5} speed={0.2} color="#c9a962" />
    </>
  );
}
