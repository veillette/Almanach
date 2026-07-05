---
title: Graph and Boolean Shape Operations
description: The Graph machinery powering Shape.union/intersection/xor and clipping — how to combine two Shapes, at a practical level.
category: api
library: kite
tags: [kite, Graph, Shape, Face, HalfEdge, Loop, Boundary, Edge, Vertex, boolean-operations]
status: complete
prerequisites:
  - /api/kite/shape
related:
  - /api/kite/shape
  - /api/kite/subpath
  - /api/kite/segment
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Graph and Boolean Shape Operations

`Graph` (from `scenerystack/kite`, exported alongside `Shape` from the same module) is the machinery behind [`Shape`](/api/kite/shape)'s boolean operations — `Shape.union()`, `Shape.intersection()`, `Shape.xor()`, and shape clipping. It builds a planar subdivision (a doubly-connected-edge-list-style structure of `Vertex`/`Edge`/`HalfEdge`/`Loop`/`Boundary`/`Face` objects) out of one or more shapes' segments, resolves every self-intersection and overlap between them, and then re-derives a clean output `Shape` from whichever faces satisfy a winding-number rule. In practice, you almost never touch `Graph` directly — you call the `Shape` static methods that use it internally.

```ts
import { Shape } from 'scenerystack/kite';

const circle = Shape.circle( 50, 50, 40 );
const square = Shape.rectangle( 30, 30, 60, 60 );

const combined = Shape.union( [ circle, square ] );          // everything covered by either shape
const overlap = Shape.intersection( [ circle, square ] );     // only the region covered by both
const symmetricDifference = Shape.xor( [ circle, square ] );  // covered by exactly one, not both
```

## The `Shape` entry points

| Method | Result |
| --- | --- |
| `Shape.union( shapes )` | The region covered by at least one input shape |
| `Shape.intersection( shapes )` | The region covered by every input shape |
| `Shape.xor( shapes )` | The region covered by an odd number of input shapes (their symmetric difference) |

All three (and `Graph.simplifyNonZero( shape )`, used to clean up self-intersections in a single shape) are implemented by constructing a `Graph`, adding each input shape with a distinct integer ID, computing the planar subdivision, then filtering faces by a `windingMap` predicate — a record of, for each shape ID, how many times that shape's boundary winds around a given face. `union` keeps any face where at least one shape's winding is non-zero; `intersection` keeps only faces where *every* shape's winding is non-zero; `xor` keeps faces where an odd number of shapes wind around it.

## Clipping one shape to another

`Graph.clipShape( clipAreaShape, shape, options? )` returns the portion of `shape` that falls inside `clipAreaShape`, useful for anything that needs to restrict a drawn path to a clip region using real geometry (rather than a Canvas/SVG clip path) — for example, precomputing the clipped area to measure it, or to further combine it with other shapes.

| Option | Default | Effect |
| --- | --- | --- |
| `includeExterior` | `false` | Keep the parts of `shape` outside `clipAreaShape` |
| `includeBoundary` | `true` | Keep the parts of `shape` exactly on `clipAreaShape`'s boundary |
| `includeInterior` | `true` | Keep the parts of `shape` inside `clipAreaShape` |

## What's inside a `Graph`, briefly

If you do need to go one level deeper — say, to inspect exactly which faces a combination produced — a `Graph` is built from these pieces, in rough dependency order: `Vertex` (a point where segments meet), `Edge` (a `Segment` between two vertices, with a `forwardHalf`/`reversedHalf` pair of `HalfEdge`s for its two traversal directions), `Loop` (a cyclic sequence of half-edges from one original subpath), `Boundary` (a maximal cycle of half-edges bounding a region, possibly nested as holes via `childBoundaries`), and `Face` (a region bounded by a `Boundary`, with a `windingMap` recording each input shape's winding number there and a `filled` flag once `computeFaceInclusion()` has run). The typical pipeline a `Graph` runs through is: `addShape()` for each input, `computeSimplifiedFaces()` (resolves self-intersections/overlaps and builds faces), `computeFaceInclusion( windingMapFilter )` (marks `filled` per your predicate), `createFilledSubGraph()`, then `facesToShape()`/`Shape.fromGraph()` to get the resulting `Shape` back out.

::: tip Boolean operations are exact geometry, not a rendering trick
Because `Graph` resolves the actual intersection points and rebuilds real segments, the `Shape` returned by `union`/`intersection`/`xor`/`clipShape` is genuine vector geometry — it has correct `bounds`, `containsPoint()`, and stroke behavior, unlike compositing two overlapping shapes with Canvas globalCompositeOperation tricks. The tradeoff is cost: computing intersections across many segments is the dominant expense in these operations, so avoid recomputing a boolean combination every frame for shapes that aren't actually changing.
:::
