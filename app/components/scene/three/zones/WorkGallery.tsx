"use client";

import { Billboard, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PROJECTS } from "@/data/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const PANEL_POSITIONS: [number, number, number][] = [
  [-2.2, 0.2, -21],
  [2.2, 0.2, -21],
];

export default function WorkGallery() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useFrame((state) => {
    if (!group.current || reduced) return;
    group.current.children.forEach((child, i) => {
      child.position.y =
        PANEL_POSITIONS[i][1] +
        Math.sin(state.clock.elapsedTime * 0.6 + i * 1.4) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {PROJECTS.slice(0, PANEL_POSITIONS.length).map((project, i) => (
        <group key={project.id} position={PANEL_POSITIONS[i]}>
          <Billboard>
            <RoundedBox args={[2.7, 1.7, 0.08]} radius={0.09} smoothness={4}>
              <meshStandardMaterial
                color="#1d1d1b"
                metalness={0.45}
                roughness={0.55}
                emissive={project.accent}
                emissiveIntensity={0.03}
              />
            </RoundedBox>
            <mesh position={[0, -0.5, 0.06]}>
              <planeGeometry args={[2.3, 0.05]} />
              <meshBasicMaterial
                color={project.accent}
                transparent
                opacity={0.6}
              />
            </mesh>
            <mesh position={[-1.05, 0.56, 0.06]}>
              <circleGeometry args={[0.05, 24]} />
              <meshBasicMaterial color={project.accent} />
            </mesh>
            <pointLight
              position={[0, 0, 1]}
              intensity={0.6}
              distance={3.5}
              decay={2}
              color={project.accent}
            />
          </Billboard>
        </group>
      ))}
    </group>
  );
}
