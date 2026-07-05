---
title: ConvexHull2
description: A Graham Scan implementation computing the 2D convex hull (minimal enclosing polygon) of a set of Vector2 points.
category: api
library: dot
tags: [dot, ConvexHull2, Vector2, geometry, math]
status: complete
prerequisites:
  - /api/dot/vector2
related:
  - /api/dot/vector2
  - /api/dot/permutation-and-combination
  - /api/kite/shape
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ConvexHull2

`ConvexHull2` (from `scenerystack/dot`) is a namespace object (not a class you instantiate) with a single method, `grahamScan()`, implementing the [Graham Scan](http://en.wikipedia.org/wiki/Graham_scan) algorithm: given an arbitrary set of 2D points, it returns the ordered subset of those points that form the smallest convex polygon containing all of them.

```ts
import { ConvexHull2, Vector2 } from 'scenerystack/dot';
import { Shape } from 'scenerystack/kite';

const points = [
  new Vector2( 0, 0 ), new Vector2( 4, 0 ), new Vector2( 2, 2 ),
  new Vector2( 2, 4 ), new Vector2( 1, 1 ) // interior point - excluded from the hull
];

const hullPoints = ConvexHull2.grahamScan( points, false );
// an ordered Vector2[] tracing the outer boundary, excluding the interior point

const hullShape = Shape.polygon( hullPoints ); // draw it with kite
```

## `grahamScan( points, includeCollinear )`

| Parameter | Effect |
| --- | --- |
| `points` | The `Vector2[]` to compute a hull over |
| `includeCollinear` | If `true`, points lying exactly along a hull edge (not at a vertex) are kept in the result; if `false`, only the "true" corner vertices are kept |

Returns an ordered `Vector2[]` (counter-clockwise) tracing the hull boundary. Arrays of 2 or fewer points are returned unchanged (there's no meaningful "hull" to compute).

## When you'd reach for this

Convex hulls come up whenever you need the smallest polygon enclosing a scattered set of points — for example, drawing a boundary/highlight around a cluster of draggable objects, computing a rough bounding shape for collision purposes that's tighter than an axis-aligned [`Bounds2`](/api/dot/bounds2) but simpler than the objects' exact outlines, or building the correct arm/interaction shape for a Voronoi- or hull-based interactive diagram.

::: tip Collinear points are excluded by default
Pass `includeCollinear: false` (as most callers do) unless you specifically need every point that lies exactly on a hull edge represented in the result — the default (excluding them) gives you the minimal vertex set describing the same polygon, which is usually what you want for drawing or further geometric processing.
:::
