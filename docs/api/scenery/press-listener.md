---
title: PressListener (direct usage)
description: Using PressListener directly for custom pressable interactions, and the PDOM/focus-aware state it exposes beyond what FireListener and DragListener summarize.
category: api
library: scenery
tags: [scenery, PressListener, DragListener, FireListener, input, accessibility, PDOM]
status: complete
related:
  - /api/scenery/fire-listener
  - /api/scenery/drag-listener
  - /api/scenery/node
prerequisites:
  - /api/scenery/fire-listener
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PressListener (direct usage)

`PressListener` (from `scenerystack/scenery`) is the shared base class documented alongside its most common subclass in [PressListener and FireListener](/api/scenery/fire-listener) — that page covers the options and read-only Properties both classes share. This page is for the case [PressListener and FireListener](/api/scenery/fire-listener) calls out explicitly: reaching for `PressListener` **directly**, without `FireListener`'s fire-on-release semantics or `DragListener`'s coordinate tracking, because the interaction is something else — a press-and-hold tool, a custom multi-pointer gesture, or a Node whose "pressed" visual state needs to track PDOM (keyboard/switch-device) focus as well as pointer input.

```ts
import { Node, Circle, PressListener } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const magnifier = new Node( { children: [ new Circle( 20, { fill: 'lightblue' } ) ], cursor: 'pointer' } );

const magnifyListener = new PressListener( {
  press: () => magnifier.setScaleMagnitude( 1.5 ),
  release: () => magnifier.setScaleMagnitude( 1 ),
  canStartPress: () => !magnifier.isDisposed,
  tandem: Tandem.OPT_OUT
} );

magnifier.addInputListener( magnifyListener );

// Drive a highlight off state that also accounts for keyboard focus, not just pointer hover:
magnifyListener.isOverOrFocusedProperty.link( overOrFocused => {
  magnifier.opacity = overOrFocused ? 1 : 0.8;
});
```

`PressListener` extends axon's `EnabledComponent`, so every instance also has a standard `enabledProperty`/`enabled` — disabling the listener prevents new presses from starting without needing a separate guard in `canStartPress`.

## PDOM- and focus-aware state

Beyond the `isPressedProperty`/`isOverProperty`/`isHoveringProperty`/`isHighlightedProperty` covered in [PressListener and FireListener](/api/scenery/fire-listener), `PressListener` tracks additional state specifically so a Node's "looks interactive" visuals stay correct for keyboard and switch-device users, not just mouse/touch:

| Property | Meaning |
| --- | --- |
| `isFocusedProperty` | Whether this listener's Node currently has PDOM focus |
| `isOverOrFocusedProperty` | `isOverProperty \|\| ` (focused **and** the Display is currently showing focus highlights) — the right signal for "should this look highlighted," including keyboard users |
| `pdomClickingProperty` | `true` while a press is being processed from a PDOM `click` event (as opposed to real pointer down/up) — needed because some assistive devices send a single `click` rather than separate down/up |
| `looksPressedProperty` | `pdomClickingProperty \|\| isPressedProperty` — whether the button should render as pressed, accounting for the fact that a PDOM click fires the press/release callbacks immediately but should still *look* pressed briefly |
| `overPointers` | An `ObservableArray<Pointer>` of every pointer currently over the listener's Node |

`a11yLooksPressedInterval` (default `100` ms) controls how long `looksPressedProperty` stays `true` after a PDOM click, since the press and release callbacks both fire essentially at once for that input source.

## Methods beyond press/release/drag

| Method | Effect |
| --- | --- |
| `canPress( event )` | Whether a press could currently start for the given event (checks button/attachment/`canStartPress`) |
| `canClick()` | Whether a programmatic `click()` could currently succeed |
| `click( event, callback? )` | Simulates a full press-then-release from a single PDOM click event; used internally by [`FireListener`](/api/scenery/fire-listener) and accessible-input handling |
| `focus( event )` / `blur()` | Called by scenery's focus system to update `isFocusedProperty`; not something you typically call directly |
| `step()` | Advances any pending collapsed drag event (see `collapseDragEvents`); called automatically if the listener is registered appropriately |
| `setCreatePanTargetBounds( fn )` | Supplies a callback returning the `Bounds2` that [`AnimatedPanZoomListener`](/api/scenery/animated-pan-zoom-listener) should keep in view while this listener is pressed — useful when the pressed/dragged region differs from the listener's Node bounds |

## `useInputListenerCursor`

`useInputListenerCursor: true` makes any Node this listener is attached to adopt `pressCursor` as its effective cursor whenever that Node's own `cursor` is `null` — a small convenience so you don't have to set `cursor: 'pointer'` on the Node separately from configuring the listener's `pressCursor`.

::: tip Reach for PressListener directly when the interaction isn't "fire" or "drag"
If the shape of the interaction is genuinely custom — press-and-hold-to-charge, multi-touch gesture recognition, or anything that needs `isOverOrFocusedProperty`/`overPointers` — build on `PressListener` directly rather than working around `FireListener`'s fire semantics or `DragListener`'s coordinate machinery. Both of those subclasses exist specifically to save you from reimplementing this state for the two most common cases.
:::

::: warning `tandem` still defaults to required
Like `FireListener` and `DragListener`, a directly-constructed `PressListener` defaults `tandem` to `Tandem.REQUIRED` and defaults `phetioReadOnly: true` on its internal press/release `PhetioAction`s. Pass `Tandem.OPT_OUT` for non-instrumented sim code, as shown above.
:::
