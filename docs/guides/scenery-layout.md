---
title: Scenery Layout
description: Overview of scenery's auto-layout system - FlowBox, GridBox, AlignBox, and layout options.
category: guides
tags: [scenery, layout, flow-box, grid-box]
status: complete
related:
  - /guides/scenery-basics
  - /guides/building-your-first-screen
  - /api/scenery/node
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Scenery Layout

Setting every child's `x`/`y` by hand works for a handful of Nodes but falls apart once content changes size dynamically (translated strings, resizable panels). Scenery's layout containers — `FlowBox`, `GridBox`, and `AlignBox` — solve this the way CSS flexbox/grid do: you describe *relationships* between children, and the container keeps positions correct as content changes.

## FlowBox: one-dimensional flow (like flexbox)

`FlowBox` lays children out in a single row or column, in `children` array order:

```ts
import { FlowBox, Rectangle, Text } from 'scenerystack/scenery';

const row = new FlowBox( {
  orientation: 'horizontal',
  spacing: 8,
  align: 'center',
  children: [
    new Rectangle( 0, 0, 20, 20, { fill: 'red' } ),
    new Text( 'Label', { font: '16px sans-serif' } ),
    new Rectangle( 0, 0, 20, 20, { fill: 'blue' } )
  ]
} );
```

| Option | Effect |
| --- | --- |
| `orientation` | `'horizontal'` or `'vertical'` — which axis children flow along |
| `spacing` | Gap between adjacent children |
| `align` | Cross-axis alignment: `'start'` / `'center'` / `'end'` / `'stretch'`, etc. |
| `justify` | Main-axis distribution: `'left'`/`'top'`, `'center'`, `'right'`/`'bottom'`, `'spaceBetween'`, `'spaceAround'`, `'spaceEvenly'` |
| `wrap` | Whether children wrap to a new line when they overflow the preferred size |
| `stretch` | Whether children stretch to fill the cross-axis by default |

`HBox` and `VBox` are `FlowBox` with `orientation` fixed to `'horizontal'`/`'vertical'` — reach for them when you never need to change orientation dynamically:

```ts
import { VBox } from 'scenerystack/scenery';

const column = new VBox( { spacing: 4, children: [ /* ... */ ] } );
```

A child can override its own contribution via `layoutOptions`, without the `FlowBox` needing to know about it:

```ts
someChild.layoutOptions = { grow: 1 }; // this child expands to absorb extra space
```

## GridBox: two-dimensional layout

`GridBox` positions children in a grid, either by nested `rows`/`columns` arrays or by giving each child explicit `layoutOptions`:

```ts
import { GridBox, Text } from 'scenerystack/scenery';

const grid = new GridBox( {
  xSpacing: 10,
  ySpacing: 6,
  rows: [
    [ new Text( 'Name' ), new Text( 'Value' ) ],
    [ new Text( 'Mass' ), new Text( '5 kg' ) ]
  ]
} );
```

| Option | Effect |
| --- | --- |
| `rows` | `Node[][]`, outer array is rows, inner array is that row's columns |
| `columns` | `Node[][]`, outer array is columns instead — use one or the other, not both |
| `xSpacing` / `ySpacing` | Gaps between columns / rows |
| `autoRows` / `autoColumns` | Auto-place a flat `children` array into a grid with a fixed number of rows/columns, instead of positioning explicitly |

## AlignBox: aligning within reserved space

`AlignBox` wraps a single child and gives it a fixed alignment inside a bounding box — commonly used to keep same-size content aligned across several sibling panels:

```ts
import { AlignBox, AlignGroup, Text } from 'scenerystack/scenery';

const group = new AlignGroup(); // shares one common size across boxes

const leftLabel = new AlignBox( new Text( 'Short' ), { group, xAlign: 'left' } );
const rightLabel = new AlignBox( new Text( 'A much longer label' ), { group, xAlign: 'left' } );
// Both AlignBoxes now report the same (largest) size to whatever lays them out.
```

| Option | Effect |
| --- | --- |
| `xAlign` / `yAlign` | `'left'\|'center'\|'right'\|'stretch'` and `'top'\|'center'\|'bottom'\|'stretch'` |
| `xMargin` / `yMargin` | Padding around the content inside the alignment box |
| `group` | An `AlignGroup` shared by multiple `AlignBox`es so they all report a common (max) size |

## Margins, shared across containers

`FlowBox` and `GridBox` cells both support per-child margin options — `xMargin`, `yMargin`, `leftMargin`, `rightMargin`, `topMargin`, `bottomMargin`, `minContentWidth`/`minContentHeight` — set either on the container (as a default) or per-child via `layoutOptions`.

::: tip Layout containers manage their children's transform — don't fight them
Once a `Node` is a child of a `FlowBox`/`GridBox`, that container sets its `x`/`y` every layout pass. Setting `translation` on the child directly afterwards is overwritten on the next layout update; adjust `spacing`, `align`, `layoutOptions`, or wrap the child in its own `Node` if you need an offset the container doesn't already model.
:::

## Where to go next

- [Building Your First Screen](/guides/building-your-first-screen) — laying out a `ScreenView`'s content with these containers
- [Scenery Basics](/guides/scenery-basics) — the Node tree and coordinate frames layout containers operate on
- [UI Components Overview](/guides/ui-components-overview) — `sun` components that are commonly composed inside `FlowBox`/`GridBox`
