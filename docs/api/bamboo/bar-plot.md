---
title: BarPlot
description: Draws one rectangular bar per data point on a bamboo chart, growing from a shared baseline value.
category: api
library: bamboo
tags: [bamboo, BarPlot, chart, plot]
status: verified
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/line-plot
  - /api/bamboo/scatter-plot
  - /api/bamboo/axis-nodes
  - /api/scenery/rectangle
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BarPlot

`BarPlot` (from `scenerystack/bamboo`) shows numerical data (an x-value plus a height) as one `Rectangle` per point, extending `scenerystack/scenery`'s `Node` rather than `Path` since it manages a pool of child `Rectangle`s instead of a single `Shape`. Each bar's tail sits at a shared `barTailValue` (the baseline, e.g. `y = 0`) and its tip is the data point itself, so bars can grow up or down from the baseline. It only supports numeric x-values — not categorical data.

```ts
import { ChartTransform, BarPlot } from 'scenerystack/bamboo';
import { Range, Vector2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 300,
  viewHeight: 200,
  modelXRange: new Range( 0, 5 ),
  modelYRange: new Range( 0, 10 )
} );

const dataSet = [
  new Vector2( 0, 3 ),
  new Vector2( 1, 7 ),
  new Vector2( 2, 5 ),
  new Vector2( 3, 9 ),
  new Vector2( 4, 2 )
];

const barPlot = new BarPlot( chartTransform, dataSet, {
  barWidth: 20,
  pointToPaintableFields: point => ( { fill: point.y > 5 ? 'orange' : 'gray' } )
} );
```

<SceneryDemo demo="bar-plot" />

## Constructor

```ts
new BarPlot( chartTransform: ChartTransform, dataSet: Vector2[], providedOptions?: BarPlotOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `barWidth` | `10` | Width of each bar, in view coordinates |
| `barTailValue` | `0` | The model-coordinate baseline each bar's tail is drawn from |
| `pointToPaintableFields` | `() => ({ fill: 'black' })` | Maps a data point to `PaintableOptions` (e.g. `{ fill, stroke }`) applied to that bar's `Rectangle` |

## Methods

| Member | Description |
| --- | --- |
| `dataSet` | `Vector2[]` — public field. Mutate in place only if you also call `update()` yourself |
| `rectangles` | `Rectangle[]` — the current child rectangles, one per data point, kept in sync by `update()` |
| `setDataSet( dataSet )` | Replaces the dataset and calls `update()` |
| `update()` | Adds/removes `Rectangle` children to match `dataSet.length`, repositions/resizes each one from the chart transform, and re-applies `pointToPaintableFields` |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling `Node.dispose()` |

::: warning `pointToPaintableFields` is restricted to paintable keys
`update()` asserts that every key returned by `pointToPaintableFields` is one of the `Rectangle`'s default paintable options (`fill`, `stroke`, and similar) before calling `.mutate()` with it — this guards against accidentally passing an option (like `children` or a layout option) that would be unsafe to `mutate()` onto an internally-managed `Rectangle`. Stick to fill/stroke-style fields.
:::
