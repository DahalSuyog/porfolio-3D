"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/lenis";
import { useScrollStore } from "@/lib/scroll-store";
import type { SectionId } from "@/lib/sections";

interface SectionBox {
  id: string;
  top: number;
  height: number;
}

/**
 * Drives Lenis smooth scrolling and writes per-frame scroll telemetry into the
 * zustand store. The 3D camera rig reads it transiently; only section changes
 * trigger React re-renders.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const boxesRef = useRef<SectionBox[]>([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced
      ? null
      : new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenisRef.current = lenis;
    setLenis(lenis);

    let raf = 0;
    let lastProgress = 0;

    const tick = (time: number) => {
      lenis?.raf(time);
      const boxes = boxesRef.current;
      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      const center = scrollY + window.innerHeight * 0.5;

      let section: SectionBox | null = boxes[0] ?? null;
      for (const box of boxes) {
        if (center >= box.top) section = box;
        else break;
      }

      const local =
        section && section.height > 0
          ? Math.min(1, Math.max(0, (center - section.top) / section.height))
          : 0;

      const state = useScrollStore.getState();
      state.setSample(progress, local, progress - lastProgress);
      if (section) state.setSection(section.id as SectionId);
      lastProgress = progress;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      lenisRef.current?.scrollTo(el, { offset: -64, duration: 1.1 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const measure = () => {
      boxesRef.current = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scroll-section]")
      )
        .map((el) => ({
          id: el.dataset.scrollSection ?? "",
          top: el.getBoundingClientRect().top + window.scrollY,
          height: el.offsetHeight,
        }))
        .filter((box) => box.id)
        .sort((a, b) => a.top - b.top);
    };

    measure();
    const settle = window.setTimeout(measure, 400);
    window.addEventListener("resize", measure);

    if (mountedRef.current) {
      lenisRef.current?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }
    mountedRef.current = true;

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  return null;
}
