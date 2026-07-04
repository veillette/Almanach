---
title: NumberDisplay
description: A labeled, fixed-width numeric readout in a background rectangle, bound to a number Property.
category: api
library: scenery-phet
tags: [scenery-phet, NumberDisplay]
status: complete
related:
  - /api/scenery-phet/number-control
  - /api/scenery-phet/phet-font
  - /api/dot/range
prerequisites:
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# NumberDisplay

`NumberDisplay` (from `scenerystack/scenery-phet`) shows a `Property<number | null>`'s value as formatted text inside a bordered background rectangle. It pre-computes its width from a supplied `displayRange` so the background doesn't resize as the value changes — this is the readout half of [`NumberControl`](/api/scenery-phet/number-control), which composes one internally, but it's equally useful standalone whenever you need a numeric readout without a slider attached.

```ts
import { NumberDisplay } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const temperatureProperty = new NumberProperty( 20, { range: new Range( -20, 100 ) } );

const temperatureDisplay = new NumberDisplay( temperatureProperty, new Range( -20, 100 ), {
  decimalPlaces: 1,
  valuePattern: '{{value}} °C',
  align: 'right'
} );
```

## Constructor

```ts
new NumberDisplay(
  numberProperty: TReadOnlyProperty<number | null>,
  displayRange: Range,
  providedOptions?: NumberDisplayOptions
)
```

`displayRange` is used only to measure the widest possible formatted string (so the background is sized once and doesn't jitter) — it's independent of `numberProperty`'s own range and doesn't clamp the displayed value.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `align` | `'right'` | Horizontal alignment of the value text (`'center'`, `'left'`, `'right'`) |
| `valuePattern` | `SunConstants.VALUE_NAMED_PLACEHOLDER` (`'{{value}}'`) | Template the formatted value is filled into, e.g. `'{{value}} m/s'` |
| `decimalPlaces` | `0` | Decimal places to show; `null` displays the full value. Mutually exclusive with `numberFormatter` |
| `numberFormatter` | `null` | A `( n: number ) => string` for full control over formatting; mutually exclusive with `valuePattern`/`decimalPlaces`/`numberFormatOptions` |
| `useRichText` | `false` | Render the value with `RichText` instead of `Text` (needed for markup, e.g. superscripts) |
| `textOptions` | `{ font: new PhetFont(20), fill: 'black' }` | Options forwarded to the internal `Text`/`RichText` |
| `xMargin` / `yMargin` | `8` / `2` | Margin between the value text and the background edge |
| `cornerRadius` | `0` | Background rectangle corner radius |
| `backgroundFill` / `backgroundStroke` | `'white'` / `'lightGray'` | Background rectangle colors |
| `minBackgroundWidth` | `0` | Floor on the computed background width |
| `noValueString` | `MathSymbols.NO_VALUE` (an em dash) | Text shown when `numberProperty.value` is `null` — the PhET standard; avoid overriding lightly |
| `noValueAlign` / `noValuePattern` | fall back to `align` / `valuePattern` | Separate alignment/pattern for the no-value case, if needed |

## Public API

| Member | Description |
| --- | --- |
| `valueStringProperty` | Read-only `TReadOnlyProperty<string>` of the currently displayed (visual) text |
| `numberFont` / `numberFill` | Settable properties for the value text's font and fill |
| `backgroundFill` / `backgroundStroke` / `backgroundWidth` | Settable properties for the background rectangle |

::: tip `valuePattern` and `decimalPlaces` are mutually exclusive with `numberFormatter`
Pass either the simple `valuePattern` + `decimalPlaces` pair, or a `numberFormatter` function for full control — never both. `NumberDisplay` asserts if it detects both were customized, since it can't tell which formatting path should win.
:::
