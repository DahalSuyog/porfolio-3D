# porfolio-3D

A 3D, scroll-driven rebuild of [Suyog Dahal's portfolio](https://github.com/DahalSuyog).
A single persistent React Three Fiber canvas sits behind the page while a camera
rig flies through a corridor of themed zones as you scroll; all readable content
stays in real DOM for SEO and accessibility.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- three.js via @react-three/fiber and @react-three/drei
- Lenis smooth scrolling + zustand for scroll telemetry
- Tailwind v4 (CSS-first `@theme`) + CSS Modules

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Scripts

- `pnpm dev` — dev server
- `pnpm build` / `pnpm start` — production build and serve
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`

## Structure

```
app/
  layout.tsx            persistent canvas + smooth scroll mount
  page.tsx              home: hero, skills, work, experience chapters
  demos/page.tsx        project showcase (URL param is source of truth)
  components/dom/       Navbar, Footer, ContactModal, Depth, SmoothScroll
  components/scene/     Canvas, camera rig, zones, particles, distance fade
data/                   site + project content
lib/                    scroll store, depth engine, section ids, lenis, webgl
```

## Behavior notes

- Zones fade in with camera distance (`DistanceFade`); station positions live in
  `CameraRig.tsx` and must stay in sync with the fade centres in `Scene.tsx`.
  Zones also fade out when the camera flies through them.
- DOM content wrapped in `<Depth>` shares the corridor's motion model: it
  approaches from far, sharpens at the viewport centre, then flies past with
  scale, tilt, blur, and fade. `lib/depth-engine.ts` drives it from one rAF loop.
- `prefers-reduced-motion`: Lenis is disabled, camera snaps between stations,
  ambient animations pause, particle counts drop, and the depth engine is off.
- Without WebGL the canvas is skipped and the site renders as a static dark
  editorial page — content is never inside the canvas.
