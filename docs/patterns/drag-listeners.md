---
title: Drag Listeners
description: 'Making nodes draggable with DragListener, KeyboardDragListener, and RichDragListener, wired to a model positionProperty through a transform.'
category: patterns
tags:
  - scenery
  - input
  - DragListener
  - KeyboardDragListener
  - RichDragListener
  - interaction
status: verified
related:
  - /api/phetcommon/model-view-transform
  - /patterns/model-view-separation
  - /accessibility/pdom
  - /api/scenery/rich-drag-listener
  - /api/scenery/keyboard-drag-listener
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - 'https://www.npmjs.com/package/scenerystack'
  - 'https://scenerystack.org/reference/'
---

# Drag Listeners

Dragging in SceneryStack follows the [model-view separation](/patterns/model-view-separation) pattern: the listener writes to a model `positionProperty` (in model coordinates), and the node's position updates through the normal observer wiring — the listener never moves the node directly.

## DragListener (pointer input)

```ts
import { DragListener } from 'scenerystack/scenery';

bodyNode.addInputListener( new DragListener( {

  // The model Property to write, in MODEL coordinates...
  positionProperty: body.positionProperty,

  // ...which works because the listener converts through this transform.
  transform: modelViewTransform,

  // Constrain dragging to a region, in model coordinates.
  dragBoundsProperty: model.dragBoundsProperty,

  start: () => body.userControlledProperty.set( true ),
  end: () => body.userControlledProperty.set( false )
} ) );
bodyNode.cursor = 'pointer';
```

Key options:

| Option | Effect |
| --- | --- |
| `positionProperty` | Property written during the drag (model coordinates when `transform` is provided) |
| `transform` | A `ModelViewTransform2`; converts pointer motion into model units |
| `dragBoundsProperty` | Clamps the position to bounds (same frame as `positionProperty`) |
| `start` / `drag` / `end` | Callbacks around the drag lifecycle |
| `useParentOffset` | Keeps the grab point fixed relative to the node instead of jumping its origin to the pointer |
| `allowTouchSnag` | Lets a touch that starts on the node immediately begin dragging (default `true`) |
| `targetNode` | Node whose coordinate frame is used, when the listener is attached elsewhere |

Setting `userControlledProperty` in `start`/`end` is the standard way to tell the model to stop animating a body while the user holds it.

## KeyboardDragListener (alternative input)

Pointer dragging alone is not accessible. `KeyboardDragListener` moves the same Property with arrow keys and WASD, and requires the node to be focusable in the [PDOM](/accessibility/pdom):

```ts
import { KeyboardDragListener } from 'scenerystack/scenery';

bodyNode.addInputListener( new KeyboardDragListener( {
  positionProperty: body.positionProperty,
  transform: modelViewTransform,
  dragBoundsProperty: model.dragBoundsProperty,
  dragSpeed: 150,       // model units per second while a key is held
  shiftDragSpeed: 50    // finer motion with shift held
} ) );

// PDOM: focusable with a meaningful accessible name
bodyNode.tagName = 'div';
bodyNode.focusable = true;
bodyNode.accessibleName = 'Planet';
```

## RichDragListener (both at once)

`RichDragListener` bundles a `DragListener` and a `KeyboardDragListener` behind one API, so every draggable gets pointer and keyboard support from a single declaration. Prefer it for new code:

```ts
import { RichDragListener } from 'scenerystack/scenery';

bodyNode.addInputListener( new RichDragListener( {
  positionProperty: body.positionProperty,
  transform: modelViewTransform,
  dragBoundsProperty: model.dragBoundsProperty,
  keyboardDragListenerOptions: {
    dragSpeed: 150
  }
} ) );
```

::: tip Checklist for a well-behaved draggable
1. Listener writes a **model** Property through `transform` — the node observes it back.
2. `dragBoundsProperty` keeps the object reachable (nothing draggable off-screen).
3. Keyboard path exists (`RichDragListener`, or `KeyboardDragListener` + focusable PDOM).
4. `cursor = 'pointer'` and, for touch, adequate `touchArea` / `mouseArea` dilation.
5. `userControlledProperty` toggled in `start`/`end` if the model animates the object.
:::
