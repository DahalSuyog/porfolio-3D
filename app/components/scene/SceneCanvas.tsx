"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { supportsWebGL } from "@/lib/webgl";

const Experience = dynamic(() => import("./three/Experience"), {
  ssr: false,
  loading: () => null,
});

let cachedSupport: boolean | null = null;

function getSnapshot() {
  if (cachedSupport === null) cachedSupport = supportsWebGL();
  return cachedSupport;
}

function getServerSnapshot() {
  return false;
}

function subscribe() {
  return () => {};
}

export default function SceneCanvas() {
  const webgl = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!webgl) return null;

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Experience />
    </div>
  );
}
