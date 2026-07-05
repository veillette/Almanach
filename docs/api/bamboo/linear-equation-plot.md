---
title: LinearEquationPlot
description: Draws the straight line y = mx + b (or a vertical line, for infinite slope) across a bamboo chart's model x-range.
category: api
library: bamboo
tags: [bamboo, LinearEquationPlot, chart, plot]
status: complete
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/line-plot
  - /api/bamboo/gridlines-and-tick-marks
  - /api/bamboo/axis-nodes
  - /api/scenery/line
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LinearEquationPlot

`LinearEquationPlot` (from `scenerystack/bamboo`) renders the line described by a slope `m` and y-intercept `b` — `y = mx + b` — rather than a dataset of discrete points. Unlike [`LinePlot`](/api/bamboo/line-plot), which connects an array of `(Vector2 | null)` samples, `LinearEquationPlot` only needs the two numbers describing the equation: it extends `scenerystack/scenery`'s `Line` and recomputes its endpoints to span the chart transform's full `modelXRange` (or `modelYRange`, for a vertical line) whenever `m`, `b`, or the transform changes. Passing `m: Infinity` or `m: -Infinity` draws a vertical line instead of throwing, which is the idiomatic way to represent an undefined slope.

```ts
import { ChartTransform, LinearEquationPlot } from 'scenerystack/bamboo';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( -10, 10 ),
  modelYRange: new Range( -10, 10 )
} );

// y = 2x + 1, spanning the chart's full model x-range.
const linearEquationPlot = new LinearEquationPlot( chartTransform, 2, 1, {
  stroke: 'red',
  lineWidth: 2
} );

// A vertical line at x = 3.
const verticalLine = new LinearEquationPlot( chartTransform, Infinity, 3 );
```

## Constructor

```ts
new LinearEquationPlot( chartTransform: ChartTransform, m: number, b: number, providedOptions?: LinearEquationPlotOptions )
```

`m` is the slope (`Infinity`/`-Infinity` for a vertical line), and `b` is the y-intercept. `LinearEquationPlotOptions` adds no options of its own beyond whatever it inherits from `LineOptions` (e.g. `stroke`, `lineWidth`); `stroke` defaults to `'black'` and `lineWidth` defaults to `1`.

## Methods

| Member | Description |
| --- | --- |
| `m` (getter/setter) | The slope. Setting it calls `setSlope()`, which recomputes the endpoints |
| `setSlope( m )` | Replaces the slope and redraws |
| `b` (getter/setter) | The y-intercept. Setting it calls `setYIntercept()`, which recomputes the endpoints |
| `setYIntercept( b )` | Replaces the y-intercept and redraws |
| `solve( x )` | Returns `m * x + b` — the y-value the equation predicts for a given x, without touching the rendered line |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling `Line.dispose()` |

::: tip Use it for reference lines and fits, not for arbitrary curves
Because `LinearEquationPlot` always spans the transform's entire model range, it's a natural fit for things a dataset would be overkill for: a best-fit line overlaid on a `ScatterPlot`, a target/threshold line, or a y = x reference line. For anything that isn't representable as a single global slope and intercept — a curve, a piecewise function, or real sampled data — reach for [`LinePlot`](/api/bamboo/line-plot) instead.
:::
