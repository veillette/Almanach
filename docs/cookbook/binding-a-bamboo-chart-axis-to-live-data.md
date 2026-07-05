---
title: Binding a Bamboo Chart Axis to Live Model Data
description: Wiring a bamboo ChartTransform's modelXRange to a model Property so the visible range tracks live, growing data.
category: cookbook
tags: [bamboo, ChartTransform, LinePlot, NumberProperty, chart]
status: complete
related:
  - /api/bamboo/chart-transform
  - /api/bamboo/line-plot
  - /api/axon/number-property
prerequisites:
  - /api/bamboo/chart-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Binding a Bamboo Chart Axis to Live Model Data

**Task:** a chart plotting a value over time (a running sensor reading, an accumulating measurement) needs its visible x-axis range to keep up with the data as it grows, rather than being fixed to a static range decided at construction time — a "scrolling" or "auto-expanding" chart.

A [`ChartTransform`](/api/bamboo/chart-transform) is a plain object holding the chart's current model ranges; every bamboo rendering primitive listens to its `changedEmitter` and redraws automatically whenever a range changes. Binding the axis to live data is a matter of listening to the model `Property` that's actually changing (elapsed time, most recent x value) and calling `chartTransform.setModelXRange(...)` in response — never assigning `chartTransform.modelXRange` directly, since that skips the emitter that tells plots to redraw.

## The solution

```ts
import { ChartTransform, ChartRectangle, LinePlot } from 'scenerystack/bamboo';
import { Range, Vector2 } from 'scenerystack/dot';
import { NumberProperty } from 'scenerystack/axon';

const WINDOW_WIDTH = 10; // seconds of history visible at once

// --- model ---
const timeProperty = new NumberProperty( 0 ); // advances every step()
const dataSet: ( Vector2 | null )[] = [];

function step( dt: number ): void {
  timeProperty.value += dt;
  dataSet.push( new Vector2( timeProperty.value, Math.sin( timeProperty.value ) ) );

  // Keep the dataset from growing unboundedly - drop points that have
  // scrolled out of the visible window.
  while ( dataSet.length > 0 && dataSet[ 0 ] !== null && dataSet[ 0 ].x < timeProperty.value - WINDOW_WIDTH ) {
    dataSet.shift();
  }
}

// --- view ---
const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( 0, WINDOW_WIDTH ),
  modelYRange: new Range( -1, 1 )
} );

const chartRectangle = new ChartRectangle( chartTransform, { fill: 'white', stroke: 'black' } );
const linePlot = new LinePlot( chartTransform, dataSet, { stroke: 'blue' } );

// The x axis "scrolls": always showing the most recent WINDOW_WIDTH seconds.
timeProperty.link( time => {
  chartTransform.setModelXRange( new Range( time - WINDOW_WIDTH, time ) );
  linePlot.setDataSet( dataSet ); // dataSet was mutated in place in step(), above
} );
```

Every frame, `timeProperty`'s listener slides `modelXRange` forward to keep the most recent `WINDOW_WIDTH` seconds visible; `setModelXRange` fires `chartTransform.changedEmitter`, which `chartRectangle` and `linePlot` are both already listening to, so both redraw with no additional wiring. `linePlot.setDataSet(...)` is called separately since mutating the `dataSet` array in place doesn't itself trigger a redraw — only `setDataSet`/the transform's `changedEmitter` do.

## Auto-expanding instead of scrolling

For a chart that should keep the full history visible and simply widen as data accumulates (rather than scrolling a fixed-width window), grow `modelXRange`'s upper bound instead of sliding the whole window:

```ts
import { Orientation } from 'scenerystack/phet-core';

timeProperty.link( time => {
  const currentRange = chartTransform.getModelRange( Orientation.HORIZONTAL );
  if ( time > currentRange.max ) {
    chartTransform.setModelXRange( new Range( currentRange.min, time ) );
  }
} );
```

(`Orientation` here comes from `scenerystack/phet-core`, the same enum bamboo's axis Nodes use — see [AxisLine and AxisArrowNode](/api/bamboo/axis-nodes).)

## Options and methods used here

| Member | Effect |
| --- | --- |
| `setModelXRange( range )` | Updates the chart's x-axis model range and fires `changedEmitter` if it actually changed |
| `getModelRange( orientation )` | Reads back the current `modelXRange`/`modelYRange` |
| `changedEmitter` | What every plot/axis/grid listens to; you never need to call anything on the plots directly when only the transform changes |
| `LinePlot.setDataSet( dataSet )` | Replaces the dataset and immediately redraws — needed alongside `setModelXRange` since the two are independent triggers |

::: tip Trim the dataset, not just the visible range
Sliding `modelXRange` forward only changes what's *drawn* — an ever-growing `dataSet` array still keeps every point in memory and still costs time to iterate every redraw. For a genuinely long-running scrolling chart, drop points that have scrolled out of the window (as `step()` does above) rather than relying on the chart's clipping to hide the problem.
:::

::: warning Never assign `chartTransform.modelXRange = ...` directly
`modelXRange` is a plain public field, readable and directly writable — but assigning it directly does **not** fire `changedEmitter`, so `chartRectangle`/`linePlot`/any axis Nodes silently keep drawing the old range. Always go through `setModelXRange()` (or the equivalent setter for whichever dimension changed), exactly as called out on [ChartTransform](/api/bamboo/chart-transform#methods).
:::
