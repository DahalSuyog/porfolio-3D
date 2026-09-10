"use client";

import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";

/** Matches DistanceFade so panels and zones emerge/dissolve identically. */
const CLOSE_FADE = 2.5;
const CLOSE_FULL = 5.5;

/** Vertical chrome (navbar + breathing room) reserved when fitting panels. */
const VIEWPORT_MARGIN = 130;

interface StationPanelProps {
  /** World position of the panel centre (the station's look target) */
  position: [number, number, number];
  /** Camera position at the station; the panel is rotated to face it */
  face: [number, number, number];
  /** World distance from the station camera to this panel (for 1:1 scaling) */
  distance: number;
  /** Distance at which the panel starts fading in */
  far?: number;
  /** Distance at which the panel is fully present */
  near?: number;
  className?: string;
  /** Allow wheel scrolling inside the panel (code blocks) */
  allowInnerScroll?: boolean;
  children: ReactNode;
}

/**
 * A real DOM panel anchored in the 3D scene. It scales with perspective as the
 * camera flies, fades with the same distance curve as the 3D zones, and is
 * rotated once to face its station camera so it reads straight-on at rest.
 * Panels taller than the viewport are scaled down so nothing is cropped.
 */
export default function StationPanel({
  position,
  face,
  distance,
  far = 16,
  near = 8,
  className,
  allowInnerScroll = false,
  children,
}: StationPanelProps) {
  const group = useRef<THREE.Group>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentNode, setContentNode] = useState<HTMLDivElement | null>(null);
  const { camera, size } = useThree();
  const [fitScale, setFitScale] = useState(1);

  const attachContent = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    setContentNode(node);
  }, []);

  useEffect(() => {
    const node = group.current;
    if (!node) return;
    node.lookAt(new THREE.Vector3(...face));
  }, [face]);

  useEffect(() => {
    const el = contentNode;
    if (!el) return;

    const measure = () => {
      const available = window.innerHeight - VIEWPORT_MARGIN;
      const height = el.offsetHeight;
      setFitScale(height > available ? available / height : 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [contentNode]);

  const fov = camera.projectionMatrix.elements[5] * (size.height / 2);
  const distanceFactor = ((400 * distance) / fov) * fitScale;

  useFrame(({ camera: activeCamera }) => {
    const node = contentRef.current;
    const groupNode = group.current;
    if (!node || !groupNode) return;

    const worldPosition = groupNode.getWorldPosition(new THREE.Vector3());
    const dist = activeCamera.position.distanceTo(worldPosition);
    const fadeFar = 1 - THREE.MathUtils.smoothstep(dist, near, far);
    const fadeClose = THREE.MathUtils.smoothstep(dist, CLOSE_FADE, CLOSE_FULL);
    const fade = Math.min(fadeFar, fadeClose);

    node.style.opacity = fade.toFixed(3);
    node.style.visibility = fade > 0.01 ? "visible" : "hidden";
  });

  const width = Math.min(1180, Math.max(320, size.width - 48));

  return (
    <group ref={group} position={position}>
      <Html
        transform
        distanceFactor={distanceFactor}
        zIndexRange={[5, 0]}
        pointerEvents="auto"
      >
        <div
          ref={attachContent}
          className={className}
          style={{ width }}
          data-lenis-prevent={allowInnerScroll ? "" : undefined}
        >
          {children}
        </div>
      </Html>
    </group>
  );
}
