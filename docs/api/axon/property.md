---
title: Property
description: The base observable value wrapper underlying all reactive state.
category: api
library: axon
tags: [axon, Property, reactive]
status: complete
related:
  - /api/axon/boolean-property
  - /api/axon/number-property
  - /api/axon/string-property
  - /api/axon/enumeration-property
  - /api/axon/derived-property
  - /api/axon/multilink
  - /patterns/emitter-vs-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Property

`Property<T>` (from `scenerystack/axon`) is the base observable value wrapper that all reactive state in a SceneryStack simulation is built on. It holds a single current value, notifies listeners when that value changes, and remembers its initial value so it can be `reset()`. Almost every other axon class — [`BooleanProperty`](/api/axon/boolean-property), [`NumberProperty`](/api/axon/number-property), [`StringProperty`](/api/axon/string-property), [`EnumerationProperty`](/api/axon/enumeration-property) — is a thin, typed subclass of `Property`, and [`DerivedProperty`](/api/axon/derived-property) is a read-only sibling built on the same base (`ReadOnlyProperty`).

```ts
import { Property } from 'scenerystack/axon';

const isPausedProperty = new Property<boolean>( false );

isPausedProperty.link( isPaused => {
  console.log( 'paused:', isPaused );
} );

isPausedProperty.value = true; // logs "paused: true"
```

## Reading and writing

`value` is the idiomatic get/set (there are also `get()`/`set()` methods that do the same thing, useful in hot inner loops):

```ts
const speedProperty = new Property( 1 );

speedProperty.value = 2;        // triggers listeners if the value actually changed
console.log( speedProperty.value ); // 2

speedProperty.reset();          // back to the initial value (1)
```

## Listening for changes

| Method | Behavior |
| --- | --- |
| `link( listener )` | Adds a listener and immediately calls it once with `( value, null, this )` |
| `lazyLink( listener )` | Adds a listener without an immediate callback |
| `unlink( listener )` | Removes a specific listener |
| `unlinkAll()` | Removes every listener |
| `hasListener( listener )` | Checks whether a listener is registered |
| `linkAttribute( object, attributeName )` | Convenience: sets `object[attributeName] = value` whenever the Property changes |

```ts
const listener = ( newValue: number, oldValue: number | null ) => {
  console.log( `${oldValue} -> ${newValue}` );
};

speedProperty.link( listener );     // fires immediately with (1, null)
speedProperty.lazyLink( listener ); // does not fire immediately
speedProperty.unlink( listener );
```

## Other members

| Member | Effect |
| --- | --- |
| `initialValue` (getter) | The value the Property was constructed with |
| `getInitialValue()` / `setInitialValue( value )` | Explicit accessors for the initial value; use `setInitialValue` sparingly, only when the "reset" value isn't known until after construction |
| `reset()` | Sets the value back to `initialValue` |
| `isSettable()` | Returns `true` for `Property` (subclasses like `DerivedProperty` override this to `false`) |
| `dispose()` | Removes all listeners and marks the Property as disposed |
| `isValueValid( value )` / `getValidationError( value )` | Check a candidate value against the Property's validator without setting it |

## Options

`Property` accepts a `PropertyOptions<T>` object as its second constructor argument. The most commonly used options for simulation code:

| Option | Effect |
| --- | --- |
| `valueType` | A validator shorthand, e.g. `'boolean'`, `'number'`, or a constructor, checked on every `set()` |
| `validValues` | Restrict the value to a fixed array of allowed values |
| `isValidValue` | A custom `( value ) => boolean` predicate |
| `units` | Physical units string for PhET-iO/documentation purposes |
| `reentrant` | Allow a listener to set the Property's own value again while notifications are in progress (default `false`) |

::: tip Prefer a typed subclass
Reach for `Property<T>` directly only when there isn't a more specific subclass. For booleans, numbers, strings, and enum values, use [`BooleanProperty`](/api/axon/boolean-property), [`NumberProperty`](/api/axon/number-property), [`StringProperty`](/api/axon/string-property), or [`EnumerationProperty`](/api/axon/enumeration-property) instead — they bake in the right validators and PhET-iO serialization automatically.
:::

::: warning Property vs. Emitter
A `Property` always has a *current value* that new listeners immediately receive on `link()`. If you need to broadcast a discrete occurrence that has no persistent state — a "button pressed" or "collision happened" moment — use [`Emitter`](/api/axon/emitter) instead. See [Emitter vs. Property](/patterns/emitter-vs-property) for the full guidance.
:::
