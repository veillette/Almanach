---
title: StringProperty
description: A Property<string>'s role in localizable, translatable values.
category: api
library: axon
tags: [axon, StringProperty, localization]
status: verified
prerequisites:
  - /api/axon/property
related:
  - /api/axon/enumeration-property
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StringProperty

`StringProperty` (from `scenerystack/axon`) is a [`Property`](/api/axon/property) whose value must be a `string`. It adds no methods beyond `Property<string>` — its entire job is fixing `valueType: 'string'` and the PhET-iO `StringIO` type so every string-valued piece of simulation state validates and serializes consistently.

```ts
import { StringProperty } from 'scenerystack/axon';

const labelProperty = new StringProperty( 'Start' );

labelProperty.link( label => console.log( 'button label:', label ) );
labelProperty.value = 'Resume';
```

## Options

`StringPropertyOptions` is `PropertyOptions<string>` with `valueType` and `phetioValueType` removed, since `StringProperty` sets both internally (`'string'` and `StringIO`, respectively). All other [`PropertyOptions`](/api/axon/property) — `validValues`, `isValidValue`, `units`, `reentrant`, etc. — pass through normally:

```ts
const modeProperty = new StringProperty( 'idle', {
  validValues: [ 'idle', 'running', 'paused' ]
} );
```

## Role in localization

Displayed, translatable UI text in SceneryStack simulations is generally exposed through generated `StringProperty` instances (from the sim's `-strings_en.json` and Fluent-based string modules), not through this constructor directly — but the underlying contract is the same `Property<string>` API described here and on the [Property](/api/axon/property) page: `.value`, `.link()`, `.dispose()`. Any `scenery` Node that displays text (e.g. `Text`, `RichText`) accepts a `TReadOnlyProperty<string>` for its `string`/`stringProperty` option, so a plain `StringProperty` is a fine stand-in during development before the translated strings pipeline is wired up.

::: tip Restricting to a fixed set of strings
If a string Property should only ever hold one of a small, fixed set of values (e.g. `'idle' | 'running' | 'paused'`), consider whether an [`EnumerationProperty`](/api/axon/enumeration-property) backed by an `EnumerationValue` subclass is a better fit than a raw `StringProperty` with `validValues` — the enumeration gives you compile-time exhaustiveness checks that a string union does not.
:::
