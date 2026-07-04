---
title: Animation and Easing
description: Animating a Property's value smoothly over time instead of setting it instantly.
category: api
library: twixt
tags: [twixt, Animation, Easing]
status: complete
related:
  - /api/axon/property
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Animation and Easing

`Animation` (from `scenerystack/twixt`) smoothly interpolates a Property's value — or an object attribute, or an arbitrary getter/setter pair — from a starting value to an ending value over time, instead of jumping to the new value instantly. `Easing` supplies the interpolation curve (linear, quadratic, cubic, …) that controls how the animation accelerates and decelerates.

```ts
import { Animation, Easing } from 'scenerystack/twixt';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const opacityProperty = new NumberProperty( 1 );

const fadeOutAnimation = new Animation( {
  property: opacityProperty,
  to: 0,
  duration: 0.5, // seconds
  easing: Easing.QUADRATIC_IN_OUT
} );

fadeOutAnimation.start();
```

By default, `Animation` drives itself off axon's shared `stepTimer`, so once `start()` is called it advances every frame with no further wiring — no ScreenView or model `step()` call is required unless you pass `stepEmitter: null` and step it manually.

## Constructor

`Animation` takes a single config object — there's no separate positional-argument form:

```ts
new Animation( providedOptions: AnimationOptions )
```

## Options

Exactly one target-binding style and exactly one length source are required; `Animation` asserts if you provide zero or more than one of each.

| Option | Default | Effect |
| --- | --- | --- |
| `property` | — | An axon `Property` to animate directly (mutually exclusive with `object`/`setValue`/`targets`) |
| `object` + `attribute` | — | Animates `object[ attribute ]` in place |
| `setValue` (+ optional `getValue`) | — | Custom setter/getter pair, for values that aren't a Property or plain attribute |
| `targets` | `null` | An array of per-target configs (each shaped like the options above) to animate multiple values in lockstep from one `Animation` |
| `to` | — | The end value (mutually exclusive with `delta`) |
| `delta` | — | Animates by this much relative to the starting value, instead of to an absolute value |
| `duration` | `null` | Length of the animation in seconds — provide this **or** a `speed` on a target, never both |
| `delay` | `0` | Seconds to wait after `start()` before the value actually begins changing |
| `easing` | `Easing.LINEAR` (via `AnimationTarget`) | Controls the rate of change over the animation's course |
| `from` | — | Overrides the starting value instead of reading the current value |
| `stepEmitter` | axon's `stepTimer` | The `Emitter<[number]>` that drives stepping; pass `null` to step manually via `.step( dt )` |

## Public state and events

| Member | Description |
| --- | --- |
| `runningProperty` | `true` for the whole run, including any initial `delay` |
| `animatingProperty` | `true` only once the value itself is actively changing (after the delay elapses) |
| `startEmitter` | Fires when `start()` is called |
| `beginEmitter` | Fires when the delay elapses and value interpolation begins |
| `updateEmitter` | Fires after each step's value update |
| `finishEmitter` | Fires `(overflowDt)` when the animation completes naturally |
| `stopEmitter` | Fires only if `stop()` is called before completion |
| `endedEmitter` | Fires whenever the animation ends, whether finished or stopped |

## Methods

| Method | Effect |
| --- | --- |
| `start( dt? )` | Begins the animation (or restarts the delay); no-op if already running |
| `stop()` | Immediately halts the animation, leaving the value wherever it was |
| `step( dt )` | Manually advances by `dt` seconds — only needed if `stepEmitter: null` |
| `then( animation )` | Chains another `Animation` to start when this one finishes naturally; returns the chained animation for further chaining |

## `Easing`

| Static member | Curve |
| --- | --- |
| `Easing.LINEAR` | Constant rate |
| `Easing.QUADRATIC_IN` / `_OUT` / `_IN_OUT` | t², eased in / out / both |
| `Easing.CUBIC_IN` / `_OUT` / `_IN_OUT` | t³ |
| `Easing.QUARTIC_IN` / `_OUT` / `_IN_OUT` | t⁴ |
| `Easing.QUINTIC_IN` / `_OUT` / `_IN_OUT` | t⁵ |

For a custom degree, use the static factories `Easing.polynomialEaseIn( n )`, `polynomialEaseOut( n )`, or `polynomialEaseInOut( n )`.

::: tip Chain animations instead of listening for completion yourself
`a.then( b )` starts `b` automatically when `a` finishes (not when `a.stop()` is called), and returns `b` so chains read left-to-right: `first.then( second ).then( third )`. This is the idiomatic way to build back-and-forth or multi-step animations, rather than manually subscribing to `finishEmitter`.
:::
