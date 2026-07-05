---
title: Detecting Touch vs. Mouse vs. Keyboard Input
description: Branching interaction behavior on the input modality using a SceneryEvent's Pointer type or type-specific listener callbacks.
category: cookbook
tags: [scenery, Pointer, SceneryEvent, Mouse, Touch, input]
status: complete
related:
  - /guides/scenery-input
  - /accessibility/alternative-input-overview
  - /api/scenery/pointer-mouse-touch-pen
  - /api/scenery/scenery-event
prerequisites:
  - /guides/scenery-input
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Detecting Touch vs. Mouse vs. Keyboard Input

**Task:** most interactions should behave identically regardless of input device, but occasionally a behavior genuinely needs to differ — a bigger visual "grab" affordance only for touch, a hover tooltip that makes no sense on a touchscreen, a log line that records which modality triggered an action.

Every scenery input event ultimately traces back to a `Pointer` — a `Mouse`, `Touch`, `Pen`, or, for keyboard/AT-driven input, a `PDOMPointer` (see [Alternative Input Overview](/accessibility/alternative-input-overview)). A [`SceneryEvent`](/api/scenery/scenery-event) passed to any input listener callback carries the triggering `Pointer` as `event.pointer`, and its `type` field is exactly the discriminator to branch on.

## Branching on `event.pointer.type`

```ts
import { Node, Circle } from 'scenerystack/scenery';

const draggableIcon = new Circle( 20, { fill: 'crimson', cursor: 'pointer' } );

draggableIcon.addInputListener( {
  down: event => {
    switch( event.pointer.type ) {
      case 'touch':
        // Touch presses benefit from a visibly larger "being held" affordance.
        draggableIcon.scale( 1.15 );
        break;
      case 'mouse':
        draggableIcon.cursor = 'grabbing';
        break;
      case 'pdom':
        // Keyboard/AT-driven activation - no pointer-specific visual needed.
        break;
      default:
        break;
    }
  },
  up: event => {
    draggableIcon.scale( 1 );
    draggableIcon.cursor = 'pointer';
  }
} );
```

`event.pointer.type` is a plain string (`'mouse'`, `'touch'`, `'pen'`, or `'pdom'` for PDOM-driven input) — see [Pointer, Mouse, and Touch](/api/scenery/pointer-mouse-touch-pen) for the full set of `Pointer` subclasses this corresponds to, and [SceneryEvent](/api/scenery/scenery-event) for the rest of what's available on the event object (`event.trail`, `event.domEvent`, etc.).

## Type-specific listener callback names

For the common case of "run this only for touch" (or only for mouse), scenery also dispatches type-specific event names directly, so you don't need an `if`/`switch` inside a generic `down`/`up` callback:

```ts
draggableIcon.addInputListener( {
  touchdown: event => {
    // Fires only for Touch pointers - equivalent to checking
    // event.pointer.type === 'touch' inside a plain `down` handler.
    draggableIcon.scale( 1.15 );
  },
  mousedown: event => {
    draggableIcon.cursor = 'grabbing';
  }
} );
```

Every generic event (`down`, `up`, `move`, `enter`, `exit`, `over`, `out`, `cancel`) has `mouse`/`touch`/`pen`-prefixed variants (`mousedown`, `touchdown`, `pendown`, …) — use whichever reads more clearly for the listener you're writing; both approaches dispatch from the same underlying `Pointer` type.

## Detecting keyboard/PDOM-driven interaction specifically

Keyboard activation doesn't flow through `down`/`up` pointer events at all — a focusable Node driven by keyboard/switch input receives `keydown`/`keyup` (and, for structured listeners, `press`/`release` via the same `TInputListener` interface pointer input uses; see [Alternative Input Overview](/accessibility/alternative-input-overview)). To confirm an interaction happened via keyboard rather than a pointer, check for the `PDOMPointer` case in a pointer-based listener, or simply attach a `focus`/`keydown` listener instead:

```ts
draggableIcon.tagName = 'div';
draggableIcon.focusable = true;
draggableIcon.accessibleName = 'Movable token';

draggableIcon.addInputListener( {
  focus: () => {
    // A focus event only ever originates from keyboard/AT navigation, not a pointer.
    draggableIcon.stroke = 'black';
  },
  blur: () => {
    draggableIcon.stroke = null;
  }
} );
```

## Where each check makes sense

| Situation | What to check |
| --- | --- |
| A pointer-driven listener needs to special-case touch's larger fingertip | `event.pointer.type === 'touch'`, or the `touchdown`/`touchup`/… callback names |
| Code needs to know "was this triggered by keyboard/AT, not a pointer at all" | `event.pointer.type === 'pdom'`, or simply react to `focus`/`keydown` instead of `down` |
| A visual affordance (tooltip, hover highlight) should only show for non-touch pointers | Check `event.pointer.type !== 'touch'` in `over`/`out`, since touch has no true "hover" state |

::: warning Don't gate core functionality on input type
Branching on `event.pointer.type` is appropriate for *presentation* differences (a bigger grab handle, skipping a hover-only tooltip) — never for whether an interaction works at all. An interaction that only works for one pointer type, or that has no keyboard-accessible equivalent, fails [Alternative Input Overview](/accessibility/alternative-input-overview)'s core requirement that every listener implement the same shared `TInputListener` interface regardless of what triggers it.
:::
