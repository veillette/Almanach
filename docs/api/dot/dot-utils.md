---
title: Utils
description: "dot's numeric helper functions: clamp, linear, roundSymmetric, and friends."
category: api
library: dot
tags: [dot, Utils, math]
status: verified
related:
  - /api/dot/range
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Utils

dot doesn't bundle its numeric helpers into a single `Utils` namespace object — instead, `scenerystack/dot` re-exports each helper as its own named function. They're grouped here as "the dot Utils" because that's how they're typically reached for: small, dependency-free numeric functions used throughout simulation code for clamping, mapping, and rounding numbers.

```ts
import { clamp, linear, roundSymmetric, toDegrees, toRadians } from 'scenerystack/dot';

clamp( 150, 0, 100 );             // 100
linear( 0, 1, 0, 100, 0.37 );      // 37 — maps 0.37 in [0,1] to [0,100]
roundSymmetric( -2.5 );            // -3 (not -2, unlike Math.round)
toDegrees( Math.PI );              // 180
toRadians( 180 );                  // Math.PI
```

## Core helpers

| Function | Signature | Effect |
| --- | --- | --- |
| `clamp` | `clamp( value, min, max ): number` | Constrains `value` to `[min, max]` |
| `linear` | `linear( a1, a2, b1, b2, a3 ): number` | Linear map: given `f(a1) = b1` and `f(a2) = b2`, returns `f(a3)` |
| `roundSymmetric` | `roundSymmetric( value ): number` | Rounds half-away-from-zero (symmetric for `+`/`-`, unlike `Math.round`) |
| `roundToInterval` | `roundToInterval( value, interval ): number` | Rounds `value` to the nearest multiple of `interval` |
| `toFixedNumber` | `toFixedNumber( value, decimalPlaces ): number` | Like `.toFixed()`, but returns a `number` and rounds symmetrically |
| `toDegrees` / `toRadians` | `toDegrees( radians )`, `toRadians( degrees )` | Angle unit conversion |
| `equalsEpsilon` | `equalsEpsilon( a, b, epsilon ): boolean` | Whether two numbers are within `epsilon` of each other |

## Other exported free functions

`scenerystack/dot` also exports several more specialized numeric helpers directly (not methods on a class): `mod`, `gcd`, `lcm`, `cubeRoot`, `log10`, `sinh`, `cosh`, `factorial`, `numberOfDecimalPlaces`, `triangleArea`/`triangleAreaSigned`, `centroidOfPolygon`, `distToSegment`/`distToSegmentSquared`, `lineLineIntersection`, `lineSegmentIntersection`, `solveLinearRootsReal`/`solveQuadraticRootsReal`/`solveCubicRootsReal`, and `arePointsCollinear`. Import whichever you need directly from `scenerystack/dot` by name.

## Typical use: mapping a physical quantity onto a display range

```ts
import { linear, clamp } from 'scenerystack/dot';

function temperatureToHue( temperatureCelsius: number ): number {
  // Map [0, 100] C onto a hue range [240, 0] (blue to red), clamping outliers first
  const clamped = clamp( temperatureCelsius, 0, 100 );
  return linear( 0, 100, 240, 0, clamped );
}
```

::: tip `roundSymmetric`, not `Math.round`, is the sim convention
`Math.round` uses "round half up," so `Math.round( -2.5 ) === -2`. SceneryStack simulations consistently use `roundSymmetric` instead, which rounds `-2.5` to `-3` — symmetric behavior for positive and negative numbers. Reach for `roundSymmetric` (and `roundToInterval` for rounding to steps other than 1) instead of the built-in `Math.round` when displaying rounded values to users.
:::

## Related

- [Range](/api/dot/range) — `range.constrainValue()` is the `Range`-aware equivalent of `clamp()`.
- [Vector2](/api/dot/vector2) — `Vector2.roundedSymmetric()` / `roundSymmetric()` apply `roundSymmetric` component-wise.
