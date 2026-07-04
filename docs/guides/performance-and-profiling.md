---
title: Performance and Profiling
description: Finding and fixing slow rendering or update-loop performance in a SceneryStack simulation - profiling query parameters, Node/Property overhead, and Canvas/SVG/WebGL tradeoffs.
category: guides
tags: [scenery, performance, profiling, rendering]
status: verified
related:
  - /guides/scenery-basics
  - /guides/scenery-layout
  - /getting-started/supported-browsers
  - /api/axon/property
  - /api/axon/derived-property
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Performance and Profiling

A slow SceneryStack simulation is almost never slow because scenery itself is slow — it's slow because the scene graph is doing more repaint/relayout work than the visible result needs, or because the model's `step`/listener graph is doing more computation per frame than the animation actually requires. This page covers how to *see* where the time goes before guessing, and the handful of causes that account for most real slowdowns: Node count and structure, `Property`/listener overhead, and choosing the wrong renderer for a subtree.

::: warning Profile before you optimize
Every technique below (picking a `renderer`, flattening Node structure, batching `Property` updates) has a real cost in code complexity or flexibility. Applied to a subtree that was never the bottleneck, it's pure overhead with no payoff. Use the query parameters in the next section to find the actual slow part first — guessing which Node or Property is "probably expensive" reliably wastes effort on the wrong thing.
:::

## Finding the bottleneck: built-in profiling query parameters

Every SceneryStack simulation ships with debug instrumentation reachable via query parameters — no extra setup required, since these are wired into the shared `joist`/`chipper` initialization every `Sim` goes through:

| Query parameter | Shows |
| --- | --- |
| `?profiler` | An FPS/ms-per-frame histogram in the corner of the screen, updated every 60 frames — the first thing to check for "is it actually slow, and when" |
| `?showPointerAreas` | Each Node's `mouseArea`/`touchArea`, useful for confirming input regions rather than raw render cost |
| `?showHitAreas` | Actual hit-testing regions being used for pointer input |
| `?showCanvasNodeBounds` | Bounds overlays for `CanvasNode` subtrees specifically |
| `?showFittedBlockBounds` | The boundaries of scenery's internal rendering "blocks" — useful for seeing how much of the tree got batched into one Canvas/SVG/WebGL block versus split into many |
| `?dev` | A bundle of internal developer-facing overlays and checks, useful when narrowing down where in the tree a problem lives |

Start with `?profiler`. If frame time is consistently high rather than spiking occasionally, you're CPU- or GPU-bound on steady-state work (too many Nodes repainting, too much `step`/listener computation per frame). If it's fine most frames but spikes occasionally, that's usually garbage collection pressure from allocating in a hot path (a `step` function or `Property` listener that creates new objects every frame) rather than a rendering problem at all — the profiler's own doc calls this out explicitly, which is why it reports a full histogram rather than just an average.

## Node count and tree shape

Scenery batches adjacent, renderer-compatible Nodes into as few underlying Canvas/SVG/WebGL surfaces as it can (see [Scenery Basics](/guides/scenery-basics#render-layers-canvas-svg-and-webgl)), but every Node still costs *something* — a bounds computation, a transform, participation in hit-testing. A few thousand simple Nodes rarely matters; tens of thousands, or a few thousand Nodes each with complex `Shape`-based geometry, starts to show up in the profiler.

The usual fix is reducing Node count for content that doesn't need to be individually addressable:

- **Static decorative content** that never changes and never needs independent input handling is a candidate for a single `Path`/`Image` rather than many small Nodes assembled at runtime.
- **Large repeated structures** (a grid of many small identical icons, for instance) are a good candidate for `CanvasNode` with hand-written `paintCanvas` logic instead of one scenery `Node` per repeated element — trading scenery's automatic per-Node input/bounds handling for one manual draw routine, in exchange for far fewer objects for scenery to track.
- **Visibility toggling** should use `visible`, not adding/removing children repeatedly — `node.visible = false` keeps the Node in the tree (and its subtree structure intact) while skipping paint and, if `pickable` is also affected, input; repeated `addChild`/`removeChild` churn is more expensive than toggling a flag.

## Property and listener overhead

`Property.set()`/`.value =` notifies every registered listener synchronously, in registration order. That's usually cheap — but two patterns turn it into a real cost:

- **A `DerivedProperty` (or manual listener) that does expensive work on every dependency change**, when the dependency changes far more often than the derived result actually needs to update. If a derived value only matters once per animation frame, deriving it from `stepTimer`/an explicit per-frame recompute rather than from a rapidly-changing input Property (e.g. a raw pointer-position Property firing many times per frame) avoids redundant recomputation between frames nobody observes.
- **Registering listeners you never remove.** A `Property` (or `Emitter`) that accumulates listeners across the sim's lifetime — because a transient object linked to it but never called `unlink`/`dispose` — both leaks memory and means every future `.set()` does more work than it should. See [Dispose and Memory Management](/patterns/dispose-and-memory-management) for the disposal convention that prevents this.

```ts
import { DerivedProperty } from 'scenerystack/axon';

// Expensive: recomputes on every change to either dependency, even many times per frame.
const derivedProperty = new DerivedProperty(
  [ rawPointerPositionProperty, zoomLevelProperty ],
  ( position, zoom ) => expensiveLayoutComputation( position, zoom )
);
```

If `rawPointerPositionProperty` updates on every pointer-move event rather than once per frame, `expensiveLayoutComputation` runs far more often than the screen actually repaints. Debouncing to a per-frame recompute (driven from the model's own `step(dt)`, reading the latest pointer position without re-deriving on every intermediate update) is the usual fix once profiling actually shows this Property's listeners as the hot path.

## Canvas, SVG, and WebGL: matching the renderer to the content

Every `Node` has a `renderer` option (`'svg' | 'canvas' | 'webgl' | 'dom' | null`), normally left `null` so scenery picks automatically (see [Supported Browsers](/getting-started/supported-browsers#graceful-degradation-via-renderer-fallback)). The tradeoffs, for the rare case profiling shows you need to pin one:

| Renderer | Best for | Cost |
| --- | --- | --- |
| SVG (scenery's default for most vector content) | Crisp vector shapes/text at any zoom, resolution-independent | Each distinct element is a real DOM node; very large numbers of separately-styled SVG elements get expensive to keep in sync |
| Canvas | Many similar elements painted together, or custom per-pixel drawing (`CanvasNode`) | Cheaper per-element than SVG at scale, but loses SVG's automatic hit-testing/accessibility hooks — you draw pixels, not addressable elements |
| WebGL | Large numbers of simple shapes needing GPU-accelerated compositing (particle-like effects, many identical sprites) | Highest ceiling for raw throughput, but the least forgiving to author for and not guaranteed available (falls back automatically per [Supported Browsers](/getting-started/supported-browsers)) |

The practical rule: leave `renderer` unset until `?profiler` and Node-count investigation point at a *specific* subtree, then reach for `CanvasNode` (for many similar small elements) or a pinned `renderer: 'canvas'`/`'webgl'` hint (for scenery-managed Nodes that would benefit from being batched onto a different surface than their neighbors) only for that subtree — not the whole sim.

## Where to go next

- [Scenery Basics](/guides/scenery-basics) — the Node tree and render-layer model this page assumes
- [Dispose and Memory Management](/patterns/dispose-and-memory-management) — the disposal convention that prevents listener/Property leaks from becoming a performance problem over a long-running sim
- [Supported Browsers](/getting-started/supported-browsers) — renderer fallback behavior across platforms
