"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getProject } from "@/data/projects";
import { useDemoStore } from "@/lib/demo-store";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export default function DemoArtifact() {
  const activeId = useDemoStore((s) => s.activeId);
  const accent = getProject(activeId).accent;
  const reduced = useReducedMotion();

  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const pulse = useRef(0);
  const targetColor = useRef(new THREE.Color(accent));

  useEffect(() => {
    targetColor.current.set(accent);
    pulse.current = 1;
  }, [accent]);

  useFrame((state, delta) => {
    if (knot.current && !reduced) {
      knot.current.rotation.y += delta * 0.35;
      knot.current.rotation.x += delta * 0.12;
    }
    if (material.current) {
      material.current.emissive.lerp(targetColor.current, 1 - Math.exp(-4 * delta));
    }
    pulse.current = Math.max(0, pulse.current - delta * 1.4);
    if (group.current) {
      const base = reduced ? 1 : 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      group.current.scale.setScalar(base + pulse.current * 0.16);
    }
  });

  return (
    <group ref={group} position={[0, 0.1, -19]} scale={0.9}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[0.85, 0.24, 180, 28]} />
        <meshStandardMaterial
          ref={material}
          color="#191918"
          emissive={accent}
          emissiveIntensity={0.4}
          metalness={0.75}
          roughness={0.28}
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#c9a87c" wireframe transparent opacity={0.14} />
      </mesh>

      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.01, 8, 160]} />
        <meshBasicMaterial color="#c9a87c" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, Math.PI / 4, 0]}>
        <torusGeometry args={[2.6, 0.007, 8, 160]} />
        <meshBasicMaterial color="#8f8c85" transparent opacity={0.28} />
      </mesh>

      <pointLight intensity={4} distance={10} decay={2} color={accent} />
    </group>
  );
}
