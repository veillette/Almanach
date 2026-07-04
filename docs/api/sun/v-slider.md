---
title: VSlider
description: The vertical counterpart to HSlider, bound to the same NumberProperty/Range pattern.
category: api
library: sun
tags: [sun, VSlider, slider]
status: complete
related:
  - /api/sun/hslider
  - /api/dot/range
prerequisites:
  - /api/axon/number-property
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# VSlider

`VSlider` (from `scenerystack/sun`) is [`HSlider`](/api/sun/hslider)'s vertical twin: both are thin convenience wrappers around the general `Slider` class that fix its `orientation` option, `VSlider` to `Orientation.VERTICAL` and `HSlider` to `Orientation.HORIZONTAL`. Every option, tick-mark method, and the `enabledRangeProperty` behavior documented on [`HSlider`](/api/sun/hslider) applies identically here — only the layout axis differs, so reach for `VSlider` purely as a layout choice (e.g. a volume fader or a vertical thermometer-style control) rather than as a separately-behaving component.

```ts
import { VSlider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const volumeProperty = new NumberProperty( 50, {
  range: new Range( 0, 100 )
} );

const volumeSlider = new VSlider( volumeProperty, new Range( 0, 100 ), {
  tandem: Tandem.REQUIRED
} );
```

As with `HSlider`, dragging the thumb (now vertically) or clicking the track sets `volumeProperty.value`, clamped to the range; the thumb's position updates automatically whenever the value or the enabled range changes elsewhere.

## Options

`VSliderOptions` is `SliderOptions` with `orientation` removed (it's always vertical) — the same table documented on [HSlider's Options](/api/sun/hslider#options) applies: `trackSize`, `thumbSize`, `thumbFill`/`thumbFillHighlighted`, `trackFillEnabled`/`trackFillDisabled`, `constrainValue`, `enabledRangeProperty`, `trackNode`/`thumbNode`, and the `startDrag`/`drag`/`endDrag` hooks.

## Adding tick marks

Tick marks work identically to `HSlider` — `addMajorTick`/`addMinorTick` place ticks perpendicular to the (now vertical) track:

```ts
volumeSlider.addMajorTick( 0, new Text( '0%' ) );
volumeSlider.addMajorTick( 100, new Text( '100%' ) );
```

::: tip `trackSize` swaps meaning with orientation
For a vertical slider, `trackSize`'s `width` is the track's thickness and `height` is its length along the direction of travel — the opposite of how the same `Dimension2` reads for `HSlider`. If you're sharing a `trackSize` constant between horizontal and vertical sliders in the same sim, remember to swap its dimensions rather than reusing it as-is.
:::
