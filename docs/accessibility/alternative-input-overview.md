---
title: Alternative Input Overview
description: How pointer, keyboard, and switch/AT input all route through the same listeners.
category: accessibility
tags: [scenery, alternative-input]
status: complete
related:
  - /accessibility/pdom
  - /accessibility/keyboard-input-and-hotkeys
  - /accessibility/focus-highlights
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Alternative Input Overview

"Alternative input" is scenery's term for any non-mouse way of interacting with a scene — keyboard, switch devices, and other assistive technology (AT) — as opposed to conventional pointer input (mouse/touch/pen). The key architectural fact is that **all of these route through the same `TInputListener` interface and the same `addInputListener` call**: a Node doesn't need separate code paths for "mouse users" and "keyboard users."

## One listener interface, multiple input sources

Every scenery input listener (`DragListener`, `PressListener`, `FireListener`, `KeyboardListener`, `KeyboardDragListener`) implements `TInputListener` (from `scenerystack/scenery`). Pointer events (`down`, `up`, `move`, …) and keyboard events (`keydown`, `keyup`, …) are both dispatched through the same listener-array mechanism on a Node — a listener just implements the callback names it cares about:

```ts
import { Node, PressListener } from 'scenerystack/scenery';

const button = new Node( { tagName: 'button', focusable: true } );

button.addInputListener( new PressListener( {
  press: () => model.activate()  // fires for pointer press AND (via focusable + Enter/Space) keyboard activation
} ) );
```

Interactive `sun` components (buttons, sliders, checkboxes) already wire this up for you — the same `PressListener`/button model responds whether the user clicked, tapped, or pressed <kbd>Enter</kbd> while focused.

## Pointers, including the PDOM pointer

Pointer input itself is represented by `Pointer` subclasses — `Mouse`, `Touch`, `Pen` — but there is also a `PDOMPointer`, which represents interactions coming from the Parallel DOM (see [The Parallel DOM](/accessibility/pdom)): keyboard activation, and AT-generated synthetic events (a screen reader's virtual cursor, a switch-access scanner) all arrive at scenery as events on the `PDOMPointer`. This is why a `Node` only needs `tagName`/`focusable`/`accessibleName` to become reachable by keyboard and AT — it's being added to the same dispatch system pointer input already uses, not a separate accessibility layer.

## Dragging: the RichDragListener pattern

The clearest example of "one interaction, multiple input modalities" is dragging. `RichDragListener` (from `scenerystack/scenery`) composes a pointer-based `DragListener` and a keyboard-based `KeyboardDragListener` into a single listener implementing `TInputListener`, so one `addInputListener` call supports both:

```ts
import { Node, RichDragListener } from 'scenerystack/scenery';

// A focusable Node that can be dragged with pointer or keyboard.
const draggableNode = new Node( {
  tagName: 'div',
  focusable: true
} );

const richDragListener = new RichDragListener( {
  positionProperty: modelElement.positionProperty,
  transform: modelViewTransform
} );

draggableNode.addInputListener( richDragListener );
```

Options specific to only one modality are namespaced under `dragListenerOptions`/`keyboardDragListenerOptions`; options common to both (like `positionProperty`, `transform`) are given directly.

## What this buys you

- **No parallel code paths.** A single `press`/`fire`/`drag` callback runs regardless of what device triggered it.
- **Accessibility is additive, not a rewrite.** Adding `tagName`/`focusable` to an existing Node with pointer listeners is usually enough to bring keyboard/AT support online, because the listener was already written against the shared interface.
- **Focus becomes the organizing concept for non-pointer input**, which is why [focus highlights](/accessibility/focus-highlights) and `pdomOrder` matter so much — see [The Parallel DOM](/accessibility/pdom) for `pdomOrder`, and [Keyboard Input and Hotkeys](/accessibility/keyboard-input-and-hotkeys) for shortcuts beyond dragging.

::: tip Design for keyboard first, not as an afterthought
Because pointer and keyboard input share one dispatch system, retrofitting keyboard support onto a pointer-only interaction later usually means restructuring the listener anyway. It's less work overall to reach for `RichDragListener`/`KeyboardListener` from the start than to add a pointer-only `DragListener` and bolt on keyboard support afterward.
:::
