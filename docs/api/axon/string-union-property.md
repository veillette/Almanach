---
title: StringUnionProperty
description: A Property constrained to a fixed union of string literal values, with validValues and PhET-iO serialization set up automatically.
category: api
library: axon
tags: [axon, StringUnionProperty, Property, enumeration, TypeScript]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/property
  - /api/axon/enumeration-property
  - /patterns/enumeration-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StringUnionProperty

`StringUnionProperty<T extends string>` (from `scenerystack/axon`) is a thin [`Property`](/api/axon/property) subclass for the common TypeScript idiom of using a string literal union (`'small' | 'medium' | 'large'`) as a lightweight enumeration, instead of an [`EnumerationProperty`](/api/axon/enumeration-property) backed by a `Rich Enumeration` class. It requires `validValues` at construction (there's no way to construct one without it) and derives the PhET-iO `phetioValueType` from that list automatically via `StringUnionIO`.

```ts
import { StringUnionProperty } from 'scenerystack/axon';

type SizeChoice = 'small' | 'medium' | 'large';

const sizeProperty = new StringUnionProperty<SizeChoice>( 'medium', {
  validValues: [ 'small', 'medium', 'large' ]
} );

sizeProperty.value = 'large'; // fine
// sizeProperty.value = 'huge'; // would throw an assertion error — not in validValues
```

## Constructor

```ts
new StringUnionProperty<T extends string>( value: T, providedOptions: StringEnumerationPropertyOptions<T> )
```

Unlike plain `Property`, the options argument is **required** — `validValues` has no default and must be supplied.

## Options

`StringUnionProperty` accepts the same [`PropertyOptions<T>`](/api/axon/property) as `Property`, with two differences:

| Option | Effect |
| --- | --- |
| `validValues` | **Required.** The full list of legal string literal values — also used to build the `phetioValueType` |
| `phetioValueType` | Not settable — `StringUnionProperty` always computes it from `validValues` via `StringUnionIO` |

Everything else (`tandem`, `units`, `reentrant`, …) works exactly as it does on `Property`.

::: tip When to reach for this instead of EnumerationProperty
Use `StringUnionProperty` when the set of choices is small, has no associated behavior/data beyond the label itself, and is naturally expressed as a TypeScript string literal union already used elsewhere in your model's types. Use [`EnumerationProperty`](/api/axon/enumeration-property) instead when the values need to carry additional data or methods (a full PhET "Rich Enumeration" class) — see the [Enumeration Pattern](/patterns/enumeration-pattern) for the tradeoffs between the two approaches.
:::
