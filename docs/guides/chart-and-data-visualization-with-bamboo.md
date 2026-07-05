---
title: Chart and Data Visualization with Bamboo
description: Subsystem overview of bamboo - the ChartTransform every plot shares, the family of Plot Node types built on it, and axis/gridline decoration.
category: guides
tags: [bamboo, chart, data-visualization, ChartTransform]
status: complete
related:
  - /api/bamboo/chart-transform
  - /api/bamboo/line-plot
  - /api/bamboo/bar-plot
  - /api/bamboo/scatter-plot
  - /api/bamboo/area-plot
  - /api/bamboo/linear-equation-plot
  - /api/bamboo/axis-nodes
  - /api/bamboo/gridlines-and-tick-marks
  - /api/bamboo/canvas-line-plot
  - /guides/performance-and-profiling
  - /patterns/dispose-and-memory-management
prerequisites:
  - /guides/scenery-basics
  - /api/bamboo/chart-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Chart and Data Visualization with Bamboo

`bamboo` (`scenerystack/bamboo`) is SceneryStack's charting library — it renders datasets as line/bar/scatter/area plots, draws axes and gridlines, and does it all through one shared coordinate object every piece of a chart is built around. This page is a subsystem-level tour of how the pieces fit together; each linked API page documents one class in depth.

## ChartTransform: the object everything else is built on

Every bamboo Node — every plot type, every axis, every gridline set — takes a [`ChartTransform`](/api/bamboo/chart-transform) in its constructor and rebuilds itself whenever that transform's `changedEmitter` fires. `ChartTransform` is not itself a `Node` — it's a plain object holding the chart's model-coordinate ranges (`modelXRange`, `modelYRange`) and view-coordinate size (`viewWidth`, `viewHeight`), plus the conversion math between the two:

```ts
import { ChartTransform, ChartRectangle, LinePlot, AxisArrowNode } from 'scenerystack/bamboo';
import { Orientation } from 'scenerystack/phet-core';
import { Range, Vector2 } from 'scenerystack/dot';

const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( 0, 10 ),
  modelYRange: new Range( -1, 1 )
} );

const chartRectangle = new ChartRectangle( chartTransform, { stroke: 'gray' } );
const xAxis = new AxisArrowNode( chartTransform, Orientation.HORIZONTAL );

const dataSet: ( Vector2 | null )[] = [];
for ( let x = 0; x <= 10; x += 0.1 ) {
  dataSet.push( new Vector2( x, Math.sin( x ) ) );
}
const linePlot = new LinePlot( chartTransform, dataSet, { stroke: 'blue' } );

// A resize (or panning/zooming the chart) is one call, and every attached Node redraws together.
chartTransform.setViewWidth( 600 );
```

This is the single most important thing to internalize about bamboo: **a chart is a loose collection of independent Nodes that happen to share one `ChartTransform`**, not one monolithic "Chart" class you configure. Adding a second plot type to the same chart is just constructing another Node against the same `chartTransform` — there's no chart-level API to register plots with.

## The plot Node family

Each plot type is a distinct `Node` subclass specialized for one data shape — pick based on what the dataset actually represents, not by look alone:

| Plot | Dataset shape | Use it for |
| --- | --- | --- |
| [`LinePlot`](/api/bamboo/line-plot) | `(Vector2 \| null)[]`, connected by straight segments | A sampled continuous function or time series; `null` entries create gaps for missing/discontinuous data |
| [`AreaPlot`](/api/bamboo/area-plot) | Same shape as `LinePlot` | The same kind of data as `LinePlot`, shaded down to a baseline — cumulative quantities, or emphasizing magnitude rather than just the curve's shape |
| [`BarPlot`](/api/bamboo/bar-plot) | `Vector2[]`, one bar per point, numeric x only | Discrete quantities at discrete x-values, growing from a shared baseline |
| [`ScatterPlot`](/api/bamboo/scatter-plot) | `Vector2[]`, one circle per point | Unconnected discrete data points — measurements, samples — where connecting them with lines would imply a relationship that isn't there |
| [`LinearEquationPlot`](/api/bamboo/linear-equation-plot) | A slope `m` and intercept `b`, no dataset at all | A reference/threshold/best-fit line spanning the chart's entire model range, not a curve through sampled points |

