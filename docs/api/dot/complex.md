---
title: Complex
description: A complex number type with immutable and mutable arithmetic, including polar form and polynomial root-solving.
category: api
library: dot
tags: [dot, Complex, math]
status: verified
related:
  - /api/dot/dot-utils
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Complex

`Complex` (from `scenerystack/dot`) is a complex number with a `real` and `imaginary` part, supporting the usual arithmetic (add, subtract, multiply, divide, conjugate, powers, trig, exponentiation) plus static solvers for the roots of linear, quadratic, and cubic equations with complex coefficients. It follows the same immutable/mutable method-naming convention as dot's vector types.

```ts
import { Complex } from 'scenerystack/dot';

const a = new Complex( 3, 4 );  // 3 + 4i

a.magnitude;         // 5
a.phase();           // Math.atan2(4, 3)

const product = a.times( Complex.I ); // new Complex, a unchanged: rotates a by 90 degrees -> -4 + 3i
a.multiply( Complex.I );               // mutates a in place to -4 + 3i
```

## Constructing

The constructor takes `real` and `imaginary` directly: `new Complex( real, imaginary )`. Both are plain mutable public fields.

| Static | Meaning |
| --- | --- |
| `Complex.real( r )` | `r + 0i` |
| `Complex.imaginary( i )` | `0 + ri` |
| `Complex.createPolar( magnitude, phase )` | Builds from magnitude/phase (radians) instead of real/imaginary |
| `Complex.ZERO` / `Complex.ONE` / `Complex.I` | The constants `0`, `1`, and the imaginary unit `i` |

## Immutable vs. mutable methods

The convention matches `Vector2`/`Vector3`: the immutable form returns a new `Complex`, the mutable form changes `this` and returns it.

| Immutable (returns new `Complex`) | Mutable (changes `this`, returns `this`) | Effect |
| --- | --- | --- |
| `plus( c )` | `add( c )` | Addition |
| `minus( c )` | `subtract( c )` | Subtraction |
| `times( c )` | `multiply( c )` | Complex multiplication |
| `dividedBy( c )` | `divide( c )` | Complex division |
| `negated()` | `negate()` | Negation |
| `conjugated()` | `conjugate()` | Complex conjugate (flips the sign of `imaginary`) |
| `squared()` | `square()` | Self times self |
| `sqrtOf()` | `sqrt()` | Principal square root |
| `powerByReal( realPower )` | — (no mutable form) | Raises to a real-valued power |
| `sinOf()` / `cosOf()` | `sin()` / `cos()` | Complex sine/cosine |
| `exponentiated()` | `exponentiate()` | $e^{a+bi} = e^a(\cos b + i\sin b)$ |
| `copy()` | `set( c )` / `setRealImaginary( r, i )` / `setReal( r )` / `setImaginary( i )` / `setPolar( magnitude, phase )` | Copy / assign |

Read-only queries: `magnitude`, `magnitudeSquared`, `phase()` (alias `argument`/`getArgument()`), `equals( other )` / `equalsEpsilon( other, epsilon )`, `getCubeRoots()` (the three cube roots of this complex number), and `toString()`.

## Solving polynomial roots

`Complex` exposes static solvers that work over complex coefficients, each returning an array of roots or `null` if every value is a solution:

| Static method | Solves |
| --- | --- |
| `Complex.solveLinearRoots( a, b )` | $ax + b = 0$ |
| `Complex.solveQuadraticRoots( a, b, c )` | $ax^2 + bx + c = 0$ |
| `Complex.solveCubicRoots( a, b, c, d )` | $ax^3 + bx^2 + cx + d = 0$ |

::: tip For real-only coefficients, dot's free functions are simpler
If your coefficients and expected roots are all real numbers, `scenerystack/dot`'s free functions `solveLinearRootsReal`, `solveQuadraticRootsReal`, and `solveCubicRootsReal` (see [Utils](/api/dot/dot-utils)) skip the `Complex` wrapping entirely and return `number[] | null` directly. Reach for `Complex.solve*Roots` only when coefficients or roots may genuinely be complex (not just real values that happen to be represented as numbers).
:::

## Related

- [Utils](/api/dot/dot-utils) — the real-only root solvers (`solveQuadraticRootsReal`, etc.) that skip `Complex` when all values are real.
