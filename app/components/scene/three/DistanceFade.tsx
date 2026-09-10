"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

interface DistanceFadeProps {
  center: [number, number, number];
  /** Full opacity when the camera is closer than this */
  near: number;
  /** Fully invisible when the camera is farther than this */
  far: number;
  children: ReactNode;
}

/**
 * Fades a zone in as the camera approaches and out as it recedes, so distant
 * stations read as fog rather than clutter. Base opacities are captured once
 * and scaled every frame.
 */
export default function DistanceFade({
  center,
  near,
  far,
  children,
}: DistanceFadeProps) {
  const group = useRef<THREE.Group>(null);
  const centerVec = useMemo(() => new THREE.Vector3(...center), [center]);

  useFrame(({ camera }) => {
    const node = group.current;
    if (!node) return;
    const distance = camera.position.distanceTo(centerVec);
    const fade = 1 - THREE.MathUtils.smoothstep(distance, near, far);
    node.visible = fade > 0.02;

    node.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as
        | THREE.Material
        | THREE.Material[]
        | undefined;
      if (!material) return;

      const apply = (mat: THREE.Material) => {
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity;
          mat.userData.baseDepthWrite = mat.depthWrite;
          mat.transparent = true;
        }
        mat.opacity = (mat.userData.baseOpacity as number) * fade;
        mat.depthWrite = fade > 0.95 ? (mat.userData.baseDepthWrite as boolean) : false;
      };

      if (Array.isArray(material)) material.forEach(apply);
      else apply(material);
    });
  });

  return <group ref={group}>{children}</group>;
}
