---
title: Visual Debugging Aids
description: Using scenery's built-in debug query parameters to visualize hit areas, pointer areas, and rendering-block boundaries while tracking down layout and input problems.
category: styling
tags: [scenery, debugging, query-parameters, showPointerAreas, showHitAreas, dev]
status: complete
related:
  - /guides/performance-and-profiling
  - /patterns/query-parameters-pattern
  - /patterns/drag-listeners
  - /api/scenery/hit-testing-and-picking
prerequisites:
  - /getting-started/running-and-building-a-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Visual Debugging Aids

Every SceneryStack simulation ships with a set of debug-overlay query parameters, wired into the shared `joist`/`chipper` startup path so no extra setup is needed to use them — just append the parameter to the dev URL (see [Running and Building a Simulation](/getting-started/running-and-building-a-simulation)). [Performance and Profiling](/guides/performance-and-profiling) covers the subset of these aimed at *speed* (`?profiler`, `?showFittedBlockBounds`). This page is about the subset aimed at **spotting layout and hit-area problems during development** — cases where something looks positioned correctly but doesn't respond to input where you'd expect, or vice versa.

## The overlay query parameters

| Query parameter | Shows | Use it to catch |
| --- | --- | --- |
| `?showPointerAreas` | Each Node's `mouseArea`/`touchArea` as an overlay | A touch target that's smaller (or larger) than intended — see [Icon Sizing and Button Padding Standards](/styling/icon-sizing-and-button-padding-standards) for the dilation options these overlays are visualizing |
| `?showHitAreas` | The actual hit-testing region scenery is using for pointer input, which may differ from the drawn shape for a `Path` with a custom `mouseArea`/hit-testing override — see [Hit-Testing and Picking](/api/scenery/hit-testing-and-picking) for the `pickable`/`mouseArea`/`touchArea` mechanics these overlays are visualizing | An interactive region that's misaligned with what's drawn — a draggable whose grabbable area doesn't match its visible bounds |
| `?showCanvasNodeBounds` | Bounds overlays specifically for `CanvasNode` subtrees | A `CanvasNode` whose declared `canvasBounds` doesn't match what it actually paints — content clipped at the overlay's edge is a sign the bounds are too small |
| `?showFittedBlockBounds` | The boundaries of scenery's internal Canvas/SVG/WebGL rendering blocks | Unexpected repaint/relayout scope — see [Performance and Profiling](/guides/performance-and-profiling) |
| `?dev` | A bundle of internal developer-facing overlays and checks | A general first pass when narrowing down where in the tree a problem lives, before reaching for a more specific flag above |

```
http://localhost:5173/?ea&showPointerAreas&showHitAreas
```

Combining `?showPointerAreas` and `?showHitAreas` is the most common pairing: the first shows *where you configured* input to be accepted, the second shows what scenery is *actually* using, and a mismatch between the two overlays is the fastest way to spot a stale or incorrectly-scoped `mouseArea`/`touchArea` override.

## A typical debugging session

A draggable Node that feels "hard to grab" near its edges is a good candidate for this workflow:

1. Load the sim with `?showPointerAreas` and look at the draggable's overlay. If the overlay is noticeably smaller than the Node's visible bounds, its `touchAreaXDilation`/`touchAreaYDilation` (see [Drag Listeners](/patterns/drag-listeners) and [Icon Sizing and Button Padding Standards](/styling/icon-sizing-and-button-padding-standards)) may be unset or too small.
2. Add `showHitAreas` alongside it. If the two overlays disagree, something is overriding the effective hit-testing region beyond the plain `mouseArea`/`touchArea` you'd expect — worth checking for a custom `Shape`-based hit area or a `pickable`/`inputEnabled` override on an ancestor.
3. If the region looks right but the Node still doesn't respond, the problem is more likely in the input-listener wiring itself (see [Drag Listeners](/patterns/drag-listeners)) than in geometry — the overlays only diagnose *where* scenery is willing to accept input, not whether a listener is actually attached and firing.

## Combine with `?ea` while debugging

These overlay parameters are purely visual and don't themselves validate anything — pair them with `?ea` (enabling SceneryStack's runtime assertions, see [Running and Building a Simulation](/getting-started/running-and-building-a-simulation)) so that an invalid option value or API misuse surfaces as an assertion failure rather than a silently wrong overlay.

::: tip These overlays are dev-only by convention, not stripped automatically
Nothing prevents a user from appending `?showPointerAreas` to a production build's URL — these are ordinary query parameters, not something gated behind a build flag. Treat them as a development workflow rather than assuming they're inaccessible outside of local dev; don't rely on their *absence* as a security or content-hiding mechanism.
:::
