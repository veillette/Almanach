---
title: EllipticalArc
description: A generalization of Arc that sweeps an ellipse (independent x/y radii, plus rotation) rather than a circle.
category: api
library: kite
tags: [kite, EllipticalArc, segment, path]
status: verified
related:
  - /api/kite/shape
  - /api/kite/arc
  - /api/kite/line-styles
  - /api/dot/vector2
prerequisites:
  - /api/kite/arc
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# EllipticalArc

`EllipticalArc` (from `scenerystack/kite`) is a [`Segment`](/api/kite/shape) that generalizes [`Arc`](/api/kite/arc) to ellipses: instead of a single `radius`, it has independent `radiusX`/`radiusY`, plus a `rotation` for the ellipse's semi-major axis. It's what `shape.ellipticalArc( centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise )` appends to the current subpath, and it's also what `Arc.transformed()` produces when a circular arc is transformed by a non-uniform scale (circles don't stay circular once x and y are scaled differently).

```ts
import { EllipticalArc, Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';

const halfEllipse = new EllipticalArc( new Vector2( 0, 0 ), 80, 40, 0, 0, Math.PI, false );
halfEllipse.start;   // Vector2( 80, 0 )
halfEllipse.bounds;  // Bounds2 tightly containing the swept arc

// The usual way you'll get one: build it through Shape
const shape = new Shape().ellipticalArc( 0, 0, 80, 40, 0, 0, Math.PI, false );
```

::: tip A circular `Arc` is just an `EllipticalArc` with `radiusX === radiusY` and `rotation === 0`
kite keeps them as separate classes for efficiency (circular math is cheaper), not because they're conceptually different — if you're writing code generic over "some kind of arc segment," `EllipticalArc` is the superset. Internally, `EllipticalArc` computes a `unitTransform` (a `Transform3` mapping the ellipse to a unit circle) and delegates position/tangent queries to the equivalent `Arc` on that unit circle, exposed as `unitArcSegment`.
:::

## Constructor

```ts
new EllipticalArc(
  center: Vector2,
  radiusX: number,
  radiusY: number,
  rotation: number,
  startAngle: number,
  endAngle: number,
  anticlockwise: boolean
)
```

`rotation` (radians) rotates the whole ellipse — including which direction counts as `radiusX` vs `radiusY` — around `center`, applied before `startAngle`/`endAngle` are measured.

## Public API

| Member | Description |
| --- | --- |
| `center`, `radiusX`, `radiusY`, `rotation`, `startAngle`, `endAngle`, `anticlockwise` | The defining values, each with a getter and setter (setters recompute cached bounds/tangents) |
| `start` / `end` | The endpoint `Vector2`s |
| `startTangent` / `endTangent` | Normalized tangent direction at each endpoint |
| `actualEndAngle` | `endAngle` remapped relative to `startAngle` to reflect the true angular sweep |
| `angleDifference` | The signed angular sweep, accounting for `anticlockwise` |
| `isFullPerimeter` | `true` if the arc sweeps a complete ellipse |
| `unitTransform` | The `Transform3` mapping this ellipse to/from a unit circle |
| `unitArcSegment` | The equivalent circular [`Arc`](/api/kite/arc) on that unit circle |
| `bounds` | The tight `Bounds2` around the swept arc |
| `positionAtAngle( angle )` / `tangentAtAngle( angle )` | Position/tangent at a raw angle, rather than a parametric `t` |
| `transformed( matrix )` | Always returns another `EllipticalArc` (unlike `Arc.transformed()`, which can stay circular) |
| `reversed()` | A new `EllipticalArc` tracing the same points in the opposite direction |

`EllipticalArc` also implements the shared [`Segment`](/api/kite/shape) contract — `positionAt( t )`, `tangentAt( t )`, `curvatureAt( t )`, `subdivided( t )`, `getArcLength()` — the same as [`Arc`](/api/kite/arc), [`Line`](/api/kite/line-segment), [`Quadratic`](/api/kite/quadratic), and [`Cubic`](/api/kite/cubic).

## Related

- [Shape](/api/kite/shape) — the fluent `ellipticalArc()` builder and static `Shape.ellipse()` factory.
- [Arc](/api/kite/arc) — the circular special case, and what a uniformly-scaled `EllipticalArc.transformed()` conceptually mirrors.
