import { create } from "zustand";

/**
 * Global UI state. Lives outside the page components so the in-scene DOM
 * panels (rendered inside the Canvas) can drive overlays like the contact
 * modal.
 */
interface UIState {
  contactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  contactOpen: false,
  openContact: () => set({ contactOpen: true }),
  closeContact: () => set({ contactOpen: false }),
}));
