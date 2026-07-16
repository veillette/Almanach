---
title: ScatterPlot
description: Draws a dataset of points as filled circles on a bamboo chart.
category: api
library: bamboo
tags: [bamboo, ScatterPlot, chart, plot]
status: verified
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/line-plot
  - /api/bamboo/bar-plot
  - /api/bamboo/axis-nodes
  - /api/scenery/path
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ScatterPlot

`ScatterPlot` (from `scenerystack/bamboo`) renders a `Vector2[]` dataset as one filled circle per point, using a `ChartTransform` to convert each model point to a view position. It extends `scenerystack/scenery`'s `Path`, building a single `Shape` containing one `circle()` subpath per data point. Unlike `LinePlot`, its dataset has no `null`-gap convention — non-finite points (`NaN` or infinite components) are simply skipped and draw nothing.

```ts
import { ChartTransform, ScatterPlot } from 'scenerystack/bamboo';
import { Range, Vector2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 300,
  viewHeight: 300,
  modelXRange: new Range( 0, 10 ),
  modelYRange: new Range( 0, 10 )
} );

const dataSet = [];
for ( let i = 0; i < 50; i++ ) {
  dataSet.push( new Vector2( Math.random() * 10, Math.random() * 10 ) );
}

const scatterPlot = new ScatterPlot( chartTransform, dataSet, {
  radius: 3,
  fill: 'purple'
} );
```

<SceneryDemo demo="scatter-plot" />

## Constructor

```ts
new ScatterPlot( chartTransform: ChartTransform, dataSet: Vector2[], providedOptions?: ScatterPlotOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `2` | Radius of each plotted circle, in view coordinates |
| `fill` (inherited `PathOptions`) | `'black'` | Fill color of the circles |

## Methods

| Member | Description |
| --- | --- |
| `dataSet` | `Vector2[]` — public field. Mutate in place only if you also call `update()` yourself |
| `setDataSet( dataSet )` | Replaces the dataset and calls `update()` |
| `update()` | Recomputes the circles' `Shape` from the current `dataSet`, skipping non-finite points |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling `Path.dispose()` |

::: warning `fill` and `stroke` together can render incorrectly on overlapping points
Because all circles are packed into one `Shape` on a single `Path`, if you set both `fill` and `stroke` to different colors, overlapping points will not composite the way separate individually-stroked circles would (this is a known upstream limitation, not a configuration mistake). If your data can produce overlapping points and the visual difference matters, prefer a fill-only or stroke-only style, or lay out separate `Circle` nodes instead of `ScatterPlot`.
:::
