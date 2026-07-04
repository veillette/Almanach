---
title: GaugeNode
description: A circular dial gauge with a needle, tick marks, and a label, driven by a numeric value Property within a fixed range.
category: api
library: scenery-phet
tags: [scenery-phet, GaugeNode, gauge, dial, meter]
status: complete
related:
  - /api/scenery-phet/thermometer-node
  - /api/dot/range
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GaugeNode

`GaugeNode` (from `scenerystack/scenery-phet`) draws a speedometer-style dial: a circular background, major/minor tick marks around most of the circle, a text label, and a needle that rotates to reflect a numeric value clamped to a fixed `Range`. It was generalized out of the speedometer in Forces and Motion: Basics and works for any bounded numeric quantity — speed, force, temperature, whatever your label says it is.

```ts
import { GaugeNode } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { StringProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const speedProperty = new NumberProperty( 0 );
const speedRange = new Range( 0, 100 );
const labelProperty = new StringProperty( 'm/s' );

const gaugeNode = new GaugeNode( speedProperty, labelProperty, speedRange, {
  radius: 120
} );
```

## Constructor

```ts
new GaugeNode(
  valueProperty: TReadOnlyProperty<number>,
  labelProperty: TReadOnlyProperty<string>,
  range: Range,
  providedOptions?: GaugeNodeOptions
)
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `100` | Radius of the gauge |
| `backgroundFill` / `backgroundStroke` / `backgroundLineWidth` | `'white'` / `'rgb(85,85,85)'` / `2` | Styling of the circular background |
| `maxLabelWidthScale` | `1.3` | Max width of the label, as a multiple of `radius` (label scales down to fit) |
| `numberOfTicks` | `21` | Total ticks around the span (odd numbers keep one tick centered) |
| `majorTickStroke` / `minorTickStroke` | `'gray'` / `'gray'` | Tick colors; every other tick (starting at index 0) is drawn as "major" |
| `majorTickLength` / `minorTickLength` | `10` / `5` | Tick lengths |
| `majorTickLineWidth` / `minorTickLineWidth` | `2` / `1` | Tick stroke widths |
| `labelTextOptions` | `{ font: PhetFont(20) }` | Options forwarded to the internal label `Text` |
| `span` | `Math.PI + Math.PI / 4` | Angular span the ticks/needle range covers, in radians (default is the top half-circle plus a bit past horizontal on each side) |
| `needleLineWidth` | `3` | Stroke width of the needle |
| `updateWhenInvisible` | `true` | If `false`, the needle stops recomputing while the gauge is invisible (a perf optimization), catching up once it becomes visible again |

## Members

| Member | Description |
| --- | --- |
| `radius` | Public readonly copy of the resolved `radius` option |

::: warning The needle disappears for non-numeric values, and clamps otherwise
`GaugeNode` hides the needle entirely (`needle.visible = false`) whenever `valueProperty.get()` is not a `number` — useful if you're deriving the value and want to represent "no reading." For actual numbers, the needle instead **clamps** to `range.min`/`range.max` rather than disappearing or overshooting, so an out-of-range value still shows a (misleadingly) valid-looking needle position.
:::

For a variant with a numeric readout built in, see `ValueGaugeNode` in the same source file — it's a `GaugeNode` subclass that adds a centered `NumberDisplay` and a `numberDisplayVisible` setter/getter, otherwise sharing the same constructor shape.
