---
title: HBox
description: A FlowBox convenience subclass fixed to horizontal orientation, for laying children out in a row.
category: api
library: scenery
tags: [scenery, HBox, VBox, FlowBox, layout]
status: verified
related:
  - /api/scenery/flow-box
  - /api/scenery/v-box
  - /api/scenery/grid-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/flow-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HBox

`HBox` (from `scenerystack/scenery`) is [`FlowBox`](/api/scenery/flow-box) with `orientation` fixed to `'horizontal'` — it lays its children out left-to-right in a single row. Like [`VBox`](/api/scenery/v-box), it's the class most code reaches for instead of `FlowBox` directly, since orientation rarely changes at runtime; `HBox` accepts every `FlowBox` option (`spacing`, `align`, `stretch`, `grow`, `justify`, `wrap`, margins, …) except `orientation`, which the constructor sets for you and asserts you didn't also pass.

```ts
import { HBox, Circle, Rectangle } from 'scenerystack/scenery';

const row = new HBox( {
  spacing: 10,
  align: 'center',
  children: [
    new Circle( 15, { fill: 'crimson' } ),
    new Rectangle( 0, 0, 40, 30, { fill: 'teal' } ),
    new Circle( 10, { fill: 'goldenrod' } )
  ]
} );
```

For a vertical (column) layout, use [`VBox`](/api/scenery/v-box) instead; for the full option table (spacing, alignment, growth, wrapping, margins) see [`FlowBox`](/api/scenery/flow-box), which documents everything `HBox` inherits.

## Options and methods

`HBoxOptions` is `FlowBoxOptions` with `orientation` omitted — every option and method documented on [`FlowBox`](/api/scenery/flow-box) (`spacing`, `align`, `grow`, `justify`, `wrap`, `getCell()`, `dispose()`, …) applies here unchanged, just fixed to a horizontal main axis. For a row layout, `align` takes the vertical-alignment values (`'top'`, `'bottom'`, `'center'`, `'origin'`) since it controls cross-axis (vertical) placement of each child.

::: warning Use `VSeparator`, not `HSeparator`, to divide an `HBox`
`HBox` asserts against inserting an `HSeparator` child — a *horizontal* dividing line makes no sense between columns laid out *horizontally*. Use `VSeparator` (a vertical rule, also from `scenerystack/scenery`) to visually divide sections of an `HBox`; `HSeparator` is for dividing rows inside a [`VBox`](/api/scenery/v-box) instead.
:::
