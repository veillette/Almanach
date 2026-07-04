---
title: KeyboardDragListener
description: The keyboard-driven equivalent of pointer dragging, moving a positionProperty with arrow keys or WASD.
category: api
library: scenery
tags: [scenery, KeyboardDragListener, input, keyboard, accessibility, drag]
status: verified
related:
  - /api/scenery/node
  - /api/scenery/keyboard-listener
  - /api/scenery/rich-drag-listener
  - /patterns/drag-listeners
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# KeyboardDragListener

`KeyboardDragListener` (from `scenerystack/scenery`) is a `KeyboardListener` specialized for dragging: it moves an object with the arrow keys or W/A/S/D, writing to the same kind of model `positionProperty` a pointer [`DragListener`](/patterns/drag-listeners) would. Pointer dragging alone is never accessible, so any draggable object that needs to work for keyboard/switch users needs this listener (or [`RichDragListener`](/api/scenery/rich-drag-listener), which bundles both) in addition to — or instead of — pointer dragging.

```ts
import { Node, KeyboardDragListener } from 'scenerystack/scenery';

const bodyNode = new Node( { tagName: 'div', focusable: true } );

bodyNode.addInputListener( new KeyboardDragListener( {
  positionProperty: body.positionProperty,
  transform: modelViewTransform,
  dragBoundsProperty: model.dragBoundsProperty,
  dragSpeed: 150,     // model units/second while a key is held
  shiftDragSpeed: 50  // finer motion with shift held
} ) );
```

## Options

`KeyboardDragListenerOptions` accepts everything `DragListener` shares via `AllDragListenerOptions` (`positionProperty`, `transform`, `dragBoundsProperty`, `mapPosition`, `translateNode`, `start`/`drag`/`end`), plus:

| Option | Default | Effect |
| --- | --- | --- |
| `dragDelta` | `10` | Discrete step (in parent/view coordinates) moved per `moveOnHoldInterval` tick — a "typical application" feel; mutually exclusive with `dragSpeed`/`shiftDragSpeed` |
| `shiftDragDelta` | `5` | Finer `dragDelta` while shift is held |
| `dragSpeed` | `0` | Continuous units/second moved while a direction key is held — smoother, game-like motion; mutually exclusive with `dragDelta`/`shiftDragDelta` |
| `shiftDragSpeed` | `0` | Finer `dragSpeed` while shift is held |
| `keyboardDragDirection` | `'both'` | Constrains motion: `'both'` (2D), `'leftRight'`, or `'upDown'` |
| `moveOnHoldDelay` | `500` | Milliseconds a key must be held before repeat movement begins (delta mode only) |
| `moveOnHoldInterval` | `400` | Milliseconds between discrete steps once repeating (delta mode only; must be > 0) |

`dragSpeed`/`shiftDragSpeed` and `dragDelta`/`shiftDragDelta` are mutually exclusive — pick one motion model per listener. If you pass `dragBoundsProperty`, you must also provide `positionProperty` or `translateNode: true`, since the listener otherwise has no way to know the current position to constrain.

## Public state

| Member | Meaning |
| --- | --- |
| `modelDelta` | The `Vector2` delta (in model coordinates) applied during the current drag step |
| `modelPoint` | The current drag point in model coordinates |
| `isPressedProperty` (inherited from `KeyboardListener`) | Whether a drag is currently active |

## Methods

Shares `interrupt()` and `dispose()` with [`KeyboardListener`](/api/scenery/keyboard-listener), since `KeyboardDragListener` extends it directly.

::: tip Requires a focusable target — pair it with the PDOM
`KeyboardDragListener` only receives key events when its Node has keyboard focus. Set `tagName: 'div'` and `focusable: true` (and a meaningful `accessibleName`) on the target Node, or the listener will never fire. See [Drag Listeners](/patterns/drag-listeners) for the full checklist, including combining this with pointer dragging via `RichDragListener`.
:::
