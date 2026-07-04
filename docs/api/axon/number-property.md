---
title: NumberProperty
description: A Property<number> with an optional range for validation and UI binding.
category: api
library: axon
tags: [axon, NumberProperty, range]
status: verified
prerequisites:
  - /api/axon/property
related:
  - /api/axon/boolean-property
  - /api/axon/derived-property
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# NumberProperty

`NumberProperty` (from `scenerystack/axon`) is a [`Property`](/api/axon/property) whose value must be a number, with an optional `range` that both validates the value and is exposed to UI components (like sliders) that need to know the legal bounds. The range itself is stored as its own nested `rangeProperty`, so range and value can each be observed independently.

```ts
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const volumeProperty = new NumberProperty( 0.5, {
  range: new Range( 0, 1 )
} );

volumeProperty.link( volume => console.log( 'volume:', volume ) );

volumeProperty.value = 1.5; // throws an assertion error in dev builds: outside rangeProperty's range
```

## Options

| Option | Effect |
| --- | --- |
| `range` | A `Range` (or a `Property<Range>` for a dynamic range) that values are validated against |
| `numberType` | `'FloatingPoint'` (default) or `'Integer'` — `'Integer'` adds a validator requiring `value % 1 === 0` |
| `rangePropertyOptions` | Options forwarded to the internally-created `rangeProperty`, ignored if you passed a `Property<Range>` for `range` |

All other [`PropertyOptions`](/api/axon/property) (e.g. `units`, `reentrant`) are supported too; `valueType` and `phetioValueType` are fixed to `'number'` / `NumberIO` internally.

## Members and methods

| Member | Effect |
| --- | --- |
| `range` (getter/setter) | Reads or replaces the current `Range` value (shorthand for `rangeProperty.value`) |
| `rangeProperty` | The underlying `Property<Range>` — link to it directly if a UI element needs to react to range changes |
| `setValueAndRange( value, range )` | Atomically sets both value and range so an intermediate state never fails validation |
| `resetValueAndRange()` | Resets both `value` and `range` back to their initial values together |
| `reset()` | Overridden to reset value and range atomically, then defer to `Property.reset()` |

```ts
const angleProperty = new NumberProperty( 0, { range: new Range( 0, 90 ) } );

// Grow the range and set an out-of-old-range value without a transient validation error:
angleProperty.setValueAndRange( 120, new Range( 0, 180 ) );
```

::: warning Range changes are validated immediately
Setting `.range = ...` directly re-validates the *current* value against the new range right away. If the new range wouldn't contain the current value, use `setValueAndRange()` (or `setDeferred`) to change both together — otherwise you'll trip an assertion in dev builds.
:::