All five extend either `scenery`'s `Path` or `Node` and rebuild their drawn geometry in an internal `update()`, called on construction and whenever `chartTransform.changedEmitter` fires — so once a plot is constructed against a transform, updating the transform (a resize, a pan) or calling the plot's own `setDataSet()` is all that's needed to keep it visually correct; nothing needs to be manually re-laid-out.

## Axes and gridlines: decoration, not structure

[`AxisLine`/`AxisArrowNode`](/api/bamboo/axis-nodes) draw the x/y axis lines themselves (plain or arrow-tipped), and [`GridLineSet`, `TickMarkSet`, and `TickLabelSet`](/api/bamboo/gridlines-and-tick-marks) draw the repeating reference lines, tick marks, and numeric tick labels behind or alongside the data, all at a fixed model-coordinate spacing. All of these are, like the plots, independent Nodes constructed against the same `ChartTransform` — a chart with no axis or gridline Nodes at all is still a perfectly valid, if sparse, bamboo chart; they're additive decoration, not something a plot depends on to render correctly.

## Composing a full chart

A typical bamboo chart is a `Node` (or the `ScreenView` itself) with several bamboo Nodes as children, all built from one `ChartTransform`, layered in the usual scenery stacking order — background/gridlines first, data plots in the middle, axes and labels on top:

```ts
import { GridLineSet } from 'scenerystack/bamboo';

const verticalGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 1, {
  stroke: 'lightGray'
} );

const chartNode = new Node( {
  children: [
    chartRectangle,       // background + border
    verticalGridLines,    // reference gridlines, behind the data
    linePlot,             // the data itself
    xAxis                 // axis line/arrow on top
  ]
} );
```

Panning or zooming the whole chart is then a single `chartTransform.setModelXRange( newRange )` (or `setViewWidth`/`setViewHeight` for a resize) — every child Node listening to `changedEmitter` redraws itself in response, with no coordination code needed between them.

## Large datasets: CanvasLinePlot instead of LinePlot

Every plot type above extends an ordinary scenery `Path`/`Node`, which means a dataset large enough (many thousands of points, redrawn every frame) can start to show up as real overhead — one scenery drawable's bookkeeping cost, multiplied by every point. [`CanvasLinePlot`](/api/bamboo/canvas-line-plot) is bamboo's answer for that specific case: it paints the same kind of `(Vector2 | null)[]` dataset as `LinePlot`, but directly to a `CanvasRenderingContext2D` via a shared `ChartCanvasNode`, rather than building a scenery `Shape`. Reach for it only once profiling (see [Performance and Profiling](/guides/performance-and-profiling)) actually shows `LinePlot`'s per-point overhead as the bottleneck — for anything smaller, `LinePlot`'s automatic redraw wiring and ordinary `Path` semantics (hit-testing, easy composition with other Nodes) are simpler to work with.

::: tip Dispose a chart's Nodes the same as any dynamically-created view
Every bamboo Node holds a listener on its `ChartTransform`'s `changedEmitter`, which its own `dispose()` removes — but if a chart itself is created and destroyed dynamically (not for the sim's lifetime), the usual [Dispose and Memory Management](/patterns/dispose-and-memory-management) discipline still applies: dispose each plot/axis Node (and the `ChartTransform` itself, via its own `dispose()`) when the chart is torn down, the same as any other transient view.
:::

## Where to go next

- [ChartTransform](/api/bamboo/chart-transform) — the full API for the shared coordinate object this page is built around
- [LinePlot](/api/bamboo/line-plot), [BarPlot](/api/bamboo/bar-plot), [ScatterPlot](/api/bamboo/scatter-plot), [AreaPlot](/api/bamboo/area-plot), [LinearEquationPlot](/api/bamboo/linear-equation-plot) — the individual plot types
- [AxisLine and AxisArrowNode](/api/bamboo/axis-nodes) — axis decoration
- [GridLineSet, TickMarkSet, and TickLabelSet](/api/bamboo/gridlines-and-tick-marks) — gridline/tick decoration
- [CanvasLinePlot](/api/bamboo/canvas-line-plot) — the Canvas-painted variant for very large datasets
