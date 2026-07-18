"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

const STEM_COUNT = 16;
const SEG = 12;

interface Stem {
  x: number;
  height: number;
  phase: number;
  sway: number;
}

/**
 * Sustainability — a field of slender stems swaying upward, each tipped with a
 * golden bud. Handloom as something grown and tended, not manufactured: living,
 * rooted, regenerative.
 */
function GrowingStems() {
  const budRefs = useRef<(THREE.Mesh | null)[]>([]);

  const stems = useMemo<Stem[]>(
    () =>
      Array.from({ length: STEM_COUNT }).map((_, i) => ({
        x: (i / (STEM_COUNT - 1) - 0.5) * 8.4,
        height: 2 + ((i * 53) % 18) / 10,
        phase: (i * 1.7) % (Math.PI * 2),
        sway: 0.2 + ((i * 31) % 12) / 60,
      })),
    []
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(STEM_COUNT * SEG * 2 * 3), 3)
    );
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    let ptr = 0;
    stems.forEach((s, si) => {
      let px = 0;
      let py = 0;
      let pz = 0;
      for (let j = 0; j <= SEG; j++) {
        const f = j / SEG;
        const bend = Math.sin(t * 0.6 + s.phase + f * 1.6) * s.sway * f;
        const x = s.x + bend;
        const y = -2.3 + f * s.height;
        const z = Math.cos(t * 0.4 + s.phase) * 0.25 * f;
        if (j > 0) {
          pos.setXYZ(ptr++, px, py, pz);
          pos.setXYZ(ptr++, x, y, z);
        }
        if (j === SEG) {
          const bud = budRefs.current[si];
          if (bud) {
            bud.position.set(x, y, z);
            // each bud opens and closes on its own rhythm — a slow bloom
            bud.scale.setScalar(0.85 + (Math.sin(t * 1.3 + s.phase * 2) * 0.5 + 0.5) * 0.7);
          }
        }
        px = x;
        py = y;
        pz = z;
      }
    });
    pos.needsUpdate = true;
    geometry.computeBoundingSphere();
  });

  return (
    <group>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#2d5c4e" transparent opacity={0.6} />
      </lineSegments>
      {stems.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            budRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#c9a962" emissive="#c9a962" emissiveIntensity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

export function SustainabilityGrowthScene() {
  return (
    <>
      <color attach="background" args={["#0f1410"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 4]} intensity={1} color="#c9a962" />
      <pointLight position={[2, -1, 2]} intensity={0.5} color="#2d5c4e" />
      <GrowingStems />
      <Sparkles count={70} scale={[10, 6, 5]} size={1.6} speed={0.25} color="#c9a962" />
    </>
  );
}
