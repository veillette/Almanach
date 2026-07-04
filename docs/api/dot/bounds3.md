---
title: Bounds3
description: An axis-aligned cuboid (3D bounding box), the 3D counterpart to Bounds2.
category: api
library: dot
tags: [dot, Bounds3, bounds]
status: complete
related:
  - /api/dot/bounds2
  - /api/dot/vector3
  - /api/dot/matrix4
prerequisites:
  - /api/dot/bounds2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Bounds3

`Bounds3` (from `scenerystack/dot`) is the 3D counterpart to [`Bounds2`](/api/dot/bounds2): an axis-aligned cuboid stored as `minX`/`minY`/`minZ`/`maxX`/`maxY`/`maxZ` (plus `width`/`height`/`depth` convenience getters). It shows up far less often than `Bounds2` — mainly in 3D-flavored simulation content alongside [`Vector3`](/api/dot/vector3) and [`Matrix4`](/api/dot/matrix4) — but shares the same shape and naming conventions.

```ts
import { Bounds3 } from 'scenerystack/dot';

const box = new Bounds3( 0, 0, 0, 10, 20, 30 );

box.width;    // 10
box.height;   // 20
box.depth;    // 30
box.volume;   // 6000
box.center;   // Vector3(5, 10, 15)
```

## Constructing bounds

The constructor takes all six extremes directly: `new Bounds3( minX, minY, minZ, maxX, maxY, maxZ )`. For the `(x, y, z, width, height, depth)` cuboid shape, use the static factory instead:

```ts
const box = Bounds3.cuboid( 0, 0, 0, 10, 20, 30 ); // same box as above
```

| Static | Meaning |
| --- | --- |
| `Bounds3.cuboid( x, y, z, width, height, depth )` | Build from x/y/z/width/height/depth |
| `Bounds3.point( x, y, z )` | A zero-volume bounds containing exactly one point |
| `Bounds3.NOTHING` | All mins `+Infinity`, all maxes `-Infinity` — the identity for `union()` |
| `Bounds3.EVERYTHING` | All mins `-Infinity`, all maxes `+Infinity` — the identity for `intersection()` |

## Reading properties

| Getter | Meaning |
| --- | --- |
| `width`, `height`, `depth` | `maxX - minX`, `maxY - minY`, `maxZ - minZ` |
| `x`, `y`, `z`, `left`, `top`, `back`, `right`, `bottom`, `front` | Aliases for `minX`, `minY`, `minZ`, `minX`, `minY`, `minZ`, `maxX`, `maxY`, `maxZ` |
| `centerX`, `centerY`, `centerZ`, `center` | Midpoints, as numbers or a [`Vector3`](/api/dot/vector3) |
| `volume` | `width * height * depth` |
| `isEmpty()` | `true` if any dimension is negative |
| `isFinite()` | `true` unless it's `NOTHING`/`EVERYTHING`-like |
| `hasNonzeroVolume()` | `true` if width, height, and depth are all strictly positive |
| `isValid()` | `!isEmpty() && isFinite()` |

## Immutable vs. mutable methods

Like `Bounds2`, most operations come in an immutable form (new `Bounds3`) and a mutable form (mutates `this`). Note that `Bounds3` doesn't have the full set of named corner getters (`leftTop`, etc.) that `Bounds2` has — the model is otherwise identical:

| Immutable | Mutable | Effect |
| --- | --- | --- |
| `union( bounds )` | `includeBounds( bounds )` | Smallest bounds containing both |
| `intersection( bounds )` | `constrainBounds( bounds )` | Largest bounds contained in both |
| `withCoordinates( x, y, z )` / `withPoint( point )` | `addCoordinates( x, y, z )` / `addPoint( point )` | Expand to include a point |
| `dilated( d )` / `dilatedXYZ( x, y, z )` | `dilate( d )` / `dilateXYZ( x, y, z )` | Expand on all sides |
| `eroded( d )` / `erodedXYZ( x, y, z )` | `erode( d )` / `erodeXYZ( x, y, z )` | Contract on all sides |
| `shifted( v )` / `shiftedXYZ( x, y, z )` | `shift( v )` / `shiftXYZ( x, y, z )` | Translate |
| `roundedOut()` / `roundedIn()` | `roundOut()` / `roundIn()` | Snap to integer boundaries, expanding or contracting |
| `transformed( matrix )` | `transform( matrix )` | Apply a [`Matrix4`](/api/dot/matrix4) affine transform, re-fitting to axis-alignment |
| `copy()` | `set( bounds )` / `setMinMax( ... )` | Copy / assign |

Queries: `containsCoordinates( x, y, z )`, `containsPoint( point )`, `containsBounds( bounds )`, `intersectsBounds( bounds )`, `equals`/`equalsEpsilon`, and `toString()`.

::: tip `transformed`/`transform` check all 8 corners
Just like `Bounds2.transformed()`, `Bounds3.transformed( matrix )` re-fits the box after an arbitrary [`Matrix4`](/api/dot/matrix4) affine transform by transforming all 8 corners and taking the min/max of the results — so it stays axis-aligned even after a rotation. Composing a transform with its inverse (`bounds.transformed( m ).transformed( m.inverted() )`) can therefore return a *larger* box than the original if `m` includes a rotation that isn't a multiple of a right angle.
:::

## Related

- [Bounds2](/api/dot/bounds2) — the 2D counterpart; same shape and naming conventions, one dimension fewer.
- [Vector3](/api/dot/vector3) — `Bounds3`'s corners and center are `Vector3` instances.
- [Matrix4](/api/dot/matrix4) — `bounds.transformed( matrix )` re-fits a `Bounds3` after an affine transform.
