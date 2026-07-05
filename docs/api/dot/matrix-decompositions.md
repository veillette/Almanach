---
title: Matrix Decompositions
description: A practical survey of dot's LUDecomposition, QRDecomposition, EigenvalueDecomposition, and SingularValueDecomposition, and when a sim author would ever reach for one.
category: api
library: dot
tags: [dot, Matrix, LUDecomposition, QRDecomposition, EigenvalueDecomposition, SingularValueDecomposition, linear-algebra]
status: complete
prerequisites:
  - /api/dot/matrix3
related:
  - /api/dot/matrix3
  - /api/dot/matrix4
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Matrix Decompositions

`scenerystack/dot` exports a general, arbitrary-dimensional `Matrix` class (distinct from the fixed-size [`Matrix3`](/api/dot/matrix3)/`Matrix4` used for 2D/3D transforms — `Matrix` is for numerical linear algebra on `m x n` data, ported from [Jama](http://math.nist.gov/javanumerics/jama/)) plus four decomposition classes built on it: `LUDecomposition`, `QRDecomposition`, `EigenvalueDecomposition`, and `SingularValueDecomposition`. Most simulation code never needs any of these directly — they exist to support `Matrix.solve()`/`Matrix.inverse()` and any sim that does real numerical linear algebra (curve fitting, physics models expressed as linear systems, PCA-style data analysis). This page is a map of what each one is for, not a numerical-methods tutorial.

```ts
import { Matrix } from 'scenerystack/dot';

const A = new Matrix( 2, 2, [ 2, 1, 1, 3 ] ); // row-major: [[2,1],[1,3]]
const b = new Matrix( 2, 1, [ 3, 5 ] );

const x = A.solve( b ); // solves Ax = b - internally picks LU (square) or QR (non-square)
```

## `Matrix` itself

`new Matrix( m, n, filler?, fast? )` builds an `m`-row by `n`-column matrix backed by a flat, row-major `Float64Array`. Beyond basic algebra (`plus`, `minus`, `times`, `transpose`, `trace`, ...), its most-used members delegate to the decompositions below:

| Method | Delegates to |
| --- | --- |
| `solve( b )` | `LUDecomposition` if square, otherwise `QRDecomposition` (least-squares) |
| `inverse()` | `solve( Matrix.identity( ... ) )` |
| `det()` | `LUDecomposition.det()` |
| `rank()` | `SingularValueDecomposition.rank()` |
| `cond()` | `SingularValueDecomposition.cond()` |

You'll reach for a specific decomposition class directly only when you need something `Matrix`'s convenience methods don't expose — the individual `L`/`U`, `Q`/`R`, eigenvector, or singular-value matrices themselves, not just a solved system or a scalar.

## `LUDecomposition` — solving square linear systems

Factors a square matrix `A` into a lower-triangular `L` and upper-triangular `U` (with row pivoting) such that `A = L * U` (up to a permutation). This is the classical "solve `Ax = b`" workhorse for square systems, and what `Matrix.solve()`/`det()` use whenever the matrix is square.

| Member | Effect |
| --- | --- |
| `new LUDecomposition( matrix )` | Computes the factorization of a square `Matrix` |
| `isNonsingular()` | Whether the matrix is invertible (no zero pivot) |
| `getL()` / `getU()` | The lower/upper triangular factor matrices |
| `getPivot()` / `getDoublePivot()` | The row-pivot permutation applied during factorization |
| `det()` | The determinant, computed from the pivoted diagonal |
| `solve( b )` | Solves `Ax = b` for `x`, given the already-computed factorization |

A separate `LUDecompositionDecimal` export provides the same factorization using arbitrary-precision decimal arithmetic instead of floating point, for cases where floating-point rounding error in an ordinary `LUDecomposition` would matter.

## `QRDecomposition` — solving non-square (least-squares) systems

Factors any `m x n` matrix `A` (via Householder reflections) into an orthogonal `Q` and upper-triangular `R` such that `A = Q * R`. Where `LUDecomposition` requires a square matrix, `QRDecomposition` works for any shape, and `Matrix.solve()` falls back to it whenever the system is over- or under-determined, producing a least-squares solution.

| Member | Effect |
| --- | --- |
| `new QRDecomposition( matrix )` | Computes the factorization of any `Matrix` |
| `isFullRank()` | Whether `R`'s diagonal has no (near-)zero entries |
| `getQ()` / `getR()` | The orthogonal / upper-triangular factor matrices |
| `getH()` | The raw Householder vectors used internally |
| `solve( b )` | Least-squares solution to `Ax = b` |

## `EigenvalueDecomposition` — eigenvalues and eigenvectors

Computes the eigenvalues and eigenvectors of a square matrix `A`: `A = V * D * V⁻¹`, where `D` is (block-)diagonal and `V`'s columns are the eigenvectors. For symmetric `A`, `D` is purely diagonal with real eigenvalues and `V` is orthogonal; for non-symmetric `A`, complex eigenvalue pairs show up as 2x2 blocks in `D`.

| Member | Effect |
| --- | --- |
| `new EigenvalueDecomposition( matrix )` | Computes the decomposition of a square `Matrix` |
| `getV()` | The eigenvector matrix |
| `getD()` | The (block-)diagonal eigenvalue matrix |
| `getRealEigenvalues()` / `getImagEigenvalues()` | The eigenvalues' real and imaginary parts as plain number arrays |

Reach for this when a sim needs the actual eigenstructure of a system — e.g. finding the natural modes/frequencies of a coupled-oscillator model, or the principal axes of a data set.

## `SingularValueDecomposition` — rank, conditioning, and general factorization

Factors any `m x n` matrix into `A = U * S * Vᵀ`, where `S` is diagonal (the singular values) and `U`/`V` are orthogonal. This is the most numerically robust of the four — `Matrix.rank()` and `Matrix.cond()` both delegate to it — at the cost of being the most expensive to compute.

| Member | Effect |
| --- | --- |
| `new SingularValueDecomposition( matrix )` | Computes the decomposition of any `Matrix` |
| `getU()` / `getV()` | The two orthogonal factor matrices |
| `getSingularValues()` / `getS()` | The singular values as a plain array, or as the diagonal `S` matrix |
| `rank()` | The matrix's numerical rank (count of singular values above a tolerance) |
| `cond()` | The condition number (`largest / smallest` singular value) — a large value signals a numerically unstable/near-singular matrix |

::: tip Reach for `Matrix.solve()`/`.det()`/`.rank()` first
Unless you specifically need the factor matrices themselves (`L`/`U`, `Q`/`R`, eigenvectors, or `U`/`S`/`V`), use `Matrix`'s own convenience methods (`solve`, `inverse`, `det`, `rank`, `cond`) — they pick the appropriate decomposition internally. Constructing a decomposition class directly is for the minority of cases (eigenstructure analysis, needing `Q` or `L`/`U` explicitly) where the convenience methods don't expose what you need.
:::
