---
title: Hit-Testing and Picking
description: How scenery decides what a pointer is over, and the Node options that shape it.
category: api
library: scenery
tags: [scenery, Picker, pickable, mouse-area, touch-area, cursor, input]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/drag-listener
  - /api/scenery/fire-listener
  - /api/scenery/scenery-event
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Hit-Testing and Picking

Every `Node` internally owns a `Picker` (`scenerystack/scenery`, but never constructed directly — it's an implementation detail of `Node`) that decides whether a given point hits that Node's subtree, and caches enough bounds information to prune most of the scene graph before doing expensive per-shape containment checks. You won't call into `Picker` yourself, but its behavior is controlled entirely through Node options you *do* set directly: `pickable`, `mouseArea`, `touchArea`, and `cursor`.

```ts
import { Circle } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const smallTarget = new Circle( 6, {
  fill: 'red',
  cursor: 'pointer',
  // Expand the *touch* hit region well beyond the drawn 6px radius, without changing
  // how it looks or how mouse hit-testing behaves.
  touchArea: Shape.circle( 0, 0, 22 )
} );
```

## `pickable`: the tri-state that controls pruning

| Value | Meaning |
| --- | --- |
| `null` (default) | Pass-through: this subtree is only hit-tested if some ancestor or descendant is `pickable: true` or has an input listener attached |
| `false` | This Node and its entire subtree are pruned — nothing in it will ever be hit, receive events, or be picked, regardless of listeners |
| `true` | This subtree is never pruned for lacking a listener (it's always searched), except where a descendant sets `pickable: false` |

The practical rule: **you almost never need to set `pickable` explicitly.** Attaching an input listener (a [`FireListener`](/api/scenery/fire-listener), [`DragListener`](/api/scenery/drag-listener), etc.) already makes a Node's subtree includable in hit-testing. `pickable: false` is for the opposite case — a decorative overlay drawn on top of interactive content that should be visible but never intercept input, letting hits fall through to whatever is beneath it.

## `mouseArea` and `touchArea`

Both accept a `Shape` (see [kite `Shape`](/api/kite/shape)) or a `Bounds2`, in the Node's local coordinate frame, and completely replace the drawn shape for the purposes of hit-testing that input type — a mouse/touch position only counts as "over" the Node if it falls inside the given area, not the Node's actual painted region. This is the standard way to make small controls touch-friendly without changing how they look: dilate the touch area well past the visual bounds while leaving `mouseArea` unset (so precise mouse pointing still behaves normally).

## `cursor`

A CSS cursor string (or `null` to inherit from whatever's shown by default). `Node.getEffectiveCursor()` walks: this Node's own `cursor`, then any attached input listener's cursor (see `useInputListenerCursor` on [`PressListener`](/api/scenery/fire-listener)), falling through to ancestors if none is set — this is how a listener's `pressCursor` can force a specific cursor for the duration of a press even as the pointer moves off the original target.

::: tip `pickable: false` is not the same as `inputEnabled: false`
If you want a Node to still be "pickable" — showing a cursor, appearing as hovered/focused, participating in [interactive highlighting](/api/scenery/interactive-highlighting) — but not actually respond to input, use `inputEnabled: false` on the Node instead of `pickable: false`. `pickable: false` removes the subtree from hit-testing entirely (so nothing under it looks interactive either); `inputEnabled: false` only suppresses the *events* while leaving picking behavior alone.
:::
