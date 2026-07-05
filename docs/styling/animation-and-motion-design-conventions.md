---
title: Animation and Motion Design Conventions
description: When to animate a transition instead of snapping it instantly, how long an animation should run, which Easing curve to reach for, and how to avoid overusing motion.
category: styling
tags: [twixt, Animation, Easing, motion, transitions, conventions]
status: complete
related:
  - /api/twixt/animation
  - /api/twixt/transition-node
  - /styling/color-profiles
  - /patterns/feature-flags-and-preferences-pattern
prerequisites:
  - /api/twixt/animation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Animation and Motion Design Conventions

[Animation and Easing](/api/twixt/animation) covers the `Animation`/`Easing` mechanism itself — how to interpolate a Property over time. This page is the design layer on top of that mechanism: **when** a transition should animate at all, **how long** it should take, **which** `Easing` curve reads correctly for the kind of change happening, and how to avoid motion that distracts more than it clarifies.

## When to animate, and when not to

Animate a change when its *before* and *after* states are both meaningful and the viewer benefits from seeing the path between them — a panel expanding, a value smoothly settling, a highlight fading in. Snap a change instantly when the intermediate states carry no information, or when animating would fight the user's own input:

| Animate | Snap instantly |
| --- | --- |
| A panel opening/closing, a screen transition, a value drifting to a new target on its own | A value being actively dragged by the user (the pointer *is* the animation — adding easing on top makes the object lag behind the cursor) |
| A one-time state change the user should notice (a correct-answer highlight fading in and out) | A `reset()` — see the warning below |
| Smoothing a discrete jump (snapping to the nearest tick mark after a drag ends) | High-frequency updates (a live physics readout) — animating every frame's tiny change adds latency without adding clarity |

::: warning Don't animate `reset()`
[The Reset-All Pattern](/patterns/reset-all-pattern) restores every Property to its `initialValue` instantly. Animating a reset (easing every control back to its starting position over half a second) turns a deliberately abrupt, unambiguous action into something that looks like it might be undoable or still in progress. If a reset needs *any* visual acknowledgment, use a brief flash or fade on the reset button itself, not a tween of the restored values.
:::

## Choosing a duration

Short, UI-scale transitions (a highlight, a panel sliding open, a button's pressed-state feedback) read best in the **150-400ms** range — long enough to be perceived as motion rather than a flicker, short enough that the interface doesn't feel sluggish. Model-driven transitions (an object settling into a new position because the *model* changed, not because the user is actively controlling it) can reasonably run longer, up to a second or two, if the content being animated is large or the change is meant to be narratively noticeable (e.g. "watch this quantity settle to equilibrium"). Err short: a duration that feels slightly too fast on a fast rewatch is far less costly than one that feels sluggish on every single interaction.

```ts
import { Animation, Easing } from 'scenerystack/twixt';

// UI-scale: a panel's opacity fading in - short and snappy.
const panelFadeInAnimation = new Animation( {
  property: panelOpacityProperty,
  to: 1,
  duration: 0.25,
  easing: Easing.QUADRATIC_OUT
} );

// Model-scale: a value settling toward a target the user isn't actively dragging.
const settleAnimation = new Animation( {
  property: needlePositionProperty,
  to: targetPosition,
  duration: 0.8,
  easing: Easing.CUBIC_IN_OUT
} );
```

## Picking an `Easing` curve

`Easing`'s three families (`_IN`, `_OUT`, `_IN_OUT`) each read differently, and the wrong one for the situation is one of the most common ways a technically-correct animation still feels slightly wrong:

| Curve | Reads as | Use for |
| --- | --- | --- |
| `_OUT` (fast start, gentle finish) | The object was already moving and is arriving/settling | Something appearing, expanding, or coming to rest — a panel opening, a highlight fading in |
| `_IN` (gentle start, fast finish) | The object is departing/accelerating away | Something disappearing or being dismissed — a panel closing, a highlight fading out |
| `_IN_OUT` | A deliberate, self-contained move with its own beginning and end | A value moving from one settled state to another with the user not actively involved — the "model-scale" case above |
| `Easing.LINEAR` | Mechanical, constant-rate | Rarely what a UI transition should look like; reach for it only when the motion genuinely represents a constant real-world rate (a clock hand, a conveyor belt), not general-purpose UI polish |

`Easing.QUADRATIC_*` is a reasonable default weight for UI-scale motion; `CUBIC_*` or higher reads as more pronounced acceleration/deceleration and suits larger or slower model-scale transitions better than it suits a small, frequent UI transition.

## Avoiding unnecessary motion

Every animation has an ongoing cost: it holds a `stepTimer` listener alive for its duration, and — more importantly for the user — it delays the interface from reaching its final, readable state. Two guidelines keep motion in check as a project grows:

- **Don't animate purely decorative flourish** that isn't tied to a state change the user needs to track. A control panel that pulses gently at rest to "look alive" is the kind of motion that reads as polish once and as visual noise on the hundredth viewing.
- **Chain, don't overlap incidentally.** If two animations on related content need to run in sequence (a highlight fading in, *then* a value updating), use `firstAnimation.then( secondAnimation )` (see [Animation and Easing](/api/twixt/animation)) rather than starting both independently and hoping their durations happen to line up — durations that "happen to line up" drift the moment either one is tuned later.

## Respecting reduced-motion preferences

SceneryStack doesn't ship a dedicated reduced-motion API, but a project that wants to honor the platform-level `prefers-reduced-motion` preference (or offer its own "reduce motion" toggle) can do so with the same building blocks used for any other optional behavior: read `window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches` (or a project-specific preference) once at startup, store it in a `BooleanProperty` following the [feature-flag naming convention](/patterns/feature-flags-and-preferences-pattern), and branch on it wherever an animation would otherwise start — either skipping straight to the `Animation`'s end value, or using a much shorter `duration`, instead of running the full transition.

```ts
import { Animation, Easing } from 'scenerystack/twixt';
import MySimFeatures from './MySimFeatures.js'; // reducedMotionFeatureEnabledProperty, per the feature-flag pattern

function animateToTarget( property: NumberProperty, target: number ): void {
  if ( MySimFeatures.reducedMotionFeatureEnabledProperty.value ) {
    property.value = target; // snap instantly rather than tween
    return;
  }

  new Animation( {
    property: property,
    to: target,
    duration: 0.8,
    easing: Easing.CUBIC_IN_OUT
  } ).start();
}
```

::: tip Motion should clarify a change, not just decorate it
Before adding an `Animation` to a transition, ask what the viewer learns from watching the intermediate frames. If the answer is "nothing — they just see the final state a fraction of a second later," the animation is decoration, not communication, and a shorter duration (or no animation at all) usually serves the interface better.
:::
