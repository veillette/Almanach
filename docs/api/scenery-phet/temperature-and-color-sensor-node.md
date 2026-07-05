---
title: TemperatureAndColorSensorNode
description: A composite Node pairing a ThermometerNode with a triangular color-swatch indicator, for sensors that report both a temperature and a sampled color.
category: api
library: scenery-phet
tags: [scenery-phet, TemperatureAndColorSensorNode, ThermometerNode, sensor]
status: complete
related:
  - /api/scenery-phet/thermometer-node
  - /api/dot/range
prerequisites:
  - /api/scenery-phet/thermometer-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TemperatureAndColorSensorNode

`TemperatureAndColorSensorNode` (from `scenerystack/scenery-phet`) composes a [`ThermometerNode`](/api/scenery-phet/thermometer-node) with a small triangular color swatch positioned to its left, for probes that sense both a temperature and a color at the same point (for example, a light-absorption probe in a states-of-matter-style sim, where the sampled color communicates *what* is being measured and the thermometer communicates *how hot it is*). The triangle's leftmost point is meant to line up with the sensor's actual position in the model — the thermometer hangs off to the side of it.

```ts
import { TemperatureAndColorSensorNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Color } from 'scenerystack/scenery';
```

## A minimal example

```ts
const temperatureProperty = new Property( 293 ); // kelvin
const temperatureRange = new Range( 0, 1000 );
const colorProperty = new Property( Color.RED );

const sensorNode = new TemperatureAndColorSensorNode(
  temperatureProperty,
  temperatureRange,
  colorProperty,
  {
    thermometerNodeOptions: {
      bulbDiameter: 40,
      tubeHeight: 120
    }
  }
);

colorProperty.value = Color.BLUE; // the triangle's fill updates immediately
```

## Constructor

```ts
new TemperatureAndColorSensorNode(
  temperatureProperty: TProperty<number>,
  temperatureRange: Range,
  colorProperty: TProperty<TColor>,
  providedOptions?: TemperatureAndColorSensorNodeOptions
)
```

`temperatureRange.min`/`.max` are forwarded directly as the `minTemperature`/`maxTemperature` arguments of the internal `ThermometerNode`.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `horizontalSpace` | `3` | Horizontal gap between the color triangle and the thermometer |
| `bottomOffset` | `5` | Vertical difference between the bottom of the color triangle and the bottom of the thermometer |
| `thermometerNodeOptions` | `{ bulbDiameter: 30, tubeWidth: 18, lineWidth: 2, tickSpacingTemperature: 25, majorTickLength: 10, minorTickLength: 5, backgroundFill: Color(256,256,256,0.67) }` | Forwarded to the internal `ThermometerNode`, minus `left`/`bottom` (which this Node computes itself for layout) |
| `colorIndicatorOptions` | `{ fill: Color(0,0,0,0), lineWidth: 2, stroke: 'black', lineJoin: 'round', sideLength: 18 }` | `PathOptions` plus `sideLength`, controlling the size and styling of the triangular color swatch |

## Members and methods

| Member | Effect |
| --- | --- |
| `thermometerBounds` (getter) / `getThermometerBounds()` | `Bounds2` of the internal `ThermometerNode` |
| `colorIndicatorBounds` (getter) / `getColorIndicatorBounds()` | `Bounds2` of the triangular color swatch |

::: tip The triangle's origin is its leftmost point, not its center
The color-indicator `Shape` is built with `moveTo(0, 0)` as the leftmost vertex and the other two vertices extending to the right at ±30°, so `(0, 0)` in the sensor's local coordinate frame is exactly where you'd position the tip of the sensor probe in the model — position the whole `Node` (via `x`/`y`/`translation`/`center` options passed through `providedOptions`) so that point lands on the model's sensor location, rather than trying to center the Node as a whole.
:::
