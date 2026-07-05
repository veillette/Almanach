---
title: SceneryEvent
description: The event object scenery passes to input listeners, wrapping the native DOM event, the pointer, and the hit trail.
category: api
library: scenery
tags: [scenery, SceneryEvent, input, Trail]
status: complete
related:
  - /api/scenery/pointer-mouse-touch-pen
  - /api/scenery/fire-listener
  - /api/scenery/drag-listener
  - /api/scenery/trail
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SceneryEvent

`SceneryEvent<DOMEvent>` (from `scenerystack/scenery`) is the object every scenery input listener callback receives — `press`, `release`, `drag`, `fire`, and the raw listener methods (`down`, `up`, `move`, …) documented on [`PressListener`/`FireListener`](/api/scenery/fire-listener) and [`DragListener`](/api/scenery/drag-listener) all take one. It wraps the native browser event together with scenery-specific context: which [`Pointer`](/api/scenery/pointer-mouse-touch-pen) triggered it, and the [`Trail`](/api/scenery/trail) of Nodes it was dispatched through. A single DOM `TouchEvent` can carry multiple touch points, so don't assume a `SceneryEvent`'s `domEvent` is exclusive to that event — the same DOM event object can back multiple `SceneryEvent`s.

```ts
import { FireListener } from 'scenerystack/scenery';

button.addInputListener( new FireListener( {
  fire: event => {
    console.log( 'fired by', event.pointer.type );      // 'mouse' | 'touch' | 'pen' | 'pdom'
    console.log( 'hit trail', event.trail.toString() );
    console.log( 'leaf node', event.target === event.trail.lastNode() ); // true
  }
} ) );
```

## Properties

| Property | Meaning |
| --- | --- |
| `trail` | Root-to-leaf `Trail` of Nodes hit by this event |
| `type` | The scenery event type string that was fired, e.g. `'down'`, `'move'` |
| `pointer` | The [`Pointer`](/api/scenery/pointer-mouse-touch-pen) (`Mouse`/`Touch`/`Pen`/PDOM pointer) that triggered this event |
| `domEvent` | The raw underlying DOM event (`MouseEvent`, `TouchEvent`, `PointerEvent`, `KeyboardEvent`, …), or `null` |
| `context` | The `EventContext` scenery captured around the DOM event (environment info at dispatch time) |
| `activeElement` | `document.activeElement` at the time the event fired |
| `currentTarget` | The Node the listener was attached to; `null` when the event is being fired directly on a `Pointer` rather than dispatched through the scene graph |
| `target` | The leaf-most Node in `trail` — the actual Node that was hit |
| `isPrimary` | `true` for touches, and for the mouse only when it's the primary (left) button |
| `handled` / `aborted` | Set by `handle()`/`abort()`, see below |

## Methods

| Method | Effect |
| --- | --- |
| `handle()` | Marks the event `handled`, signaling it shouldn't bubble further — analogous to DOM `stopPropagation()`, but named differently because it does **not** call the underlying DOM method |
| `abort()` | Marks the event `aborted`, so no further listeners see it at all (stronger than `handle()`) |
| `isFromPDOM()` | `true` if the event originated from the Parallel DOM (keyboard/assistive-technology activation) rather than a physical pointer |
| `canStartPress()` | `true` if a fresh, unattached `PressListener` could start a press with this event — ignores non-left mouse buttons and pointers already attached to another listener |

::: tip `handle()` doesn't touch the native DOM event
Calling `event.handle()` stops *scenery's* internal dispatch from continuing to bubble the `SceneryEvent` up the trail — it deliberately does not call `stopPropagation()` on the underlying DOM event, since other (non-scenery) listeners on the page may still need to see it. If you need to prevent default browser behavior too, call `event.domEvent?.preventDefault()` yourself.
:::
