---
title: A Custom Slider Thumb and Track
description: Replacing HSlider's default thumb/track Nodes with custom artwork via the thumbNode/trackNode options.
category: cookbook
tags: [sun, HSlider, VSlider, slider]
status: complete
related:
  - /api/sun/hslider
  - /api/sun/v-slider
prerequisites:
  - /api/sun/hslider
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Custom Slider Thumb and Track

**Task:** the default rectangular thumb and plain track of an `HSlider`/`VSlider` don't match a sim's visual style — a circular thumb, a gradient track, or icon-based thumb artwork is needed instead.

`HSlider`/`VSlider` (thin, orientation-fixed wrappers around the shared `Slider` class) accept `trackNode` and `thumbNode` options that replace the default-drawn track/thumb entirely with any `Node` you supply — you're not limited to tweaking colors on the built-in shapes.

## The solution

```ts
import { HSlider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Circle, Rectangle } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const volumeProperty = new NumberProperty( 50, {
  range: new Range( 0, 100 )
} );

// A custom track: a thin, rounded gradient-free bar (styling only - Slider
// still handles hit-testing and positioning based on its bounds).
const customTrack = new Rectangle( 0, 0, 160, 6, {
  fill: 'lightGray',
  cornerRadius: 3
} );

// A custom thumb: a plain circle instead of the default beveled rectangle.
const customThumb = new Circle( 12, {
  fill: 'dodgerblue',
  stroke: 'black',
  lineWidth: 1,
  cursor: 'pointer'
} );

const volumeSlider = new HSlider( volumeProperty, new Range( 0, 100 ), {
  trackNode: customTrack,
  thumbNode: customThumb,
  tandem: Tandem.REQUIRED
} );
```

`Slider` takes ownership of `customTrack`'s and `customThumb`'s sizing/positioning from here on — it reads their bounds to compute track length and thumb travel, and attaches its own drag handling to `customThumb`, so you don't add input listeners to either Node yourself.

## Giving the thumb a highlighted/pressed look

The default thumb supports `thumbFill`/`thumbFillHighlighted` for pointer-over feedback; a fully custom `thumbNode` needs to implement the equivalent itself, since those two options only apply to the *default* thumb shape. Track the slider's own pressed state via the underlying `Property`-observing pattern most `sun` controls use, or layer a `PressListener`-driven highlight directly on the custom Node:

```ts
// Slider already attaches its own drag listener to customThumb, so add a
// plain hover listener alongside it rather than another PressListener
// competing to attach to the same pointer.
customThumb.addInputListener( {
  over: () => { customThumb.fill = 'royalblue'; },
  out: () => { customThumb.fill = 'dodgerblue'; }
} );
```

This is usually enough for a hover cue and avoids fighting with `Slider`'s own internal drag listener over pointer attachment (see `attach` on [`PressListener`](/api/scenery/fire-listener) for why two `attach: true` listeners on one pointer is normally avoided).

## Options used here

| Option | Effect |
| --- | --- |
| `trackNode` | Replaces the default track `Node` entirely |
| `thumbNode` | Replaces the default thumb `Node` entirely |
| `trackSize` / `thumbSize` | Only apply to the *default* track/thumb — ignored once `trackNode`/`thumbNode` is supplied, since the custom Node's own bounds determine size |
| `thumbFill` / `thumbFillHighlighted` | Also only apply to the default thumb shape |

::: tip Everything else about `HSlider` still works unchanged
Tick marks (`addMajorTick`/`addMinorTick`), `enabledRangeProperty`, and `constrainValue` all keep working normally with a custom `trackNode`/`thumbNode` — only the two Nodes' *appearance* changes, not the slider's value/range/enabled-range behavior. See [HSlider](/api/sun/hslider) for the full option set this composes with.
:::

::: warning `trackSize`'s swapped meaning still matters when picking a `VSlider` thumb/track
If you're building the vertical counterpart with [`VSlider`](/api/sun/v-slider), remember your custom `trackNode` needs to actually be tall (not wide) — `VSlider` doesn't rotate a horizontal-shaped custom track for you, it expects the `Node` you pass to already be laid out along the vertical axis.
:::
