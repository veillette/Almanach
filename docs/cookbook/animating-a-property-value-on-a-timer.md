---
title: Animating a Property Value on a Timer
description: Using twixt's Animation to tween a NumberProperty smoothly from one value to another instead of jumping instantly.
category: cookbook
tags: [twixt, Animation, Easing, NumberProperty]
status: complete
related:
  - /api/twixt/animation
  - /api/axon/number-property
prerequisites:
  - /api/twixt/animation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Animating a Property Value on a Timer

**Task:** a model value should visibly transition over some duration — a needle sweeping to a new reading, a value fading toward a target — instead of a view snapping to the new value the instant the underlying `Property` changes.

[`Animation`](/api/twixt/animation) (from `scenerystack/twixt`) tweens a `Property`'s value from its current value to a target over a fixed duration, using an `Easing` curve to control acceleration. It drives itself off axon's shared `stepTimer` once started, so no manual per-frame stepping is required.

## The solution

```ts
import { Animation, Easing } from 'scenerystack/twixt';
import { NumberProperty } from 'scenerystack/axon';

const needleValueProperty = new NumberProperty( 0 );

function animateNeedleTo( targetValue: number ): void {
  const animation = new Animation( {
    property: needleValueProperty,
    to: targetValue,
    duration: 0.6, // seconds
    easing: Easing.QUADRATIC_IN_OUT
  } );

  animation.start();
}

// Later, e.g. when a new sensor reading arrives:
animateNeedleTo( 72 );
```

`needleValueProperty` now sweeps smoothly to `72` over 0.6 seconds instead of jumping there instantly — any view observing `needleValueProperty` (a `link`-driven needle rotation, a `NumberDisplay`) updates every intermediate frame exactly as it would for a normal value change, with no special-casing needed on the view side.

## Interrupting an in-flight animation with a new target

If a new target value can arrive before the previous animation finishes (a fast-changing sensor), stop the old one before starting the new one, rather than letting two animations fight over the same `Property`:

```ts
let currentAnimation: Animation | null = null;

function animateNeedleTo( targetValue: number ): void {
  currentAnimation?.stop();

  currentAnimation = new Animation( {
    property: needleValueProperty,
    to: targetValue,
    duration: 0.6,
    easing: Easing.QUADRATIC_IN_OUT
  } );
  currentAnimation.start();
}
```

`stop()` halts the animation immediately, leaving `needleValueProperty` wherever it currently is — the next `Animation` then tweens from that in-progress value to the new target, rather than jumping back to the old animation's starting point first.

## Chaining a return trip

For a "go there, then come back" effect (a highlight that pulses out and back), chain a second `Animation` with `.then(...)` rather than listening for completion yourself:

```ts
const highlightOpacityProperty = new NumberProperty( 0 );

const pulseOut = new Animation( {
  property: highlightOpacityProperty,
  to: 1,
  duration: 0.15,
  easing: Easing.QUADRATIC_OUT
} );

const pulseBack = new Animation( {
  property: highlightOpacityProperty,
  to: 0,
  duration: 0.3,
  easing: Easing.QUADRATIC_IN
} );

pulseOut.then( pulseBack );
pulseOut.start();
```

## Options used here

| Option | Effect |
| --- | --- |
| `property` | The `Property` being animated directly |
| `to` | The end value the Property tweens toward |
| `duration` | Length of the tween, in seconds |
| `easing` | The interpolation curve; `Easing.QUADRATIC_IN_OUT` is a reasonable general-purpose default |

::: tip No manual stepping required for the common case
`Animation` defaults `stepEmitter` to axon's shared `stepTimer`, which already advances every frame — `start()` is enough to get a running animation with no `step()` calls to wire up yourself, unless the animation needs to be paused/driven by something other than real time (e.g. paused while the sim itself is paused), in which case pass `stepEmitter: null` and call `.step( dt )` from your own per-frame model step.
:::

::: warning `stop()` leaves the value wherever it was, it doesn't snap to `to`
Calling `animation.stop()` partway through does **not** jump the Property the rest of the way to its target — it halts exactly where the value currently is. If a caller needs "finish immediately at the target value," set the Property directly (`needleValueProperty.value = targetValue`) after calling `stop()`, rather than assuming `stop()` completes the tween.
:::
