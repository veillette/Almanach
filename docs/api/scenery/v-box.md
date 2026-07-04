---
title: VBox
description: A FlowBox convenience subclass fixed to vertical orientation, for stacking children in a column.
category: api
library: scenery
tags: [scenery, VBox, HBox, FlowBox, layout]
status: verified
related:
  - /api/scenery/flow-box
  - /api/scenery/h-box
  - /api/scenery/grid-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/flow-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# VBox

`VBox` (from `scenerystack/scenery`) is [`FlowBox`](/api/scenery/flow-box) with `orientation` fixed to `'vertical'` — it stacks its children top-to-bottom in a single column. It's the class most code reaches for instead of `FlowBox` directly, since orientation rarely needs to change at runtime; `VBox` accepts every `FlowBox` option (`spacing`, `align`, `stretch`, `grow`, `justify`, `wrap`, margins, …) except `orientation`, which the constructor sets for you and asserts you didn't also pass.

```ts
import { VBox, Circle, Rectangle } from 'scenerystack/scenery';

const column = new VBox( {
  spacing: 8,
  align: 'center',
  children: [
    new Circle( 15, { fill: 'crimson' } ),
    new Rectangle( 0, 0, 40, 30, { fill: 'teal' } ),
    new Circle( 10, { fill: 'goldenrod' } )
  ]
} );
```

For a horizontal (row) layout, use [`HBox`](/api/scenery/h-box) instead; for the full option table (spacing, alignment, growth, wrapping, margins) see [`FlowBox`](/api/scenery/flow-box), which documents everything `VBox` inherits.

## Options and methods

`VBoxOptions` is `FlowBoxOptions` with `orientation` omitted — every option and method documented on [`FlowBox`](/api/scenery/flow-box) (`spacing`, `align`, `grow`, `justify`, `wrap`, `getCell()`, `dispose()`, …) applies here unchanged, just fixed to a vertical main axis. For a vertical stack, `align` takes the horizontal-alignment values (`'left'`, `'right'`, `'center'`, `'origin'`) since it controls cross-axis (horizontal) placement of each row.

::: warning Use `HSeparator`, not `VSeparator`, to divide a `VBox`
`VBox` asserts against inserting a `VSeparator` child — a *vertical* dividing line makes no sense between rows stacked *vertically*. Use `HSeparator` (a horizontal rule, also from `scenerystack/scenery`) to visually divide sections of a `VBox`; `VSeparator` is for dividing columns inside an [`HBox`](/api/scenery/h-box) instead.
:::
