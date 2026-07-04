---
title: Matrix4
description: The 4x4 homogeneous transform matrix used for 3D affine math.
category: api
library: dot
tags: [dot, Matrix4, transform]
status: verified
related:
  - /api/dot/matrix3
  - /api/dot/vector3
  - /api/dot/vector4
  - /api/dot/bounds3
prerequisites:
  - /api/dot/matrix3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Matrix4

`Matrix4` (from `scenerystack/dot`) is a 4x4 matrix, the 3D counterpart to [`Matrix3`](/api/dot/matrix3): it represents affine transforms (rotation + scale + translation) in homogeneous coordinates over `(x, y, z, w)`. It's the type used by `Bounds3.transformed()`, and is also useful directly for 3D-flavored simulation content and WebGL-adjacent math (it has a `gluPerspective` factory for building projection matrices).

```ts
import { Matrix4 } from 'scenerystack/dot';
import { Vector3 } from 'scenerystack/dot';

const matrix = Matrix4.translation( 0, 0, -10 ).timesMatrix( Matrix4.rotationY( Math.PI / 4 ) );

matrix.timesVector3( new Vector3( 1, 0, 0 ) ); // rotate then translate, as a homogeneous (x,y,z,1) point
matrix.getTranslation();                        // Vector3(0, 0, -10)
```

## Constructing matrices

The bare constructor `new Matrix4()` produces the identity matrix; passing 16 entries (row-major) builds an arbitrary matrix directly. As with `Matrix3`, static factories are the common path and let dot tag the result's `type` (`IDENTITY`, `TRANSLATION_3D`, `SCALING`, `AFFINE`, `OTHER`, all under `Matrix4.Types`) for fast-path optimizations:

| Static factory | Produces |
| --- | --- |
| `Matrix4.identity()` | The identity matrix |
| `Matrix4.translation( x, y, z )` / `Matrix4.translationFromVector( vector )` | Pure translation |
| `Matrix4.scaling( x, y?, z? )` | Pure scale (`y`/`z` default to `x` for uniform scale) |
| `Matrix4.rotationAxisAngle( axis, angle )` | Rotation about an arbitrary normalized axis |
| `Matrix4.rotationX/Y/Z( angle )` | Axis-aligned rotations, radians |
| `Matrix4.gluPerspective( fovYRadians, aspect, zNear, zFar )` | A WebGL-style perspective projection matrix |
| `Matrix4.rowMajor( v00, ..., v33, type? )` / `columnMajor( ... )` | All sixteen entries directly |

## Reading a matrix

| Accessor | Meaning |
| --- | --- |
| `m00()` ... `m33()` | Individual entries, row/column indexed |
| `translation` | `(m03, m13, m23)` as a [`Vector3`](/api/dot/vector3) |
| `scaleVector` | Per-axis scale magnitude, as a `Vector3` |
| `determinant` | The determinant |
| `isIdentity()` / `isFinite()` | Structural queries |
| `cssTransform` | A `matrix3d(...)` CSS transform string |

## Applying and combining transforms

| Method | Effect |
| --- | --- |
| `timesMatrix( matrix )` | Returns `this * matrix` as a new `Matrix4` |
| `timesVector4( v )` | Full homogeneous multiplication of a [`Vector4`](/api/dot/vector4) |
| `timesVector3( v )` | Treats `v` as `(x, y, z, 1)` — a point — and returns a `Vector3` |
| `timesRelativeVector3( v )` | Treats `v` as `(x, y, z, 0)` — a direction, ignoring translation |
| `timesTransposeVector4( v )` / `timesTransposeVector3( v )` | Multiplication by this matrix's transpose instead |
| `inverted()` | Returns the inverse as a new `Matrix4` (throws if the determinant is 0) |
| `transposed()` | Returns the transpose |
| `plus( matrix )` / `minus( matrix )` | Entry-wise addition/subtraction |
| `equals( matrix )` / `equalsEpsilon( matrix, epsilon )` | Comparison |
| `makeImmutable()` | Marks the instance so further mutation throws (used for `Matrix4.IDENTITY`) |

All of the above are immutable-returning; `Matrix4` also supports in-place mutation via `set( matrix )`, `rowMajor(...)`, and `columnMajor(...)`, which funnel through the same entry-setting path.

::: tip `timesVector3` assumes `w = 1`, not `w = 0`
`matrix.timesVector3( v )` implicitly promotes `v` to `Vector4( v.x, v.y, v.z, 1 )` before multiplying — correct for transforming a *point*, but wrong for a *direction* (like a surface normal or a velocity), where translation shouldn't apply. Use `timesRelativeVector3( v )` for directions, the same way `Transform3`/`ModelViewTransform2` distinguish "position" methods from "delta" methods in 2D.
:::

## Related

- [Matrix3](/api/dot/matrix3) — the 2D counterpart, used far more often in typical (2D) SceneryStack sims.
- [Vector3](/api/dot/vector3) — the point/vector type most `Matrix4` methods operate on.
- [Vector4](/api/dot/vector4) — the native homogeneous-coordinate operand for `timesVector4`.
- [Bounds3](/api/dot/bounds3) — `bounds.transformed( matrix )` re-fits a 3D bounding box after an affine transform.
