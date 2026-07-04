---
title: NumberSpinner
description: An integer value display flanked by increment/decrement arrow buttons, bound to a Property and a dynamic Range.
category: api
library: sun
tags: [sun, NumberSpinner, NumberProperty]
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

# NumberSpinner

`NumberSpinner` (from `scenerystack/sun`) pairs a `NumberDisplay` with increment/decrement `ArrowButton`s, bound to an integer-valued `Property<number>` and a `TReadOnlyProperty<Range>` for the allowed bounds. Use it instead of [`HSlider`](/api/sun/hslider) when discrete, one-at-a-time steps make more sense than continuous dragging — a "number of particles" or "index of item" control is the typical case.

```ts
import { NumberSpinner } from 'scenerystack/sun';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const countProperty = new NumberProperty( 3, {
  numberType: 'Integer',
  range: new Range( 0, 10 )
} );

const countRangeProperty = new Property( new Range( 0, 10 ) );

const countSpinner = new NumberSpinner(
  countProperty,
  countRangeProperty,
  { tandem: Tandem.REQUIRED }
);
```

The range argument is a `Property<Range>` (not a plain `Range`) so the spinner can respond if the allowed bounds change dynamically — e.g. disabling further increments once a dependent quantity runs out. Both `numberProperty.value` and the range's min/max must be integers; `NumberSpinner` asserts on construction if the initial value falls outside the initial range.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `arrowsPosition` | `'bothRight'` | Layout of the two arrow buttons: `'leftRight'`, `'topBottom'`, `'bothRight'`, or `'bothBottom'` |
| `deltaValue` | `1` | Amount each press changes the value by (ignored if `incrementFunction`/`decrementFunction` are supplied) |
| `incrementFunction` / `decrementFunction` | `v => v + deltaValue` / `v => v - deltaValue` | Custom step logic, e.g. non-uniform steps |
| `xSpacing` / `ySpacing` | `5` / `3` | Spacing between the arrow buttons and the number display |
| `numberDisplayOptions` | `{ cornerRadius: 5, backgroundStroke: 'black' }` | Options forwarded to the internal `NumberDisplay` |
| `arrowButtonOptions` | — | Options forwarded to both `ArrowButton`s (color, stroke, etc.) |
| `touchAreaXDilation` / `touchAreaYDilation` | `0` / `0` | Expand the arrow buttons' touch hit areas |

## Methods

| Method | Effect |
| --- | --- |
| `setNumberFill( fill: TPaint )` | Sets the color of the displayed number text |

::: tip The arrow buttons disable themselves automatically at the range's edges
`NumberSpinner` links to both the value and the range Property internally and keeps each arrow button's `enabled` in sync — the increment button disables itself when `incrementFunction(value) > range.max`, and correspondingly for decrement. You don't need to wire this up yourself, even if the range changes dynamically.
:::
