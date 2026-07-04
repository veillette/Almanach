---
title: HSlider
description: The horizontal slider bound to a NumberProperty and Range.
category: api
library: sun
tags: [sun, HSlider, slider]
status: complete
related:
  - /api/sun/checkbox
  - /api/dot/range
prerequisites:
  - /api/axon/number-property
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HSlider

`HSlider` (from `scenerystack/sun`) is a horizontal slider bound to a numeric `Property` and a `Range` — dragging the thumb (or clicking the track) sets `valueProperty.value`, clamped to the range, and the thumb's position updates automatically if the value or range changes elsewhere. `HSlider` is a thin convenience wrapper around the more general `Slider` (which also supports a vertical orientation via `VSlider`) that always fixes `orientation: Orientation.HORIZONTAL`.

```ts
import { HSlider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const temperatureProperty = new NumberProperty( 20, {
  range: new Range( 0, 100 )
} );

const slider = new HSlider( temperatureProperty, new Range( 0, 100 ), {
  tandem: Tandem.REQUIRED
} );
```

The `Range` passed to the constructor is the *track's* full range; pass a `Property<Range>` instead of a plain `Range` if you want the enabled portion of the track to change dynamically without moving the track's endpoints (see `enabledRangeProperty`, below).

## Options

`HSliderOptions` is `SliderOptions` with `orientation` removed (it's always horizontal). The ones you'll reach for most:

| Option | Effect |
| --- | --- |
| `trackSize` | `Dimension2` for the track (default `100 x 5`) |
| `thumbSize` | `Dimension2` for the default thumb (default `17 x 34`) |
| `thumbFill` / `thumbFillHighlighted` | Thumb color, normal and pointer-over |
| `trackFillEnabled` / `trackFillDisabled` | Track color in each enabled state |
| `constrainValue` | `( value: number ) => number`, e.g. to snap to a grid before the value is set |
| `enabledRangeProperty` | A `Property<Range>` narrower than the full track range — lets you shrink the interactive range (e.g. disable values above a threshold) without moving the track |
| `trackNode` / `thumbNode` | Fully custom track/thumb `Node`s, replacing the defaults |
| `startDrag` / `drag` / `endDrag` | Hooks into the drag lifecycle |

## Adding tick marks

```ts
slider.addMajorTick( 0, new Text( '0°' ) );
slider.addMajorTick( 100, new Text( '100°' ) );
slider.addMinorTick( 50 );
```

| Method | Effect |
| --- | --- |
| `addMajorTick( value, label? )` | Adds a labeled tick mark, longer stroke |
| `addMinorTick( value, label? )` | Adds an unlabeled (by default) tick mark, shorter stroke |
| `setMajorTicksVisible( visible )` / `setMinorTicksVisible( visible )` | Toggle tick visibility |

::: warning The value clamps to `enabledRangeProperty`, not just the constructor `Range`
If you never touch `enabledRangeProperty`, it defaults to the full `Range` you passed in and behaves as you'd expect. But if you narrow `enabledRangeProperty` later (e.g. to lock the slider above some model-dependent value), the *track* stays the same visual length — only the interactive/enabled portion shrinks, and `valueProperty` is clamped into the new enabled range immediately.
:::
