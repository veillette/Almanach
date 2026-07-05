---
title: AreaPlot
description: Renders a dataset as a filled, shaded region between the data and a baseline value on a bamboo chart.
category: api
library: bamboo
tags: [bamboo, AreaPlot, chart, plot]
status: complete
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/line-plot
  - /api/bamboo/bar-plot
  - /api/bamboo/scatter-plot
  - /api/bamboo/axis-nodes
  - /api/scenery/path
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AreaPlot

`AreaPlot` (from `scenerystack/bamboo`) combines the look of a [`LinePlot`](/api/bamboo/line-plot) with the shading of a [`BarPlot`](/api/bamboo/bar-plot): it renders a `(Vector2 | null)[]` dataset as a filled region bounded above by the line through the data and below by a horizontal `baseline` value. It extends `scenerystack/scenery`'s `Path`, rebuilding its `Shape` whenever the dataset, `baseline`, or the chart transform changes. As with `LinePlot`, a `null` entry in the dataset closes off the current shaded region and starts a new one on the next non-null point, rather than plotting a point at the origin.

```ts
import { ChartTransform, AreaPlot } from 'scenerystack/bamboo';
import { Range, Vector2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( 0, 10 ),
  modelYRange: new Range( -1, 1 )
} );

const dataSet: ( Vector2 | null )[] = [];
for ( let x = 0; x <= 10; x += 0.1 ) {
  dataSet.push( new Vector2( x, Math.sin( x ) ) );
}

const areaPlot = new AreaPlot( chartTransform, dataSet, {
  baseline: 0,
  fill: 'rgba(0,100,255,0.4)'
} );
```

## Constructor

```ts
new AreaPlot( chartTransform: ChartTransform, dataSet: ( Vector2 | null )[], providedOptions?: AreaChartOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `baseline` | `0` | The y-value (in model coordinates) that forms the foundation of the shaded region — each shaded run of points is closed by dropping straight down to this value at its first and last x |
| `fill` (inherited `PathOptions`) | `'black'` | Fill color of the shaded region |

## Methods

| Member | Description |
| --- | --- |
| `dataSet` | `(Vector2 \| null)[]` — public field. Safe to read directly; if you mutate it in place, you're responsible for calling `update()` yourself |
| `baseline` | `number` — public field, mirrors the `baseline` option. Same caveat as `dataSet` if mutated directly |
| `setDataSet( dataSet )` | Replaces the dataset and immediately calls `update()` |
| `setBaseline( baseline )` | Replaces the baseline and immediately calls `update()` |
| `update()` | Recomputes the shaded `Shape` from the current `dataSet` and `baseline`; called automatically on construction and whenever the `ChartTransform`'s `changedEmitter` fires |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling `Path.dispose()` |

::: tip Each run of non-null points closes independently at the baseline
`AreaPlot` walks the dataset and, on hitting a `null` (or the end of the array), draws a line straight down to `baseline` at the last point's x-coordinate and closes that subpath — then starts a fresh shaded region at the next non-null point. This is what makes `null` entries produce separate shaded islands rather than one continuous fill with a hole punched through the gap, and it's the same convention `LinePlot` uses for line segments, just with an extra close-to-baseline step.
:::
