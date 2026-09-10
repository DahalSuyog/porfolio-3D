import { create } from "zustand";

export type DemoTab = "overview" | "details" | "code";

/**
 * Bridges the demos page (URL-driven selection) and the in-scene demos panel,
 * which lives in the persistent Canvas and cannot read route params directly.
 */
interface DemoState {
  activeId: string;
  activeCategory: string;
  activeTab: DemoTab;
  setActiveId: (id: string) => void;
  setActiveCategory: (category: string) => void;
  setActiveTab: (tab: DemoTab) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  activeId: "dave-rl",
  activeCategory: "All",
  activeTab: "overview",
  setActiveId: (id) =>
    set((state) =>
      state.activeId === id ? state : { activeId: id, activeTab: "overview" }
    ),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
