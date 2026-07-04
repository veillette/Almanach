---
title: Transform3
description: A cached, observable wrapper around a Matrix3, providing forward/inverse transform methods for points, deltas, bounds, and shapes.
category: api
library: dot
tags: [dot, Transform3, transform, matrix]
status: complete
related:
  - /api/dot/matrix3
  - /api/dot/vector2
  - /api/dot/bounds2
  - /api/dot/ray2
  - /api/phetcommon/model-view-transform
prerequisites:
  - /api/dot/matrix3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Transform3

`Transform3` (from `scenerystack/dot`) wraps a single [`Matrix3`](/api/dot/matrix3) and adds three things a bare matrix doesn't have: **lazily-cached** inverse/transpose/inverse-transpose matrices (recomputed only when the primary matrix changes), a `changeEmitter` that fires whenever the matrix is replaced, and a full family of typed convenience methods (`transformPosition2`, `transformBounds2`, `transformShape`, `transformRay2`, and their `inverse*` counterparts) instead of raw matrix multiplication.

::: tip Despite the name, this is a 2D (not 3D) transform
The "3" in `Transform3` refers to the 3x3 [`Matrix3`](/api/dot/matrix3) it wraps (for 2D homogeneous coordinates), not to three spatial dimensions — it operates on [`Vector2`](/api/dot/vector2), [`Bounds2`](/api/dot/bounds2), and 2D `Shape`s. If you're looking for the sim-facing model/view coordinate converter built on similar ideas, see [`ModelViewTransform2`](/api/phetcommon/model-view-transform) — it's a different, higher-level class (not a subclass of `Transform3`) purpose-built for physical-unit-to-pixel conversion, whereas `Transform3` is the lower-level, general-purpose "matrix plus caching plus change notification" utility that generic transform math (including parts of scenery's own `Node` transform tracking) is built on.
:::

```ts
import { Transform3 } from 'scenerystack/dot';
import { Matrix3 } from 'scenerystack/dot';
import { Vector2 } from 'scenerystack/dot';

const transform = new Transform3( Matrix3.rotation2( Math.PI / 2 ) );

transform.transformPosition2( new Vector2( 1, 0 ) ); // Vector2(0, 1) (approx)
transform.inversePosition2( new Vector2( 0, 1 ) );   // Vector2(1, 0) (approx) — undoes the forward transform

transform.changeEmitter.addListener( () => console.log( 'matrix changed' ) );
transform.append( Matrix3.scaling( 2 ) ); // notifies changeEmitter
```

## Constructing and mutating

The constructor optionally takes an initial `Matrix3` (defaults to the identity): `new Transform3( matrix? )`.

| Method | Effect |
| --- | --- |
| `setMatrix( matrix )` | Replaces the primary matrix (copies values in; doesn't retain the passed-in instance), invalidates caches, notifies `changeEmitter` |
| `prepend( matrix )` | `this.matrix = matrix * this.matrix` — applies `matrix` *after* whatever this transform already does |
| `append( matrix )` | `this.matrix = this.matrix * matrix` — applies `matrix` *before* whatever this transform already does |
| `prependTranslation( x, y )` | Optimized prepend of a pure translation |
| `prependTransform( transform )` / `appendTransform( transform )` | Same as `prepend`/`append`, but taking another `Transform3`'s matrix |
| `copy()` | A new `Transform3` with the same matrix (and cached state) |

## Reading the transform

| Getter | Meaning |
| --- | --- |
| `getMatrix()` | The primary `Matrix3` |
| `getInverse()` | The inverse matrix, computed on first access after a change and cached thereafter |
| `getMatrixTransposed()` / `getInverseTransposed()` | Cached transpose / inverse-transpose |
| `isIdentity()` | Whether the primary matrix is (very likely) the identity |
| `isFinite()` | Whether all matrix entries are finite |

## Forward and inverse transform methods

Every `transform*` method has an `inverse*` counterpart that applies the inverse matrix instead — conceptually, `transform.inverseThing( transform.transformThing( x ) )` should return something equal to `x`.

| Forward | Inverse | Applies to |
| --- | --- | --- |
| `transformPosition2( v )` | `inversePosition2( v )` | A [`Vector2`](/api/dot/vector2) point (translation applied) |
| `transformDelta2( v )` | `inverseDelta2( v )` | A `Vector2` displacement (translation **not** applied) |
| `transformNormal2( v )` | `inverseNormal2( v )` | A `Vector2` surface normal (uses the transposed inverse) |
| `transformX( x )` / `transformY( y )` | `inverseX( x )` / `inverseY( y )` | A single coordinate (throws in an assertion-enabled build if the matrix has rotation/shear, since the result would depend on the other axis) |
| `transformDeltaX( x )` / `transformDeltaY( y )` | `inverseDeltaX( x )` / `inverseDeltaY( y )` | A single-axis delta |
| `transformBounds2( bounds )` | `inverseBounds2( bounds )` | A [`Bounds2`](/api/dot/bounds2), re-fit to stay axis-aligned |
| `transformShape( shape )` | `inverseShape( shape )` | A kite `Shape` |
| `transformRay2( ray )` | `inverseRay2( ray )` | A [`Ray2`](/api/dot/ray2) |
| `applyToCanvasContext( context )` | — | Calls `context.setTransform(...)` with this transform's matrix |

## Related

- [Matrix3](/api/dot/matrix3) — the underlying matrix type; `Transform3` is a caching, observable wrapper around it.
- [Vector2](/api/dot/vector2) — the point/delta type most `Transform3` methods operate on.
- [Bounds2](/api/dot/bounds2) — `transformBounds2`/`inverseBounds2` re-fit a bounds through the transform.
- [Ray2](/api/dot/ray2) — `transformRay2`/`inverseRay2` carry a ray through the transform.
- [ModelViewTransform2](/api/phetcommon/model-view-transform) — the higher-level, sim-facing model/view coordinate converter with related but distinct semantics.
