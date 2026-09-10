# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## What this is

A 3D rebuild of Suyog Dahal's portfolio: one persistent React Three Fiber canvas
fixed behind the page, with a scroll-driven camera that flies through a corridor
of themed zones while DOM content scrolls over it.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm lint` — ESLint flat config (Next core-web-vitals + TS + React Compiler rules)
- `pnpm typecheck` — `tsc --noEmit`

The React Compiler lint rules are strict: `setState` synchronously in an effect
is an error (use `useSyncExternalStore`), and mutating `useMemo` values after
render is an error (use `useRef` for per-frame mutable objects).

## Architecture

- **`app/layout.tsx`** mounts `<SceneCanvas />` (the fixed canvas, lazily loaded,
  `ssr: false`, WebGL-detected) and `<SmoothScroll />` (Lenis + scroll telemetry).
  Both persist across route changes, so the 3D scene is continuous.
- **`lib/scroll-store.ts`** is the bridge: a zustand store with per-frame
  `progress` / `sectionProgress` / `velocity` / `section`. Read it transiently
  with `useScrollStore.getState()` inside `useFrame`; only subscribe to
  `section` from React (it changes rarely).
- **`lib/sections.ts`** defines the section ids. Every scrollable section carries
  `data-scroll-section="<id>"`; SmoothScroll measures them and sets the active
  section from the viewport centre.
- **`app/components/scene/three/CameraRig.tsx`** maps section + local progress to
  camera stations along the -Z corridor. Stations dwell for the first 70% of a
  section, then fly to the next station over the last 30%.
- **`DistanceFade`** wraps each zone and fades its materials by camera distance so
  distant stations read as fog instead of clutter. Zones and their fade centres
  are registered in `Scene.tsx` — keep those two in sync.
- **Demos mode**: the same canvas switches scene contents based on `pathname`.
  The demos page pushes the selected project id into `lib/demo-store.ts` so the
  3D artifact can recolor; the page itself keeps the URL (`?project=`) as the
  source of truth.
- **`lib/depth-engine.ts` + `app/components/dom/Depth.tsx`** give DOM content the
  same scroll-scrubbed motion as the 3D corridor: each wrapped element is
  transformed every frame from its distance to the viewport centre (approach
  from far → sharp at centre → fly past with scale/tilt/blur/fade). The engine
  writes inline styles from one rAF loop and never re-renders React. Call
  `remeasureDepth()` after content height changes (tab switches, filters).
  Reduced motion disables the engine; coarse pointers get reduced amplitude and
  no blur. Bottom-of-page content needs enough footer bottom padding to be able
  to reach the viewport centre, otherwise it stays faded.
- Content lives in `data/site.ts` and `data/projects.ts`. Never hardcode copy in
  pages.

## Styling

- **Tailwind v4**, CSS-first tokens in `app/globals.css` `@theme` (no
  `tailwind.config.js`). Palette: warm near-black `#121211`, brass `#c9a87c`,
  neutrals only. Fonts: Newsreader (headlines) + Manrope (body) via `next/font`,
  Material Symbols for icons.
- Pages combine Tailwind utilities with CSS Modules; the DOM sits in `z-index: 1`
  above `.scene-canvas` (fixed, `z-index: 0`, `pointer-events: none`).

## Gotchas

- The canvas is `pointer-events: none`; all interaction happens in DOM overlay.
- `next.config.ts` pins `turbopack.root` / `outputFileTracingRoot` because stray
  lockfiles in the home directory break workspace-root inference.
- Dev-mode HMR can lose the WebGL context after many edits — hard reload before
  debugging "invisible scene" issues.
