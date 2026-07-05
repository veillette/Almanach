---
title: Grid-Snapping and Constrained-Dragging Pattern
description: When and why to constrain a draggable Node's input - snapping to a grid, clamping to bounds, or restricting to one axis - as distinct decisions layered on top of the ordinary drag-listener pattern.
category: patterns
tags: [scenery, DragListener, drag, constraint, grid-snapping]
status: complete
related:
  - /patterns/drag-listeners
  - /cookbook/snapping-a-draggable-node-to-a-grid
  - /api/scenery/drag-listener
  - /api/phetcommon/model-view-transform
  - /patterns/model-view-separation
prerequisites:
  - /patterns/drag-listeners
---

# Grid-Snapping and Constrained-Dragging Pattern

[Drag Listeners](/patterns/drag-listeners) covers the baseline pattern: a listener writes a model `positionProperty`, converted through a `ModelViewTransform2`, and the view updates by observing that Property like any other. Constrained dragging — snapping to a grid, clamping to bounds, restricting motion to one axis — is not a different mechanism from that baseline; it's a transformation applied to the value *before* it's written to the model Property. This page is about *when* and *why* to reach for a constraint, not the mechanics of writing one (see [Snapping a Draggable Node to a Grid](/cookbook/snapping-a-draggable-node-to-a-grid) for the concrete recipe).

## Where a constraint hooks in

[`DragListener`](/api/scenery/drag-listener) (and, by extension, [`RichDragListener`](/api/scenery/rich-drag-listener), which shares the same drag options) accepts both a `dragBoundsProperty` for clamping to a `Bounds2`, and a `mapPosition` option — `( point: Vector2 ) => Vector2`, applied *before* `dragBoundsProperty` — for arbitrary transformations of the dragged model position, which is exactly the hook a grid-snap function plugs into. This is the same shape [`HSlider`'s `constrainValue` option](/api/sun/hslider) uses to let a slider snap to a grid of values instead of continuous ones — a grid-snap, an axis lock, and a bounds clamp are all the same kind of hook applied with a different transformation function, none of them requiring a different listener class or a departure from the ordinary [drag-listener](/patterns/drag-listeners) wiring.

## Why constrain dragging at all

| Constraint | Solves |
| --- | --- |
| Snap to a grid | The model has a natural discrete structure (a board game's cells, a periodic table slot, integer-only positions) where "anywhere in between" is not a meaningful or valid state |
| Clamp to bounds (`dragBoundsProperty`) | Keeps a draggable object reachable and recoverable — nothing draggable off the visible play area with no way back, part of the [Drag Listeners](/patterns/drag-listeners) checklist for a well-behaved draggable |
| Restrict to one axis | The underlying model quantity is genuinely one-dimensional (a single slider-like value, a position along a fixed path) even though the visual control might otherwise invite two-dimensional dragging |

The unifying principle: a constraint exists because the **model** has a restriction the raw pointer position doesn't know about — free-form pointer motion is inherently continuous and two-dimensional, and a constraint is how that gets reconciled with a model whose valid states are a smaller set (a grid, a range, a line). Adding a constraint is a model-driven decision, not a view polish choice — reach for it because the model's state genuinely only makes sense in discrete/bounded/one-dimensional terms, not merely because snapping "feels nice."

## Snapping happens in model coordinates

Because the constraint is really about what the *model* considers a valid value, snapping/clamping logic should operate on the model-coordinate value the drag listener is about to write — after the `transform` option has converted from view pixels — not on raw view pixels before conversion. Snapping in view pixels ties the grid spacing to the current zoom/scale of the `ModelViewTransform2` in use; snapping the model value keeps the grid spacing meaningful (e.g. "snap to every 0.5 meters") independent of how many view pixels currently represent that distance. See [Working with Model-View Transforms](/guides/working-with-model-view-transforms) for why the transform boundary is where conversions like this belong.

## What constrained dragging doesn't change

A constraint doesn't alter anything else about the drag-listener pattern: the listener still writes a model `Property`, the view still only observes it, `dragBoundsProperty` and a constraint transform can be combined freely (clamp to bounds *and* snap to a grid within them), and the [Drag Listeners](/patterns/drag-listeners) checklist — keyboard path, `cursor`, touch area dilation, `userControlledProperty` toggling — still applies unchanged. Constraining the value is strictly additive on top of that baseline, not a parallel pattern to learn separately.

::: tip Don't snap harder than the model needs
A constraint should match the model's actual granularity — snapping to a finer or coarser grid than the model's valid states actually have either loses precision the model supports, or invites values the model doesn't consider meaningful. If the model's valid positions are continuous and only the *view* wants a tidier look, reconsider whether a constraint is the right tool at all, versus a purely visual layout decision that never touches the dragged Property's value.
:::
