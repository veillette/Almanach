---
title: Wavelength and Spectrum Sliders
description: SpectrumSliderThumb and SpectrumSliderTrack build a color-gradient Slider; WavelengthNumberControl and WavelengthSpectrumNode specialize that for visible-light wavelength; VisibleColor converts between wavelength and RGB.
category: api
library: scenery-phet
tags: [scenery-phet, SpectrumSliderThumb, SpectrumSliderTrack, WavelengthNumberControl, WavelengthSpectrumNode, VisibleColor, wavelength, color, slider]
status: complete
related:
  - /api/scenery-phet/spectrum-node
  - /api/scenery-phet/number-control
  - /api/sun/slider-track-and-thumb
  - /api/sun/slider
  - /api/dot/range
prerequisites:
  - /api/scenery-phet/spectrum-node
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Wavelength and Spectrum Sliders

Picking a color by dragging a slider along a visible-light gradient is a recurring PhET interaction (light/color sims, wave-interference sims, anything with a "choose a wavelength" control). `scenerystack/scenery-phet` provides this in two layers: generic color-gradient slider parts (`SpectrumSliderThumb`, `SpectrumSliderTrack`, built on [`SpectrumNode`](/api/scenery-phet/spectrum-node)), and a ready-made wavelength-specific composite (`WavelengthNumberControl`, `WavelengthSpectrumNode`), all backed by `VisibleColor`'s physically-grounded wavelength-to-RGB conversion.

```ts
import { WavelengthNumberControl } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';

// A wavelength in nanometers, defaulting to a value in the visible range.
const wavelengthProperty = new NumberProperty( 550 );

const wavelengthControl = new WavelengthNumberControl( wavelengthProperty );
```

## VisibleColor: the wavelength <-> RGB conversion

`VisibleColor` is a static utility object (not a class) mapping between nanometer wavelengths and sRGB `Color`s using a precomputed lookup table, plus a couple of physical constants.

| Member | Value / signature | Notes |
| --- | --- | --- |
| `MIN_WAVELENGTH` / `MAX_WAVELENGTH` | `380` / `780` (nm) | The visible range the lookup table covers |
| `MIN_FREQUENCY` / `MAX_FREQUENCY` | Derived from `SPEED_OF_LIGHT` | In Hz |
| `SPEED_OF_LIGHT` | `299792458` (m/s) | Speed of light in a vacuum |
| `wavelengthToColor( wavelength, options? )` | `( number, WavelengthToColorOptions? ) => Color` | Below `MIN_WAVELENGTH` is "UV," above `MAX_WAVELENGTH` is "IR" — both return `options.uvColor`/`options.irColor` (default `null`, meaning you must supply one to avoid an assertion) rather than a spectrum color |
| `frequencyToColor( frequency, options? )` | `( number, WavelengthToColorOptions? ) => Color` | Converts frequency to wavelength first, then calls `wavelengthToColor` |
| `colorToWavelength( color, reduceIntensityAtExtrema? )` | `( Color, boolean? ) => number` | The inverse lookup; asserts if no close-enough match is found in the table |
| `isVisibleWavelength` / `isIRWavelength` / `isUVWavelength` | `( number ) => boolean` | Range checks against `MIN_WAVELENGTH`/`MAX_WAVELENGTH` |

`reduceIntensityAtExtrema` (default `true` on the options) dims colors near the edges of the visible range, since perceived brightness falls off there — pass `false` for full-intensity colors throughout.

```ts
import { VisibleColor } from 'scenerystack/scenery-phet';

const greenish = VisibleColor.wavelengthToColor( 550 ); // ~green
const isVisible = VisibleColor.isVisibleWavelength( 900 ); // false (infrared)
```

## SpectrumSliderTrack and SpectrumSliderThumb: generic gradient slider parts

These are a matched `SliderTrack`/(thumb `Node`) pair — see [Slider, SliderTrack, and SliderThumb](/api/sun/slider-track-and-thumb) — meant to be passed as `trackNode`/`thumbNode` options to a plain [`Slider`](/api/sun/slider) when you want the track itself to *be* the color gradient, rather than a plain gray bar. Both take the same `valueToColor: ( value: number ) => Color` function so the track and the thumb's fill stay in sync.

| Type | Base class | Key options |
| --- | --- | --- |
| `SpectrumSliderTrack` | `SliderTrack` (`sun`) | `valueToColor` (default grayscale), `size` (default `150 x 30`); internally builds a [`SpectrumNode`](/api/scenery-phet/spectrum-node) for the visual |
| `SpectrumSliderThumb` | `Path` | `valueToColor`, `width`/`height` (default `35 x 45`) for the teardrop handle shape, `cursorHeight`/`cursorWidth` for the thin indicator line overlaid on the track |

```ts
import { SpectrumSliderTrack, SpectrumSliderThumb, VisibleColor } from 'scenerystack/scenery-phet';
import { Slider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const valueProperty = new NumberProperty( 550 );
const range = new Range( VisibleColor.MIN_WAVELENGTH, VisibleColor.MAX_WAVELENGTH );

const trackNode = new SpectrumSliderTrack( valueProperty, range, {
  valueToColor: VisibleColor.wavelengthToColor
} );
const thumbNode = new SpectrumSliderThumb( valueProperty, {
  valueToColor: VisibleColor.wavelengthToColor
} );

const spectrumSlider = new Slider( valueProperty, range, {
  trackNode: trackNode,
  thumbNode: thumbNode
} );
```

## WavelengthSpectrumNode and WavelengthNumberControl: the wavelength-specific composites

`WavelengthSpectrumNode` is a [`SpectrumNode`](/api/scenery-phet/spectrum-node) subclass that hard-codes `valueToColor` to `VisibleColor.wavelengthToColor` and defaults its `minValue`/`maxValue` to `VisibleColor.MIN_WAVELENGTH`/`MAX_WAVELENGTH` — a static, non-interactive rendering of the visible spectrum bar, useful as a legend or backdrop.

`WavelengthNumberControl` goes further and assembles the entire interactive control: it's a [`NumberControl`](/api/scenery-phet/number-control) whose slider is built from `SpectrumSliderTrack`/`SpectrumSliderThumb` (both wired to `VisibleColor.wavelengthToColor` by default), plus the standard title and numeric ("### nm") readout.

```ts
import { WavelengthNumberControl, WavelengthSpectrumNode } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';

const wavelengthProperty = new NumberProperty( 650 );

// The full interactive control: title, slider with gradient track, and "650 nm" readout.
const control = new WavelengthNumberControl( wavelengthProperty, {
  range: new Range( 400, 700 ) // narrower than the full visible range, if desired
} );

// A static, non-interactive spectrum bar, e.g. as a legend.
const legend = new WavelengthSpectrumNode( {
  size: new Dimension2( 200, 20 )
} );
```

::: tip Reach for WavelengthNumberControl first
Unless you need a bare gradient bar (`WavelengthSpectrumNode`) or a custom composite slider (assembled from `SpectrumSliderTrack`/`SpectrumSliderThumb` directly), `WavelengthNumberControl` is the one-line way to get a fully wired wavelength picker with title, gradient slider, and numeric readout, matching the standard PhET look.
:::
