---
title: PressListener and FireListener
description: The base classes behind clickable/pressable Nodes.
category: api
library: scenery
tags: [scenery, FireListener, PressListener, input]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/display
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
  - /api/scenery/display
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PressListener and FireListener

`PressListener` and `FireListener` (both from `scenerystack/scenery`) are the input listeners that give a `Node` press/click behavior. `PressListener` is the general-purpose base — it tracks whether a pointer is pressed/hovering/focused and exposes `press`/`release`/`drag` callbacks — and is also the shared base class for `DragListener`. `FireListener` adds one thing on top: a `fire()` callback invoked on a complete press-then-release (or on down, if `fireOnDown` is set), which is exactly the "button" interaction pattern. Attach either as an [`inputListeners`](/api/scenery/node) entry on a `Node`, and make sure the owning [`Display`](/api/scenery/display) has called `initializeEvents()`.

```ts
import { Circle, FireListener } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const button = new Circle( 25, {
  fill: 'dodgerblue',
  cursor: 'pointer'
} );

button.addInputListener( new FireListener( {
  fire: () => console.log( 'fired!' ),
  tandem: Tandem.REQUIRED
} ) );
```

## `FireListener` options

`FireListenerOptions` adds these to everything `PressListener` accepts:

| Option | Default | Effect |
| --- | --- | --- |
| `fire` | no-op | Called as `fire( event )` when the button fires |
| `fireOnDown` | `false` | If `true`, fires on press instead of on release-while-hovering |
| `fireOnHold` | `false` | Enables fire-on-hold (repeated firing while held) |
| `fireOnHoldDelay` | `400` | Milliseconds held before fire-on-hold starts repeating |
| `fireOnHoldInterval` | `100` | Milliseconds between repeated fires once fire-on-hold is active |

## `PressListener` options

| Option | Default | Effect |
| --- | --- | --- |
| `press` | no-op | Called as `press( event, listener )` when a press starts |
| `release` | no-op | Called as `release( event \| null, listener )` when released, interrupted, or canceled |
| `drag` | no-op | Called as `drag( event, listener )` on pointer move while pressed |
| `targetNode` | `null` | Overrides the Node used to compute the pressed `Trail`/coordinate frame, when it differs from the Node the listener is attached to |
| `attach` | `true` | Whether this listener attaches itself to the pointer (blocking other `attach: true` listeners while pressed) |
| `mouseButton` | `0` (left) | Restricts which mouse button starts a press; any touch/pen still works |
| `pressCursor` | `'pointer'` | Cursor to force while pressed |
| `canStartPress` | always `true` | Predicate checked before allowing a press to start |
| `collapseDragEvents` | `false` | Coalesces multiple drag events between frames into one `drag()` call |

## Useful read-only properties

| Property | Meaning |
| --- | --- |
| `isPressedProperty` | Whether the listener is currently pressed |
| `isOverProperty` | Whether a pointer is currently over the associated Node |
| `isHoveringProperty` | `true` while a pointer that could fire this listener is over it (pressed-and-over, or unpressed-and-over) |
| `isHighlightedProperty` | `isPressed || isHovering` — the usual signal for "should this look highlighted" |
| `pointer` / `pressedTrail` | The active `Pointer` and press `Trail`, or `null` when not pressed |
| `interrupted` | Whether the most recent release was due to an interruption rather than a normal up/click |

## Methods shared by both

| Method | Effect |
| --- | --- |
| `press( event, targetNode?, callback? )` | Programmatically attempts to start a press; returns whether it succeeded |
| `release( event?, callback? )` | Programmatically ends the press |
| `interrupt()` | Cancels an in-progress press without treating it as a normal release (no `fire()` on `FireListener`) |
| `dispose()` | Releases the listener's `Property`/`Emitter` resources |

`FireListener` additionally exposes `fire( event )` (invoke the fire callback directly) and `click( event, callback? )` (used by PDOM/accessibility interactions to press-and-release in one step).

::: tip Use `FireListener` for buttons, `PressListener`/`DragListener` for everything else
If you just need "clicked," reach for `FireListener` — it already integrates with keyboard/PDOM activation. If you need to track pointer movement while pressed (dragging a `Node` around), use `PressListener` directly or [`DragListener`](/guides/scenery-input), which builds on the same `press`/`release`/`drag` shape.
:::

::: warning `tandem` defaults to required
Both listeners default `tandem` to `Tandem.REQUIRED` (for PhET-iO instrumentation of user actions). If your project isn't PhET-iO-instrumented, pass `Tandem.OPT_OUT`, or supply a real tandem as shown above — leaving the default in place will throw if PhET-iO validation is active.
:::
