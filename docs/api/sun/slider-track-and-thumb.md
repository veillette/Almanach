---
title: SliderTrack, DefaultSliderTrack, and SliderThumb
description: The pluggable track and thumb pieces you swap out to customize a Slider/HSlider/VSlider's visual appearance.
category: api
library: sun
tags: [sun, SliderTrack, DefaultSliderTrack, SliderThumb, Slider]
status: complete
related:
  - /api/sun/hslider
  - /api/sun/slider
  - /api/dot/range
prerequisites:
  - /api/sun/hslider
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SliderTrack, DefaultSliderTrack, and SliderThumb

[`HSlider`](/api/sun/hslider)/`VSlider`/[`Slider`](/api/sun/slider) build their visuals from two swappable pieces: a track (the line the thumb moves along, handling click-and-drag-to-set-value) and a thumb (the draggable handle). `DefaultSliderTrack` and the default rectangular thumb are what you get out of the box; pass `trackNode`/`thumbNode` to any slider constructor to replace either one with your own `Node` while keeping the drag-to-value behavior.

```ts
import { HSlider, DefaultSliderTrack } from 'scenerystack/sun';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const volumeProperty = new NumberProperty( 50, { range: new Range( 0, 100 ) } );
const rangeProperty = new Property( new Range( 0, 100 ) );

const customTrack = new DefaultSliderTrack( volumeProperty, rangeProperty, {
  size: new Dimension2( 160, 3 ),
  fillEnabled: 'green',
  fillDisabled: 'lightgray',
  cornerRadius: 1.5,
  enabledRangeProperty: rangeProperty,
  tandem: Tandem.REQUIRED.createTandem( 'trackNode' )
} );

const slider = new HSlider( volumeProperty, new Range( 0, 100 ), {
  trackNode: customTrack,
  tandem: Tandem.REQUIRED
} );
```

::: tip Prefer the plain options first
Most visual changes — track color, track size, thumb color, thumb size — are exposed directly as `HSlider`/`Slider` options (`trackFillEnabled`, `trackSize`, `thumbFill`, `thumbSize`, …; see [`HSlider`](/api/sun/hslider)). Reach for `trackNode`/`thumbNode` only when you need a shape or behavior the built-in appearance can't express, e.g. a gradient track or a custom-shaped thumb icon.
:::

## SliderTrack (abstract base)

`SliderTrack` implements the shared mechanics every track needs — mapping a pixel position to a value along a `Range`, a `DragListener` for click-and-drag-to-set, and sound-on-click — but takes an arbitrary `Node` as its visual. Constructing `SliderTrack` directly means supplying that visual `Node` yourself:

```ts
import { SliderTrack } from 'scenerystack/sun';
import { Rectangle } from 'scenerystack/scenery';

const visual = new Rectangle( 0, 0, 160, 3, { fill: 'purple' } );
const track = new SliderTrack( volumeProperty, visual, new Range( 0, 100 ), {
  size: new Dimension2( 160, 3 )
} );
```

| Constructor argument | Meaning |
| --- | --- |
| `valueProperty` | The numeric `Property` the track writes to on click/drag |
| `trackNode` | The visual `Node` to display and drag on |
| `range` | A `Range` or `TReadOnlyProperty<Range>` mapping pixel position to value |

| Option | Effect |
| --- | --- |
| `size` | `Dimension2` used for layout math (the visual `Node` isn't resized automatically to match) |
| `enabledRangeProperty` | Narrower range that actually constrains dragging; defaults to the full `range` |
| `constrainValue` | `(value: number) => number`, applied before the value is set |
| `startDrag` / `drag` / `endDrag` | Hooks into the drag lifecycle |
| `soundGenerator` | A `ValueChangeSoundPlayer`, or `null` to silence click/drag sounds |

## DefaultSliderTrack

`DefaultSliderTrack` extends `SliderTrack`, supplying the visual itself: two stacked `Rectangle`s — a full-range "disabled" rectangle behind an "enabled" rectangle that shrinks to match `enabledRangeProperty`, so narrowing the enabled range visibly grays out the excluded portion. This is what `HSlider`/`VSlider`/`Slider` construct when you don't pass a `trackNode`.

| Option | Default | Effect |
| --- | --- | --- |
| `fillEnabled` | `'white'` | Fill of the enabled (interactive) portion |
| `fillDisabled` | `'gray'` | Fill of the disabled portion |
| `stroke` | `'black'` | Stroke on both rectangles |
| `lineWidth` | `1` | Stroke width |
| `cornerRadius` | `0` | Corner radius on both rectangles |

`size` and `enabledRangeProperty` are required for `DefaultSliderTrack` (they're optional on the base `SliderTrack`).

## SliderThumb

`SliderThumb` is a `Rectangle`-based thumb with a vertical center line, sized and colored by options — the default thumb every `HSlider`/`VSlider`/`Slider` uses unless you pass `thumbNode`. It highlights itself on pointer-over via an internal `PressListener`.

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `22 x 45` | Thumb dimensions (pass `2 x height` for width to get a square-ish/circular-feeling thumb) |
| `fill` | `'rgb( 50, 145, 184 )'` | Normal fill |
| `fillHighlighted` | `'rgb( 71, 207, 255 )'` | Fill while the pointer is over or dragging the thumb |
| `stroke` | `'black'` | Thumb stroke |
| `centerLineStroke` | `'white'` | Color of the vertical center line |
| `cornerRadius` | `0.25 * size.width` | Corner rounding |

::: warning A custom `thumbNode`/`trackNode` gets its position managed for you
When you supply `trackNode`/`thumbNode` to a slider, the slider still owns positioning and drag wiring — don't add your own `DragListener` to a custom track/thumb `Node` you pass in, and don't reposition it manually; use the appearance-only options (fills, strokes, size) and let the slider's internal `SliderTrack`/thumb-positioning logic handle placement.
:::
