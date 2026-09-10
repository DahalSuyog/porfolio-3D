import { create } from "zustand";

/**
 * Bridges the demos page DOM (URL-driven selection) and the persistent 3D
 * scene, which lives in the root layout and cannot read route params without
 * a Suspense boundary of its own.
 */
interface DemoState {
  activeId: string;
  setActiveId: (id: string) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  activeId: "dave-rl",
  setActiveId: (id) => set((state) => (state.activeId === id ? state : { activeId: id })),
}));
