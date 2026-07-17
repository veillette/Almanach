---
title: GridLineSet, TickMarkSet, and TickLabelSet
description: The three bamboo Path/Node sets that draw a chart's repeating gridlines, tick marks, and tick labels at a fixed model-coordinate spacing.
category: api
library: bamboo
tags: [bamboo, GridLineSet, TickMarkSet, TickLabelSet, chart, axis]
status: complete
prerequisites:
  - /api/bamboo/chart-transform
related:
  - /api/bamboo/chart-transform
  - /api/bamboo/axis-nodes
  - /api/bamboo/canvas-line-plot
  - /api/scenery/path
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GridLineSet, TickMarkSet, and TickLabelSet

`GridLineSet`, `TickMarkSet`, and `TickLabelSet` (all from `scenerystack/bamboo`) are the three repeating-decoration primitives every bamboo chart uses alongside [`ChartTransform`](/api/bamboo/chart-transform) and the [axis Nodes](/api/bamboo/axis-nodes): they draw evenly-spaced lines, tick marks, and tick labels respectively, all driven by the same `(chartTransform, axisOrientation, spacing)` triple. Internally, each one calls `chartTransform.forEachSpacing()` to walk the model/view coordinate pairs at that spacing and clipping behavior, then builds its `Shape` (or, for `TickLabelSet`, its `Text` children) from those pairs. All three listen to `changedEmitter` and redraw automatically.

```ts
import { ChartTransform, GridLineSet, TickMarkSet, TickLabelSet } from 'scenerystack/bamboo';
import { Orientation } from 'scenerystack/phet-core';
import { Range } from 'scenerystack/dot';
```

<SceneryDemo demo="grid-line-set" />

## A minimal example

```ts
const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( 0, 10 ),
  modelYRange: new Range( -1, 1 )
} );

// Vertical lines every 1 model unit along x.
const verticalGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 1, {
  stroke: 'lightGray'
} );

// Tick marks along the x axis (at model y = 0), every 1 unit.
const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 1, {
  edge: 'min'
} );

// Numeric labels below the x tick marks.
const xTickLabels = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, {
  edge: 'min'
} );
```

All three constructors share the same shape:

```ts
new GridLineSet( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number, providedOptions?: GridLineSetOptions )
new TickMarkSet( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number, providedOptions?: TickMarkSetOptions )
new TickLabelSet( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number, providedOptions?: TickLabelSetOptions )
```

`axisOrientation` is the axis the ticks/gridlines *progress along* — a `HORIZONTAL` set has ticks marching along x (at x=0,1,2,…), producing vertical gridlines; a `VERTICAL` set marches along y and produces horizontal gridlines. `spacing` is in model coordinates.

## Options

| Option | Applies to | Default | Effect |
| --- | --- | --- | --- |
| `value` | all three | `0` | Model coordinate on the *opposite* axis where the ticks/gridlines are positioned (mutually exclusive with `edge`) |
| `edge` | all three | `null` | `'min'` or `'max'` pins the ticks/gridlines to that edge of the chart instead of a `value` |
| `origin` | all three | `0` | Model-coordinate offset the spacing is measured from |
| `skipCoordinates` | `TickMarkSet`, `TickLabelSet` | `[]` | Model coordinates to skip — typically `[0]`, to avoid drawing a redundant tick where the axes cross |
| `extent` | `TickMarkSet`, `TickLabelSet` | `10` (`TickMarkSet.DEFAULT_EXTENT`) | Length of each tick mark in view coordinates (or, for `TickLabelSet`, the extent an implied tick would have, used only for label positioning) |
| `clippingType` | all three | `'strict'` | Rounding/clipping behavior for `ChartTransform.forEachSpacing()` — whether partially-out-of-range ticks are included |
| `createLabel` | `TickLabelSet` | `value => new Text( toFixed( value, 1 ), { fontSize: 12 } )` | Builds the label `Node` for a given model coordinate; returning `null` omits that label |
| `positionLabel` | `TickLabelSet` | positions below (`HORIZONTAL`) or to the left (`VERTICAL`) of the tick | Positions a created label relative to its tick's bounds |

## Methods

| Member | Description |
| --- | --- |
| `setSpacing( spacing )` / `getSpacing()` | Replaces the spacing (a no-op if unchanged) and recomputes; shared across all three |
| `getSpacingBorders()` | Returns the `Range` of model coordinates the current spacing/origin/clippingType actually produces ticks for; shared across all three |
| `setCreateLabel( createLabel )` | `TickLabelSet` only — swaps the label-creation function and calls `invalidateTickLabelSet()` |
| `invalidateTickLabelSet()` | `TickLabelSet` only — disposes every cached label and rebuilds, needed if `createLabel`'s *output* for an already-seen value should change (e.g. switching from numeric to symbolic labels) |
| `dispose()` | Removes the `chartTransform.changedEmitter` listener before calling the superclass's `dispose()` |

::: tip `TickLabelSet` caches label Nodes by model coordinate
`TickLabelSet` keeps a `Map` from model coordinate to the `Node` last built by `createLabel`, and reuses it across `update()` calls rather than reconstructing every label on every transform change — labels are only rebuilt when a coordinate scrolls out of range and a different one scrolls in. If `createLabel`'s logic depends on external state (not just the coordinate value), call `invalidateTickLabelSet()` after that state changes, or stale labels will stick around.
:::
