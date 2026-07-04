---
title: RulerNode
description: A ruler graphic with major/minor tick marks and a units label, for measurement-style interactions.
category: api
library: scenery-phet
tags: [scenery-phet, RulerNode, ruler, measurement, ticks]
status: complete
related:
  - /api/scenery-phet/phet-font
  - /styling/typography-and-fonts
  - /patterns/dispose-and-memory-management
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RulerNode

`RulerNode` (from `scenerystack/scenery-phet`) draws the visual body of a ruler: a tinted background rectangle, evenly spaced major/minor tick lines, tick labels, and a units label. It doesn't do any measuring itself or attach to a model Property — you position it (often inside a `DragListener`-driven wrapper) and supply the tick labels for whatever scale you want.

```ts
import { RulerNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const rulerNode = new RulerNode(
  500,                                        // rulerWidth, in view coordinates
  40,                                          // rulerHeight
  100,                                         // majorTickWidth, in the same view coordinates
  [ '0', '10', '20', '30', '40', '50' ],       // majorTickLabels, one per major tick
  'cm',                                        // units
  {
    minorTicksPerMajorTick: 4,
    insetsWidth: 15
  }
);
```

## Constructor

```ts
new RulerNode(
  rulerWidth: number,
  rulerHeight: number,
  majorTickWidth: number,
  majorTickLabels: ( string | number )[],
  units: string | TReadOnlyProperty<string>,
  providedOptions?: RulerNodeOptions
)
```

`rulerWidth` is the distance between the leftmost and rightmost tick, in view coordinates — `insetsWidth` adds extra background on either side beyond that. `majorTickWidth` is the spacing between major ticks in those same view coordinates, and it need not correspond 1:1 with the values in `majorTickLabels`; the label strings are just what gets drawn at each major tick position, in order.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `backgroundFill` | `RulerNode.DEFAULT_FILL` (`'rgb(236, 225, 113)'`, a pale wood tone) | Fill of the ruler body |
| `backgroundStroke` | `'black'` | Stroke around the ruler body |
| `backgroundLineWidth` | `1` | Stroke width of the ruler body |
| `insetsWidth` | `14` | Extra background width beyond the first/last tick, on each side |
| `majorTickFont` / `minorTickFont` | `PhetFont(18)` | Fonts for major/minor tick labels |
| `majorTickHeight` / `minorTickHeight` | `0.4 * rulerHeight / 2` / `0.2 * rulerHeight / 2` | Lengths of the tick lines |
| `majorTickStroke` / `minorTickStroke` | `'black'` | Colors of the tick lines |
| `majorTickLineWidth` / `minorTickLineWidth` | `1` | Stroke widths of the tick lines |
| `minorTicksPerMajorTick` | `0` | Number of minor ticks drawn between each pair of major ticks |
| `unitsFont` | `PhetFont(18)` | Font for the units label |
| `unitsMajorTickIndex` | `0` | The units label is placed to the right of this major tick (by index) |
| `unitsSpacing` | `3` | Horizontal gap between a tick label and the units label |
| `tickMarksOnTop` / `tickMarksOnBottom` | `true` / `true` | Whether tick lines are drawn on each edge |
| `instrumentUnitsLabelText` | `true` | Whether the internal units `Text` gets its own PhET-iO tandem |

::: warning `majorTickLabels.length` must match the tick count exactly
`RulerNode` asserts `Math.floor( rulerWidth / majorTickWidth ) + 1 === majorTickLabels.length`. Passing too few or too many labels for the given `rulerWidth`/`majorTickWidth` combination throws in an assertion-enabled build rather than silently truncating or padding. Compute the label array's length the same way when generating it dynamically.
:::
