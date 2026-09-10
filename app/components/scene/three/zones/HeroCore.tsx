"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface HeroCoreProps {
  position?: [number, number, number];
  scale?: number;
  dim?: boolean;
}

export default function HeroCore({
  position = [0, 0, 0],
  scale = 1,
  dim = false,
}: HeroCoreProps) {
  const shell = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const satellites = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.08;
      shell.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }
    if (rings.current) rings.current.rotation.z += delta * 0.05;
    if (satellites.current) satellites.current.rotation.y -= delta * 0.22;
    if (core.current) {
      const pulse = 1 + Math.sin(t * 1.15) * 0.035;
      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position} scale={scale}>
      <group ref={shell}>
        <mesh>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshBasicMaterial
            color="#c9a87c"
            wireframe
            transparent
            opacity={dim ? 0.14 : 0.26}
          />
        </mesh>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial
            color="#1d1d1b"
            emissive="#c9a87c"
            emissiveIntensity={dim ? 0.25 : 0.42}
            metalness={0.7}
            roughness={0.35}
            flatShading
          />
        </mesh>
        <pointLight
          intensity={dim ? 2 : 5}
          distance={8}
          decay={2}
          color="#c9a87c"
        />
      </group>

      <group ref={rings}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.4, 0.012, 8, 160]} />
          <meshBasicMaterial color="#c9a87c" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 1.6, Math.PI / 3, 0]}>
          <torusGeometry args={[2.95, 0.008, 8, 160]} />
          <meshBasicMaterial color="#8f8c85" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 3]}>
          <torusGeometry args={[3.45, 0.006, 8, 160]} />
          <meshBasicMaterial color="#c9a87c" transparent opacity={0.2} />
        </mesh>
      </group>

      <group ref={satellites}>
        <mesh position={[2.4, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#c9a87c" />
        </mesh>
        <mesh position={[-2.95, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#eceae4" />
        </mesh>
        <mesh position={[0, 3.45, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#c9a87c" />
        </mesh>
      </group>
    </group>
  );
}
