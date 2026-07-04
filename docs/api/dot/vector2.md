---
title: Vector2
description: The 2D vector/point class used throughout SceneryStack's math and positioning APIs.
category: api
library: dot
tags: [dot, Vector2, math]
status: verified
related:
  - /api/dot/vector3
  - /api/dot/bounds2
  - /api/dot/matrix3
  - /api/phetcommon/model-view-transform
prerequisites:
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Vector2

`Vector2` (from `scenerystack/dot`) is the 2-dimensional `(x, y)` vector/point class used everywhere in SceneryStack — positions, velocities, drag deltas, and node translations all pass through it. It doubles as both a "point" and a "displacement" depending on context; there is no separate point type.

```ts
import { Vector2 } from 'scenerystack/dot';

const position = new Vector2( 3, 4 );

position.magnitude;      // 5, i.e. sqrt(3^2 + 4^2)
position.angle;           // Math.atan2( 4, 3 ), in radians

const moved = position.plus( new Vector2( 1, 0 ) ); // (4, 4) — new vector, position unchanged
position.add( new Vector2( 1, 0 ) );                 // (4, 4) — mutates position in place
```

## Constructing vectors

The constructor takes `x` and `y` directly: `new Vector2( x, y )`. There's also the pooled shorthand `v2( x, y )` (exported alongside `Vector2`) which reuses pooled instances for performance-sensitive code, and static constants:

| Static | Value |
| --- | --- |
| `Vector2.ZERO` | `(0, 0)` |
| `Vector2.X_UNIT` | `(1, 0)` |
| `Vector2.Y_UNIT` | `(0, 1)` |
| `Vector2.createPolar( magnitude, angle )` | Builds a vector from magnitude/angle instead of x/y |

## Immutable vs. mutable methods

Every operation on `Vector2` comes in two forms: an **immutable** version that returns a new vector, and a **mutable** version that changes `this` and returns it for chaining. The naming convention is consistent throughout dot: the immutable form usually reads as a noun/adjective (`plus`, `minus`, `times`, `normalized`, `rotated`), and the mutable form reads as a verb (`add`, `subtract`, `multiply`, `normalize`, `rotate`).

| Immutable (returns new `Vector2`) | Mutable (changes `this`, returns `this`) | Effect |
| --- | --- | --- |
| `plus( v )` / `plusXY( x, y )` / `plusScalar( s )` | `add( v )` / `addXY( x, y )` / `addScalar( s )` | Addition |
| `minus( v )` / `minusXY( x, y )` / `minusScalar( s )` | `subtract( v )` / `subtractXY( x, y )` / `subtractScalar( s )` | Subtraction |
| `times( s )` / `timesScalar( s )` | `multiply( s )` / `multiplyScalar( s )` | Scalar multiplication |
| `componentTimes( v )` | `componentMultiply( v )` | Component-wise multiplication |
| `dividedScalar( s )` | `divideScalar( s )` | Scalar division |
| `negated()` | `negate()` | Multiply by -1 |
| `normalized()` | `normalize()` | Rescale to magnitude 1 (throws on a zero vector) |
| `withMagnitude( m )` | `setMagnitude( m )` | Rescale to magnitude `m` |
| `rotated( angle )` | `rotate( angle )` | Rotate about the origin, radians |
| `rotatedAboutXY( x, y, angle )` / `rotatedAboutPoint( p, angle )` | `rotateAboutXY( x, y, angle )` / `rotateAboutPoint( p, angle )` | Rotate about an arbitrary point |
| `roundedSymmetric()` | `roundSymmetric()` | Round both components |
| `copy()` | `set( v )` / `setXY( x, y )` / `setX( x )` / `setY( y )` | Copy / assign |

Read-only queries (no mutable counterpart, since they don't change the vector): `magnitude`, `magnitudeSquared`, `angle`, `dot( v )` / `dotXY( x, y )`, `distance( point )` / `distanceXY( x, y )`, `distanceSquared( point )`, `crossScalar( v )` (the z-component of the 3D cross product), `angleBetween( v )`, `equals( v )` / `equalsEpsilon( v, epsilon )`, `isFinite()`, `perpendicular` (rotated -π/2), `blend( v, ratio )` / `average( v )`, and `toString()`.

## Common uses

```ts
import { Vector2 } from 'scenerystack/dot';

// Position tracked in a model, updated via a drag listener
const velocity = new Vector2( 2, -1 );
const dt = 0.016;

// Immutable style: compute a new position without touching the old one
const nextPosition = position.plus( velocity.timesScalar( dt ) );

// Mutable style: update a stored vector in place (common in performance-sensitive step() loops)
position.add( velocity.timesScalar( dt ) );
```

::: warning Mutable methods change shared state
Because plain object references are passed around freely, calling a mutable method (`add`, `normalize`, `rotate`, `set...`) on a `Vector2` that's stored in a `Property` or shared elsewhere will silently change it for every holder of that reference, **without notifying listeners** (a `Vector2Property` only fires when you call `.value = newVector`, not when you mutate the existing value in place). When in doubt, prefer the immutable form (`plus`, `normalized`, `rotated`, ...) for anything backing observable state, and reserve the mutable form for local scratch vectors.
:::

## Related

- [Vector3](/api/dot/vector3) — the 3D counterpart, used for color math and 3D-flavored sims.
- [Bounds2](/api/dot/bounds2) — axis-aligned rectangles built from `Vector2` corners/centers.
- [Matrix3](/api/dot/matrix3) — transforms that map `Vector2` positions via `multiplyVector2`.
- [ModelViewTransform2](/api/phetcommon/model-view-transform) — converts `Vector2` positions between model and view coordinates.
