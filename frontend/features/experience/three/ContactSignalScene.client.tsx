"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const NODE_COUNT = 7;
const CENTRE = new THREE.Vector3(0, 0, 0);

/**
 * Contact — a constellation of nodes reaching toward a single glowing centre.
 * Beads of light travel inward along each line, like messages arriving, and the
 * heart of the constellation pulses each time one lands. A quiet metaphor for
 * getting in touch: many voices, one open line that always answers.
 */
function Constellation() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const messageRefs = useRef<(THREE.Mesh | null)[]>([]);

  const nodes = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }).map((_, i) => {
        const angle = (i / NODE_COUNT) * Math.PI * 2;
        const radius = 1.7 + (i % 3) * 0.55;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.62,
          Math.sin(angle * 1.4) * 0.7
        );
      }),
    []
  );

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    nodes.forEach((n) => positions.push(0, 0, 0, n.x, n.y, n.z));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.18;
      groupRef.current.rotation.y = t * 0.08;
    }

    let arrival = 0;
    nodes.forEach((n, i) => {
      const mesh = messageRefs.current[i];
      if (!mesh) return;
      const cycle = (t * 0.32 + i / NODE_COUNT) % 1;
      mesh.position.lerpVectors(n, CENTRE, cycle);
      const glow = Math.sin(cycle * Math.PI);
      mesh.scale.setScalar(0.5 + glow);
      (mesh.material as THREE.MeshBasicMaterial).opacity = glow;
      // a message "lands" as it nears the centre
      if (cycle > 0.92) arrival = Math.max(arrival, (cycle - 0.92) / 0.08);
    });

    if (coreRef.current) {
      const pulse = 1 + arrival * 0.4 + Math.sin(t * 2) * 0.04;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#c9a962" transparent opacity={0.32} />
      </lineSegments>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial color="#c9a962" emissive="#c9a962" emissiveIntensity={0.9} />
      </mesh>
      {nodes.map((n, i) => (
        <Float key={i} speed={1.6} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh position={[n.x, n.y, n.z]}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial color="#6b2d3c" emissive="#6b2d3c" emissiveIntensity={0.55} />
          </mesh>
        </Float>
      ))}
      {nodes.map((_, i) => (
        <mesh
          key={`msg-${i}`}
          ref={(el) => {
            messageRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#fdf8f3" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function SignalPulses() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const delays = useMemo(() => [0, 1.4, 2.8], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    delays.forEach((delay, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const cycle = ((t + delay) % 4.2) / 4.2;
      const scale = 0.3 + cycle * 3.4;
      mesh.scale.set(scale, scale, scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.4;
    });
  });

  return (
    <group>
      {delays.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <ringGeometry args={[0.96, 1, 72]} />
          <meshBasicMaterial color="#c9a962" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function ContactSignalScene() {
  return (
    <>
      <color attach="background" args={["#1a1410"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#c9a962" />
      <pointLight position={[-3, 2, 2]} intensity={0.5} color="#6b2d3c" />
      <Constellation />
      <SignalPulses />
      <Sparkles count={120} scale={11} size={2} speed={0.4} color="#c9a962" />
    </>
  );
}
