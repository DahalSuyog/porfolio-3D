"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export default function ExperiencePath() {
  const markerRefs = useRef<(THREE.Group | null)[]>([]);
  const reduced = useReducedMotion();

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.5, -0.9, -29),
        new THREE.Vector3(-1.7, 0.15, -29.8),
        new THREE.Vector3(0.4, -0.25, -30.4),
        new THREE.Vector3(2.2, 0.85, -30.9),
        new THREE.Vector3(3.6, 1.35, -31.4),
      ]),
    []
  );

  const markers = useMemo(
    () => [curve.getPoint(0.12), curve.getPoint(0.66)],
    [curve]
  );

  useFrame((state) => {
    if (reduced) return;
    markerRefs.current.forEach((marker, i) => {
      if (!marker) return;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.4 + i * 2) * 0.08;
      marker.scale.setScalar(scale);
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.018, 8, false]} />
        <meshBasicMaterial color="#c9a87c" transparent opacity={0.42} />
      </mesh>

      {markers.map((point, i) => (
        <group
          key={i}
          position={[point.x, point.y, point.z]}
          ref={(node) => {
            markerRefs.current[i] = node;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshStandardMaterial
              color="#2b2b28"
              emissive="#c9a87c"
              emissiveIntensity={0.9}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <torusGeometry args={[0.24, 0.008, 8, 72]} />
            <meshBasicMaterial color="#c9a87c" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      <pointLight
        position={[0, 0.4, -30.4]}
        intensity={4}
        distance={9}
        decay={2}
        color="#c9a87c"
      />
    </group>
  );
}
