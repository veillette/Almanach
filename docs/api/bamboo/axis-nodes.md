---
title: AxisLine and AxisArrowNode
description: Draws a bamboo chart's x or y axis as a plain line or an arrow-tipped line, positioned and auto-hidden by a ChartTransform.
category: api
library: bamboo
tags: [bamboo, AxisLine, AxisArrowNode, chart, axis]
status: verified
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/line-plot
  - /api/bamboo/bar-plot
  - /api/bamboo/scatter-plot
  - /api/scenery/line
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AxisLine and AxisArrowNode

Bamboo has no single `AxisNode` — instead, `scenerystack/bamboo` exports two interchangeable axis-drawing Nodes, both driven by a `ChartTransform` plus an `Orientation` (`scenerystack/phet-core`) saying which axis they represent:

- **`AxisLine`** extends `scenerystack/scenery`'s `Line` — a plain stroked line, no arrowheads.
- **`AxisArrowNode`** extends `scenerystack/scenery-phet`'s `ArrowNode` — the same idea, but double-headed by default, for charts that want to emphasize the axis extending indefinitely.

Both reposition themselves whenever the chart transform changes, and both auto-hide (`setVisible( false )`) when their position would fall outside the transform's current view bounds — so an axis pinned at, say, `x = 0` disappears cleanly if the visible model range pans away from zero.

```ts
import { ChartTransform, AxisLine, AxisArrowNode, ChartRectangle } from 'scenerystack/bamboo';
import { Orientation } from 'scenerystack/phet-core';
import { Range } from 'scenerystack/dot';
```

<SceneryDemo demo="axis-arrow-node" />

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( -5, 5 ),
  modelYRange: new Range( -1, 1 )
} );

const chartRectangle = new ChartRectangle( chartTransform, { stroke: 'gray' } );

// A vertical AxisLine (the "y axis"), positioned at model x = 0.
const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, {
  value: 0
} );

// A horizontal AxisArrowNode (the "x axis"), positioned at model y = 0.
const xAxis = new AxisArrowNode( chartTransform, Orientation.HORIZONTAL, {
  value: 0
} );
```

## Constructors

```ts
new AxisLine( chartTransform: ChartTransform, axisOrientation: Orientation, providedOptions?: AxisLineOptions )
new AxisArrowNode( chartTransform: ChartTransform, axisOrientation: Orientation, providedOptions?: AxisArrowNodeOptions )
```

## Options

| Option | `AxisLine` default | `AxisArrowNode` default | Effect |
| --- | --- | --- | --- |
| `value` | `0` | `0` | The position of the axis, in model coordinates **on the opposite axis** from `axisOrientation` (see tip below) |
| `extension` | `0` | `20` | How far past the `ChartRectangle`'s edge (in view coordinates) the line/arrow is drawn |
| `stroke` / `lineWidth` (`AxisLine`, from `LineOptions`) | `'black'` / `2` | — | Line styling |
| `doubleHead` / `headHeight` / `headWidth` / `tailWidth` (`AxisArrowNode`, from `ArrowNodeOptions`) | — | `true` / `10` / `10` / `2` | Arrowhead styling |

## Methods

Both classes share the same shape: they recompute their geometry in a private `update()` (called on construction and on every `chartTransform.changedEmitter` firing), and expose only:

| Member | Description |
| --- | --- |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling the superclass's `dispose()` |

::: tip `value` is a coordinate on the *opposite* axis
For a `VERTICAL` `AxisLine`/`AxisArrowNode` (a vertical line representing the "y axis"), `value` is an **x** model coordinate — it's where that vertical line crosses the horizontal axis. Symmetrically, a `HORIZONTAL` axis's `value` is a **y** model coordinate. This is why the default `value: 0` conventionally draws each axis through the origin, and why changing `value` moves the axis sideways/vertically rather than stretching it.
:::
