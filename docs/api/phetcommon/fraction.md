---
title: Fraction
description: An exact-arithmetic numerator/denominator fraction class with add/subtract/multiply/divide and reduction, used throughout PhET's fraction and ratio sims.
category: api
library: phetcommon
tags: [phetcommon, Fraction, model, math]
status: complete
related:
  - /api/phetcommon/model-view-transform
  - /api/phetcommon/bucket
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Fraction

`Fraction` (from `scenerystack/phetcommon`) represents a fraction as an integer `numerator` and integer `denominator`, with arithmetic operations that stay exact (no floating-point rounding) as long as the values involved stay below 2^53. It's the model class behind PhET's fraction- and ratio-based sims — every operation preserves the numerator/denominator pair rather than collapsing to a decimal, so `1/3 + 1/3` stays representable exactly instead of becoming `0.6666666666666666`.

```ts
import { Fraction } from 'scenerystack/phetcommon';
```

## A minimal example

```ts
const a = new Fraction( 1, 3 );
const b = new Fraction( 1, 6 );

const sum = a.plus( b );        // Fraction( 9, 18 ) -- lcm-based denominator, NOT auto-reduced
sum.reduce();                   // mutates sum in place to Fraction( 1, 2 )

a.getValue();                   // 0.3333333333333333 -- the fraction still exposes a numeric value
a.isReduced();                  // true (gcd(1, 3) === 1)
Fraction.fromDecimal( 0.25 );   // Fraction( 1, 4 )
```

## Constructor

```ts
new Fraction( numerator: number, denominator: number )
```

Both arguments must be integers — asserted at construction and on every subsequent `numerator`/`denominator` setter call. `Fraction` does not validate `denominator !== 0`; a zero denominator is allowed to be constructed (some operations, like `dividedInteger`, explicitly note that division by zero is permitted).

## Static members

| Member | Value / Signature |
| --- | --- |
| `Fraction.ZERO` | `new Fraction( 0, 1 )` |
| `Fraction.ONE` | `new Fraction( 1, 1 )` |
| `Fraction.fromInteger( value )` | Builds `new Fraction( value, 1 )` |
| `Fraction.fromDecimal( value )` | Converts a decimal `number` to an equivalent, reduced `Fraction` by counting decimal places |
| `Fraction.fromStateObject( stateObject )` | Deserializes from `{ numerator, denominator }`, for PhET-iO |
| `Fraction.FractionIO` | The `IOType` used to serialize/deserialize `Fraction` instances for PhET-iO state |

## Instance members

| Member | Effect |
| --- | --- |
| `numerator` / `denominator` (getter/setter) | Read or replace either integer component directly |
| `getValue()` / `value` (getter) | `numerator / denominator` as a floating-point number |
| `isInteger()` | Whether the fraction reduces to a whole number (`numerator % denominator === 0`) |
| `isReduced()` | Whether `gcd(numerator, denominator) === 1` |
| `reduce()` | Divides both components by their GCD, **mutating this instance**; returns `this` |
| `reduced()` | Returns a new, reduced `Fraction`, leaving this one untouched |
| `copy()` | Returns a new `Fraction` with the same numerator/denominator |
| `equals( fraction )` | True only if numerator **and** denominator match exactly — `1/2` and `2/4` are not `equals()`, even though they have the same value |
| `isLessThan( fraction )` | Value comparison, computed via exact subtraction (not floating-point division) to avoid precision loss |
| `sign` (getter) | `Math.sign( this.getValue() )` |
| `abs()` | Returns a new `Fraction` with both components made non-negative |
| `add( f )` / `subtract( f )` / `multiply( f )` / `divide( f )` | **Mutating** operations — modify `this` and return it. Sums/differences use the LCM of the two denominators; none of these reduce the result automatically |
| `plus( f )` / `minus( f )` / `times( f )` / `divided( f )` | Non-mutating equivalents — each returns a new `Fraction`, leaving `this` unchanged |
| `plusInteger( n )` / `minusInteger( n )` / `timesInteger( n )` / `dividedInteger( n )` | Convenience non-mutating operations against a plain integer, keeping this fraction's existing denominator (for `plusInteger`/`minusInteger`/`timesInteger`) |
| `toString()` | Returns `"numerator/denominator"` |
| `toStateObject()` | Serializes to `{ numerator, denominator }` |

::: warning Arithmetic results are not automatically reduced
`plus()`, `minus()`, `times()`, `divided()` (and their mutating counterparts) deliberately leave the result unreduced — e.g. `new Fraction(1,3).plus(new Fraction(1,6))` gives `Fraction(9, 18)`, not `Fraction(1, 2)`. Call `.reduce()` (mutating) or `.reduced()` (non-mutating) explicitly whenever you need a fraction in lowest terms, such as before comparing two fractions with `equals()`, which checks the numerator/denominator pair exactly rather than the reduced value.
:::
