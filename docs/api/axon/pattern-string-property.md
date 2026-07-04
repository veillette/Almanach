---
title: PatternStringProperty
description: A derived string Property that fills a translated pattern string's placeholders from other Properties or plain values.
category: api
library: axon
tags: [axon, PatternStringProperty, DerivedProperty, i18n, strings]
status: verified
prerequisites:
  - /api/axon/derived-property
related:
  - /api/axon/derived-property
  - /api/axon/string-property
  - /api/phetcommon/phetcommon-query-parameters
  - /guides/internationalization-deep-dive
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PatternStringProperty

`PatternStringProperty<Values>` (from `scenerystack/axon`) is a specialized [`DerivedProperty`](/api/axon/derived-property) (technically, a `DerivedStringProperty`) that fills `{{placeholder}}` tokens in a translated pattern string with values pulled from other Properties, automatically re-deriving whenever the pattern string or any value Property changes. This is the standard way to build a translated, dynamic UI string like "Score: {{score}}" or "{{count}} particles remaining" without hand-rolling a `DerivedProperty` and a `StringUtils.fillIn` call yourself.

```ts
import { PatternStringProperty, NumberProperty, TinyProperty } from 'scenerystack/axon';

const scoreProperty = new NumberProperty( 0 );
const patternProperty = new TinyProperty( '{{score}} points' ); // typically a translated StringProperty

const scoreStringProperty = new PatternStringProperty( patternProperty, {
  score: scoreProperty
} );

scoreStringProperty.value; // '0 points'
scoreProperty.value = 12;
scoreStringProperty.value; // '12 points'
```

Values may be plain strings/numbers or Properties of strings/numbers — both work in the `values` record, and only the Property ones become dependencies that trigger re-derivation.

## Constructor

```ts
new PatternStringProperty( patternProperty, values, providedOptions? )
```

| Parameter | Effect |
| --- | --- |
| `patternProperty` | A `TReadOnlyProperty<string>` holding the pattern, e.g. a localized `...StringProperty` with `{{name}}`-style placeholders |
| `values` | A record mapping each placeholder name to a `string \| number \| TReadOnlyProperty<string \| number>` (or, with a `maps` entry, any other Property type) |
| `providedOptions` | See below |

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `maps` | `{}` | Per-key functions converting a value to `string \| number` before substitution — **required** for any key whose value isn't already `string`, `number`, or a Property of those |
| `decimalPlaces` | `null` | Rounds numeric values (after any `map`) to a fixed number of decimals; either one number applied to every numeric value, or a per-key record |
| `formatNames` | `[]` | Back-compat shim for patterns written for `StringUtils.format`'s `{0}`/`{1}` style — lists the placeholder names those positional indices map to |

```ts
const gramsProperty = new NumberProperty( 2143 );

const kilogramsStringProperty = new PatternStringProperty(
  new TinyProperty( '{{kilograms}} kg' ),
  { kilograms: gramsProperty },
  {
    maps: { kilograms: ( grams: number ) => grams / 1000 },
    decimalPlaces: 2
  }
);

kilogramsStringProperty.value; // '2.14 kg'
```

::: tip It's a DerivedProperty — dispose it
Because `PatternStringProperty` is built on `DerivedProperty`, it lazy-links to `patternProperty` and every value Property passed in, and its value can't be set directly. Always `dispose()` a `PatternStringProperty` you create dynamically (e.g. per list item), the same as any other `DerivedProperty`.
:::
