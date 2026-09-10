import { create } from "zustand";
import type { SectionId } from "./sections";

/**
 * Scroll telemetry shared between the Lenis driver, the 3D camera rig and any
 * DOM components that need coarse section state. The per-frame values are read
 * transiently with `useScrollStore.getState()` inside rAF/useFrame loops so
 * they never trigger React re-renders. Only `section` is safe to subscribe to.
 */
interface ScrollState {
  /** Overall document progress, 0..1 */
  progress: number;
  /** Progress within the active section, 0..1 */
  sectionProgress: number;
  /** Signed progress delta of the last frame (scroll velocity proxy) */
  velocity: number;
  /** The section currently crossing the viewport centre */
  section: SectionId;
  /** True once the first scroll sample has been written */
  ready: boolean;
  setSample: (
    progress: number,
    sectionProgress: number,
    velocity: number
  ) => void;
  setSection: (section: SectionId) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  sectionProgress: 0,
  velocity: 0,
  section: "hero",
  ready: false,
  setSample: (progress, sectionProgress, velocity) =>
    set((state) =>
      state.progress === progress &&
      state.sectionProgress === sectionProgress &&
      state.ready
        ? state
        : { progress, sectionProgress, velocity, ready: true }
    ),
  setSection: (section) =>
    set((state) => (state.section === section ? state : { section })),
}));
