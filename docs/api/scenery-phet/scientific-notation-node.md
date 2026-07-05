---
title: ScientificNotationNode
description: Renders a number Property as mantissa x 10^exponent, updating live as the value changes.
category: api
library: scenery-phet
tags: [scenery-phet, ScientificNotationNode, number-formatting]
status: complete
related:
  - /api/scenery-phet/number-display
  - /api/scenery-phet/phet-font
  - /api/axon/property
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ScientificNotationNode

`ScientificNotationNode` (from `scenerystack/scenery-phet`) displays a numeric `TReadOnlyProperty<number | null>` as `M x 10^E` — a mantissa, a "x 10" label, and a superscript-styled exponent — updating automatically whenever the Property changes. It handles the layout of the three text pieces (mantissa, "x 10", exponent) for you, including several special-cased display simplifications for integers and zero.

```ts
import { ScientificNotationNode } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const valueProperty = new NumberProperty( 0.0002342 );

const notationNode = new ScientificNotationNode( valueProperty, {
  mantissaDecimalPlaces: 2
} );
// displays "2.34 x 10⁻⁴" (10 with a small, raised exponent)

valueProperty.value = 8000;
// showIntegersAsMantissaOnly defaults to false, so this still displays as "8 x 10³"
```

## Constructor

```ts
new ScientificNotationNode(
  valueProperty: TReadOnlyProperty<number | null>,
  providedOptions?: ScientificNotationNodeOptions
)
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `font` | `PhetFont( 20 )` | Font for the mantissa and "x 10" text |
| `fill` | `'black'` | Text color |
| `exponent` | `null` | Force a specific exponent (mantissa is scaled to match); `null` computes the exponent so the mantissa has exactly one digit before the decimal point |
| `mantissaDecimalPlaces` | `1` | Decimal places shown in the mantissa |
| `exponentScale` | `0.75` | Scale of the exponent text relative to the mantissa/"x 10" text |
| `showIntegersAsMantissaOnly` | `false` | If `true`, integers display as a plain number (`'8000'`) instead of `'8 x 10^3'` |
| `showZeroAsInteger` | `true` | If `true`, a zero mantissa displays as `'0'` instead of `'0 x 10^E'` |
| `showZeroExponent` | `false` | If `false`, an exponent of `0` displays as just the mantissa (`'M'`) instead of `'M x 10^0'` |
| `nullValueString` | `MathSymbols.NO_VALUE` | Displayed string when `valueProperty`'s value is `null` |

## Static method

| Method | Effect |
| --- | --- |
| `ScientificNotationNode.toScientificNotation( value, options? )` | Pure function (no Node needed) converting a finite `number` to `{ mantissa: string; exponent: string }`, using the same `mantissaDecimalPlaces`/`exponent` options |

::: tip Non-finite values bypass scientific notation entirely
If `valueProperty`'s value is `null`, `NaN`, or `±Infinity`, `ScientificNotationNode` shows `nullValueString`, `'NaN'`, or `'Infinity'`/`'-Infinity'` respectively — it never calls `toScientificNotation` on a non-finite number (which would throw, since `toScientificNotation` asserts its input `isFinite`). If you need custom formatting for those edge cases, handle them in a sibling Node rather than expecting an option here.
:::
