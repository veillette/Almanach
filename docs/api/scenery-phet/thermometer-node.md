---
title: ThermometerNode
description: A fluid-level thermometer visualization bound to a temperature Property.
category: api
library: scenery-phet
tags: [scenery-phet, ThermometerNode]
status: complete
related:
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ThermometerNode

`ThermometerNode` (from `scenerystack/scenery-phet`) draws a classic bulb-and-tube thermometer whose fluid level tracks a temperature value between a min and max. It handles the glass outline, tick marks, and the clipped fluid shape for you — you only supply the temperature Property and the range it can take.

```ts
import { ThermometerNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const temperatureProperty = new Property<number | null>( 20 );

const thermometer = new ThermometerNode( temperatureProperty, 0, 100, {
  bulbDiameter: 50,
  tubeHeight: 150,
  tickSpacingTemperature: 10 // one tick every 10 degrees, instead of every fixed pixel spacing
} );
```

## Constructor

```ts
new ThermometerNode(
  temperatureProperty: TReadOnlyProperty<number | null>,
  minTemperature: number,
  maxTemperature: number,
  providedOptions?: ThermometerNodeOptions
)
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `bulbDiameter` | `50` | Diameter of the bulb at the bottom |
| `tubeWidth` | `30` | Width of the tube |
| `tubeHeight` | `100` | Height of the straight part of the tube |
| `lineWidth` | `4` | Stroke width of the glass outline |
| `outlineStroke` | `'black'` | Color of the glass outline |
| `glassThickness` | `4` | Gap between the outline and the fluid inside it |
| `tickSpacing` | `15` | Pixel spacing between tick marks |
| `tickSpacingTemperature` | `null` | If set, overrides `tickSpacing` to space ticks by units of temperature instead of pixels |
| `majorTickLength` / `minorTickLength` | `15` / `7.5` | Lengths of alternating major/minor ticks |
| `zeroLevel` | `'bulbCenter'` | Where the fluid level sits at `minTemperature` — `'bulbCenter'` or `'bulbTop'` |
| `backgroundFill` | `null` | If set, an extra `Path` is drawn behind the fluid in this color; `null` leaves the tube background transparent |
| `fluidMainColor` / `fluidHighlightColor` / `fluidRightSideColor` | shades of red | Colors for the bulb fluid and the tube's gradient |

## Methods

| Method | Effect |
| --- | --- |
| `temperatureToYPos( temperature )` | Converts a temperature (or `null`) to the internal y-coordinate used for tick placement |
| `yPosToTemperature( y )` | Inverse of the above, useful for mapping a draggable thumb position back to a temperature |

::: tip A `null` temperature is treated as the minimum
`temperatureProperty` accepts `number | null`. A `null` value is displayed the same as `minTemperature` (a legacy requirement carried over from States of Matter) — it does **not** hide the fluid or throw. If you need "no reading" to look visually distinct, handle that in a sibling Node rather than expecting `ThermometerNode` to do it.
:::
