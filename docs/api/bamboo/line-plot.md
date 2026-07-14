---
title: LinePlot
description: Draws a polyline through a dataset of points on a bamboo chart, with null entries producing gaps.
category: api
library: bamboo
tags: [bamboo, LinePlot, chart, plot]
status: verified
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/bar-plot
  - /api/bamboo/scatter-plot
  - /api/bamboo/axis-nodes
  - /api/scenery/path
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LinePlot

`LinePlot` (from `scenerystack/bamboo`) renders a dataset of `(Vector2 | null)[]` by connecting consecutive points with straight line segments, using a `ChartTransform` to convert each model-space point to view coordinates. It extends `scenerystack/scenery`'s `Path`, rebuilding its `Shape` whenever the dataset or the chart transform changes. A `null` entry breaks the line: `[ (0,0), (0,1), null, (0,2), (0,3) ]` draws two separate segments instead of three connected ones.

```ts
import { ChartTransform, LinePlot } from 'scenerystack/bamboo';
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

const linePlot = new LinePlot( chartTransform, dataSet, {
  stroke: 'blue',
  lineWidth: 2
} );
```

<SceneryDemo demo="line-plot" />

## Constructor

```ts
new LinePlot( chartTransform: ChartTransform, dataSet: ( Vector2 | null )[], providedOptions?: LinePlotOptions )
```

`LinePlotOptions` adds no options of its own beyond whatever it inherits from `PathOptions` (e.g. `stroke`, `lineWidth`, `lineDash`); `stroke` defaults to `'black'`.

## Methods

| Member | Description |
| --- | --- |
| `dataSet` | `( Vector2 \| null )[]` — public field. Safe to read directly; if you mutate it in place (rather than calling `setDataSet`), you're responsible for calling `update()` yourself |
| `setDataSet( dataSet )` | Replaces the dataset and immediately calls `update()` |
| `update()` | Recomputes the line's `Shape` from the current `dataSet`; called automatically on construction and whenever the `ChartTransform`'s `changedEmitter` fires |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling `Path.dispose()` |

::: tip `null` entries create gaps, not zero-value points
Each `null` in `dataSet` starts a new, disconnected subpath on the next non-null point — it does not plot a point at the origin. This is the standard way to represent missing data or a discontinuous function on a bamboo chart, and it's the main behavioral difference from `ScatterPlot`, whose `dataSet` has no such gap mechanism.
:::
