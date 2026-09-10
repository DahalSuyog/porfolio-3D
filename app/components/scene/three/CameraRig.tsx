"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { HOME_SECTIONS, type HomeSectionId } from "@/lib/sections";
import { useScrollStore } from "@/lib/scroll-store";

interface Station {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const STATION_DATA: Record<
  HomeSectionId,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  hero: { position: [0, 0.4, 9], target: [0, 0, 0] },
  skills: { position: [0, 0.7, -2], target: [0, 0.4, -10] },
  work: { position: [0, 0.5, -12], target: [0, 0.1, -21] },
  experience: { position: [0, 0.6, -21], target: [0, 0.2, -30] },
  contact: { position: [0, 0.25, -30], target: [0, 0, -39] },
};

const DEMO_STATION: Station = {
  position: new THREE.Vector3(0, 0.25, -11),
  target: new THREE.Vector3(0, 0.1, -19),
};

const CONTACT_STATION: Station = {
  position: new THREE.Vector3(0, 0.25, -30),
  target: new THREE.Vector3(0, 0, -39),
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export default function CameraRig({
  isDemos,
  reduced,
}: {
  isDemos: boolean;
  reduced: boolean;
}) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const pointer = useRef({ x: 0, y: 0 });

  const stations = useMemo(() => {
    const entries = Object.entries(STATION_DATA) as [
      HomeSectionId,
      (typeof STATION_DATA)[HomeSectionId],
    ][];
    return entries.map(([, value]) => ({
      position: new THREE.Vector3(...value.position),
      target: new THREE.Vector3(...value.target),
    }));
  }, []);

  useFrame((state, delta) => {
    const { section, sectionProgress, progress, ready } = useScrollStore.getState();
    const pos = desiredPos.current;
    const target = desiredTarget.current;

    if (isDemos) {
      const t = smoothstep(0.5, 0.95, progress);
      pos.copy(DEMO_STATION.position).lerp(CONTACT_STATION.position, t);
      target.copy(DEMO_STATION.target).lerp(CONTACT_STATION.target, t);
    } else {
      const rawIndex = HOME_SECTIONS.indexOf(section as HomeSectionId);
      const index = rawIndex < 0 ? 0 : rawIndex;
      const nextIndex = Math.min(index + 1, HOME_SECTIONS.length - 1);
      const t = smoothstep(0.7, 1, ready ? sectionProgress : 0);
      pos.copy(stations[index].position).lerp(stations[nextIndex].position, t);
      target
        .copy(stations[index].target)
        .lerp(stations[nextIndex].target, t);
    }

    pointer.current.x = THREE.MathUtils.damp(
      pointer.current.x,
      state.pointer.x,
      2.5,
      delta
    );
    pointer.current.y = THREE.MathUtils.damp(
      pointer.current.y,
      state.pointer.y,
      2.5,
      delta
    );

    pos.x += pointer.current.x * 0.45;
    pos.y += pointer.current.y * 0.3;
    target.x += pointer.current.x * 0.6;
    target.y += pointer.current.y * 0.4;

    const k = 1 - Math.exp(-(reduced ? 40 : 3) * delta);
    camera.position.lerp(pos, k);
    lookAt.current.lerp(target, k);
    camera.lookAt(lookAt.current);
  });

  return null;
}
