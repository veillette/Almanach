---
title: Vector4
description: The 4D vector class used for homogeneous coordinates and RGBA-style color math.
category: api
library: dot
tags: [dot, Vector4, math]
status: verified
related:
  - /api/dot/vector2
  - /api/dot/vector3
  - /api/dot/matrix4
prerequisites:
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Vector4

`Vector4` (from `scenerystack/dot`) is the 4-dimensional `(x, y, z, w)` counterpart to [`Vector2`](/api/dot/vector2) and [`Vector3`](/api/dot/vector3). It follows the exact same immutable/mutable naming convention as its lower-dimensional siblings, but has no cross product (a 4D cross product isn't a single well-defined operation the way it is in 3D). It's used wherever a fourth homogeneous or alpha component is needed — most notably as the operand type for [`Matrix4`](/api/dot/matrix4)'s `timesVector4`.

```ts
import { Vector4 } from 'scenerystack/dot';

const homogeneous = new Vector4( 1, 2, 3, 1 ); // a 3D point (1,2,3) in homogeneous form

homogeneous.magnitude;                  // sqrt(1^2 + 2^2 + 3^2 + 1^2)
const doubled = homogeneous.plus( new Vector4( 1, 0, 0, 0 ) ); // new vector, unchanged original
homogeneous.add( new Vector4( 1, 0, 0, 0 ) );                   // mutates in place
```

## Constructing vectors

The constructor takes all four components directly: `new Vector4( x, y, z, w )`. There's also the pooled shorthand `v4( x, y, z, w )` (exported alongside `Vector4`) for allocation-sensitive code, and static constants:

| Static | Value |
| --- | --- |
| `Vector4.ZERO` | `(0, 0, 0, 0)` |
| `Vector4.X_UNIT` | `(1, 0, 0, 0)` |
| `Vector4.Y_UNIT` | `(0, 1, 0, 0)` |
| `Vector4.Z_UNIT` | `(0, 0, 1, 0)` |
| `Vector4.W_UNIT` | `(0, 0, 0, 1)` |
| `Vector4.from( vector4Like, defaultW? )` | Builds a `Vector4` from any `{x?, y?, z?, w?}`-shaped object, defaulting missing `x`/`y`/`z` to `0` and missing `w` to `1` (or the given `defaultW`) |

## Immutable vs. mutable methods

Same convention as `Vector2`/`Vector3`: the immutable form returns a new `Vector4` and reads as a noun/adjective; the mutable form changes `this` and returns it, reading as a verb.

| Immutable (returns new `Vector4`) | Mutable (changes `this`, returns `this`) | Effect |
| --- | --- | --- |
| `plus( v )` / `plusXYZW( x, y, z, w )` / `plusScalar( s )` | `add( v )` / `addXYZW( x, y, z, w )` / `addScalar( s )` | Addition |
| `minus( v )` / `minusXYZW( x, y, z, w )` / `minusScalar( s )` | `subtract( v )` / `subtractXYZW( x, y, z, w )` / `subtractScalar( s )` | Subtraction |
| `times( s )` / `timesScalar( s )` | `multiply( s )` / `multiplyScalar( s )` | Scalar multiplication |
| `componentTimes( v )` | `componentMultiply( v )` | Component-wise multiplication |
| `dividedScalar( s )` | `divideScalar( s )` | Scalar division |
| `negated()` | `negate()` | Multiply by -1 |
| `normalized()` | `normalize()` | Rescale to magnitude 1 (throws on a zero vector) |
| `withMagnitude( m )` | `setMagnitude( m )` | Rescale to magnitude `m` |
| `roundedSymmetric()` | `roundSymmetric()` | Round all four components |
| `copy()` | `set( v )` / `setXYZW( x, y, z, w )` / `setX( x )` / `setY( y )` / `setZ( z )` / `setW( w )` | Copy / assign |

Read-only queries: `magnitude`, `magnitudeSquared`, `dot( v )` / `dotXYZW( x, y, z, w )`, `distance( point )` / `distanceXYZW( x, y, z, w )`, `distanceSquared( point )`, `angleBetween( v )`, `equals( v )` / `equalsEpsilon( v, epsilon )`, `isFinite()`, `blend( v, ratio )` / `average( v )`, and `toString()`.

::: tip Mostly a `Matrix4` operand, not a general-purpose vector
Unlike `Vector2`/`Vector3`, `Vector4` doesn't show up often as application-level state in sims — it mainly exists as the natural operand for [`Matrix4`](/api/dot/matrix4)'s homogeneous 4x4 math (`timesVector4`, `timesTransposeVector4`), where `w = 1` represents a point and `w = 0` represents a direction. If you're modeling an RGBA color or a plain 4-tuple without matrix math in mind, a `Vector4` still works fine, but there's no dedicated color type here — reach for `scenerystack/scenery`'s `Color` for actual color values.
:::

## Related

- [Vector2](/api/dot/vector2) — the 2D counterpart used for almost all on-screen positioning.
- [Vector3](/api/dot/vector3) — the 3D counterpart, used for color math and 3D-flavored sims.
- [Matrix4](/api/dot/matrix4) — the 4x4 matrix type that operates on `Vector4` via `timesVector4`.
