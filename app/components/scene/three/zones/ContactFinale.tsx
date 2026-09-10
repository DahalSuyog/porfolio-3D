"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const CENTER = new THREE.Vector3(0, 0, -39);
const COUNT = 520;
const RADIUS = 2.3;

function seeded(index: number, salt: number) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function ContactFinale() {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const reduced = useReducedMotion();

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = seeded(i, 1) * Math.PI * 2;
      const phi = Math.acos(2 * seeded(i, 2) - 1);
      const r = RADIUS + seeded(i, 3) * 0.5;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.cos(phi) * r;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (reduced) return;
    if (group.current) group.current.rotation.y += delta * 0.12;
    if (light.current) {
      light.current.intensity =
        14 + Math.sin(state.clock.elapsedTime * 1.6) * 6;
    }
  });

  return (
    <group position={CENTER}>
      <points ref={group} geometry={geometry}>
        <pointsMaterial
          color="#e0a13c"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh>
        <icosahedronGeometry args={[0.3, 2]} />
        <meshStandardMaterial
          color="#2b2b28"
          emissive="#e0a13c"
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[3.1, 0.008, 8, 160]} />
        <meshBasicMaterial color="#e0a13c" transparent opacity={0.3} />
      </mesh>

      <pointLight ref={light} intensity={16} distance={14} decay={2} color="#e0a13c" />
    </group>
  );
}
