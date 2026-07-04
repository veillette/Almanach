---
title: Vector3
description: The 3D vector class used for color math and 3D-flavored simulations.
category: api
library: dot
tags: [dot, Vector3, math]
status: verified
related:
  - /api/dot/vector2
  - /api/dot/matrix3
prerequisites:
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Vector3

`Vector3` (from `scenerystack/dot`) is the 3-dimensional `(x, y, z)` counterpart to [`Vector2`](/api/dot/vector2). It shares the same immutable/mutable method-naming convention, plus a genuine 3D cross product. It shows up less often than `Vector2` in 2D sims, but is used for color math (RGB triples) and any 3D-flavored simulation content.

```ts
import { Vector3 } from 'scenerystack/dot';

const a = new Vector3( 1, 0, 0 );
const b = new Vector3( 0, 1, 0 );

a.cross( b );      // Vector3(0, 0, 1) — new vector, a and b unchanged
a.dot( b );         // 0
a.magnitude;         // 1
```

## Constructing vectors

The constructor takes `x`, `y`, and `z` directly: `new Vector3( x, y, z )`. The pooled shorthand `v3( x, y, z )` is also exported for allocation-sensitive code, along with static constants:

| Static | Value |
| --- | --- |
| `Vector3.ZERO` | `(0, 0, 0)` |
| `Vector3.X_UNIT` | `(1, 0, 0)` |
| `Vector3.Y_UNIT` | `(0, 1, 0)` |
| `Vector3.Z_UNIT` | `(0, 0, 1)` |

## Immutable vs. mutable methods

Just like `Vector2`, every operation comes in an immutable form (returns a new `Vector3`) and a mutable form (changes `this` and returns it).

| Immutable (returns new `Vector3`) | Mutable (changes `this`, returns `this`) | Effect |
| --- | --- | --- |
| `plus( v )` / `plusXYZ( x, y, z )` / `plusScalar( s )` | `add( v )` / `addXYZ( x, y, z )` / `addScalar( s )` | Addition |
| `minus( v )` / `minusXYZ( x, y, z )` / `minusScalar( s )` | `subtract( v )` / `subtractXYZ( x, y, z )` / `subtractScalar( s )` | Subtraction |
| `times( s )` / `timesScalar( s )` | `multiply( s )` / `multiplyScalar( s )` | Scalar multiplication |
| `componentTimes( v )` | `componentMultiply( v )` | Component-wise multiplication |
| `dividedScalar( s )` | `divideScalar( s )` | Scalar division |
| `negated()` | `negate()` | Multiply by -1 |
| `normalized()` | `normalize()` | Rescale to magnitude 1 (throws on a zero vector) |
| `withMagnitude( m )` | `setMagnitude( m )` | Rescale to magnitude `m` |
| `cross( v )` | `setCross( v )` | 3D cross product |
| `roundedSymmetric()` | `roundSymmetric()` | Round all three components |
| `copy()` | `set( v )` / `setXYZ( x, y, z )` / `setX( x )` / `setY( y )` / `setZ( z )` | Copy / assign |

Read-only queries: `magnitude`, `magnitudeSquared`, `dot( v )` / `dotXYZ( x, y, z )`, `distance( point )` / `distanceXYZ( x, y, z )`, `distanceSquared( point )`, `angleBetween( v )`, `equals( v )` / `equalsEpsilon( v, epsilon )`, `isFinite()`, `blend( v, ratio )` / `average( v )`, and `toString()`. A static `Vector3.slerp( start, end, ratio )` does spherical linear interpolation between two unit vectors.

::: tip No 2D cross product here
Unlike `Vector2.crossScalar()` (which returns a single number — the z-component of the equivalent 3D cross product), `Vector3.cross()` returns a full `Vector3`, since a genuine cross product only makes sense in three (or seven) dimensions.
:::

## Related

- [Vector2](/api/dot/vector2) — the 2D counterpart used for almost all on-screen positioning.
- [Matrix3](/api/dot/matrix3) — `Matrix3.rotationAxisAngle` and `Matrix3.rotateAToB` take `Vector3` axes.
