---
title: DampedHarmonic
description: A closed-form solver for the damped harmonic oscillator differential equation, useful for spring, pendulum, and oscillation sims.
category: api
library: dot
tags: [dot, DampedHarmonic, differential-equations, physics, math]
status: complete
related:
  - /api/dot/linear-function
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# DampedHarmonic

`DampedHarmonic` (from `scenerystack/dot`) solves the general damped harmonic oscillator differential equation `a·x'' + b·x' + c·x = 0` in closed form, given initial conditions `x(0)` and `x'(0)`. This is the same equation governing a mass on a damped spring, a damped pendulum (small-angle approximation), or an RLC circuit — anywhere a sim's model has a restoring force plus a velocity-proportional damping force and needs `x(t)` evaluated analytically (no numerical integration, no accumulated per-step error) at any time `t`.

```ts
import { DampedHarmonic } from 'scenerystack/dot';

// A mass-spring-damper: mx'' + bx' + kx = 0, released from x=1 with zero velocity
const mass = 1;
const damping = 0.5;
const springConstant = 4;

const oscillator = new DampedHarmonic( mass, damping, springConstant, 1, 0 );

oscillator.getValue( 0 );    // 1 (the initial position)
oscillator.getValue( 2 );    // position at t=2 seconds
oscillator.getDerivative( 2 ); // velocity at t=2 seconds
```

## Constructor

```ts
new DampedHarmonic(
  a: number, b: number, c: number,
  initialValue: number, initialDerivative: number
)
```

| Parameter | Effect |
| --- | --- |
| `a` | Coefficient on `x''` (e.g. mass) — must be finite and non-zero |
| `b` | Coefficient on `x'` (damping) — must be finite; `a` and `b` must share the same sign, since negative damping (relative to `a`) doesn't correspond to a physical damped system this class solves |
| `c` | Coefficient on `x` (restoring force / spring constant) — must be finite and non-zero; `a` and `c` must share the same sign |
| `initialValue` | `x(0)` |
| `initialDerivative` | `x'(0)` |

Internally, the constructor normalizes to `x'' + dampingConstant·x' + angularFrequencySquared·x = 0`, computes the discriminant `dampingConstant² - 4·angularFrequencySquared`, and picks the matching closed-form solution: **over-damped** (`discriminant > 0`, two real exponential decay rates), **critically damped** (`discriminant ≈ 0`, a linear-times-exponential solution), or **under-damped** (`discriminant < 0`, an oscillating exponentially-decaying solution) — this is standard textbook damped-oscillator classification, chosen once at construction and then used by both query methods below.

## Methods

| Method | Effect |
| --- | --- |
| `getValue( t )` | The solution `x(t)` at time `t` |
| `getDerivative( t )` | The velocity `x'(t)` at time `t` |

Both are pure functions of `t` — evaluating at an arbitrary time doesn't require stepping through every intermediate time, unlike a numerically-integrated model.

::: tip This is an analytic solver, not a stepping integrator
Unlike model code that advances state with `step( dt )` on every animation frame, `DampedHarmonic` computes the exact solution at any requested `t` directly from the initial conditions — there's no accumulated integration error, and no need to call it every frame if you only need the value at a few specific times. If your model already advances other quantities with discrete `dt` steps, you can still track a single elapsed-time accumulator and call `getValue( elapsedTime )` each frame for the oscillating quantity specifically.
:::
