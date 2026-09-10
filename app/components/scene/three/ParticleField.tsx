"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

function seeded(index: number, salt: number) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function ParticleField({ count = 720 }: { count?: number }) {
  const group = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seeded(i, 1) - 0.5) * 19;
      positions[i * 3 + 1] = (seeded(i, 2) - 0.5) * 11 + 0.8;
      positions[i * 3 + 2] = 8 - seeded(i, 3) * 56;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += delta * 0.008;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.25;
  });

  return (
    <points ref={group} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#c9a87c"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.38}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
