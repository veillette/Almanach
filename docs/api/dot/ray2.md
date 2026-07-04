---
title: Ray2
description: A 2D ray (origin position plus a unit direction vector), used for hit-testing and intersection queries.
category: api
library: dot
tags: [dot, Ray2, math, hit-testing]
status: verified
related:
  - /api/dot/vector2
  - /api/dot/transform3
prerequisites:
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Ray2

`Ray2` (from `scenerystack/dot`) is a minimal 2D ray: an origin `position` and a unit-length `direction`, both [`Vector2`](/api/dot/vector2) instances. It's the type [`Transform3`](/api/dot/transform3)'s `transformRay2`/`inverseRay2` carry through a transform, and the natural representation for hit-testing/intersection queries (e.g. "does this pointer ray hit that shape").

```ts
import { Ray2 } from 'scenerystack/dot';
import { Vector2 } from 'scenerystack/dot';

const ray = new Ray2( new Vector2( 0, 0 ), new Vector2( 1, 0 ) ); // origin at (0,0), pointing along +x

ray.pointAtDistance( 5 );  // Vector2(5, 0) — the point 5 units along the ray
ray.shifted( 5 );          // a new Ray2 with the same direction, origin moved to (5, 0)
```

## Constructing

```ts
new Ray2( position: Vector2, direction: Vector2 )
```

Both fields are plain public properties, not getter/setter pairs. `direction` **must** be a unit vector (magnitude 1) — an assertion in development builds checks `Math.abs( direction.magnitude - 1 ) < 0.01` and throws if it's off. Passing a non-normalized vector is a common mistake; call `.normalized()` on it first if you're not sure it's already unit length.

## Methods

| Method | Effect |
| --- | --- |
| `pointAtDistance( distance )` | Returns `position.plus( direction.timesScalar( distance ) )` as a new `Vector2` — the point reached by walking `distance` along the ray |
| `shifted( distance )` | Returns a new `Ray2` with the same `direction`, whose origin is `pointAtDistance( distance )` |
| `toString()` | Debug string showing position and direction |

That's the full public surface on `Ray2` itself — it's deliberately a thin data holder. Most of the interesting ray behavior (transforming a ray, or intersecting it against a shape) lives on the *other* object: [`Transform3.transformRay2`](/api/dot/transform3)/`inverseRay2` carry a `Ray2` through a matrix transform, and kite `Shape`s expose their own intersection methods that accept a `Ray2`.

::: warning `direction` is not automatically kept normalized
Because `position` and `direction` are plain mutable fields, nothing stops you from reassigning `ray.direction` to a non-unit vector after construction — only the constructor asserts unit length, and only in assertion-enabled (development) builds. If you mutate a ray's direction after creating it, normalize it yourself first, or construct a fresh `Ray2` instead.
:::

## Related

- [Vector2](/api/dot/vector2) — both `position` and `direction` are `Vector2` instances.
- [Transform3](/api/dot/transform3) — `transformRay2`/`inverseRay2` carry a `Ray2` through a `Matrix3`-based transform.
