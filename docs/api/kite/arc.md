---
title: Arc
description: A circular arc segment defined by center, radius, and start/end angles — one of the pieces a Shape's subpaths are built from.
category: api
library: kite
tags: [kite, Arc, segment, path]
status: verified
related:
  - /api/kite/shape
  - /api/kite/elliptical-arc
  - /api/kite/line-segment
  - /api/kite/line-styles
  - /api/dot/vector2
prerequisites:
  - /api/kite/shape
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Arc

`Arc` (from `scenerystack/kite`) is a [`Segment`](/api/kite/shape) describing a piece of a circle — every point on it is equidistant (`radius`) from a `center`, swept from `startAngle` to `endAngle`. It's what `shape.arc( centerX, centerY, radius, startAngle, endAngle, anticlockwise )` appends to the current subpath, and it's also what `LineStyles` uses internally to build `'round'` line caps and joins (see [LineStyles](/api/kite/line-styles)).

```ts
import { Arc, Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';

const halfCircle = new Arc( new Vector2( 0, 0 ), 50, 0, Math.PI, false );
halfCircle.start;    // Vector2( 50, 0 )
halfCircle.end;      // Vector2( -50, 0 ) (approximately)
halfCircle.bounds;   // Bounds2 tightly containing the arc

// The usual way you'll get one: build it through Shape
const shape = new Shape().arc( 0, 0, 50, 0, Math.PI, false );
```

::: tip Angles are in radians, and `anticlockwise` follows the Canvas 2D convention
`startAngle`/`endAngle` are radians, not degrees, and `anticlockwise` matches the [HTML Canvas `arc()`](http://www.w3.org/TR/2dcontext/#dom-context-2d-arc) parameter of the same name — it's easy to get a swept direction backwards by assuming it means "counterclockwise in screen space," when scenery's y-axis points down, so `anticlockwise: true` sweeps what looks like *clockwise* on screen. If an arc looks like it's going the wrong way, flip this flag before touching the angles.
:::

## Constructor

```ts
new Arc( center: Vector2, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean )
```

If `startAngle`/`endAngle` differ by (approximately) a full turn, the `Arc` represents a complete circle rather than a partial arc — see `isFullPerimeter` below.

## Public API

| Member | Description |
| --- | --- |
| `center`, `radius`, `startAngle`, `endAngle`, `anticlockwise` | The five defining values, each with a getter and a setter (setters recompute cached bounds/tangents) |
| `start` / `end` | The endpoint `Vector2`s, derived from `center` + `radius` at `startAngle`/`endAngle` |
| `startTangent` / `endTangent` | Normalized tangent direction at each endpoint |
| `actualEndAngle` | `endAngle` remapped relative to `startAngle` so it always represents the actual angular sweep direction |
| `angleDifference` | The signed angular sweep of the arc, accounting for `anticlockwise` |
| `isFullPerimeter` | `true` if the arc is (approximately) a complete circle rather than a partial sweep |
| `bounds` | The tight `Bounds2` around the swept arc (not the full circle, unless `isFullPerimeter`) |
| `positionAtAngle( angle )` / `tangentAtAngle( angle )` | Position/tangent at a raw angle, rather than a parametric `t` |
| `transformed( matrix )` | Returns `Arc \| EllipticalArc` — a uniform-scale/rotation transform stays a circular `Arc`, but a non-uniform scale turns it into an [`EllipticalArc`](/api/kite/elliptical-arc), since circles don't stay circular under non-uniform scaling |
| `reversed()` | A new `Arc` tracing the same points in the opposite direction |

`Arc` also implements the full [`Segment`](/api/kite/shape) contract shared by every segment type — `positionAt( t )`, `tangentAt( t )`, `curvatureAt( t )`, `subdivided( t )`, and `getArcLength()` all work the same way they do on [`Line`](/api/kite/line-segment), [`Quadratic`](/api/kite/quadratic), and [`Cubic`](/api/kite/cubic).

## Related

- [Shape](/api/kite/shape) — how `Arc` and other segments compose into subpaths and shapes; also has the fluent `arc()`/static `Shape.circle()` builders.
- [EllipticalArc](/api/kite/elliptical-arc) — the more general segment `Arc.transformed()` can produce under non-uniform scaling.
- [LineStyles](/api/kite/line-styles) — `'round'` caps/joins are built from `Arc` segments.
