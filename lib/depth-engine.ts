"use client";

/**
 * Scroll-scrubbed depth engine for DOM content.
 *
 * Every registered element is transformed each frame based on its position
 * relative to the viewport centre, mirroring how the 3D camera flies through
 * its stations: content approaches from far away (small, blurred, transparent),
 * reaches full presence at the centre, then flies past the viewer (larger,
 * tilted, blurred, fading). Scrubbing back reverses everything.
 *
 * Transforms are written directly to element styles from a single rAF loop, so
 * no React re-renders happen while scrolling.
 */

interface DepthTarget {
  el: HTMLElement;
  /** Document-space layout top (transform independent) */
  top: number;
  height: number;
  /** Document-space horizontal centre */
  centerX: number;
  /** 0..1 multiplier on the depth displacement */
  strength: number;
}

const Z_AMPLITUDE = 140;
const X_DRIFT = 60;
const ROTATE_X = 5;
const FADE_START = 0.5;
const FADE_END = 1;
const MAX_BLUR = 4;
const PERSPECTIVE = 1100;

const targets = new Set<DepthTarget>();
let rafId: number | null = null;
let vh = 0;
let vw = 0;
let reduced = false;
let coarse = false;
let listenersBound = false;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function readEnvironment() {
  vh = window.innerHeight;
  vw = window.innerWidth;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  coarse = window.matchMedia("(pointer: coarse)").matches;
}

function measure(target: DepthTarget) {
  const { el } = target;
  let top = 0;
  let left = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  target.top = top;
  target.height = el.offsetHeight;
  target.centerX = left + el.offsetWidth / 2;
}

function clearStyles(el: HTMLElement) {
  el.style.transform = "";
  el.style.opacity = "";
  el.style.filter = "";
  el.style.willChange = "";
}

function apply(target: DepthTarget, p: number) {
  const { el, strength } = target;
  const amplitude = coarse ? 0.7 : 1;
  const offsetX = (target.centerX - vw / 2) / vw;

  const z = p * Z_AMPLITUDE * strength * amplitude;
  const x = p * offsetX * X_DRIFT * strength * amplitude;
  const rotateX = -p * ROTATE_X * strength;
  const rotateY = offsetX * 10 * strength;
  const fade = smoothstep(FADE_START, FADE_END, Math.abs(p));

  el.style.transform = `perspective(${PERSPECTIVE}px) translate3d(${x.toFixed(
    2
  )}px, 0, ${z.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
    2
  )}deg)`;
  el.style.opacity = (1 - fade).toFixed(3);
  el.style.willChange = "transform, opacity, filter";

  if (!coarse) {
    const blur = fade * MAX_BLUR;
    el.style.filter = blur > 0.06 ? `blur(${blur.toFixed(2)}px)` : "";
  }
}

function tick() {
  rafId = null;
  if (reduced) return;

  const viewportCentre = window.scrollY + vh / 2;

  for (const target of targets) {
    const range = vh / 2 + target.height / 2;
    const p = clamp(
      (viewportCentre - (target.top + target.height / 2)) / range,
      -1.2,
      1.2
    );
    apply(target, p);
  }

  rafId = requestAnimationFrame(tick);
}

function ensureLoop() {
  if (rafId === null && !reduced && targets.size > 0) {
    rafId = requestAnimationFrame(tick);
  }
}

function remeasureAll() {
  for (const target of targets) measure(target);
}

function handleResize() {
  readEnvironment();
  remeasureAll();
  ensureLoop();
}

function handleMotionChange() {
  readEnvironment();
  if (reduced) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    for (const target of targets) clearStyles(target.el);
  } else {
    ensureLoop();
  }
}

function bindGlobalListeners() {
  if (listenersBound || typeof window === "undefined") return;
  listenersBound = true;
  window.addEventListener("resize", handleResize);
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", handleMotionChange);
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => remeasureAll()).catch(() => {});
  }
  window.setTimeout(remeasureAll, 600);
}

/**
 * Registers an element with the depth engine. Returns a cleanup function that
 * unregisters it and clears the inline styles.
 */
export function registerDepth(el: HTMLElement, strength = 1) {
  if (!listenersBound) {
    readEnvironment();
    bindGlobalListeners();
  }

  const target: DepthTarget = { el, top: 0, height: 0, centerX: 0, strength };
  measure(target);

  if (reduced) {
    return () => {};
  }

  targets.add(target);
  ensureLoop();

  return () => {
    targets.delete(target);
    clearStyles(el);
  };
}

/** Re-measures every target; call after content height changes (tabs, filters). */
export function remeasureDepth() {
  remeasureAll();
}
