---
title: Snapping a Draggable Node to a Grid
description: Using DragListener's mapPosition hook to round a dragged position onto fixed grid cells.
category: cookbook
tags: [scenery, DragListener, mapPosition, drag, dot, roundToInterval]
status: complete
related:
  - /patterns/drag-listeners
  - /api/scenery/drag-listener
  - /api/dot/dot-utils
  - /api/dot/vector2
  - /cookbook/draggable-node-bounded-to-an-area
prerequisites:
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Snapping a Draggable Node to a Grid

**Task:** a draggable object (a puzzle piece, a graph point) should visually jump to the nearest cell of a fixed grid while being dragged, rather than following the pointer at arbitrary sub-pixel positions.

`DragListener` and `KeyboardDragListener` both accept a `mapPosition` option — a `( point: Vector2 ) => Vector2` hook that runs on every proposed position *before* it's written to `positionProperty` (and before `dragBoundsProperty` clamping). Returning a rounded point from `mapPosition` is the standard way to snap a drag to a grid without hand-rolling position math inside `drag`/`end` callbacks.

## The solution

```ts
import { DragListener, Rectangle } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Vector2, roundToInterval } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const GRID_CELL_SIZE = 20; // model units per grid cell

// --- model ---
const positionProperty = new Property( new Vector2( 0, 0 ) );

// --- view ---
const pieceNode = new Rectangle( -8, -8, 16, 16, {
  fill: 'mediumseagreen',
  cursor: 'pointer'
} );

positionProperty.link( position => {
  pieceNode.translation = position;
} );

pieceNode.addInputListener( new DragListener( {
  positionProperty: positionProperty,

  // Snap every candidate position to the nearest grid intersection before
  // it's written to positionProperty.
  mapPosition: ( point: Vector2 ) => new Vector2(
    roundToInterval( point.x, GRID_CELL_SIZE ),
    roundToInterval( point.y, GRID_CELL_SIZE )
  ),

  tandem: Tandem.REQUIRED
} ) );
```

`roundToInterval` (from `scenerystack/dot`, alongside the other numeric helpers documented in [Utils](/api/dot/dot-utils)) rounds a value to the nearest multiple of a given interval — exactly the "nearest grid line" computation, applied independently to `x` and `y`.

The Node now jumps between grid cells as it's dragged, rather than following the pointer continuously — try setting `GRID_CELL_SIZE` to `1` to confirm the un-snapped behavior is unchanged, and larger values (e.g. `50`) to make the snapping obvious.

## Combining with drag bounds

`mapPosition` and `dragBoundsProperty` compose — `mapPosition` runs first, then the result is clamped into `dragBoundsProperty` (see [Making Any Node Draggable and Bounded to an Area](/cookbook/draggable-node-bounded-to-an-area)) — so a snapped grid position that would fall just outside the play area is still pulled back in:

```ts
import { Bounds2 } from 'scenerystack/dot';

pieceNode.addInputListener( new DragListener( {
  positionProperty: positionProperty,
  dragBoundsProperty: new Property( new Bounds2( -100, -100, 100, 100 ) ),
  mapPosition: ( point: Vector2 ) => new Vector2(
    roundToInterval( point.x, GRID_CELL_SIZE ),
    roundToInterval( point.y, GRID_CELL_SIZE )
  ),
  tandem: Tandem.REQUIRED
} ) );
```

## Options used here

| Option | Effect |
| --- | --- |
| `mapPosition` | `( point: Vector2 ) => Vector2` — transforms a candidate drag position before it's written to `positionProperty`; runs before `dragBoundsProperty` clamping |
| `positionProperty` | The model `Property` receiving the (now snapped) position |

::: tip `mapPosition` works identically on `KeyboardDragListener` and `RichDragListener`
Because `mapPosition` is part of the shared `AllDragListenerOptions` every drag listener accepts, adding the same `mapPosition` function to a `KeyboardDragListener` (or the `keyboardDragListenerOptions` of a `RichDragListener`) snaps keyboard-driven dragging to the same grid, with no separate logic needed — see [Drag Listeners](/patterns/drag-listeners) for wiring up the keyboard-accessible variants.
:::

::: warning Round the point, not the delta
`mapPosition` receives and must return an absolute point (in the same coordinate frame as `positionProperty`), not a per-step delta — rounding a delta instead would snap relative to wherever the drag started rather than to a fixed grid, so cells would shift depending on the drag's starting position.
:::
