---
title: PushButtonModel
description: The non-visual press/fire state machine behind RectangularPushButton and RoundPushButton, and its ButtonModel base.
category: api
library: sun
tags: [sun, PushButtonModel, ButtonModel, button]
status: complete
related:
  - /api/sun/rectangular-push-button
  - /api/sun/round-push-button
  - /api/sun/rectangular-button
  - /api/sun/round-button
  - /api/sun/momentary-button
  - /api/sun/sticky-toggle-button
prerequisites:
  - /api/axon/emitter
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PushButtonModel

`PushButtonModel` (from `scenerystack/sun`) is the non-visual model behind [`RectangularPushButton`](/api/sun/rectangular-push-button) and [`RoundPushButton`](/api/sun/round-push-button) — it owns the fire-on-press-or-release logic, the fire-on-hold repeat timer, and the listener list, with no knowledge of what the button looks like. Every button in `sun` follows this split: a `ButtonModel` subclass tracks interaction state and decides *when* to act, while a `ButtonNode` subclass (`RectangularButton`/`RoundButton`) turns that state into pixels. You'll construct `PushButtonModel` directly only if you're building a fully custom button `Node` that doesn't fit any of `RectangularPushButton`/`RoundPushButton`/`ArrowButton`/etc.

## `ButtonModel`, the shared base

`ButtonModel` (also exported from `scenerystack/sun`) is what `PushButtonModel`, `ToggleButtonModel`, `StickyToggleButtonModel`, and `MomentaryButtonModel` all extend. It provides the Properties every button interaction is built from:

| Property | Meaning |
| --- | --- |
| `overProperty` | Pointer is over the button (read-only) |
| `downProperty` | Pointer is currently down on the button |
| `focusedProperty` | Button has PDOM focus |
| `looksPressedProperty` | Whether the button should render as pressed (down, or an in-progress a11y click) |
| `isOverOrFocusedProperty` | Pointer over, or focused with highlights shown |
| `enabledProperty` | From the `EnabledComponent` mixin `ButtonModel` extends |
| `fireCompleteEmitter` | Emits after the button has fully fired — the hook sound generators and Voicing responses listen to |

`ButtonModel.createPressListener( options? )` builds and returns a `PressListener` wired up to these Properties; a `ButtonNode` subclass calls it once and adds the result as an input listener on itself.

## `PushButtonModel`

`PushButtonModel` adds the actual momentary-action firing behavior on top of `ButtonModel`:

```ts
import { PushButtonModel, RectangularButton, PushButtonInteractionStateProperty } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';

// What RectangularPushButton does internally — only write this directly when building
// a custom button Node that RectangularButton/RoundButton don't already cover.
const buttonModel = new PushButtonModel( {
  fireOnDown: false,
  listener: () => console.log( 'fired!' ),
  tandem: Tandem.REQUIRED.createTandem( 'buttonModel' )
} );

const interactionStateProperty = new PushButtonInteractionStateProperty( buttonModel );
```

`RectangularPushButton` and `RoundPushButton` construct exactly this pair (a `PushButtonModel` plus a `PushButtonInteractionStateProperty`) and hand them to `RectangularButton`/`RoundButton`'s `super()` — which is why both button shapes share identical firing options (`fireOnDown`, `fireOnHold`, `listener`, `addListener`/`removeListener`) despite having unrelated visual implementations.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `listener` | `null` | Convenience for one fire listener, `() => void` |
| `fireOnDown` | `false` | Fire on pointer-down instead of pointer-up-while-over |
| `fireOnHold` | `false` | Enable press-and-hold repeat firing |
| `fireOnHoldDelay` | `400` | Milliseconds held before repeat firing starts |
| `fireOnHoldInterval` | `100` | Milliseconds between repeat fires once started |
| `interruptListener` | `null` | Runs before other fire listeners, purely to interrupt other pointers (helps multitouch) |
| `startCallback` / `endCallback` | (inherited from `ButtonModel`) | Called on pointer down / up, independent of whether the button actually fires |

## Methods

| Method | Effect |
| --- | --- |
| `addListener( listener )` / `removeListener( listener )` | Add/remove a fire listener, called with no arguments |
| `fire()` | Fires all listeners immediately; public so PhET-iO and accessibility code can trigger it directly |

::: tip `isFiringProperty` guards against re-entrant firing
`PushButtonModel.fire()` asserts if called while already firing (`isFiringProperty.value` is `true`) — a listener that tries to fire the same button again synchronously (e.g. from within its own fire callback) will hit that assertion rather than silently recursing.
:::
