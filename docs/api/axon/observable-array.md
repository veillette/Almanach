---
title: Observable Array
description: "createObservableArray: a Property-like array with add/remove item emitters."
category: api
library: axon
tags: [axon, observable-array, collections]
status: complete
prerequisites:
  - /api/axon/property
  - /api/axon/emitter
related:
  - /api/axon/number-property
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Observable Array (createObservableArray)

`createObservableArray<T>` (from `scenerystack/axon`) builds an object with the exact same API as a native JavaScript `Array<T>` — you can `push`, `pop`, `splice`, index with `[i]`, iterate, etc. — but that also notifies listeners whenever its contents change. Internally it wraps a real array in a `Proxy` and exposes an [`Emitter`](/api/axon/emitter) for additions, an `Emitter` for removals, and a [`NumberProperty`](/api/axon/number-property) tracking the length.

```ts
import { createObservableArray } from 'scenerystack/axon';

const particles = createObservableArray<{ id: number }>();

particles.elementAddedEmitter.addListener( particle => console.log( 'added', particle.id ) );
particles.elementRemovedEmitter.addListener( particle => console.log( 'removed', particle.id ) );
particles.lengthProperty.link( length => console.log( 'count:', length ) );

particles.push( { id: 1 } ); // logs "added 1", then "count: 1"
particles.pop();             // logs "removed 1", then "count: 0"
```

`lengthProperty` always updates *before* the corresponding `elementAddedEmitter`/`elementRemovedEmitter` fires, so a listener on either emitter can safely read the up-to-date `lengthProperty.value`.

## Observable members

| Member | Type | Notes |
| --- | --- | --- |
| `elementAddedEmitter` | `TEmitter<[T]>` | Fires once per element added (`push`, `unshift`, `splice` insertions, index assignment, etc.) |
| `elementRemovedEmitter` | `TEmitter<[T]>` | Fires once per element removed |
| `lengthProperty` | `NumberProperty` | Mirrors `.length`; read-only in practice — don't set it directly |

## Array-like and convenience methods

All standard `Array<T>` methods work as expected (`push`, `pop`, `shift`, `unshift`, `splice`, `map`, `filter`, `forEach`, indexing, `for...of`, ...). `createObservableArray` also layers on PhET-specific convenience methods:

| Method | Effect |
| --- | --- |
| `add( element )` | Alias for `push( element )` |
| `addAll( elements )` | Pushes every element in `elements` |
| `remove( element )` | Removes the first matching element |
| `removeAll( elements )` | Removes every matching element in `elements` |
| `clear()` | Empties the array (pops until empty, so removal notifications still fire) |
| `count( predicate )` | Number of elements matching `predicate` |
| `find( predicate, fromIndex? )` | First matching element, or `undefined` |
| `get( index )` | Same as `array[index]` |
| `getArrayCopy()` | A plain (non-observable) `T[]` snapshot |
| `shuffle( random )` | Reorders in place via a `{ shuffle }`-shaped random source, without firing add/remove notifications |
| `addItemAddedListener` / `removeItemAddedListener` | Legacy aliases for `elementAddedEmitter.addListener` / `removeListener` |
| `addItemRemovedListener` / `removeItemRemovedListener` | Legacy aliases for `elementRemovedEmitter.addListener` / `removeListener` |
| `reset()` | Restores the array to the `elements`/`length` it was constructed with |
| `dispose()` | Disposes `elementAddedEmitter`, `elementRemovedEmitter`, and `lengthProperty` |

## Options

```ts
const readingsArray = createObservableArray<number>( {
  elements: [ 0, 0, 0 ]
} );
```

| Option | Effect |
| --- | --- |
| `elements` | Initial contents (mutually exclusive with `length`) |
| `length` | Initial length, filled with `undefined` (mutually exclusive with `elements`) |
| `elementAddedEmitterOptions` | Options forwarded to the internal `elementAddedEmitter` |
| `elementRemovedEmitterOptions` | Options forwarded to the internal `elementRemovedEmitter` |
| `lengthPropertyOptions` | Options forwarded to the internal `lengthProperty` |

::: tip It's a function, not a class
There is no `ObservableArray` constructor to `new` up — call `createObservableArray<T>(options?)` and you get back a value that satisfies both `T[]` and the observable API table above. The exported `ObservableArray<T>` name from `scenerystack/axon` is a *type*, useful for annotating a field or parameter, not a runtime class.
:::

::: warning Prefer this over an array of Properties for "add/remove" collections
If you find yourself keeping a plain `T[]` alongside a manually-maintained `Emitter` for adds and another for removes, that's exactly what `createObservableArray` already does — and it keeps `lengthProperty` in sync for you, which is easy to get wrong by hand. See [DerivedProperty](/api/axon/derived-property) if you need a *value* computed from the array's contents (e.g. a sum), by pairing `DerivedProperty.deriveAny` with `lengthProperty` or `recomputeDerivation()` triggered from `elementAddedEmitter`/`elementRemovedEmitter`.
:::
