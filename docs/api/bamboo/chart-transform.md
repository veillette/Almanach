---
title: ChartTransform
description: Maps chart data between model coordinates and view (pixel) coordinates, and is the shared object every bamboo plot and axis is built around.
category: api
library: bamboo
tags: [bamboo, ChartTransform, coordinates, chart]
status: complete
related:
  - /api/bamboo/line-plot
  - /api/bamboo/bar-plot
  - /api/bamboo/scatter-plot
  - /api/bamboo/axis-nodes
  - /api/dot/range
  - /api/dot/vector2
  - /patterns/dispose-and-memory-management
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ChartTransform

`ChartTransform` (from `scenerystack/bamboo`) is a plain (non-`Node`) object that defines a chart's model-coordinate ranges (`modelXRange`, `modelYRange`) and view-coordinate size (`viewWidth`, `viewHeight`), and converts between the two. Every bamboo rendering primitive — `LinePlot`, `BarPlot`, `ScatterPlot`, `ChartRectangle`, `AxisLine`/`AxisArrowNode`, grid and tick sets — takes a `ChartTransform` in its constructor and listens to its `changedEmitter` so the whole chart redraws together when the transform changes (e.g. on a resize or a pan/zoom).

```ts
import { ChartTransform, ChartRectangle, LinePlot } from 'scenerystack/bamboo';
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

// ChartRectangle gives the chart a visible background/border sized to the transform.
const chartRectangle = new ChartRectangle( chartTransform, {
  fill: 'white',
  stroke: 'black'
} );

const dataSet = [];
for ( let x = 0; x <= 10; x += 0.1 ) {
  dataSet.push( new Vector2( x, Math.sin( x ) ) );
}
const linePlot = new LinePlot( chartTransform, dataSet, { stroke: 'blue' } );

// Later, e.g. on a layout resize:
chartTransform.setViewWidth( 600 );
// -> chartRectangle and linePlot both redraw automatically via changedEmitter.
```

## Constructor

```ts
new ChartTransform( providedOptions?: ChartTransformOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `viewWidth` | `100` | Width of the chart in view (pixel) coordinates |
| `viewHeight` | `100` | Height of the chart in view (pixel) coordinates |
| `modelXRange` | `new Range( -1, 1 )` | Range of the x axis, in model coordinates |
| `modelYRange` | `new Range( -1, 1 )` | Range of the y axis, in model coordinates |
| `modelXRangeInverted` | `false` | Flips which view edge corresponds to `modelXRange.min` |
| `modelYRangeInverted` | `false` | Flips which view edge corresponds to `modelYRange.min` |
| `xTransform` | identity `Transform1` | Nonlinear model-to-view scaling function for x (e.g. for a log axis), applied before the linear view-range mapping |
| `yTransform` | identity `Transform1` | Nonlinear model-to-view scaling function for y |

## Methods

| Member | Description |
| --- | --- |
| `modelToView( orientation, value )` / `modelToViewX/Y( value )` | Converts a scalar model coordinate to a view coordinate along the given `Orientation` (`scenerystack/phet-core`) |
| `modelToViewXY( x, y )` / `modelToViewPosition( Vector2 )` | Converts a model point to a view `Vector2` |
| `modelToViewDelta/DeltaX/DeltaY/DeltaXY` | Converts a model-space *delta* (not an absolute position) to view space |
| `viewToModel*` | The inverse of each `modelToView*` method |
| `setViewWidth( w )` / `setViewHeight( h )` | Updates the view size and fires `changedEmitter` if it actually changed |
| `setModelXRange( range )` / `setModelYRange( range )` | Updates a model range and fires `changedEmitter` if it actually changed |
| `setXTransform( transform )` / `setYTransform( transform )` | Swaps the nonlinear scaling function for an axis |
| `getModelRange( orientation )` | Returns `modelXRange` or `modelYRange` for the given orientation |
| `forEachSpacing( orientation, spacing, origin, clippingType, callback )` | Iterates evenly-spaced model/view coordinate pairs across a range — what `TickMarkSet`/`GridLineSet` use internally |
| `changedEmitter` | `TEmitter` — fires whenever any dimension, range, or transform changes; plots/axes/grids listen to this to know when to redraw |
| `dispose()` | Disposes `changedEmitter` |

::: warning Mutate through the setters, not the public fields
`viewWidth`, `modelXRange`, etc. are public fields (readable directly, e.g. by a plot's `update()`), but they are also directly *writable* — assigning `chartTransform.viewWidth = 600` will **not** fire `changedEmitter`, so nothing downstream redraws. Always go through `setViewWidth()`, `setModelXRange()`, `setXTransform()`, and friends when changing a `ChartTransform` after construction.
:::
