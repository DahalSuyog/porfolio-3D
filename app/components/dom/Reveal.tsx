"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealVariant = "rise" | "fade" | "left";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Stagger delay in ms */
  delay?: number;
}

export default function Reveal({
  children,
  className,
  variant = "rise",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const fallback = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(fallback);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      data-visible={visible ? "true" : "false"}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
