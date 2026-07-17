---
title: FlowBox
description: A single-axis (row/column) auto-layout container.
category: api
library: scenery
tags: [scenery, FlowBox, HBox, VBox, layout]
status: verified
related:
  - /api/scenery/node
  - /api/scenery/grid-box
  - /api/scenery/align-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# FlowBox

`FlowBox` (from `scenerystack/scenery`) is a [`Node`](/api/scenery/node) that automatically positions its children along one axis (a row or a column), with configurable spacing, alignment, and wrapping — the scenery equivalent of a CSS flexbox with a single main axis. It re-runs layout whenever children are added/removed/reordered or resized, so you don't have to compute positions by hand. In practice, most code uses the fixed-orientation convenience subclasses `HBox` (`orientation: 'horizontal'`) and `VBox` (`orientation: 'vertical'`) instead of `FlowBox` directly.

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

Adding, removing, or reordering `row.children` afterward re-lays-out the remaining children automatically — no manual repositioning needed.

<SceneryDemo demo="flow-box" />

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `orientation` | `'horizontal'` | `'horizontal'` (row) or `'vertical'` (column) — fixed by `HBox`/`VBox` |
| `spacing` | `0` | Gap between adjacent children along the main axis |
| `lineSpacing` | `0` | Gap between wrapped lines, when `wrap: true` |
| `align` | `'center'` | Cross-axis alignment for children — for a horizontal `FlowBox`: `'top'`, `'bottom'`, `'center'`, or `'origin'`; for a vertical one: `'left'`, `'right'`, `'center'`, or `'origin'` |
| `stretch` | `false` | Whether children grow to fill the cross axis (requires the child to be resizable on that axis) |
| `grow` | `0` | How much a child should grow to fill leftover main-axis space, relative to other children's `grow` |
| `justify` | `'spaceBetween'` | How extra main-axis space is distributed, e.g. `'left'`/`'right'`/`'center'` (horizontal) or `'top'`/`'bottom'`/`'center'` (vertical), plus `'spaceBetween'`, `'spaceAround'`, `'spaceEvenly'` |
| `wrap` | `false` | Whether children flow onto additional lines instead of overflowing |
| `resize` | `true` | Whether the FlowBox keeps re-running layout after construction; set `false` and call `updateLayout()` manually for performance-sensitive cases |
| `forward` | `true` | If `false`, children are laid out in reverse order (useful for RTL locales via `forwardProperty`) |
| `margin` / `xMargin` / `yMargin` / `leftMargin` / `rightMargin` / `topMargin` / `bottomMargin` | `0` | Per-cell margins, settable box-wide or per-child via `layoutOptions` |
| `minContentWidth` / `minContentHeight` / `maxContentWidth` / `maxContentHeight` | — | Clamp the FlowBox's own content size |

Per-child overrides (`align`, `stretch`, `grow`, `margin`, …) can also be set on an individual child via that child's `layoutOptions`, taking precedence over the FlowBox-wide value:

```ts
someChild.layoutOptions = { grow: 1, stretch: true };
```

## Methods

| Method | Effect |
| --- | --- |
| `getCell( node )` | Returns the internal `FlowCell` tracking a given child, for advanced layout inspection |
| `updateLayout()` (via `constraint`) | Forces an immediate re-layout, useful when `resize: false` |
| `setForward( forward )` / `.forward` | Toggles child order, or bind `forwardProperty` to a locale/orientation `Property` |
| `dispose()` | Releases layout listeners; call this when discarding the box for good |

::: tip Reach for `HBox`/`VBox` first
`HBox` and `VBox` are `FlowBox` with `orientation` fixed to `'horizontal'`/`'vertical'` — use `FlowBox` directly only when the orientation itself needs to change at runtime.
:::

::: warning Per-child layout options live in `layoutOptions`, not on the child itself
Options like `align`, `grow`, `stretch`, and margins are consumed by the parent `FlowBox` from each child's `layoutOptions` object, not from options passed directly to the child's own constructor. Setting `someChild.align = 'center'` does nothing — set `someChild.layoutOptions = { align: 'center' }` instead (or pass `align` on the `FlowBox` itself to apply it to every child).
:::
