---
title: DynamicProperty
description: A Property that re-points itself to follow whichever inner Property a source Property currently holds.
category: api
library: axon
tags: [axon, DynamicProperty, Property, MappedProperty]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/property
  - /api/axon/derived-property
  - /api/axon/tiny-property
  - /api/axon/unit-conversion-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# DynamicProperty

`DynamicProperty<ThisValueType, InnerValueType, OuterValueType>` (from `scenerystack/axon`) solves a specific problem [`DerivedProperty`](/api/axon/derived-property) can't: following a Property *of* Properties. Given a `Property<Property<Color>>` — for example a `currentSceneProperty` whose value is itself a scene's `backgroundColorProperty` — `DynamicProperty` produces a plain `Property<Color>` that automatically re-subscribes to whichever inner Property is current, so consumers never have to unlink from the old scene and relink to the new one by hand.

```ts
import { DynamicProperty, Property } from 'scenerystack/axon';

const firstProperty = new Property( 'red' );
const secondProperty = new Property( 'blue' );
const currentProperty = new Property( firstProperty ); // Property<Property<string>>

const colorProperty = new DynamicProperty( currentProperty );
colorProperty.value; // 'red' — currentProperty.value is firstProperty

firstProperty.value = 'yellow';
colorProperty.value; // 'yellow' — still following firstProperty

currentProperty.value = secondProperty; // switch which Property is active
colorProperty.value; // 'blue'
```

If `currentProperty.value` is ever `null`, `DynamicProperty` falls back to its `defaultValue` option rather than throwing.

## Constructor

```ts
new DynamicProperty( valuePropertyProperty, providedOptions? )
```

`valuePropertyProperty` is the outer, "Property of Properties" source; its value may be `null` to mean "disconnected."

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `derive` | identity | A function `(outerValue) => TReadOnlyProperty<InnerValueType>`, or a string key, for reaching an inner Property that's nested inside the outer value (e.g. `derive: 'backgroundColorProperty'` when the outer Property holds a `Scene` object rather than a Property directly) |
| `defaultValue` | `null` | The `InnerValueType` used (before `map`) when `valuePropertyProperty.value` is `null` |
| `map` | identity | Maps the inner Property's value to `ThisValueType` — lets `DynamicProperty` change type, not just source |
| `inverseMap` | identity | Required alongside `map` only if `bidirectional: true` and the mapping isn't its own inverse |
| `bidirectional` | `false` | If `true`, setting `dynamicProperty.value` writes back through `inverseMap` into the currently-active inner Property, instead of throwing |

```ts
// Bidirectional example, plus a map that changes the exposed type
const dynamicProperty = new DynamicProperty( currentProperty, {
  bidirectional: true,
  map: ( n: number ) => `${n}`,
  inverseMap: ( s: string ) => Number.parseFloat( s )
} );
```

## Methods

| Method | Effect |
| --- | --- |
| `reset()` | Resets whichever inner Property is currently active (asserts if not `bidirectional`) |
| `dispose()` | Unlinks from both the outer Property and the currently-active inner Property |

::: tip MappedProperty is DynamicProperty with the wrapping done for you
[`UnitConversionProperty`](/api/axon/unit-conversion-property) and the general-purpose `MappedProperty` are both literally `DynamicProperty` subclasses that wrap a single source Property in a `TinyProperty` internally, so you get `map`/`inverseMap`/`bidirectional` without needing an outer "Property of Properties." Reach for `DynamicProperty` directly only when the thing you're following can actually change — a `currentSceneProperty`-style source — not just when you want to transform one Property's value into another.
:::
