---
title: GridBox
description: A two-dimensional grid auto-layout container.
category: api
library: scenery
tags: [scenery, GridBox, layout]
status: verified
related:
  - /api/scenery/node
  - /api/scenery/flow-box
  - /api/scenery/align-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/node
  - /api/scenery/flow-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GridBox

`GridBox` (from `scenerystack/scenery`) is a [`Node`](/api/scenery/node) that arranges its children in a two-dimensional grid of rows and columns, similar to CSS grid. Where [`FlowBox`](/api/scenery/flow-box) only handles one axis at a time, `GridBox` positions each child at an explicit `(row, column)` cell (or lets it auto-place), independently controlling per-column width and per-row height so everything lines up.

```ts
import { GridBox, Rectangle, Circle } from 'scenerystack/scenery';

const grid = new GridBox( {
  xSpacing: 10,
  ySpacing: 8,
  children: [
    new Rectangle( 0, 0, 40, 40, { fill: 'teal', layoutOptions: { column: 0, row: 0 } } ),
    new Circle( 20, { fill: 'crimson', layoutOptions: { column: 1, row: 0 } } ),
    new Rectangle( 0, 0, 90, 20, { fill: 'goldenrod', layoutOptions: { column: 0, row: 1, horizontalSpan: 2 } } )
  ]
} );
```

Each child's cell position and span are set through that child's `layoutOptions`, not through `GridBox` options — `GridBox` itself only configures grid-wide defaults (spacing, alignment, margins) and how auto-placement behaves.

## `GridBox`-level options

| Option | Default | Effect |
| --- | --- | --- |
| `rows` | — | Sets children all at once from a 2D `(Node \| null)[][]` (`rows[row][column]`); mutually exclusive with `children`/`columns` |
| `columns` | — | Same idea, transposed (`columns[column][row]`); mutually exclusive with `children`/`rows` |
| `autoRows` | `null` | When set, children auto-place into 1-column-wide cells, wrapping to a new column after this many rows |
| `autoColumns` | `null` | Same idea, wrapping to a new row after this many columns |
| `resize` | `true` | Whether the GridBox keeps re-running layout after construction |
| `spacing` | `0` | Shorthand for setting both `xSpacing` and `ySpacing` |
| `xSpacing` / `ySpacing` | `0` | Gap between columns / between rows |
| `xAlign` | `'center'` | Horizontal alignment within a cell: `'left'`, `'right'`, `'center'`, or `'origin'` |
| `yAlign` | `'center'` | Vertical alignment within a cell: `'top'`, `'bottom'`, `'center'`, or `'origin'` |
| `margin` / `xMargin` / `yMargin` / `leftMargin` / `rightMargin` / `topMargin` / `bottomMargin` | `0` | Per-cell margins, box-wide or overridable per child |
| `minContentWidth` / `minContentHeight` / `maxContentWidth` / `maxContentHeight` | — | Clamp the GridBox's own content size |

## Per-child `layoutOptions` (grid position)

These can **only** be set via a child's `layoutOptions`, not as `GridBox` constructor options:

| `layoutOptions` key | Effect |
| --- | --- |
| `column` | Zero-based column index for this child (leftmost column is `0`) |
| `row` | Zero-based row index for this child (topmost row is `0`) |
| `horizontalSpan` | Number of columns this child occupies (default `1`) |
| `verticalSpan` | Number of rows this child occupies (default `1`) |
| `xAlign` / `yAlign` / `xStretch` / `yStretch` / `xGrow` / `yGrow` / margins | Per-child overrides of the corresponding `GridBox`-level option |

## Methods

| Method | Effect |
| --- | --- |
| `setLines( orientation, lineArrays )` / `getLines( orientation )` | Programmatic equivalent of the `rows`/`columns` options, for reading or rewriting the whole grid at once |
| `dispose()` | Releases layout listeners |

::: tip Auto-placement vs. explicit placement
Use `autoRows`/`autoColumns` when children are added dynamically and you just want them to flow into a grid (like a tag list). Use explicit `layoutOptions.row`/`.column` (or the `rows`/`columns` constructor options) when the grid has a fixed, meaningful structure — the two approaches are mutually exclusive per the source's own `NOTE`s.
:::

::: warning `rows`/`columns` rewrites `layoutOptions` and replaces all children
Passing `rows` or `columns` mutates every listed child's `layoutOptions` to bake in its `(row, column)` position, and replaces the `GridBox`'s entire `children` list. Don't mix it with manually calling `addChild()`/`removeChild()` afterward without accounting for that; prefer `autoRows`/`autoColumns` or manual `layoutOptions` if you need to add/remove children incrementally.
:::
