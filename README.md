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
  layout.tsx            persistent canvas + smooth scroll + contact modal
  page.tsx              home: scroll spacers (content lives in the scene)
  demos/page.tsx        project showcase, URL param is source of truth
  components/content/   the actual chapter content (hero, skills, work, ...)
  components/dom/       Navbar, ContactModal, SmoothScroll, fallbacks
  components/scene/     Canvas, camera rig, station panels, zones, particles
data/                   site + project content
lib/                    scroll store, demo/ui stores, section ids, lenis, webgl
```

## Behavior notes

- **The text is in the scene.** Each chapter's content is real DOM rendered
  through drei's `<Html transform>` at its 3D station (`StationPanel`), so it
  scales, approaches, and recedes with the camera exactly like the 3D objects.
  Pages only render invisible spacer sections that provide the scroll range.
- Panels are rotated once to face their station camera (straight-on at rest,
  angled while flying) and fade with the same distance curve as the zones
  (`DistanceFade`). Panels taller than the viewport scale down to fit.
- Demos lives in the scene too: `lib/demo-store.ts` holds the selection and the
  URL (`?project=`) stays the source of truth.
- `prefers-reduced-motion`: Lenis is disabled, camera snaps between stations,
  ambient animations pause, particle counts drop.
- Without WebGL, pages fall back to the same content in normal document flow.
