---
title: DragListener
description: The pointer-driven drag listener that most draggable Nodes are built on.
category: api
library: scenery
tags: [scenery, DragListener, PressListener, input, drag]
status: complete
related:
  - /api/scenery/fire-listener
  - /api/scenery/rich-drag-listener
  - /api/scenery/keyboard-drag-listener
  - /api/scenery/transform-tracker
  - /api/scenery/hit-testing-and-picking
prerequisites:
  - /api/scenery/node
  - /api/scenery/fire-listener
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# DragListener

`DragListener` (from `scenerystack/scenery`) is a `PressListener` subclass specialized for dragging: it tracks a pointer from press through release, converts the pointer's position into local/parent/model coordinate frames, and (optionally) writes the result straight into a `positionProperty`. As [`PressListener` and `FireListener`](/api/scenery/fire-listener) documents, `PressListener` is the shared base for both — `FireListener` adds a `fire()` callback for clicks, while `DragListener` adds coordinate tracking and repositioning for drags. If you also need keyboard support on the same draggable object, reach for [`RichDragListener`](/api/scenery/rich-drag-listener) instead, which composes a `DragListener` with a [`KeyboardDragListener`](/api/scenery/keyboard-drag-listener) rather than requiring you to wire up both yourself.

```ts
import { Node, DragListener } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';
import { Property } from 'scenerystack/axon';

const positionProperty = new Property( new Vector2( 0, 0 ) );

const body = new Node( { cursor: 'pointer' } );
body.translation = positionProperty.value;

body.addInputListener( new DragListener( {
  positionProperty: positionProperty,
  transform: modelViewTransform, // maps model <-> view (parent) coordinates
  dragBoundsProperty: model.dragBoundsProperty,
  start: () => body.moveToFront(),
  end: () => { /* drag finished */ }
} ) );

positionProperty.link( position => {
  body.translation = modelViewTransform.modelToViewPosition( position );
} );
```

This is the typical PhET pattern: give `DragListener` a `positionProperty` and a `transform`, and it keeps the model position in sync with the pointer without you writing any coordinate math. If you'd rather read the drag out manually, omit `positionProperty` and use the `drag` callback together with `listener.modelDelta`/`listener.modelPoint`.

## Options

`DragListenerOptions` combines everything [`PressListener`](/api/scenery/fire-listener) accepts (`targetNode`, `attach`, `mouseButton`, `pressCursor`, `canStartPress`, `collapseDragEvents`, …) with:

| Option | Default | Effect |
| --- | --- | --- |
| `positionProperty` | `null` | A `Property`-like object (needs only a settable `.value`) kept in sync with the drag, in the model coordinate frame |
| `transform` | `null` | A `Transform3` or `TReadOnlyProperty<Transform3>` mapping the parent (view) frame to the model frame |
| `dragBoundsProperty` | `null` | Constrains the model position to a `Bounds2` (via `closestPointTo`); combine with `mapPosition` for custom constraints |
| `mapPosition` | `null` | `(point: Vector2) => Vector2` — custom mapping from desired to allowed model position, applied before `dragBoundsProperty` |
| `translateNode` | `false` | If `true`, directly sets the drag target's `translation` during the drag, instead of (or in addition to) `positionProperty` |
| `start` / `drag` / `end` | no-ops | Preferred over overriding `press`/`release` — these fire after the listener has already updated its internal state for the event |
| `allowTouchSnag` | `true` | Whether an unattached touch that moves across the target will "snag" and start a press — helps with small draggable targets |
| `applyOffset` | `true` | Whether the initial offset between the pointer and the target's local origin is preserved throughout the drag |
| `useParentOffset` | `false` | Compute the offset in the parent coordinate frame from `positionProperty` instead of the target Node's actual transform — for cases where no single Node's transform represents the dragged thing |
| `trackAncestors` | `false` | If `true`, an internal [`TransformTracker`](/api/scenery/transform-tracker) watches ancestor transforms and repositions automatically when they change |
| `offsetPosition` | `null` | `(point, listener) => Vector2` added to the parent point before computation — useful to offset touch drags away from being directly under the finger |
| `canClick` | `false` | `DragListener` normally can't be "clicked" (a single tap would pick up and immediately drop); set `true` to allow accessible single-activation in addition to dragging |

## Reading the drag state

| Member | Meaning |
| --- | --- |
| `isPressedProperty` / `isUserControlledProperty` | Whether a drag is in progress (`isUserControlledProperty` is just a more readable alias for the same Property) |
| `globalPoint` / `parentPoint` / `localPoint` / `modelPoint` | Defensive-copy getters for the current drag point in each coordinate frame |
| `modelDelta` | The change in `modelPoint` since the previous reposition |
| `dragBounds` | The current value of `dragBoundsProperty` |
| `reposition( globalPoint )` | Recomputes all the coordinate-frame points and applies `positionProperty`/`translateNode`; called automatically on pointer move |
| `interrupt()` | Cancels an in-progress drag without it looking like a normal release |
| `dispose()` | Releases the listener's `Property`/`Action` resources |

::: tip DragListener is not itself keyboard-accessible
`DragListener` only responds to pointer input (mouse/touch/pen). If a draggable object also needs to work with a keyboard, don't hand-wire a separate [`KeyboardDragListener`](/api/scenery/keyboard-drag-listener) alongside it — use [`RichDragListener`](/api/scenery/rich-drag-listener), which composes both and keeps their shared options (`positionProperty`, `transform`, `dragBoundsProperty`, `start`/`drag`/`end`) in sync automatically.
:::

::: warning `tandem` defaults to required, and drag actions are read-only for PhET-iO
Like `PressListener`/`FireListener`, `DragListener` defaults `tandem` to `Tandem.REQUIRED`. Its internal `dragAction` is also `phetioReadOnly: true` by default — PhET-iO can observe drag events in the data stream, but can't trigger them, since simulating a drag requires more state than a single data-stream call can carry.
:::
