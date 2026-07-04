---
title: Spacer
description: An invisible, childless Node that reserves a fixed rectangular area of layout space.
category: api
library: scenery
tags: [scenery, Spacer, layout, bounds]
status: verified
related:
  - /api/scenery/node
  - /api/scenery/flow-box
  - /api/scenery/grid-box
  - /api/scenery/v-box
  - /api/scenery/h-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Spacer

`Spacer` (from `scenerystack/scenery`) is a [`Node`](/api/scenery/node) that draws nothing and can never have children — it exists purely to occupy a fixed rectangular region of `[0, width] x [0, height]` in its own local coordinate frame, so a layout container that sees its `bounds` treats that region as reserved space. It's the scenery equivalent of a CSS empty spacer `<div>`: use it inside a [`FlowBox`](/api/scenery/flow-box)/[`GridBox`](/api/scenery/grid-box) to force a gap that isn't uniform `spacing`, or standalone to pad out a fixed layout.

```ts
import { Spacer, HBox, Circle } from 'scenerystack/scenery';

const row = new HBox( {
  spacing: 4,
  children: [
    new Circle( 10, { fill: 'crimson' } ),
    new Spacer( 40, 1 ),   // a 40-wide gap wider than `spacing` alone would give
    new Circle( 10, { fill: 'teal' } )
  ]
} );
```

## Constructor

`new Spacer( width, height, options? )` — `width` and `height` must both be finite numbers; they set `localBounds` to `Bounds2( 0, 0, width, height )` before any `options` (standard [`Node`](/api/scenery/node) options like `x`/`y`/`layoutOptions`) are applied via `mutate()`.

`SpacerOptions` is just `NodeOptions` — `Spacer` adds no options of its own beyond the `width`/`height` constructor arguments.

## `HStrut` and `VStrut`

`HStrut` and `VStrut` (also from `scenerystack/scenery`) are thin `Spacer` subclasses for the common one-dimensional case: `new HStrut( width, options? )` is exactly `new Spacer( width, 0, options )`, and `new VStrut( height, options? )` is exactly `new Spacer( 0, height, options )`. Reach for these when you only need to reserve space along one axis — e.g. a horizontal gap inside a [`VBox`](/api/scenery/v-box) — since the intent reads more clearly than a `Spacer` with an explicit `0`.

::: warning A Spacer can never have children
`Spacer` is built with scenery's `Leaf` mixin, which throws if you try to `addChild()` to it — it is always and only a leaf in the scene graph. If you need an invisible *container* (something that can hold other Nodes but isn't itself drawn), use a plain [`Node`](/api/scenery/node) with no visible content instead of `Spacer`.
:::
