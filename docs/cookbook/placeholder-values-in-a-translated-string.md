---
title: Placeholder Values in a Translated String
description: Using PatternStringProperty to build "{{count}} items"-style strings that stay translatable and update reactively.
category: cookbook
tags: [axon, PatternStringProperty, DerivedProperty, i18n, strings]
status: complete
related:
  - /api/axon/pattern-string-property
  - /guides/internationalization-deep-dive
prerequisites:
  - /api/axon/pattern-string-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Placeholder Values in a Translated String

**Task:** a UI string needs to include a dynamic value — "3 particles remaining", "Score: 42" — and that string must still be fully translatable, including handling of languages where the value's position in the sentence differs from English.

Concatenating strings by hand (`particlesRemaining + ' ' + count`) breaks translation, since a translator can't reorder pieces that are only ever joined in one fixed order in code. [`PatternStringProperty`](/api/axon/pattern-string-property) (from `scenerystack/axon`) is the fix: the translated string itself contains the `{{placeholder}}` token, in whatever position that language's grammar requires, and `PatternStringProperty` fills it in reactively as the underlying value changes.

## The solution

```ts
import { PatternStringProperty, NumberProperty, TinyProperty } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';

const particleCountProperty = new NumberProperty( 3 );

// In real sim code this comes from a generated strings module backed by a
// translation file, e.g. MySimStrings.particlesRemainingStringProperty -
// a TinyProperty stands in here for a self-contained example.
const particlesRemainingPatternProperty = new TinyProperty( '{{count}} particles remaining' );

const particlesRemainingStringProperty = new PatternStringProperty(
  particlesRemainingPatternProperty,
  { count: particleCountProperty }
);

const particlesRemainingText = new Text( particlesRemainingStringProperty );
// particlesRemainingText reads "3 particles remaining"

particleCountProperty.value = 1;
// particlesRemainingText now reads "1 particles remaining" automatically -
// no manual re-render, and no separate singular/plural handling here (see below).
```

Because `particlesRemainingStringProperty` is itself a `TReadOnlyProperty<string>`, passing it straight to `Text`'s constructor is enough — `Text` accepts a string `Property` directly and updates its rendered content whenever the Property changes, so there's no `.link()` to write by hand.

## Multiple placeholders and derived formatting

`values` accepts as many placeholder names as the pattern string uses, and each can be a plain value or another `Property` (only the Property ones trigger re-derivation):

```ts
const scoreProperty = new NumberProperty( 0 );
const totalProperty = new NumberProperty( 10 );

const scorePatternProperty = new TinyProperty( 'Score: {{score}} of {{total}}' );

const scoreStringProperty = new PatternStringProperty( scorePatternProperty, {
  score: scoreProperty,
  total: totalProperty // a plain number here would also work, if the total never changes
} );
```

Use the `maps` option to convert a non-string/non-number value (or to round/rescale a numeric one) before substitution:

```ts
const distanceMetersProperty = new NumberProperty( 1234.5 );

const distanceStringProperty = new PatternStringProperty(
  new TinyProperty( '{{distance}} km' ),
  { distance: distanceMetersProperty },
  {
    maps: { distance: ( meters: number ) => meters / 1000 },
    decimalPlaces: 1
  }
);
// '1.2 km'
```

## Disposing dynamically-created instances

`PatternStringProperty` is a `DerivedProperty` under the hood, so an instance created for a transient piece of UI (a per-item label in a list) must be disposed when that UI goes away, the same as any other derived Property — see [Dispose and Memory Management](/patterns/dispose-and-memory-management):

```ts
const itemLabelStringProperty = new PatternStringProperty(
  new TinyProperty( '{{name}}: {{value}}' ),
  { name: item.nameProperty, value: item.valueProperty }
);
// ...later, when the item is removed:
itemLabelStringProperty.dispose();
```

## Options used here

| Option | Effect |
| --- | --- |
| `values` (second constructor argument) | Record mapping each `{{placeholder}}` name to a value or Property |
| `maps` | Per-key conversion functions run before substitution |
| `decimalPlaces` | Rounds numeric values (after any `map`) to a fixed number of decimals |

::: tip Plural forms need their own pattern string, not extra logic in code
English happily reads "1 particles remaining" without anyone noticing, but many languages have real plural-form grammar. `PatternStringProperty` itself doesn't solve plural forms — that's handled at the translation-string level (a translator provides a grammatically correct pattern for their language) together with the broader localization pipeline described in [Internationalization Deep Dive](/guides/internationalization-deep-dive), not by branching in application code on `count === 1`.
:::

::: warning The pattern must be a `Property`, not a plain string
`PatternStringProperty`'s first argument needs to be a `TReadOnlyProperty<string>` (typically a real translated `...StringProperty` from a generated strings module) so the whole derived string re-renders automatically if the locale changes at runtime — passing a plain string works at the type level for a `TinyProperty` wrapper but defeats the point if the real translated string Property is available and skipped in favor of a hardcoded literal.
:::
