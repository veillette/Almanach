---
title: ReadOnlyProperty
description: The base observable class Property extends — the public type exposed by anything that shouldn't be externally settable.
category: api
library: axon
tags: [axon, ReadOnlyProperty, Property, DerivedProperty, reactive]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/property
  - /api/axon/derived-property
  - /api/axon/dynamic-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ReadOnlyProperty

`ReadOnlyProperty<T>` (from `scenerystack/axon`) is the base class that [`Property`](/api/axon/property) extends. It implements everything about an observable value — `.value`/`.get()`, `link()`, `lazyLink()`, `unlink()`, `dispose()`, PhET-iO serialization — except the ability to *set* the value from outside: its `set()`/`value=` accessors are `protected`, and its constructor is `protected` too, so you never instantiate `ReadOnlyProperty` directly. Subclasses fall into two families: `Property` (and its typed siblings `BooleanProperty`, `NumberProperty`, ...) re-expose `set`/`value=` as `public`, making the value externally settable; [`DerivedProperty`](/api/axon/derived-property) and [`DynamicProperty`](/api/axon/dynamic-property) leave them protected, so the only way their value changes is through their own internal logic.

```ts
import { ReadOnlyProperty, DerivedProperty, NumberProperty } from 'scenerystack/axon';

const widthProperty = new NumberProperty( 4 );
const heightProperty = new NumberProperty( 3 );

const areaProperty: ReadOnlyProperty<number> = new DerivedProperty(
  [ widthProperty, heightProperty ],
  ( width, height ) => width * height
);

areaProperty.isSettable(); // false - DerivedProperty never overrides this
// areaProperty.value = 100; // compile error: 'value' is protected on ReadOnlyProperty
```

## Why public APIs say `ReadOnlyProperty<T>`, not `Property<T>`

When a class exposes a derived or gated value — `isValidProperty`, `areaProperty`, anything built with `DerivedProperty` or `DynamicProperty` — its public field should be typed `ReadOnlyProperty<T>` (or the narrower `TReadOnlyProperty<T>` interface), never `Property<T>`. Typing it as `Property<T>` would be a lie: it advertises a settable `.value=` that either doesn't exist at runtime (TypeScript would happily compile `areaProperty.value = 5`, since `Property` widens the type) or, worse, silently succeeds and desyncs from the derivation. Reserve the `Property<T>` type annotation for fields you actually construct as a plain, externally-settable `Property` (or subclass).

## Public API

`ReadOnlyProperty` provides the full read side of the Property API; only `set`/`value=` are missing (protected) compared to `Property`:

| Member | Effect |
| --- | --- |
| `value` (getter) / `get()` | The current value |
| `link( listener )` / `lazyLink( listener )` | Subscribe to changes, with or without an immediate callback |
| `unlink( listener )` / `unlinkAll()` | Remove one or all listeners |
| `hasListener( listener )` / `hasListeners()` | Inspect subscriptions |
| `isSettable()` | Returns `false` on `ReadOnlyProperty` and any subclass that doesn't override it (e.g. `DerivedProperty`); `Property` overrides it to `true` |
| `isValueValid( value )` / `getValidationError( value )` | Check a candidate value against the Property's validator without setting it |
| `linkAttribute( object, attributeName )` | Convenience: sets `object[attributeName] = value` on every change |
| `toString()` / `debug( name )` | Console-debugging helpers |
| `dispose()` | Removes all listeners and marks the instance disposed |

::: tip Use `isSettable()` to branch on capability at runtime
Because both `Property` and `ReadOnlyProperty` share this same base type, `isSettable()` is the correct runtime check when code receives a `TReadOnlyProperty<T>` and needs to know whether it's safe to attempt a cast-and-set (some PhET-iO and Studio tooling does exactly this). Don't rely on `instanceof Property` for this — prefer the method, since it's what the class itself uses internally to guard `PhetioStateEngine` value-setting.
:::
