---
title: NumberControl
description: A composite slider + label + value-readout control bound to a NumberProperty.
category: api
library: scenery-phet
tags: [scenery-phet, NumberControl]
status: complete
related:
  - /api/axon/number-property
  - /api/scenery-phet/phet-font
  - /patterns/model-view-separation
prerequisites:
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# NumberControl

`NumberControl` (from `scenerystack/scenery-phet`) bundles a title, a value readout, a slider, and (by default) increment/decrement arrow buttons into one composite `Node` bound to a numeric Property. It's the standard way to expose a bounded numeric quantity to the user without hand-assembling a slider, a `NumberDisplay`, and arrow buttons yourself every time.

```ts
import { NumberControl } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const frequencyProperty = new NumberProperty( 5, { range: new Range( 0, 10 ) } );

const frequencyControl = new NumberControl(
  'Frequency',
  frequencyProperty,
  new Range( 0, 10 ),
  {
    delta: 0.5,
    numberDisplayOptions: {
      decimalPlaces: 1,
      valuePattern: '{{value}} Hz'
    }
  }
);
```

## Constructor

```ts
new NumberControl(
  title: string | TReadOnlyProperty<string> | Node,
  numberProperty: PhetioProperty<number>,
  numberRange: Range,
  providedOptions?: NumberControlOptions
)
```

`title` can be a plain string, a string Property (for i18n), or an arbitrary `Node` if you need something richer than text.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `delta` | `1` | Step size used by both the arrow buttons and the slider's keyboard shift-step |
| `includeArrowButtons` | `true` | Whether to show the increment/decrement arrow buttons |
| `numberDisplayOptions` | `{}` | Options forwarded to the internal `NumberDisplay` (readout formatting, units, decimal places, …) |
| `sliderOptions` | `{}` | Options forwarded to the internal `Slider` — accepts `majorTicks`, `minorTickSpacing` in addition to normal slider options |
| `arrowButtonOptions` | `{}` | Options forwarded to the increment/decrement `ArrowButton`s |
| `titleNodeOptions` | `{}` | Options forwarded to the title `Text`/`RichText` |
| `useRichText` | `false` | Render the title with `RichText` instead of `Text` |
| `enabledRangeProperty` | — | Constrains the effective slider/arrow-button range to a sub-range of `numberRange` |
| `startCallback` / `endCallback` | no-ops | Called when interaction begins/ends on **any** subcomponent (slider drag or arrow press) |
| `layoutFunction` | `NumberControl.createLayoutFunction1()` | Arranges title, readout, slider, and arrow buttons; swap in `createLayoutFunction2`/`3`/`4` for the other standard layouts |
| `soundGenerator` | auto-created | A `ValueChangeSoundPlayer`; pass `null` for silence |

## Static helpers

| Static member | Purpose |
| --- | --- |
| `NumberControl.withMinMaxTicks( label, property, range, options? )` | Convenience constructor that adds major ticks labeled with the range's min and max |
| `NumberControl.createLayoutFunction1()` … `createLayoutFunction4()` | Pre-built layout strategies for `options.layoutFunction`, each with its own spacing/alignment options |

## Public API

| Member | Description |
| --- | --- |
| `slider` | The internal `HSlider`, exposed read-only for accessibility wiring |

::: warning Don't mix general and per-component callbacks
Use either the top-level `startCallback`/`endCallback` pair, **or** the per-component callbacks nested in `sliderOptions`/`arrowButtonOptions` (`startDrag`, `leftStart`, `rightEnd`, …) — never both. `NumberControl` asserts against mixing them, since it can't guarantee sensible ordering between the two mechanisms.
:::
