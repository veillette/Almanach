---
title: Cubic
description: A cubic Bezier curve segment defined by a start point, two control points, and an end point.
category: api
library: kite
tags: [kite, Cubic, bezier, segment, path]
status: complete
related:
  - /api/kite/shape
  - /api/kite/quadratic
  - /api/kite/line-segment
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Cubic

`Cubic` (from `scenerystack/kite`) is a [`Segment`](/api/kite/shape) describing a cubic Bézier curve — a `start` point, two control points (`control1`, `control2`) that shape the curve without the curve passing through them, and an `end` point. It's what `shape.cubicCurveTo( cp1x, cp1y, cp2x, cp2y, x, y )` appends to the current subpath, and it's the curve type behind most hand-drawn or design-tool-exported SVG path data (`C`/`c` commands).

```ts
import { Cubic, Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';

const curve = new Cubic(
  new Vector2( 0, 0 ),     // start
  new Vector2( 30, 100 ),  // control1
  new Vector2( 70, 100 ),  // control2
  new Vector2( 100, 0 )    // end
);
curve.positionAt( 0.5 ); // the curve's midpoint

// The usual way you'll get one: build it through Shape
const shape = new Shape().moveTo( 0, 0 ).cubicCurveTo( 30, 100, 70, 100, 100, 0 );
```

::: tip Cubics can have cusps and inflection points — flatten before assuming smoothness
Unlike `Quadratic`, a `Cubic` can have an S-shape, a cusp (a sharp point where the tangent direction reverses), or self-intersect. `Cubic` exposes `tCusp`, `tInflection1`/`tInflection2`, and `xExtremaT`/`yExtremaT` so algorithms that need monotonic pieces (hit-testing, stroking, tessellation) can `subdivided()` at those `t` values first. If you're writing code that assumes a curve bends only one way, check these before trusting that assumption.
:::

## Constructor

```ts
new Cubic( start: Vector2, control1: Vector2, control2: Vector2, end: Vector2 )
```

## Public API

| Member | Description |
| --- | --- |
| `start`, `control1`, `control2`, `end` | The four defining points, each with a getter and setter (setters recompute cached bounds/tangents) |
| `startTangent` / `endTangent` | Normalized tangent direction at each endpoint — toward `control1` from `start`, and from `control2` toward `end` |
| `tCusp` | Parametric `t` of a potential cusp (a point where the derivative vanishes and direction can flip) |
| `tInflection1` / `tInflection2` | Parametric `t` values where curvature changes sign (`NaN` if not applicable) |
| `xExtremaT` / `yExtremaT` | Arrays of `t` values where the x- or y-derivative is zero, used to compute tight bounds |
| `bounds` | The tight `Bounds2` around the curve, accounting for the extrema above |
| `subdivided( t )` | Splits into two `Cubic`s at parametric `t`, each an exact piece of the original curve |
| `getArcLength()` | Approximate arc length, computed via recursive subdivision (see [Segment](/api/kite/shape)'s shared `getArcLength()`) |
| `reversed()` | A new `Cubic` with `start`/`end` swapped and `control1`/`control2` swapped |
| `transformed( matrix )` | A new `Cubic` with all four points transformed by a [`Matrix3`](/api/dot/matrix3) |

`Cubic` also implements the shared [`Segment`](/api/kite/shape) contract — `positionAt( t )`, `tangentAt( t )`, `curvatureAt( t )` — the same as [`Line`](/api/kite/line-segment), [`Arc`](/api/kite/arc), and [`Quadratic`](/api/kite/quadratic).

## Related

- [Shape](/api/kite/shape) — the fluent `cubicCurveTo()` builder.
- [Quadratic](/api/kite/quadratic) — the simpler one-control-point curve.
