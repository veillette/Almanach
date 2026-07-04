---
title: Bounds2
description: An axis-aligned rectangle used for layout, drag bounds, and hit-testing.
category: api
library: dot
tags: [dot, Bounds2, bounds]
status: verified
related:
  - /api/dot/vector2
  - /api/dot/range
  - /api/dot/matrix3
  - /patterns/drag-listeners
prerequisites:
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Bounds2

`Bounds2` (from `scenerystack/dot`) is an axis-aligned bounding box, stored as `minX`/`minY`/`maxX`/`maxY` (not `x`/`y`/`width`/`height`, though those are available as convenience getters). It's used constantly for layout bounds, drag bounds, hit-testing, and `Node.bounds`/`localBounds`.

```ts
import { Bounds2 } from 'scenerystack/dot';

const dragBounds = new Bounds2( 0, 0, 768, 504 );

dragBounds.width;                       // 768
dragBounds.center;                      // Vector2(384, 252)
dragBounds.containsCoordinates( 800, 10 ); // false — outside on the right

const clamped = dragBounds.closestPointTo( new Vector2( 900, 10 ) ); // Vector2(768, 10)
```

## Constructing bounds

The constructor takes the four extremes directly: `new Bounds2( minX, minY, maxX, maxY )`. For the more familiar `(x, y, width, height)` rectangle shape, use the static factory instead:

```ts
const bounds = Bounds2.rect( 10, 10, 200, 100 ); // minX:10, minY:10, maxX:210, maxY:110
```

| Static | Meaning |
| --- | --- |
| `Bounds2.rect( x, y, width, height )` | Build from x/y/width/height |
| `Bounds2.point( x, y )` / `Bounds2.point( vector )` | A zero-area bounds containing exactly one point, useful as a starting point to `dilate()` |
| `Bounds2.NOTHING` | `minX = minY = +Infinity`, `maxX = maxY = -Infinity` — the identity for `union()` |
| `Bounds2.EVERYTHING` | `minX = minY = -Infinity`, `maxX = maxY = +Infinity` — the identity for `intersection()` |

## Reading properties

| Getter | Meaning |
| --- | --- |
| `width`, `height` | `maxX - minX`, `maxY - minY` |
| `x`, `y`, `left`, `top`, `right`, `bottom` | Aliases for `minX`, `minY`, `minX`, `minY`, `maxX`, `maxY` |
| `centerX`, `centerY`, `center` | Midpoints, as numbers or a `Vector2` |
| `leftTop`, `centerTop`, `rightTop`, `leftCenter`, `rightCenter`, `leftBottom`, `centerBottom`, `rightBottom` | The eight named corners/edge-midpoints as `Vector2` |
| `xRange`, `yRange` | The `[minX, maxX]` / `[minY, maxY]` extents as a [`Range`](/api/dot/range) |
| `isEmpty()` | `true` if width or height is negative (`NOTHING` is empty; a zero-area point bounds is **not**) |
| `isFinite()` | `true` unless it's `NOTHING`/`EVERYTHING`-like |

## Immutable vs. mutable methods

Like the vector types, most operations come in an immutable form (new `Bounds2`) and a mutable form (mutates `this`):

| Immutable | Mutable | Effect |
| --- | --- | --- |
| `union( bounds )` | `includeBounds( bounds )` | Smallest bounds containing both |
| `intersection( bounds )` | `constrainBounds( bounds )` | Largest bounds contained in both |
| `withPoint( point )` / `withCoordinates( x, y )` | `addPoint( point )` / `addCoordinates( x, y )` | Expand to include a point |
| `dilated( d )` / `dilatedXY( x, y )` | `dilate( d )` / `dilateXY( x, y )` | Expand on all sides |
| `eroded( d )` / `erodedXY( x, y )` | `erode( d )` / `erodeXY( x, y )` | Contract on all sides |
| `shifted( v )` / `shiftedXY( x, y )` | `shift( v )` / `shiftXY( x, y )` | Translate |
| `roundedOut()` / `roundedIn()` | `roundOut()` / `roundIn()` | Snap to integer boundaries, expanding or contracting |
| `transformed( matrix )` | `transform( matrix )` | Apply a [`Matrix3`](/api/dot/matrix3) affine transform, re-fitting to axis-alignment |
| `copy()` | `set( bounds )` / `setMinMax( ... )` | Copy / assign |

Queries: `containsCoordinates( x, y )`, `containsPoint( point )`, `containsBounds( bounds )`, `intersectsBounds( bounds )`, `closestPointTo( point )`, `getConstrainedPoint( point )` (clamp a point into the bounds), `equals`/`equalsEpsilon`, and `toString()`.

::: warning `Bounds2.NOTHING` and `Bounds2.EVERYTHING` are frozen
Both constants throw if you call a mutating method (`setMinMax`, `dilate`, `transform`, ...) on them directly — they exist purely as identity elements for `union`/`intersection` chains. Start an accumulation with `Bounds2.NOTHING.copy()` (or just `Bounds2.NOTHING.union(...)`, which returns a fresh instance) rather than mutating the shared constant.
:::

## Related

- [Vector2](/api/dot/vector2) — corners and centers of a `Bounds2` are returned as `Vector2` instances.
- [Range](/api/dot/range) — `bounds.xRange` / `bounds.yRange` expose each axis as a `Range`.
- [Matrix3](/api/dot/matrix3) — `bounds.transformed( matrix )` re-fits a bounds after an affine transform.
- [Drag Listeners](/patterns/drag-listeners) — drag bounds are typically expressed as a `Bounds2`.
