---
title: Quadratic
description: A quadratic Bezier curve segment defined by a start point, one control point, and an end point.
category: api
library: kite
tags: [kite, Quadratic, bezier, segment, path]
status: verified
related:
  - /api/kite/shape
  - /api/kite/cubic
  - /api/kite/line-segment
  - /api/dot/vector2
prerequisites:
  - /api/kite/shape
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Quadratic

`Quadratic` (from `scenerystack/kite`) is a [`Segment`](/api/kite/shape) describing a quadratic Bézier curve — a `start` point, one `control` point the curve bends toward (but usually doesn't pass through), and an `end` point. It's what `shape.quadraticCurveTo( cpx, cpy, x, y )` appends to the current subpath. Quadratic curves are less common in hand-authored shapes than [`Cubic`](/api/kite/cubic) (SVG path data and most design tools default to cubic curves), but they're cheaper to evaluate and show up in font glyph outlines and some procedurally-generated shapes.

```ts
import { Quadratic, Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';

const curve = new Quadratic(
  new Vector2( 0, 0 ),    // start
  new Vector2( 50, 100 ), // control
  new Vector2( 100, 0 )   // end
);
curve.positionAt( 0.5 ); // the curve's midpoint (not the control point)

// The usual way you'll get one: build it through Shape
const shape = new Shape().moveTo( 0, 0 ).quadraticCurveTo( 50, 100, 100, 0 );
```

::: tip The curve doesn't pass through its control point
It's tempting to read `control` as a point the curve visits, but a Bézier control point only *pulls* the curve toward it — the curve touches `start` and `end` only. If you need a curve that passes through a specific interior point, either solve for the control point that produces it, or use several segments (`subdivided( t )`) to compose the shape you actually want.
:::

## Constructor

```ts
new Quadratic( start: Vector2, control: Vector2, end: Vector2 )
```

## Public API

| Member | Description |
| --- | --- |
| `start`, `control`, `end` | The three defining points, each with a getter and setter (setters recompute cached bounds/tangents) |
| `startTangent` / `endTangent` | Normalized tangent direction at each endpoint — points from `start` toward `control`, and from `control` toward `end`, respectively |
| `tCriticalX` / `tCriticalY` | The parametric `t` where the x- or y-derivative is zero (`NaN` if that extremum falls outside `[0, 1]`) — used internally to compute tight bounds |
| `bounds` | The tight `Bounds2` around the curve (accounting for the extrema above, not just the three defining points) |
| `subdivided( t )` | Splits into two `Quadratic`s at parametric `t`, each an exact piece of the original curve |
| `getArcLength()` | Approximate arc length, computed via recursive subdivision (see [Segment](/api/kite/shape)'s shared `getArcLength()`) |
| `reversed()` | A new `Quadratic` with `start`/`end` swapped and `control` unchanged |
| `transformed( matrix )` | A new `Quadratic` with all three points transformed by a [`Matrix3`](/api/dot/matrix3) |

`Quadratic` also implements the shared [`Segment`](/api/kite/shape) contract — `positionAt( t )`, `tangentAt( t )`, `curvatureAt( t )` — the same as [`Line`](/api/kite/line-segment), [`Arc`](/api/kite/arc), and [`Cubic`](/api/kite/cubic).

## Related

- [Shape](/api/kite/shape) — the fluent `quadraticCurveTo()` builder.
- [Cubic](/api/kite/cubic) — the two-control-point curve most SVG/design-tool path data actually uses.
