---
title: Ray3
description: A 3D ray (origin plus unit direction) used for picking and intersection queries in 3D-flavored code such as mobius.
category: api
library: dot
tags: [dot, Ray3, Vector3, Plane3, math, hit-testing]
status: complete
prerequisites:
  - /api/dot/ray2
related:
  - /api/dot/ray2
  - /api/dot/vector3
  - /api/dot/quaternion-and-plane3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Ray3

`Ray3` (from `scenerystack/dot`) is the 3D counterpart to [`Ray2`](/api/dot/ray2): an origin `position` and a unit-length `direction`, both [`Vector3`](/api/dot/vector3) instances. It's the representation used for picking/intersection queries in 3D-flavored code — for example, mobius's 3D scenes — such as "does this mouse ray hit that sphere or plane."

```ts
import { Ray3, Vector3 } from 'scenerystack/dot';

const ray = new Ray3( new Vector3( 0, 0, 5 ), new Vector3( 0, 0, -1 ) ); // pointing toward the origin

ray.pointAtDistance( 5 );          // Vector3(0, 0, 0) — 5 units along the ray from its origin
const shifted = ray.shifted( 2 );  // a new Ray3 with the same direction, origin moved 2 units along it
```

## Constructing

```ts
new Ray3( position: Vector3, direction: Vector3 )
```

Both fields are plain public properties. `direction` **must** be a unit vector — an assertion in development builds checks `Math.abs( direction.magnitude - 1 ) < 0.01` and throws if it's off, exactly as with `Ray2`.

## Methods

| Method | Effect |
| --- | --- |
| `pointAtDistance( distance )` | `position.plus( direction.timesScalar( distance ) )` — the point reached by walking `distance` along the ray |
| `shifted( distance )` | A new `Ray3` with the same `direction`, whose origin is `pointAtDistance( distance )` |
| `distanceToPlane( plane )` | The signed distance along the ray at which it crosses a given [`Plane3`](/api/dot/quaternion-and-plane3) |
| `toString()` | Debug string showing position and direction |

## Intersecting a ray with a plane

`Ray3` itself only computes the *distance* to a plane; combine it with [`Plane3.intersectWithRay()`](/api/dot/quaternion-and-plane3) to get the actual intersection point:

```ts
import { Ray3, Plane3, Vector3 } from 'scenerystack/dot';

const ray = new Ray3( new Vector3( 0, 0, 5 ), new Vector3( 0, 0, -1 ) );

const hitPoint = Plane3.XY.intersectWithRay( ray ); // Vector3(0, 0, 0)
```

::: tip There's no `Ray3`-vs-sphere or `Ray3`-vs-triangle method on `Ray3` itself
`Ray3` is a minimal data holder, like `Ray2` — it only knows how to walk along itself and measure distance to a plane. Sphere-ray intersection lives as the standalone `sphereRayIntersection` function (also exported from `scenerystack/dot`), and triangle/mesh picking is handled by the consuming 3D code (e.g. mobius), not by `Ray3` itself.
:::
