---
title: Matrix3
description: The 3x3 transform matrix behind Node transforms and ModelViewTransform2.
category: api
library: dot
tags: [dot, Matrix3, transform]
status: complete
related:
  - /api/dot/vector2
  - /api/dot/bounds2
  - /api/phetcommon/model-view-transform
prerequisites:
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Matrix3

`Matrix3` (from `scenerystack/dot`) is a 3x3 matrix, most commonly used to represent a 2D affine transform (rotation + scale + translation, or shear) via homogeneous coordinates. It's the type behind `Node.matrix`/`Node.transform` in scenery and the machinery inside `ModelViewTransform2`, and it's the argument type for `Bounds2.transformed()` and `Shape.transformed()`.

```ts
import { Matrix3 } from 'scenerystack/dot';
import { Vector2 } from 'scenerystack/dot';

const matrix = Matrix3.translation( 100, 50 ).timesMatrix( Matrix3.rotation2( Math.PI / 4 ) );

matrix.timesVector2( new Vector2( 1, 0 ) ); // rotate then translate the point (1,0)
matrix.getTranslation();                     // Vector2(100, 50)
matrix.getRotation();                        // Math.PI / 4
```

## Constructing matrices

The bare constructor `new Matrix3()` only ever produces the identity matrix — you build real matrices with static factories, which also let dot track the matrix's `type` (`IDENTITY`, `TRANSLATION_2D`, `SCALING`, `AFFINE`, `OTHER`) for fast-path optimizations:

| Static factory | Produces |
| --- | --- |
| `Matrix3.identity()` | The identity matrix |
| `Matrix3.translation( x, y )` / `Matrix3.translationFromVector( vector )` | Pure translation |
| `Matrix3.scaling( x, y? )` (alias `Matrix3.scale`) | Pure scale (`y` defaults to `x` for uniform scale) |
| `Matrix3.rotation2( angle )` | Pure 2D rotation, radians |
| `Matrix3.rotationAround( angle, x, y )` / `Matrix3.rotationAroundPoint( angle, point )` | Rotation about an arbitrary point |
| `Matrix3.translationRotation( x, y, angle )` | Combined translate + rotate |
| `Matrix3.rotationX/Y/Z( angle )` | 3D-style axis rotations (still a 3x3, useful for the z-rotation case above) |
| `Matrix3.affine( m00, m01, m02, m10, m11, m12 )` | Arbitrary 2x3 affine part directly |
| `Matrix3.rowMajor( v00, ..., v22 )` | All nine entries, row-major |

## Reading a matrix

| Accessor | Meaning |
| --- | --- |
| `m00()`...`m22()` | Individual entries, row/column indexed |
| `translation` | `(m02, m12)` as a `Vector2` |
| `rotation` | `Math.atan2( m10, m00 )`, in radians |
| `scaleVector` | `(|column 0|, |column 1|)` as a `Vector2` |
| `determinant` | The determinant; also the signed area scale factor |
| `isIdentity()` / `isTranslation()` / `isAffine()` / `isAligned()` | Structural queries used for fast-path code |

## Applying and combining transforms

| Method | Effect |
| --- | --- |
| `timesMatrix( matrix )` | Returns `this * matrix` as a new `Matrix3` |
| `timesVector2( vector )` / `multiplyVector2( vector )` | Apply the transform to a point; `timesVector2` is immutable (new `Vector2`), `multiplyVector2` mutates the vector argument in place |
| `inverted()` | Returns the inverse transform as a new `Matrix3` |
| `transposed()` | Returns the transpose |
| `plus( matrix )` / `minus( matrix )` | Entry-wise addition/subtraction |
| `equals( matrix )` / `equalsEpsilon( matrix, epsilon )` | Comparison |

Mutating counterparts exist for the constructor-style operations too — `setToTranslation`, `setToScale`, `setToRotationZ`, `setToTranslationRotation`, and the low-level `rowMajor(...)` that all of the mutators funnel through.

::: tip Order matters: `A.timesMatrix(B)` applies B first
`A.timesMatrix( B )` computes the matrix product `A * B`. When applied to a point via homogeneous coordinates, that means **B's transform is applied first, then A's** — so `Matrix3.translation( 100, 0 ).timesMatrix( Matrix3.rotation2( angle ) )` rotates a point about the origin and *then* translates it, not the other way around. This is the same convention used to compose [`ModelViewTransform2`](/api/phetcommon/model-view-transform)-style transforms and scenery `Node` transforms.
:::

## Related

- [Vector2](/api/dot/vector2) — the point/vector type that `Matrix3` transforms.
- [Bounds2](/api/dot/bounds2) — `bounds.transformed( matrix )` re-fits an axis-aligned box after an affine transform.
- [ModelViewTransform2](/api/phetcommon/model-view-transform) — wraps a `Matrix3` (or matrix pair) to convert between model and view coordinates.
