---
title: NumberPicker
description: A compact up/down arrow spinner bound to a NumberProperty, with its arrows drawn directly on the value display.
category: api
library: sun
tags: [sun, NumberPicker, NumberProperty]
status: complete
related:
  - /api/sun/number-spinner
  - /api/sun/hslider
  - /api/dot/range
prerequisites:
  - /api/sun/number-spinner
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# NumberPicker

`NumberPicker` (from `scenerystack/sun`) shows a number flanked by an increment arrow above and a decrement arrow below, both drawn directly on the top and bottom halves of the value's own rounded background — the compact, classic "PhET number picker" look used throughout older sims. It's bound to a `Property<number>` and a `TReadOnlyProperty<Range>`, exactly like [`NumberSpinner`](/api/sun/number-spinner). Despite the different name, `NumberPicker` and `NumberSpinner` are **not** distinguished by accessibility — both mix in the same `AccessibleNumberSpinner`, so both support keyboard arrow-key/PDOM interaction out of the box. The real difference is visual construction and configurability: `NumberSpinner` composes separate `ArrowButton` instances positioned around a `NumberDisplay` (configurable via `arrowsPosition` — above/below, beside, or both-right/both-bottom), while `NumberPicker`'s arrows are painted directly onto the two halves of its own background shape, with less layout flexibility but a smaller footprint.

```ts
import { NumberPicker } from 'scenerystack/sun';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const countProperty = new NumberProperty( 3, {
  numberType: 'Integer',
  range: new Range( 0, 10 )
} );

const countRangeProperty = new Property( new Range( 0, 10 ) );

const countPicker = new NumberPicker( countProperty, countRangeProperty, {
  tandem: Tandem.REQUIRED
} );
```

As with `NumberSpinner`, the range argument is a `TReadOnlyProperty<Range>` (not a plain `Range`), so the picker can respond if the allowed bounds change dynamically.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `color` / `pressedColor` | blue / a darker derived shade | Arrow and background-gradient color, normal and while pressed |
| `backgroundColor` | `'white'` | Background color when the pointer isn't over it |
| `cornerRadius` | `6` | Corner radius of the value background |
| `xMargin` / `yMargin` | `3` / `3` | Margin between the value text and the background edges |
| `decimalPlaces` | `0` | Digits shown after the decimal point (via the default `formatValue`) |
| `font` | `PhetFont(24)` | Font for the displayed value |
| `incrementFunction` / `decrementFunction` | `v => v + 1` / `v => v - 1` | Custom step logic, e.g. non-uniform steps |
| `align` | `'center'` | Horizontal alignment of the value text: `'center'`, `'left'`, or `'right'` |
| `touchAreaXDilation` / `touchAreaYDilation` | `10` / `10` | Expand each arrow's touch hit area |
| `mouseAreaXDilation` / `mouseAreaYDilation` | `0` / `5` | Expand each arrow's mouse hit area |
| `incrementEnabledFunction` / `decrementEnabledFunction` | Disables at `range.max`/`range.min` | Predicates controlling when each arrow is enabled |
| `formatValue` | pads to `decimalPlaces` | `( value: number ) => string` — custom value formatting |
| `onInput` | no-op | `( event: SceneryEvent \| null, oldValue: number ) => void`, called on any user-driven value change |
| `valueChangedSoundPlayer` / `boundarySoundPlayer` | shared default sound players | Sounds for an ordinary change vs. hitting the range's min/max |

## Methods

| Method | Effect |
| --- | --- |
| `setArrowsVisible( visible )` | Shows/hides both arrows, interrupting any in-progress press when hidden |
| `NumberPicker.createIcon( value, options? )` | Static — builds a non-interactive `NumberPicker` instance for use as an icon, with `pickable: false` and removed from the PDOM by default |

::: tip Arrows disable themselves automatically at the range's edges — same as NumberSpinner
`NumberPicker` derives `incrementEnabledProperty`/`decrementEnabledProperty` from `incrementEnabledFunction`/`decrementEnabledFunction` and keeps each arrow's `pickable` state (and its keyboard equivalent) in sync automatically. If you need non-default enabling logic — e.g. disabling early before the true range boundary — override these two functions rather than trying to intercept `onInput`.
:::
