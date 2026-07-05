---
title: DampedAnimation
description: A single-dimension damped-harmonic-oscillator animation that pulls a value toward a target, as an alternative to Animation's fixed-duration easing curves.
category: api
library: twixt
tags: [twixt, DampedAnimation, animation, physics]
status: complete
prerequisites:
  - /api/twixt/animation
related:
  - /api/twixt/animation
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# DampedAnimation

`DampedAnimation` (from `scenerystack/twixt`) animates a single numeric value toward a `targetValue` using damped-harmonic-oscillator physics, rather than [`Animation`](/api/twixt/animation)'s fixed-duration `Easing` curves. Instead of specifying "reach the target in 0.5 seconds using this easing curve," you specify a `damping` and `force` coefficient, and the motion — including how much it overshoots and oscillates, if at all — falls out of the physics. It has no notion of a fixed duration: you `step()` it every frame indefinitely, and it asymptotically approaches `targetValue` (exactly reaching it only in the limit).

```ts
import { DampedAnimation } from 'scenerystack/twixt';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const positionProperty = new NumberProperty( 0 );

const dampedAnimation = new DampedAnimation( {
  valueProperty: positionProperty,
  damping: 1,      // critically damped: fastest approach with no overshoot
  force: 4,
  targetValue: 100
} );

// In your animation-frame loop:
dampedAnimation.step( dt ); // dt in seconds -- updates positionProperty and its velocity

// Change the target at any time; the current position/velocity carry over smoothly.
dampedAnimation.targetValue = 250;
```

## Constructor

```ts
new DampedAnimation( providedOptions?: DampedAnimationOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `valueProperty` | a private `TinyProperty( 0 )` | The `TProperty<number>` driven by the animation — pass your own `NumberProperty` (or similar) to observe the value as it animates |
| `velocityProperty` | a private `TinyProperty( 0 )` | The `TProperty<number>` tracking the current rate of change; pass your own to read/observe velocity |
| `damping` | `1` | Damping ratio relative to critical damping: `1` critically damped (fastest approach, no overshoot), `< 1` underdamped (overshoots with decaying oscillation), `> 1` overdamped (slower exponential approach, no oscillation) |
| `force` | `1` | Coefficient for the "pull" toward the target, proportional to the current distance from it — larger values pull harder/faster |
| `targetValue` | `0` | The value being animated toward |

## Methods and properties

| Member | Description |
| --- | --- |
| `valueProperty` (readonly) | The `TProperty<number>` being animated — read it directly, or link to it, to observe the current value |
| `velocityProperty` (readonly) | The `TProperty<number>` tracking the current derivative |
| `targetValue` (getter/setter) | Reading returns the current target; setting it re-derives the internal harmonic model from the current value/velocity, so the transition to the new target stays smooth (no jump) |
| `damping` (getter/setter) | Setting recomputes the internal harmonic model, same as `targetValue` |
| `force` (getter/setter) | Setting recomputes the internal harmonic model, same as `targetValue` |
| `step( dt )` | Advances `timeElapsed` by `dt` (seconds) and updates `valueProperty`/`velocityProperty` from the closed-form `DampedHarmonic` solution — no manual re-triggering needed between steps |
| `timeElapsed` | Public field tracking seconds since the harmonic model was last recomputed (i.e. since construction or the last `targetValue`/`damping`/`force` change) |

::: warning Upstream marks this a prototype
`DampedAnimation`'s own source carries the comment `WARNING: PROTOTYPE ... Not fully documented or stabilized. May be deleted.` It is a real, currently-exported class, but treat it as less battle-tested than [`Animation`](/api/twixt/animation) — verify behavior carefully (especially repeated `targetValue` changes in quick succession) before relying on it in production sim code.
:::
