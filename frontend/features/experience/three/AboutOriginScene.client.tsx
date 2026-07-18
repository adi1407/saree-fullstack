"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function WeaveSphere() {
  const ref = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  const wireGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.4, 2);
    return new THREE.WireframeGeometry(geo);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.x = Math.sin(t * 0.15) * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.15;
    }
  });

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group>
        <mesh ref={ref}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial
            color="#6b2d3c"
            metalness={0.7}
            roughness={0.3}
            emissive="#1a1410"
            emissiveIntensity={0.3}
            wireframe
          />
        </mesh>
        <lineSegments ref={wireRef} geometry={wireGeometry}>
          <lineBasicMaterial color="#c9a962" transparent opacity={0.5} />
        </lineSegments>
      </group>
    </Float>
  );
}

export function AboutOriginScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1} color="#e8dcc4" />
      <pointLight position={[-2, -1, 3]} intensity={0.6} color="#c9a962" />
      <WeaveSphere />
    </>
  );
}
