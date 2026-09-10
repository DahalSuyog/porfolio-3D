"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { registerDepth } from "@/lib/depth-engine";

interface DepthProps {
  children: ReactNode;
  className?: string;
  /** 0..1 multiplier on the depth displacement; lower keeps text calmer */
  strength?: number;
}

/**
 * Wraps content in the scroll-scrubbed depth animation. Elements travel toward
 * the viewer as they cross the viewport, matching the 3D corridor's motion.
 */
export default function Depth({
  children,
  className,
  strength = 1,
}: DepthProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerDepth(el, strength);
  }, [strength]);

  return (
    <div ref={ref} className={className} data-depth>
      {children}
    </div>
  );
}
