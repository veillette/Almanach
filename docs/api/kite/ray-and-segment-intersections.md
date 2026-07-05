---
title: RayIntersection and SegmentIntersection
description: The two small result types returned by kite's ray-casting and segment/segment intersection queries.
category: api
library: kite
tags: [kite, RayIntersection, SegmentIntersection, Segment, Shape, intersection]
status: complete
prerequisites:
  - /api/kite/segment
related:
  - /api/kite/segment
  - /api/kite/shape
  - /api/dot/ray2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RayIntersection and SegmentIntersection

`RayIntersection` and `SegmentIntersection` (both from `scenerystack/kite`) are small, immutable data classes describing the result of two different kinds of intersection query. `RayIntersection` describes where a [`Ray2`](/api/dot/ray2) crosses a [`Segment`](/api/kite/segment) or [`Shape`](/api/kite/shape) — the result of `segment.intersection( ray )` or `shape.intersection( ray )`. `SegmentIntersection` describes where two segments cross each other — the result of `Segment.intersect( a, b )`, used internally by shape simplification and boolean operations.

```ts
import { Shape, Segment } from 'scenerystack/kite';
import { Ray2, Vector2 } from 'scenerystack/dot';

const shape = Shape.circle( 0, 0, 50 );
const ray = new Ray2( new Vector2( -100, 0 ), new Vector2( 1, 0 ) );

const hits = shape.intersection( ray ); // RayIntersection[]
hits[ 0 ].point;    // Vector2(-50, 0) - where the ray first crosses the circle
hits[ 0 ].distance; // 50 - distance from the ray's origin to that point
```

## `RayIntersection`

One crossing point between a ray and a single segment (a `Shape`'s `intersection( ray )` collects these across every segment in every subpath).

| Field | Meaning |
| --- | --- |
| `point` | The `Vector2` location of the intersection |
| `distance` | Distance from the ray's origin to `point` (always `>= 0`) |
| `normal` | Unit normal to the segment at the intersection, oriented so its dot product with the ray's direction is `<= 0` |
| `wind` | `1` or `-1` — the winding contribution of this crossing, used by the non-zero fill rule that backs `Shape.containsPoint()` |
| `t` | The parametric value (`0` to `1`) along the specific segment where the crossing occurs |

`RayIntersection` is a plain constructed value (`new RayIntersection( distance, point, normal, wind, t )`) — you receive instances of it as return values; you won't typically construct one yourself.

## `SegmentIntersection`

One crossing point between two arbitrary segments, as returned by the static `Segment.intersect( a, b )`.

| Field | Meaning |
| --- | --- |
| `point` | The `Vector2` location of the intersection |
| `aT` | Parametric value (`0` to `1`) along the *first* segment (`a`) where the crossing occurs |
| `bT` | Parametric value (`0` to `1`) along the *second* segment (`b`) where the crossing occurs |
| `getSwapped()` | Returns an equivalent `SegmentIntersection` with `aT`/`bT` swapped — useful if you called `Segment.intersect( a, b )` but want the result as if you'd called `Segment.intersect( b, a )` |

```ts
import { Segment, Shape } from 'scenerystack/kite';

const line = Shape.lineSegment( 0, -50, 0, 50 ).subpaths[ 0 ].segments[ 0 ];
const circleArc = Shape.circle( 0, 0, 30 ).subpaths[ 0 ].segments[ 0 ];

const crossings = Segment.intersect( line, circleArc ); // SegmentIntersection[]
```

::: tip These describe *where* two things cross — not whether a shape contains a point
`shape.containsPoint( point )` and boolean shape operations (`Shape.union`/`intersection`/`xor`, see [Graph and Boolean Shape Operations](/api/kite/graph-and-boolean-operations)) are built out of exactly these intersection primitives internally (`RayIntersection.wind` for hit-testing, `SegmentIntersection` for splitting overlapping segments during simplification) — but as an API consumer you'd reach for `RayIntersection`/`SegmentIntersection` directly only for a custom geometry query (e.g. "where along this path does a laser beam first hit"), not for ordinary hit-testing or shape combination, which already have dedicated, higher-level methods.
:::
