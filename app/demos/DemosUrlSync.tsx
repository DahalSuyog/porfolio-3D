"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { useDemoStore } from "@/lib/demo-store";

/**
 * Keeps the demo store in sync with the URL (the source of truth). Rendered by
 * the demos page inside a Suspense boundary; the in-scene demos panel only
 * reads the store.
 */
export default function DemosUrlSync() {
  const searchParams = useSearchParams();
  const setActiveId = useDemoStore((state) => state.setActiveId);

  useEffect(() => {
    const requested = searchParams.get("project");
    if (requested && PROJECTS.some((p) => p.id === requested)) {
      setActiveId(requested);
    }
  }, [searchParams, setActiveId]);

  return null;
}
