---
title: Sim Lifecycle and Startup Sequence
description: The real sequence from Sim construction through start(), screen selection, and the running animation loop that steps Properties and listeners every frame.
category: guides
tags: [joist, Sim, Screen, lifecycle, animation-loop]
status: complete
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/screen-view
  - /guides/scenery-basics
  - /api/axon/timer
prerequisites:
  - /api/joist/sim
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Sim Lifecycle and Startup Sequence

Every SceneryStack simulation goes through the same handful of phases between the page loading and the animation loop running steadily at 60fps. Knowing the real order — not just "it starts" — matters for questions like "why isn't my model constructed yet" or "why did this listener fire before the thing it depends on existed."

## Phase 1: asset loading, via `onReadyToLaunch`

A simulation never constructs its `Sim` directly at module scope — it wraps construction in `onReadyToLaunch` (from `scenerystack/sim`), which waits for SceneryStack's asynchronous asset loader (fonts, images, translated string files) to finish before the callback runs:

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';

onReadyToLaunch( () => {
  const sim = new Sim( /* ... */ );
  sim.start();
} );
```

Nothing in the scene graph is safe to build before this callback fires — a `Text` Node created too early could measure its bounds against a font that hasn't finished loading, and a string Property could briefly hold an untranslated fallback. This is why every [`Screen`](/api/joist/screen)'s model/view factories are deferred functions rather than eagerly-run code: they're only invoked once `Sim` decides a screen is actually needed, which is always after this phase has completed.

## Phase 2: `new Sim(...)` construction

Constructing `Sim` itself does relatively little work: it records the list of `Screen`s, builds a `HomeScreen` and navigation bar if there's more than one, and sets up its own top-level Properties (`selectedScreenProperty`, `activeProperty`, `dimensionProperty`) — see [`Sim`](/api/joist/sim) for the full option/member list. Crucially, **no individual screen's `createModel`/`createView` factory has run yet** at this point; `Screen` only holds those factories, it doesn't call them.

## Phase 3: `sim.start()` — screen initialization

Calling `start()` is what actually triggers construction. `Sim` initializes screens (by default, every screen eagerly rather than only the one first shown — see [`detachInactiveScreenViews`](/api/joist/sim) for the option that keeps inactive screens' views out of the scene graph once built), calling each `Screen`'s `createModel()` and then `createView( model )` in turn. `Sim.isConstructionCompleteProperty` becomes `true` once this has finished for every screen — code that needs to know "has everything actually been built yet" (some PhET-iO tooling, in particular) waits on that Property rather than assuming construction is synchronous with `start()` returning.

Once construction finishes, `start()` begins the `requestAnimationFrame` loop described below. `selectedScreenProperty` is set (to the `HomeScreen` for a fresh multi-screen sim, or the single screen for a one-screen sim, unless a query parameter like `?screens=2` requests a specific starting screen) as part of this same phase.

## Phase 4: the running animation loop

Once started, a `Sim` drives one `requestAnimationFrame`-based loop for the lifetime of the page. Each frame:

1. The browser calls the loop's callback with an elapsed time; `Sim` computes `dt` (elapsed seconds, capped per-screen by that `Screen`'s `maxDT` option to avoid a huge jump after e.g. a backgrounded tab resumes).
2. `Sim` steps the currently-selected screen's model (if it has a `step( dt )` method) and then its [`ScreenView`](/api/joist/screen-view)'s own `step( dt )` — only the active screen steps; a screen the user isn't looking at does no per-frame work.
3. `stepTimer` (from `scenerystack/axon`) emits `dt`, firing anything scheduled via `stepTimer.setTimeout`/`setInterval` whose accumulated time has elapsed — see [Timer, animationFrameTimer, and stepTimer](/api/axon/timer) for how this differs from `animationFrameTimer`, which fires every frame independent of which screen (or whether any screen) is active.
4. The [`Display`](/api/scenery/display) underlying the sim repaints, syncing any Node whose visual state changed as a result of the above back to actual pixels — this is the same `updateDisplay()`/`updateOnRequestAnimationFrame()` mechanism described in [Scenery Basics](/guides/scenery-basics), just already wired up for you by `Sim` rather than something you drive yourself.

Model and view `step` functions are the only place per-frame model mutation should happen — a `Property` set directly from an input listener (a drag, a slider) is fine and expected, but time-based motion (an object coasting, an animation easing toward a target) belongs in `step(dt)`, driven by the loop above, not in a `setInterval` or a listener that assumes a fixed frame rate.

::: tip `activeProperty` pauses the loop's effects, not the loop itself
Setting `sim.activeProperty = false` doesn't stop `requestAnimationFrame` from firing — `Sim` keeps receiving frames, but skips stepping the model/view while inactive, which is what "pausing" a sim actually means at this layer. This is distinct from `browserTabVisibleProperty`, which reflects whether the browser tab itself is visible and is one of the inputs `Sim` uses to decide whether to set `activeProperty` automatically.
:::

## Where to go next

- [Sim](/api/joist/sim) — the full constructor/option/member reference for the class this page walks through
- [Screen](/api/joist/screen) — the lazy model/view factory pattern `start()` invokes
- [Timer, animationFrameTimer, and stepTimer](/api/axon/timer) — the two timer singletons driven by (or independent of) this loop
- [Scenery Basics](/guides/scenery-basics) — the `Display`/repaint mechanism the loop drives each frame
