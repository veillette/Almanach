---
title: AnimationTarget and Easing
description: The per-value binding object and interpolation-curve class that Animation is built from internally, and how to use AnimationTarget directly for multi-target animations.
category: api
library: twixt
tags: [twixt, AnimationTarget, Easing, Animation]
status: complete
related:
  - /api/twixt/animation
prerequisites:
  - /api/twixt/animation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AnimationTarget and Easing

[`Animation`](/api/twixt/animation) is what sim code constructs directly, but its per-value logic — "how do I get/set this value," "what do I animate toward," "what curve controls the interpolation" — is implemented by two smaller pieces from `scenerystack/twixt`: `AnimationTarget` (one config object per animated value) and `Easing` (the interpolation curve, shared by all targets in an `Animation` unless overridden per-target). You'll construct `Easing`s directly all the time (as shown on the [`Animation`](/api/twixt/animation) page); you'll construct `AnimationTarget` directly only when using `Animation`'s `targets` array to animate several independent values in lockstep from one `Animation` instance.

```ts
import { Animation, AnimationTarget, Easing } from 'scenerystack/twixt';
import { NumberProperty } from 'scenerystack/axon';

const xProperty = new NumberProperty( 0 );
const yProperty = new NumberProperty( 0 );

// Animate two Properties together, each described by its own AnimationTargetOptions,
// with a shared duration but independently-tunable easing per target.
const moveAnimation = new Animation( {
  duration: 0.75,
  targets: [
    { property: xProperty, to: 100, easing: Easing.QUADRATIC_IN_OUT },
    { property: yProperty, to: 50, easing: Easing.LINEAR }
  ]
} );

moveAnimation.start();
```

Each entry in `targets` is exactly the shape of `AnimationTargetOptions` — the same `property`/`object`+`attribute`/`setValue`+`getValue`, `to`/`delta`, `from`, `easing`, `blend`, `distance`, and `add` options documented for `Animation` itself, just scoped to one value instead of the whole animation. `Animation` constructs one `AnimationTarget` per array entry (or exactly one, from its own top-level options, when `targets` isn't used).

## `AnimationTarget`

```ts
new AnimationTarget( providedConfig: AnimationTargetOptions<T, Obj> )
```

Exactly one way of setting the value (`property`, `object` + `attribute`, or `setValue` [+ `getValue`]) and exactly one way of determining the end value (`to` or `delta`) must be provided — `AnimationTarget` asserts otherwise, same as `Animation`.

| Option | Default | Effect |
| --- | --- | --- |
| `property` | `null` | A settable axon `Property<T>` to read from and write to |
| `object` + `attribute` | `null` | Reads/writes `object[ attribute ]` directly |
| `setValue` (+ `getValue`) | `null` | Custom setter (and, unless `from` is given, getter) for values that aren't a `Property` or plain attribute |
| `to` | `null` | Absolute end value |
| `delta` | `null` | End value computed as `add( startingValue, delta )` |
| `speed` | `null` | Seconds per unit of `distance()` between start and end — lets this target determine the animation's duration instead of a fixed `duration` |
| `from` | `null` | Overrides the starting value instead of calling `getValue()` |
| `easing` | `Easing.CUBIC_IN_OUT` | This target's interpolation curve |
| `blend` | number/`Vector2`/`Vector3`/`Vector4`/`Color`-aware default | `(start, end, ratio) => value` — how to interpolate between the start and end values |
| `distance` | number/`Vector2`/`Vector3`/`Vector4`-aware default | `(a, b) => number` — used only when `speed` determines duration |
| `add` | number/`Vector2`/`Vector3`/`Vector4`-aware default | `(start, delta) => value` — used only when `delta` is provided |

The default `blend`/`distance`/`add` implementations already handle `number`, `Vector2`, `Vector3`, `Vector4`, and (for `blend`) `Color` — supply your own only for other value types, or types whose objects don't already implement `.blend()`/`.distance()`/`.plus()`.

`AnimationTarget` also exposes `computeStartEnd()` (resolves `startingValue`/`endingValue` right before the animation begins, so `getValue()` reflects the value at start time, not construction time), `update( ratio )` (applies `blend(start, end, easing.value(ratio))` via `setValue`), `hasPreferredDuration()`, and `getPreferredDuration()` — all called internally by `Animation`, not typically by sim code.

## `Easing`

```ts
new Easing( value: (t: number) => number, derivative: (t: number) => number, secondDerivative: (t: number) => number )
```

An `Easing` is a triple of functions over `[0, 1] -> [0, 1]` (`value`), plus its first and second derivatives — the derivatives exist so `Animation` chains and speed-based durations can reason about velocity/acceleration at the boundaries, not just position. In practice you reach for one of the built-in static instances rather than constructing one from raw functions:

| Static member | Curve |
| --- | --- |
| `Easing.LINEAR` | Constant rate (`t`) |
| `Easing.QUADRATIC_IN` / `_OUT` / `_IN_OUT` | t² |
| `Easing.CUBIC_IN` / `_OUT` / `_IN_OUT` | t³ |
| `Easing.QUARTIC_IN` / `_OUT` / `_IN_OUT` | t⁴ |
| `Easing.QUINTIC_IN` / `_OUT` / `_IN_OUT` | t⁵ |

For any other polynomial degree `n` (not necessarily an integer), use the static factories directly: `Easing.polynomialEaseIn( n )`, `Easing.polynomialEaseOut( n )`, `Easing.polynomialEaseInOut( n )` — this is in fact how all of the named statics above are defined (e.g. `Easing.CUBIC_IN_OUT` is exactly `Easing.polynomialEaseInOut( 3 )`).

::: tip Use `targets` when several values must animate on the same timeline
A single `Animation` with a `targets` array keeps multiple values (e.g. `x` and `y`, or position and opacity) synchronized to one `start()`/`stop()`/chain lifecycle and one set of `startEmitter`/`finishEmitter` events, rather than juggling several independent `Animation` instances that could drift out of sync if one is interrupted.
:::

::: warning Only one target may use `speed` to determine duration
`Animation` requires exactly one length source overall — either its own `duration` option, or exactly one target's `speed`. Giving multiple targets a `speed`, or combining `speed` with a top-level `duration`, is not a supported configuration.
:::
