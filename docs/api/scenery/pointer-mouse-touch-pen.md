---
title: Pointer, Mouse, Touch, and Pen
description: The abstract input-device abstraction behind every scenery pointer event, and its Mouse/Touch/Pen subclasses.
category: api
library: scenery
tags: [scenery, Pointer, Mouse, Touch, Pen, input]
status: complete
related:
  - /api/scenery/scenery-event
  - /api/scenery/drag-listener
  - /api/scenery/fire-listener
  - /api/scenery/hit-testing-and-picking
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Pointer, Mouse, Touch, and Pen

`Pointer` (from `scenerystack/scenery`) is scenery's abstraction for a single input device: the one system mouse, one instance per active touch contact, or one instance per stylus. Every scenery input event carries a reference to the `Pointer` that triggered it via [`SceneryEvent.pointer`](/api/scenery/scenery-event), and listeners like [`FireListener`](/api/scenery/fire-listener) and [`DragListener`](/api/scenery/drag-listener) track pointers internally to know when a press is still "over" their target. `Pointer` itself is abstract — what you actually get is always a `Mouse`, `Touch`, or `Pen` instance (or the internal PDOM pointer used for keyboard/assistive-technology activation).

```ts
import { FireListener, Mouse } from 'scenerystack/scenery';

button.addInputListener( new FireListener( {
  press: ( event, listener ) => {
    // Special-case mouse-only behavior, e.g. restrict to the right button
    if ( event.pointer instanceof Mouse ) {
      console.log( 'pressed with the mouse' );
    }
  }
} ) );
```

## The `Pointer` base class

| Member | Meaning |
| --- | --- |
| `point` | Current position in the global (Display root) coordinate frame |
| `type` | `'mouse'` \| `'touch'` \| `'pen'` \| `'pdom'` — cheaper than an `instanceof` check when you just need the category |
| `trail` | The `Trail` this pointer is currently over, updated as it moves |
| `isDownProperty` | Whether the pointer is currently pressed |
| `attachedProperty` / `isAttached()` | Whether a "primary" listener has claimed this pointer (see `attach` on [`PressListener`](/api/scenery/fire-listener)) — used to prevent two listeners from responding to the same physical drag |
| `cursor` | An override cursor that takes precedence over the trail's CSS cursor, typically set for the duration of a drag |
| `isTouchLike()` | `true` for `Touch` and `Pen`, `false` for `Mouse` — useful when code should treat touch and pen the same way |
| `addInputListener( listener, attach? )` / `removeInputListener( listener )` | Attaches a listener directly to the pointer (rather than to a Node) — this is how `PressListener` tracks moves/releases after a press starts |
| `interruptAttached()` | Interrupts whichever listener is currently attached, if any |
| `interruptAll()` | Interrupts every listener on this pointer |
| `reserveForDrag()` / `reserveForKeyboardDrag()` | Marks the pointer with an `Intent` (`Intent.DRAG` or `Intent.KEYBOARD_DRAG`) so other listeners in the same dispatch can change behavior — `DragListener` calls `reserveForDrag()` automatically on a successful press |
| `hasIntent( intent )` | Checks whether a given `Intent` is currently set |

## `Mouse`, `Touch`, and `Pen`

| Class | `type` | Notes |
| --- | --- | --- |
| `Mouse` | `'mouse'` | A singleton per `Display` — there's only ever one. Adds `leftDown`/`middleDown`/`rightDown` (deprecated in favor of DOM button tracking), plus `wheelDelta`/`wheelDeltaMode` for wheel events |
| `Touch` | `'touch'` | One instance per active touch contact, identified by `id`. `isTouchLike()` returns `true` |
| `Pen` | `'pen'` | One instance per active stylus contact, identified by `id`. Also carries tilt/pressure information from the underlying `PointerEvent`. `isTouchLike()` returns `true` |

Because touches come and go as fingers land and lift, code that needs to distinguish "the mouse" from "some touch" should check `pointer.type === 'mouse'` or `pointer instanceof Mouse`, not assume there's exactly one pointer active at a time — a multi-touch interaction can have several `Touch` pointers live simultaneously.

::: tip Prefer `mouseButton` and `pressCursor` over checking `Mouse` yourself
Most pointer-type-specific behavior is already exposed as options on the listeners themselves — [`PressListener`](/api/scenery/fire-listener)'s `mouseButton` restricts which mouse button starts a press (any touch/pen still works), and `pressCursor` only visibly applies to `Mouse` anyway (touch/pen have no persistent cursor). Reach for `instanceof Mouse` only when you need behavior no listener option already covers.
:::
