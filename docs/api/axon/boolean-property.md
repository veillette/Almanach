---
title: BooleanProperty
description: A Property<boolean> with a toggle() convenience method.
category: api
library: axon
tags: [axon, BooleanProperty]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/number-property
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BooleanProperty

`BooleanProperty` (from `scenerystack/axon`) is a [`Property`](/api/axon/property) whose value is constrained to `boolean` — truthy/falsy non-boolean values are rejected by its built-in validator, not silently coerced. It's the standard type for simulation flags like "is the sim paused," "is this checkbox checked," or "is this Node visible."

```ts
import { BooleanProperty } from 'scenerystack/axon';

const isPlayingProperty = new BooleanProperty( true );

isPlayingProperty.link( isPlaying => {
  console.log( isPlaying ? 'playing' : 'paused' );
} );

isPlayingProperty.toggle(); // logs "paused"
```

## Methods

`BooleanProperty` adds exactly one method beyond what it inherits from [`Property`](/api/axon/property):

| Method | Effect |
| --- | --- |
| `toggle()` | Sets `value = !value` |

Everything else — `value`, `link`, `lazyLink`, `reset`, `dispose`, and so on — comes from `Property<boolean>`; see the [Property reference](/api/axon/property) for the full list.

## Options

`BooleanPropertyOptions` is `PropertyOptions<boolean>` with `isValidValue`, `valueType`, and `phetioValueType` removed — `BooleanProperty` sets `valueType: 'boolean'` and the PhET-iO `BooleanIO` type internally, so you cannot override them.

```ts
const isVisibleProperty = new BooleanProperty( false, {
  // any remaining PropertyOptions, e.g.:
  reentrant: false
} );
```

::: tip Combining booleans
To derive a boolean from other Properties (`a && b`, `a || b`, `!a`), don't write your own listener — use [`DerivedProperty.and`](/api/axon/derived-property), `.or`, and `.not`, which return a read-only `TReadOnlyProperty<boolean>` kept automatically in sync.
:::
