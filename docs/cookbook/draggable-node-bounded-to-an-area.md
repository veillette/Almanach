---
title: Making Any Node Draggable and Bounded to an Area
description: Attaching a DragListener to a Node so it writes a model positionProperty, clamped to a region with dragBoundsProperty.
category: cookbook
tags: [scenery, DragListener, dragBoundsProperty, drag, Bounds2]
status: complete
related:
  - /patterns/drag-listeners
  - /api/scenery/drag-listener
  - /api/dot/bounds2
  - /patterns/model-view-separation
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Making Any Node Draggable and Bounded to an Area

**Task:** you have a `Node` (an icon, a body, a token) that should follow the pointer while dragged, but never leave a fixed rectangular region — the play area, a container's interior, the visible screen bounds.

The tool for this is a plain [`DragListener`](/api/scenery/drag-listener) (from `scenerystack/scenery`) with two options set together: `positionProperty` (the model `Property` the drag writes to) and `dragBoundsProperty` (constrains the position to a `Bounds2`, via `closestPointTo`). This is a narrower slice of [Drag Listeners](/patterns/drag-listeners) — that page also covers the keyboard-accessible listeners; this recipe is pointer-only and focused on the bounding step.

## The solution

```ts
import { DragListener, Circle } from 'scenerystack/scenery';
import { Property, NumberProperty } from 'scenerystack/axon';
import { Bounds2, Vector2 } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

// --- model ---
class TokenModel {
  public readonly positionProperty = new Property( new Vector2( 0, 0 ) );

  // The region the token is allowed to occupy, in model coordinates.
  // A Property (not a plain Bounds2) so it can change later, e.g. on a layout resize.
  public readonly dragBoundsProperty = new Property( new Bounds2( -200, -150, 200, 150 ) );

  public reset(): void {
    this.positionProperty.reset();
  }
}

// --- view ---
const model = new TokenModel();

const tokenNode = new Circle( 15, {
  fill: 'dodgerblue',
  cursor: 'pointer'
} );

// The view only ever reads positionProperty back - it never sets it directly.
model.positionProperty.link( position => {
  tokenNode.translation = position;
} );

tokenNode.addInputListener( new DragListener( {
  positionProperty: model.positionProperty,
  dragBoundsProperty: model.dragBoundsProperty,

  // No `transform` is passed here, so positionProperty is written in the
  // same (view/parent) coordinate frame tokenNode itself lives in. Pass a
  // ModelViewTransform2 via `transform` if your model uses different units.

  tandem: Tandem.REQUIRED
} ) );
```

Dragging `tokenNode` now sets `model.positionProperty` to the pointer's position every frame, clamped so it never leaves `(-200, -150)`–`(200, 200)`. Because the view only observes `positionProperty` (never writes it), any other code that changes the position — a "center token" button, a reset — moves the node the same way a drag would.

## Making the bounds themselves dynamic

Since `dragBoundsProperty` is a `Property<Bounds2>`, shrinking or growing the allowed region at runtime (e.g. to match a resizable container) is just setting a new `Bounds2` — the listener re-clamps on the next drag automatically, and also clamps the *current* value immediately if it's already outside the new bounds:

```ts
function onContainerResized( newInteriorBounds: Bounds2 ): void {
  model.dragBoundsProperty.value = newInteriorBounds;
}
```

## Options used here

| Option | Effect |
| --- | --- |
| `positionProperty` | The model `Property` written during the drag |
| `dragBoundsProperty` | A `Property<Bounds2>` the written position is clamped into, in the same coordinate frame as `positionProperty` |
| `transform` | A `ModelViewTransform2` to convert between model and view units; omit it when the model and view already share coordinates, as above |
| `tandem` | Required for PhET-iO-instrumented sims; see [Tandem](/api/tandem/tandem) |

::: tip Pointer-only is not the full story
This recipe intentionally covers only pointer dragging. A production control almost always also needs a keyboard path — either add a `KeyboardDragListener` alongside this `DragListener`, or replace both with a single `RichDragListener`, which accepts the same `positionProperty`/`dragBoundsProperty` options and adds arrow-key/WASD support for free. See the [full checklist](/patterns/drag-listeners#richdraglistener-both-at-once) for what else a well-behaved draggable needs (touch area dilation, `userControlledProperty` during animation).
:::

::: warning `dragBoundsProperty` needs `positionProperty` to know the current position
If you ever switch to `translateNode: true` instead of `positionProperty` (letting the listener move the Node's translation directly rather than a model Property), you must still supply one or the other — the listener has no other way to know what position to clamp. For model-bound dragging like this recipe, `positionProperty` alone is sufficient.
:::
