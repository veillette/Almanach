---
title: CanvasLinePlot
description: A Canvas-rendered equivalent of LinePlot, painted by a shared ChartCanvasNode for charts with too many points for per-point scenery Nodes to stay fast.
category: api
library: bamboo
tags: [bamboo, CanvasLinePlot, ChartCanvasNode, chart, plot, canvas, performance]
status: complete
prerequisites:
  - /api/bamboo/chart-transform
  - /api/bamboo/line-plot
related:
  - /api/bamboo/line-plot
  - /api/bamboo/area-plot
  - /api/bamboo/gridlines-and-tick-marks
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# CanvasLinePlot

`CanvasLinePlot` (from `scenerystack/bamboo`) draws the same kind of `(Vector2 | null)[]` dataset as [`LinePlot`](/api/bamboo/line-plot) — straight segments between consecutive points, with `null` entries creating gaps — but paints directly to a `CanvasRenderingContext2D` instead of building a scenery `Shape`/`Path`. It is **not** a `Node` itself: `CanvasLinePlot` extends the abstract `CanvasPainter` base class, and one or more painters are handed to a `ChartCanvasNode` (which *is* the actual scenery `Node`, extending `CanvasNode`) that iterates its `painters` array and calls each one's `paintCanvas()` on every repaint.

```ts
import { ChartTransform, ChartCanvasNode, CanvasLinePlot } from 'scenerystack/bamboo';
import { Range, Vector2 } from 'scenerystack/dot';
```

<SceneryDemo demo="canvas-line-plot" />

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( 0, 1000 ),
  modelYRange: new Range( -1, 1 )
} );

// 10,000 points -- too many for per-point scenery Nodes to stay responsive.
const dataSet: ( Vector2 | null )[] = [];
for ( let x = 0; x <= 1000; x += 0.1 ) {
  dataSet.push( new Vector2( x, Math.sin( x ) ) );
}

const canvasLinePlot = new CanvasLinePlot( chartTransform, dataSet, {
  stroke: 'blue',
  lineWidth: 1
} );

// The ChartCanvasNode is what actually gets added to the scene graph.
const chartCanvasNode = new ChartCanvasNode( chartTransform, [ canvasLinePlot ] );
```

## Constructor

```ts
new CanvasLinePlot( chartTransform: ChartTransform, dataSet: ( Vector2 | null )[], providedOptions?: CanvasLinePlotOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `stroke` | `'black'` | CSS color string or `Color`; validated with `Color.isCSSColorString()` when assertions are enabled |
| `lineWidth` | `1` | Stroke width in view (pixel) coordinates |
| `lineDash` | `[]` (solid) | Passed straight through to `context.setLineDash()` |

## Methods

| Member | Description |
| --- | --- |
| `dataSet` | `(Vector2 \| null)[]` — public field, read directly by `paintCanvas()`. Mutating it (or calling `setDataSet()`/`setStroke()`) does **not** trigger a repaint by itself |
| `setDataSet( dataSet )` | Replaces the dataset |
| `setStroke( stroke )` / `stroke` (setter) | Replaces the stroke |
| `paintCanvas( context )` | Called by the owning `ChartCanvasNode` on every repaint; walks `dataSet`, moving to the next point after each `null` and line-ing to it otherwise |
| `dispose()` | Marks the painter disposed; asserts if called twice |

::: warning You must call `update()` on the `ChartCanvasNode` yourself
Unlike `LinePlot`, which listens to `chartTransform.changedEmitter` and rebuilds its own `Shape` automatically, `CanvasLinePlot` has no such wiring — it's a passive painter, not a `Node`. `ChartCanvasNode` is the one that listens to `changedEmitter` and calls `this.invalidatePaint()` for *its own* size/transform changes, but if you mutate a painter's `dataSet`, `lineWidth`, `lineDash`, or call `setStroke()` after construction, you must call `update()` on the owning `ChartCanvasNode` yourself (or `setPainters()`, if you're also changing which painters it holds) — nothing does it for you.
:::

Reach for `CanvasLinePlot` (plus `ChartCanvasNode`) only once profiling shows a `LinePlot`'s per-point scenery drawable overhead is the bottleneck — typically datasets in the thousands-of-points range redrawn every frame. For anything smaller, `LinePlot`'s automatic redraw wiring and ordinary scenery `Path` semantics (hit testing, easy composition with other Nodes) are simpler to work with.
