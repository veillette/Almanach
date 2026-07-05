---
title: Segment
description: The abstract base class Arc, Cubic, Quadratic, Line, and EllipticalArc all extend — the shared parametric contract every segment type implements.
category: api
library: kite
tags: [kite, Segment, Arc, Cubic, Quadratic, Line, EllipticalArc, path]
status: complete
prerequisites:
  - /api/kite/shape
  - /api/kite/subpath
related:
  - /api/kite/arc
  - /api/kite/cubic
  - /api/kite/quadratic
  - /api/kite/line-segment
  - /api/kite/elliptical-arc
  - /api/kite/shape
  - /api/kite/subpath
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Segment

`Segment` (from `scenerystack/kite`) is the abstract base class behind every curve type kite offers: [`Arc`](/api/kite/arc), [`Cubic`](/api/kite/cubic), [`Quadratic`](/api/kite/quadratic), [`Line`](/api/kite/line-segment) (exported as `KiteLine`), and [`EllipticalArc`](/api/kite/elliptical-arc) all extend it. A [`Shape`](/api/kite/shape) is ultimately just an array of [`Subpath`](/api/kite/subpath)s, and each `Subpath` is an ordered array of `Segment`s — this page documents the contract they all share, so you can treat a mixed array of segment types uniformly (e.g. when walking `shape.subpaths[i].segments`) without caring which concrete subclass each one is.

```ts
import { Shape, Segment } from 'scenerystack/kite';

const shape = new Shape().moveTo( 0, 0 ).lineTo( 100, 0 ).quadraticCurveTo( 150, 50, 100, 100 );

for ( const subpath of shape.subpaths ) {
  for ( const segment: Segment of subpath.segments ) {
    // Every segment, regardless of concrete type, supports this same API:
    console.log( segment.start.toString(), '->', segment.end.toString() );
    console.log( 'arc length:', segment.getArcLength() );
    console.log( 'midpoint:', segment.positionAt( 0.5 ).toString() );
  }
}
```

Every segment is parameterized over `t` from `0` (its `start`) to `1` (its `end`) — the same convention `Cubic` and `Quadratic`'s Bézier parameter uses, and `Arc`/`EllipticalArc` map linearly onto their angular sweep.

## The shared contract

These members are declared `abstract` on `Segment` — every concrete subclass must implement them, each according to its own geometry:

| Member | Effect |
| --- | --- |
| `start` / `end` (getters) | The segment's endpoints, at `t=0` and `t=1` |
| `startTangent` / `endTangent` (getters) | Normalized tangent vectors at the endpoints, pointing in the direction of travel |
| `bounds` (getter) / `getBounds()` | The segment's axis-aligned `Bounds2` |
| `positionAt( t )` | The point at parametric value `t` (`0 <= t <= 1`) |
| `tangentAt( t )` | The non-normalized tangent `(dx/dt, dy/dt)` at `t` |
| `curvatureAt( t )` | Signed curvature at `t` (positive for a visually-clockwise turn) |
| `subdivided( t )` | Splits the segment into up to 2 sub-segments at `t`, together tracing the same curve |
| `getInteriorExtremaTs()` | The interior `t` values (`0 < t < 1`) where `dx/dt` or `dy/dt` is zero — subdividing at these produces monotone pieces |
| `strokeLeft( lineWidth )` / `strokeRight( lineWidth )` | The offset-curve segments for the logical left/right side of a stroke |
| `windingIntersection( ray )` | The winding-number contribution of a ray/segment intersection, used by `Shape.containsPoint()` |
| `intersection( ray )` | The list of [`RayIntersection`](/api/kite/ray-and-segment-intersections)s between this segment and a `Ray2` |
| `getOverlaps( segment, epsilon? )` | Whether (and how) this segment overlaps another of a compatible type, for shape-simplification purposes |
| `getSignedAreaFragment()` | This segment's contribution to a subpath's signed area (Green's theorem) |
| `getNondegenerateSegments()` | A list of equivalent, non-degenerate segments (e.g. an `Arc` with zero radius simplifies away) |
| `transformed( matrix )` | A new segment of the same or an equivalent type, transformed by a `Matrix3` |
| `reversed()` | A new segment tracing the same curve with `start`/`end` swapped |
| `getSVGPathFragment()` | The SVG path-data fragment for this segment alone (assuming the pen is already at `start`) |
| `writeToContext( context )` | Draws the segment to a `CanvasRenderingContext2D`, assuming the context is already at `start` |
| `serialize()` / `Segment.deserialize()` | Round-trip to/from a plain serializable object |
| `invalidate()` | Recomputes any cached derived state after mutating the segment in place |

## Shared concrete behavior

`Segment` also implements a handful of concrete methods, in terms of the abstract ones above, so every subclass gets them for free:

| Member | Effect |
| --- | --- |
| `getArcLength( distanceEpsilon?, curveEpsilon?, maxLevels? )` | Adaptive-subdivision arc length estimate — recursively `subdivided()` until each piece is "sufficiently flat," then sums straight-line distances |
| `slice( t0, t1 )` | The portion of the segment between two parametric values, via `subdivided()` |
| `subdivisions( tList )` | Splits at every `t` in a sorted list, in one pass |
| `subdividedIntoMonotone()` | `subdivisions( this.getInteriorExtremaTs() )` |
| `isSufficientlyFlat( distanceEpsilon, curveEpsilon )` | Whether the segment is close enough to its start-end chord to treat as flat, used internally by `getArcLength()` and piecewise-linear conversion |
| `getDashValues( lineDash, lineDashOffset, ... )` | Parametric `t` values where dash boundaries fall, for rendering a dashed stroke |
| `toPiecewiseLinearSegments( options )` | Approximates the curve as a series of `Line` segments |
| `getClosestPoints( point )` / `Segment.closestToPoint( segments, point, threshold )` | Finds the closest point(s) on a segment (or set of segments) to an arbitrary point |
| `Segment.intersect( a, b )` | Static: all [`SegmentIntersection`](/api/kite/ray-and-segment-intersections)s between two arbitrary segments |

::: tip Reach for the shared `Segment` API when writing type-agnostic geometry code
Anything that processes `shape.subpaths[i].segments` generically — measuring total path length, hit-testing, generating a dashed outline, or converting to line-only approximations for export — should be written against this shared `Segment` contract rather than switching on `instanceof Arc`/`Cubic`/etc. The five concrete pages ([Arc](/api/kite/arc), [Cubic](/api/kite/cubic), [Quadratic](/api/kite/quadratic), [Line](/api/kite/line-segment), [EllipticalArc](/api/kite/elliptical-arc)) only need to document what's *specific* to each curve type — their constructors and shape-specific accessors (`center`/`radius` for `Arc`, control points for `Cubic`/`Quadratic`) — since everything on this page already applies uniformly.
:::
