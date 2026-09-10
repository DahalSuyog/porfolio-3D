"use client";

import { useSyncExternalStore } from "react";
import { supportsWebGL } from "./webgl";

let cachedSupport: boolean | null = null;

function getSnapshot() {
  if (cachedSupport === null) cachedSupport = supportsWebGL();
  return cachedSupport;
}

/** `null` during SSR and hydration, then the detected value on the client. */
function getServerSnapshot(): boolean | null {
  return null;
}

function subscribe() {
  return () => {};
}

/**
 * Reactive WebGL support flag. Returns `null` until hydration so the first
 * client render matches the server markup and the in-scene content mounts
 * without a fallback flash.
 */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
