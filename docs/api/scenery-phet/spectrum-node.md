---
title: SpectrumNode
description: A Node that rasterizes a value range into a horizontal color gradient bar via a client-supplied value-to-color function.
category: api
library: scenery-phet
tags: [scenery-phet, SpectrumNode, gradient, color, spectrum]
status: complete
related:
  - /api/scenery/color
  - /api/dot/dimension2
  - /api/scenery-phet/gauge-node
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SpectrumNode

`SpectrumNode` (from `scenerystack/scenery-phet`) renders a horizontal bar showing how a numeric range maps to color, by drawing directly onto an offscreen `<canvas>` (for performance) and displaying the result as an `Image`. By default it maps `[0, 1]` onto a black-to-white grayscale gradient, but any `valueToColor` function and any `[minValue, maxValue]` range are supported — this is the building block behind visible-light-spectrum displays and spectrum-based slider tracks.

```ts
import { SpectrumNode } from 'scenerystack/scenery-phet';
import { Color } from 'scenerystack/scenery';
```

## A minimal example

```ts
// A custom red-to-blue spectrum over a [0, 100] range.
const spectrumNode = new SpectrumNode( {
  minValue: 0,
  maxValue: 100,
  valueToColor: value => {
    const t = value / 100;
    return new Color( 255 * ( 1 - t ), 0, 255 * t );
  }
} );
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `Dimension2( 150, 30 )` | Rendered width/height of the bar |
| `valueToColor` | `SpectrumNode.DEFAULT_VALUE_TO_COLOR` | Maps a value in `[minValue, maxValue]` to a `Color` |
| `minValue` / `maxValue` | `0` / `1` | The domain passed to `valueToColor`; must satisfy `minValue < maxValue` |

## Static member

| Member | Description |
| --- | --- |
| `SpectrumNode.DEFAULT_VALUE_TO_COLOR` | The default grayscale mapping: asserts its input is in `[0, 1]` and returns `Color( 255v, 255v, 255v )` |

## Real siblings built on `SpectrumNode`

- **`WavelengthSpectrumNode`** — a `SpectrumNode` subclass that hard-codes `valueToColor` to `VisibleColor.wavelengthToColor` and defaults `minValue`/`maxValue` to the visible wavelength range (`VisibleColor.MIN_WAVELENGTH`/`MAX_WAVELENGTH`), for displaying the visible light spectrum.
- **`SpectrumSliderTrack`** / **`SpectrumSliderThumb`** — a `SliderTrack`/`SliderThumb` pair that composes a `SpectrumNode` internally, so you can build a slider whose track is a color gradient (e.g. picking a wavelength).

::: tip The gradient is baked to a bitmap once, not reactive
`SpectrumNode` draws its canvas and converts it to a static `Image` inside the constructor — it does not re-render if you mutate the `valueToColor` function or the value range afterward. If your spectrum needs to change (a different range, a different color mapping), construct a new `SpectrumNode` rather than expecting the existing instance to update.
:::
