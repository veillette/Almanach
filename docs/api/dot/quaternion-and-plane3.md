---
title: Quaternion and Plane3
description: A rotation quaternion class and an infinite-plane primitive used together for 3D rotation and plane/ray geometry.
category: api
library: dot
tags: [dot, Quaternion, Plane3, Vector3, Matrix3, rotation, math]
status: complete
prerequisites:
  - /api/dot/vector3
  - /api/dot/matrix3
related:
  - /api/dot/vector3
  - /api/dot/matrix3
  - /api/dot/ray3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Quaternion and Plane3

`Quaternion` and `Plane3` (both from `scenerystack/dot`) are two independent 3D-geometry primitives commonly used together in 3D-flavored code (such as mobius): `Quaternion` represents a rotation without the gimbal-lock and interpolation problems of Euler angles, while `Plane3` represents an infinite plane for ray/plane intersection tests.

## Quaternion

A `Quaternion` holds four components `{x, y, z, w}` representing a rotation — informally, `{x, y, z}` as a (scaled) rotation axis and `w` encoding the rotation angle. Unlike a rotation matrix, quaternions compose cheaply and interpolate smoothly (`slerp`), which is why they're the standard representation for smoothly animating between two orientations.

```ts
import { Quaternion, Vector3 } from 'scenerystack/dot';

const q = Quaternion.fromEulerAngles( Math.PI / 4, 0, 0 ); // 45-degree yaw
const rotated: Vector3 = q.timesVector3( new Vector3( 1, 0, 0 ) );

const matrix = q.toRotationMatrix(); // convert to a Matrix3 for use with e.g. a transform

// Smoothly blend between two orientations, t in [0, 1]:
const halfway = Quaternion.slerp( q, Quaternion.fromEulerAngles( Math.PI / 2, 0, 0 ), 0.5 );
```

| Member | Effect |
| --- | --- |
| `new Quaternion( x, y, z, w )` | Constructs from raw components (default `w = 1`, i.e. identity, if omitted) |
| `plus( quat )` / `timesScalar( s )` | Component-wise addition / scaling, returning a new `Quaternion` |
| `timesQuaternion( quat )` | Hamilton product — composes two rotations (rotate by `this`, then by `quat`) |
| `timesVector3( v )` | Rotates a [`Vector3`](/api/dot/vector3) by this quaternion, returning a new `Vector3` |
| `magnitude` / `magnitudeSquared` | The quaternion's norm |
| `normalized()` | Rescales to magnitude 1 (a valid rotation must be a unit quaternion) |
| `negated()` | The quaternion with every component negated |
| `toRotationMatrix()` | Converts to an equivalent `Matrix3` rotation matrix |
| `Quaternion.fromEulerAngles( yaw, roll, pitch )` | Builds a quaternion from Euler angles |
| `Quaternion.fromRotationMatrix( matrix )` | Converts a `Matrix3` rotation matrix back to a quaternion |
| `Quaternion.getRotationQuaternion( a, b )` | A quaternion rotating unit vector `a` onto unit vector `b` |
| `Quaternion.slerp( a, b, t )` | Spherical linear interpolation between two quaternions, `t` in `[0, 1]` |

`Quaternion` is also `Poolable` (via phet-core's `Poolable.mixInto`), so performance-sensitive code can use `Quaternion.pool.fetch()`/`.freeToPool()` instead of `new Quaternion(...)` to avoid allocation churn, the same pattern `Vector2`'s pooled `v2()` shorthand follows.

## Plane3

A `Plane3` is an infinite plane in 3D, represented by a unit `normal` vector and a signed `distance` from the origin (so that `normal.timesScalar( distance )` is a point on the plane). It's the natural counterpart to [`Ray3`](/api/dot/ray3) for ray/plane intersection.

```ts
import { Plane3, Ray3, Vector3 } from 'scenerystack/dot';

const groundPlane = Plane3.XY; // the built-in x-y plane through the origin

const ray = new Ray3( new Vector3( 0, 0, 5 ), new Vector3( 0, 0, -1 ) );
const hitPoint = groundPlane.intersectWithRay( ray ); // Vector3(0, 0, 0)
```

| Member | Effect |
| --- | --- |
| `new Plane3( normal, distance )` | `normal` must be a unit `Vector3`; `distance` is the signed distance from the origin |
| `intersectWithRay( ray )` | The `Vector3` where a [`Ray3`](/api/dot/ray3) crosses this plane |
| `getIntersection( plane )` | The `Ray3` where two planes intersect (`null` if parallel) |
| `Plane3.fromTriangle( a, b, c )` | Builds the plane through three points, normal via `(c-a) x (b-a)` (`null` if the points are collinear) |
| `Plane3.XY` / `Plane3.XZ` / `Plane3.YZ` | The three axis-aligned planes through the origin |

::: warning Both classes assert unit-length inputs, but only in development builds
`Plane3`'s constructor asserts `normal` is a unit vector, exactly like `Ray3`'s `direction` and `Ray2`'s `direction` — but this check only runs with assertions enabled. Passing a non-normalized normal (or building a `Quaternion` you forgot to `.normalized()` before treating as a rotation) will silently produce wrong geometry in a production build instead of throwing. Normalize explicitly at the boundary where you construct these objects from arbitrary input.
:::
