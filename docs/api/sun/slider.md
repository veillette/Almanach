---
title: Slider
description: The orientation-agnostic base class behind HSlider and VSlider.
category: api
library: sun
tags: [sun, Slider, HSlider, VSlider, Orientation]
status: complete
related:
  - /api/sun/hslider
  - /api/sun/v-slider
  - /api/scenery/sizable-mixins
  - /api/scenery/drag-listener
  - /api/dot/range
prerequisites:
  - /api/sun/hslider
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Slider

`Slider` (from `scenerystack/sun`) is the class that actually implements dragging a thumb along a track, clamped to a `Range` and written into a numeric `Property` — [`HSlider`](/api/sun/hslider) and `VSlider` are both thin subclasses that only fix `orientation`. Reach for `HSlider`/`VSlider` for ordinary fixed-orientation sliders; use `Slider` directly when the orientation itself needs to vary at runtime (e.g. a control that flips between a horizontal and vertical layout depending on screen size), or when writing code generic over `Orientation` that shouldn't have to pick between two classes.

```ts
import { Slider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Tandem } from 'scenerystack/tandem';

const volumeProperty = new NumberProperty( 50, { range: new Range( 0, 100 ) } );

const slider = new Slider( volumeProperty, new Range( 0, 100 ), {
  orientation: Orientation.VERTICAL,
  tandem: Tandem.REQUIRED
} );
```

`Slider`'s constructor signature, `positionProperty`/`Range` handling, tick marks (`addMajorTick`/`addMinorTick`), and most options are identical to what [`HSlider`](/api/sun/hslider) documents — that page's options table (`trackSize`, `thumbSize`, `enabledRangeProperty`, `constrainValue`, `trackNode`/`thumbNode`, …) all come from `Slider` itself. The one option `HSliderOptions` removes that `Slider` still has is `orientation`.

<SceneryDemo demo="slider" />

## What `HSlider`/`VSlider` fix

| Class | Fixes |
| --- | --- |
| `HSlider` | `orientation: Orientation.HORIZONTAL` |
| `VSlider` | `orientation: Orientation.VERTICAL` |
| `Slider` | Neither — `orientation` defaults to `Orientation.HORIZONTAL` but can be set (or swapped) explicitly |

When `orientation` is `Orientation.VERTICAL`, `Slider` swaps `trackSize`/`thumbSize` and the touch/mouse-area dilation options internally (since you always describe dimensions as if the slider were horizontal, then it's rotated), so client code doesn't need its own orientation-swapping logic.

## Public API worth knowing beyond HSlider's table

| Member | Meaning |
| --- | --- |
| `enabledRangeProperty` | A `TReadOnlyProperty<Range>` narrower than or equal to the full track range — this is what actually constrains the value, same as documented on `HSlider` |
| `thumbDragListener` | The internal [`DragListener`](/api/scenery/drag-listener) driving the thumb — public so client code can inspect its `isPressedProperty`/`isHoveringProperty` |
| `trackDragListener` | The internal `DragListener` for clicking/dragging directly on the track |
| `addMajorTick( value, label? )` / `addMinorTick( value, label? )` | Same tick API as `HSlider` |
| `setMajorTicksVisible` / `setMinorTicksVisible` | Toggle tick visibility |

`Slider` also mixes in [`Sizable`](/api/scenery/sizable-mixins) — internally it makes itself non-sizable on whichever axis isn't its orientation (a horizontal slider sets `heightSizable = false`) and sizable on the other, so it can participate in a [`FlowBox`](/api/scenery/flow-box)'s `stretch`/`grow` layout along its own axis.

::: tip Most code should still reach for HSlider or VSlider
`Slider` is documented separately mainly so the shared implementation is clear, and so generic/orientation-swapping code has somewhere to import from. For an ordinary fixed-orientation slider, `HSlider`/`VSlider` communicate intent more clearly and remove one option you'd otherwise have to remember to set.
:::
