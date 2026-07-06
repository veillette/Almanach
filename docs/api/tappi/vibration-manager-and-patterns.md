---
title: vibrationManager and VibrationPatterns
description: The shared singleton that drives device vibration through the Web Vibration API, plus a library of reusable on/off interval patterns to feed it.
category: api
library: tappi
tags: [tappi, vibrationManager, VibrationPatterns, Intensity, vibration, haptics]
status: verified
related:
  - /api/tappi/vibration-indicator-and-controller
  - /guides/haptics-and-alternative-feedback-channels
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# vibrationManager and VibrationPatterns

`vibrationManager` (from `scenerystack/tappi`, lowercase — a pre-constructed singleton instance, not a class) is the shared object that drives device vibration through the browser's [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate) (`navigator.vibrate`). It must be advanced every frame with `step( dt )`, and vibration is expressed as a repeating on/off interval pattern rather than a single duration. `VibrationPatterns` is a companion plain object of ready-made interval arrays (`FLUTTER`, `HEARTBEAT`, `HZ_10`, …) meant to be passed straight into `vibrationManager.startVibrate()`.

```ts
import { vibrationManager, VibrationPatterns, Intensity } from 'scenerystack/tappi';
```

## A minimal example

```ts
// Somewhere in your framework's step/animation-frame loop:
vibrationManager.step( dt ); // dt in seconds

// Begin a repeating vibration pattern (on/off intervals, in ms).
vibrationManager.startVibrate( VibrationPatterns.FLUTTER );

// ...later...
vibrationManager.stopVibrate();

// Or run a pattern for a fixed duration and have it stop automatically.
vibrationManager.startTimedVibrate( 2000, VibrationPatterns.HEARTBEAT );

// Intensity is a two-valued EnumerationValue enumeration (HIGH / LOW); vibrationManager
// mimics "low" intensity by rapidly toggling the motor on and off.
vibrationManager.setVibrationIntensity( Intensity.LOW );
```

## `vibrationManager` methods

| Member | Description |
| --- | --- |
| `initialize( simVisibleProperty, simActiveProperty )` | Wires up internal listeners so vibration stops automatically when the sim becomes invisible/inactive; intended to be called once by the hosting framework, not per-use |
| `startVibrate( pattern )` | Starts a repeating vibration described by `pattern` — an array of millisecond on/off durations (even indices are "on") that repeats indefinitely until `stopVibrate()` is called. Falls back to continuous vibration if `pattern` is falsy |
| `startTimedVibrate( time, pattern )` | Like `startVibrate`, but automatically calls `stopVibrate()` once `time` milliseconds have elapsed |
| `startRepeatingVibrationPattern( pattern )` | An alternate, more experimental path (noted as such in source) that expands `pattern` into a long repeated sequence and hands it to `navigator.vibrate()` directly, rather than driving the motor via `step()` |
| `stopRepeatingVibrationPattern()` | Stops a pattern started with `startRepeatingVibrationPattern()` |
| `stopVibrate()` | Immediately stops any running pattern |
| `setVibrationIntensity( intensity )` | Sets `Intensity.HIGH` (continuous motor-on) or `Intensity.LOW` (rapid on/off toggling to simulate lower intensity) |
| `isVibrating()` | Whether the motor should be actively on right now (accounts for pattern downtime) |
| `isRunningPattern()` | Whether a pattern is active at all, including during its "off" intervals |
| `step( dt )` | Advances internal pattern timing; `dt` is in seconds. Must be called every frame for `startVibrate`/`startTimedVibrate` patterns to progress |

## `VibrationPatterns` entries

| Pattern | Shape |
| --- | --- |
| `HZ_2_5`, `HZ_5`, `HZ_10`, `HZ_25`, `HZ_50`, `HZ_200` | Even on/off interval pairs approximating that frequency (the source notes `HZ_50`/`HZ_200` are faster than 60fps and may not render reliably through `step()`-driven timing) |
| `QUICK_BALL_ROLL`, `SLOW_BALL_ROLL` | Short two-value patterns suggesting a rolling motion |
| `FLUTTER` | A long, irregular multi-interval pattern |
| `SLOW_DOWN` | A pattern with increasing interval lengths |
| `HEARTBEAT`, `QUICK_HEARTBEAT` | Two-beat patterns with a long pause, approximating a heartbeat |
| `MOTOR_CALL` | `null` — shorthand for "no pattern," i.e. plain continuous vibration |
| `interactionSuccess( vibrationManageriOS )` | A function (not a pattern array) that fires three rapid transient vibrations; takes a `VibrationManageriOS` instance, a separate iOS-bridge class — see the warning below |

::: warning `VibrationPatterns.interactionSuccess` is not usable through the public API
`VibrationPatterns.interactionSuccess` takes a `VibrationManageriOS` parameter — a class whose own source marks it `@deprecated` and which is **not** re-exported from `tappi.ts`, so it isn't constructable via the public `scenerystack/tappi` API. All other exports and methods on this page were verified against `scenerystack@3.0.0` source.
:::
