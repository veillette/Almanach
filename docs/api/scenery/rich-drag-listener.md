---
title: RichDragListener
description: A single input listener that composes a DragListener and a KeyboardDragListener, giving one draggable object both pointer and keyboard support.
category: api
library: scenery
tags: [scenery, RichDragListener, input, drag, keyboard, accessibility]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/keyboard-drag-listener
  - /api/scenery/fire-listener
  - /patterns/drag-listeners
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RichDragListener

`RichDragListener` (from `scenerystack/scenery`) is not a subclass of `DragListener` — it *composes* one internal `DragListener` and one internal `KeyboardDragListener`, forwarding every scenery input-listener callback (`down`, `up`, `keydown`, `focus`, …) to whichever of the two applies, and implements `TInputListener` so it can be attached to a Node exactly like either listener alone. It exists so a draggable object gets pointer *and* keyboard support from one declaration instead of wiring up both listeners and their shared options by hand — per source, it's the recommended default for new draggable code, with plain `DragListener`/`KeyboardDragListener` reserved for cases needing one modality only or finer control.

```ts
import { Node, RichDragListener } from 'scenerystack/scenery';

const bodyNode = new Node( { tagName: 'div', focusable: true, cursor: 'pointer' } );

bodyNode.addInputListener( new RichDragListener( {
  positionProperty: body.positionProperty,
  transform: modelViewTransform,
  dragBoundsProperty: model.dragBoundsProperty,
  start: () => body.userControlledProperty.set( true ),
  end: () => body.userControlledProperty.set( false ),
  keyboardDragListenerOptions: {
    dragSpeed: 150
  }
} ) );
```

## Options

`RichDragListenerOptions` shares the common drag options (`positionProperty`, `transform`, `dragBoundsProperty`, `mapPosition`, `translateNode`, `start`/`drag`/`end`) applied to *both* internal listeners, plus:

| Option | Default | Effect |
| --- | --- | --- |
| `dragListenerOptions` | `{}` | Additional/overriding options passed only to the internal `DragListener` (e.g. `allowTouchSnag`, `mouseButton`) |
| `keyboardDragListenerOptions` | `{}` | Additional/overriding options passed only to the internal `KeyboardDragListener` (e.g. `dragSpeed`, `keyboardDragDirection`) |
| `tandem` | `Tandem.REQUIRED` | Split internally into `tandem.createTandem('dragListener')` / `'keyboardDragListener'` for PhET-iO |

`start`/`drag`/`end` given directly on `RichDragListener` fire for *either* input type; listener-specific callbacks in `dragListenerOptions`/`keyboardDragListenerOptions` fire in addition to (not instead of) the shared ones.

## Public state and methods

| Member | Meaning |
| --- | --- |
| `dragListener` | The internal `DragListener` instance — public, so you can inspect/reuse it directly |
| `keyboardDragListener` | The internal `KeyboardDragListener` instance |
| `isPressedProperty` | `true` if either internal listener is pressed |
| `interrupt()` | Interrupts both internal listeners |
| `dispose()` | Disposes both internal listeners and this listener's own Properties |

::: tip Starting one input type interrupts the other
When the pointer `DragListener` starts, it interrupts the `KeyboardDragListener` (and vice versa) — the two are mutually exclusive at any instant, so a drag can't be simultaneously driven by a mouse and the keyboard. This is handled internally; you don't need to manage it in your `start`/`end` callbacks.
:::
