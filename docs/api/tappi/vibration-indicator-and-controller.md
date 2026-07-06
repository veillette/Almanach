---
title: VibrationIndicator and ContinuousPatternVibrationController
description: An on-screen phone icon that visualizes vibration state, and a pattern-transition controller built on top of the (deprecated, iOS-only) native vibration bridge.
category: api
library: tappi
tags: [tappi, VibrationIndicator, ContinuousPatternVibrationController, vibration, haptics]
status: verified
related:
  - /api/tappi/vibration-manager-and-patterns
  - /guides/haptics-and-alternative-feedback-channels
prerequisites:
  - /api/tappi/vibration-manager-and-patterns
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# VibrationIndicator and ContinuousPatternVibrationController

`VibrationIndicator` and `ContinuousPatternVibrationController` (both from `scenerystack/tappi`) are the UI and control-flow pieces alongside [`vibrationManager`](/api/tappi/vibration-manager-and-patterns): `VibrationIndicator` is a `Node` that visually represents whether vibration is currently active (useful for development/QA on a desktop where you can't feel the device vibrate), and `ContinuousPatternVibrationController` manages smooth transitions between vibration patterns so a pattern change doesn't feel like an abrupt jolt.

```ts
import { VibrationIndicator, ContinuousPatternVibrationController } from 'scenerystack/tappi';
import { BooleanProperty } from 'scenerystack/axon';
```

## A minimal example — VibrationIndicator

```ts
const vibratingProperty = new BooleanProperty( false );

// A small phone icon whose screen color and zig-zag "vibration lines" reflect vibratingProperty.
const vibrationIndicator = new VibrationIndicator( vibratingProperty );

this.addChild( vibrationIndicator );

// In your animation-frame loop:
vibrationIndicator.step( dt ); // dt in seconds -- jostles the icon while vibratingProperty is true
```

## Constructor — VibrationIndicator

```ts
new VibrationIndicator( vibratingProperty: Property<boolean> )
```

Takes no options object — it draws a fixed-size phone icon (a dark panel, a white phone body, a screen, a home button, a speaker, and two zig-zag "vibration" `Path`s) and links directly to `vibratingProperty` to toggle the screen color (`'lightblue'` vibrating / `'grey'` idle) and the visibility of the zig-zag lines.

### VibrationIndicator methods

| Member | Description |
| --- | --- |
| `step( dt )` | While `vibratingProperty` is `true`, jostles the two vibration-line `Path`s with a sinusoidal offset so they visibly shake; a no-op (net-zero motion) while idle |

## A minimal example — ContinuousPatternVibrationController

```ts
// NOTE: requires a VibrationManageriOS instance -- see the warning below.
const controller = new ContinuousPatternVibrationController( vibrationManageriOS, {
  activePattern: [ 0.1, 0.1, 0.1, 0.3 ], // on/off intervals, in seconds
  repeat: true
} );

controller.start();
// In your animation-frame loop:
controller.step( dt ); // dt in seconds

// Queue up a different pattern -- it takes effect at the end of the current loop, not mid-pattern.
controller.setPattern( [ 0.05, 0.05 ] );

controller.stop();
```

## Constructor — ContinuousPatternVibrationController

```ts
new ContinuousPatternVibrationController( vibrationManageriOS: VibrationManageriOS, providedOptions: ContinuousPatternVibrationControllerOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `activePattern` | `[]` | Initial on/off interval pattern, in **seconds** (unlike `vibrationManager`'s millisecond patterns); even indices are "on" |
| `repeat` | `true` | Whether the active pattern loops after finishing |
| `intensity` | `1` | Forwarded to `vibrationManageriOS.vibrateContinuous()` during "on" intervals |
| `sharpness` | `1` | Forwarded to `vibrationManageriOS.vibrateContinuous()` during "on" intervals |

## Methods

| Member | Description |
| --- | --- |
| `start()` | Begins playing `activePattern` from the beginning |
| `stop()` | Stops vibration and resets pattern position |
| `step( dt )` | Advances pattern timing (`dt` in seconds); must be called every frame while running |
| `setPattern( pattern )` | Sets a new pattern. If nothing is currently running, it becomes the active pattern immediately; if a pattern is running, it becomes "pending" and swaps in only once the current pattern loop finishes, to avoid an audible/tactile stutter mid-pattern |
| `setNewActivePattern( pattern )` | Forces the active pattern immediately (used internally by `setPattern`/`step` at a loop boundary) |
| `setIntensity( intensity )` / `setSharpness( sharpness )` | Update the values forwarded to `vibrationManageriOS.vibrateContinuous()` for subsequent "on" intervals |
| `setRepeat( repeat )` | Toggles whether the active pattern loops |

::: warning `ContinuousPatternVibrationController` depends on a class that isn't exported
Its constructor requires a `VibrationManageriOS` instance — the class that bridges to a native iOS WebView vibration handler. `VibrationManageriOS`'s own source marks it `@deprecated - This strategy is being abandoned for an android specific solution`, and it is **not** re-exported from `tappi.ts` — so there's no supported way to construct one from outside the SceneryStack repository itself. `VibrationIndicator` was verified against `scenerystack@3.0.0` source; `ContinuousPatternVibrationController` is documented here from source for completeness but is not usable through the public API.
:::
