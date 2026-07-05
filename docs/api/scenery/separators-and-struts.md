---
title: HSeparator, VSeparator, HStrut, and VStrut
description: Small layout-helper Nodes for adding a visible dividing line or invisible fixed-size gap inside a FlowBox/VBox/HBox.
category: api
library: scenery
tags: [scenery, HSeparator, VSeparator, HStrut, VStrut, Separator, FlowBox, layout]
status: complete
related:
  - /api/scenery/spacer
  - /api/scenery/flow-box
  - /api/scenery/v-box
  - /api/scenery/h-box
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HSeparator, VSeparator, HStrut, and VStrut

These four small `Node` subclasses (all from `scenerystack/scenery`) exist to be dropped directly into a layout container's `children` array as spacing helpers, rather than being positioned by hand: `HSeparator`/`VSeparator` draw a thin dividing line that automatically stretches to fill the container's cross-axis width/height, while `HStrut`/`VStrut` draw nothing and simply reserve a fixed amount of space along one axis. Both pairs are meant to read clearly at the call site — "put a divider here" or "put a fixed gap here" — inside a [`FlowBox`](/api/scenery/flow-box), [`VBox`](/api/scenery/v-box), or [`HBox`](/api/scenery/h-box).

```ts
import { VBox, HSeparator, Text, HBox, HStrut, Circle } from 'scenerystack/scenery';

const menu = new VBox( {
  align: 'left',
  spacing: 4,
  children: [
    new Text( 'Option A' ),
    new Text( 'Option B' ),
    new HSeparator(),      // a full-width horizontal rule between the groups
    new Text( 'Option C' )
  ]
} );

const row = new HBox( {
  spacing: 4,
  children: [
    new Circle( 10, { fill: 'crimson' } ),
    new HStrut( 40 ),      // a fixed 40px gap, wider than `spacing` alone
    new Circle( 10, { fill: 'teal' } )
  ]
} );
```

## `HSeparator` and `VSeparator`

`new HSeparator( options? )` and `new VSeparator( options? )` are both `Line` subclasses (via a shared internal `Separator` base) that default to a dark gray `stroke` (`'rgb(100,100,100)'`) and set `layoutOptions: { stretch: true, isSeparator: true }`. `HSeparator` draws a horizontal line and grows to fill the *width* offered by its parent's layout constraint (for use inside a vertical container like `VBox`); `VSeparator` draws a vertical line and grows to fill *height* (for use inside a horizontal container like `HBox`). `SeparatorOptions` is `LineOptions` minus `tandem` — separators are purely presentational and are not PhET-iO instrumented.

The `isSeparator: true` layout flag is what makes separators special inside `FlowBox`-based containers (`VBox`/`HBox`): a separator that would end up first, last, or immediately adjacent to another separator in the visible layout order is automatically hidden, so toggling the visibility of surrounding items never leaves a dangling or doubled-up divider line.

## `HStrut` and `VStrut`

`HStrut` and `VStrut` are thin [`Spacer`](/api/scenery/spacer) subclasses — `new HStrut( width, options? )` is exactly `new Spacer( width, 0, options )`, and `new VStrut( height, options? )` is exactly `new Spacer( 0, height, options )`. Like `Spacer`, they draw nothing and can never have children; they exist purely so a layout container sees reserved space of the given size. `HStrutOptions`/`VStrutOptions` are just `SpacerOptions` (in turn just `NodeOptions`) — there's no strut-specific option beyond the constructor's single dimension argument. See [Spacer](/api/scenery/spacer) for the full details these two thin wrappers build on.

## Choosing between them

| Need | Use |
| --- | --- |
| A visible dividing line, full-width/height, that auto-hides at the edges | `HSeparator` / `VSeparator` |
| An invisible, fixed-size gap along one axis, larger or smaller than the container's uniform `spacing` | `HStrut` / `VStrut` |
| An invisible, fixed-size rectangular block (both dimensions) | [`Spacer`](/api/scenery/spacer) directly |

::: tip Separators only auto-hide inside FlowBox-based containers
The "hide at the edges / hide when adjacent to another separator" behavior comes from `isSeparator` being read by `FlowBox`'s layout constraint (which `VBox`/`HBox` both use). An `HSeparator`/`VSeparator` placed outside of a `FlowBox`-family container is just a `Line` with default styling — it stretches via `localPreferredWidthProperty`/`localPreferredHeightProperty` only when a layout container actually provides a preferred size.
:::
