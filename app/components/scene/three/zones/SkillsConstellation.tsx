"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const SKILLS = [
  "C / C++",
  "Python",
  "JavaScript",
  "React / Next.js",
  "Tailwind CSS",
  "Node.js",
  "PyTorch",
  "Gymnasium",
  "PPO / RND",
  "R-CNN",
  "Computer vision",
  "Deep learning",
];

const CENTER = new THREE.Vector3(0, 0.4, -10);
const RADIUS = 2.6;

export default function SkillsConstellation() {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const nodePositions = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return SKILLS.map((_, i) => {
      const y = 1 - (i / (SKILLS.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return new THREE.Vector3(
        Math.cos(theta) * radius * RADIUS,
        y * RADIUS,
        Math.sin(theta) * radius * RADIUS
      );
    });
  }, []);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(nodePositions.length * 6);
    nodePositions.forEach((p, i) => {
      positions.set([0, 0, 0, p.x, p.y, p.z], i * 6);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodePositions]);

  useFrame((state, delta) => {
    if (reduced) return;
    if (group.current) group.current.rotation.y += delta * 0.045;
    if (nodes.current) {
      nodes.current.children.forEach((child, i) => {
        child.position.y =
          nodePositions[i].y + Math.sin(state.clock.elapsedTime * 0.9 + i) * 0.09;
      });
    }
  });

  return (
    <group ref={group} position={CENTER}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#c9a87c"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>

      <group ref={nodes}>
        {nodePositions.map((p, i) => (
          <mesh key={SKILLS[i]} position={[p.x, p.y, p.z]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial
              color={i % 4 === 0 ? "#eceae4" : "#2b2b28"}
              emissive="#c9a87c"
              emissiveIntensity={i % 3 === 0 ? 1.1 : 0.65}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      <mesh>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshBasicMaterial color="#c9a87c" wireframe transparent opacity={0.8} />
      </mesh>
      <pointLight intensity={5} distance={10} decay={2} color="#c9a87c" />
    </group>
  );
}
