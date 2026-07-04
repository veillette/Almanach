---
title: DerivedProperty
description: A read-only Property computed from one or more dependencies.
category: api
library: axon
tags: [axon, DerivedProperty]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/multilink
  - /api/axon/boolean-property
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# DerivedProperty

`DerivedProperty<T, ...>` (from `scenerystack/axon`) is a read-only Property whose value is automatically recomputed whenever any of its dependency Properties change. It extends the same `ReadOnlyProperty` base as [`Property`](/api/axon/property), so it supports `.value`, `.link()`, `.lazyLink()`, etc. — but calling `.value = ...` on it is a programming error; the value can only change via the derivation function.

```ts
import { DerivedProperty, NumberProperty } from 'scenerystack/axon';

const widthProperty = new NumberProperty( 4 );
const heightProperty = new NumberProperty( 3 );

const areaProperty = new DerivedProperty(
  [ widthProperty, heightProperty ],
  ( width, height ) => width * height
);

areaProperty.link( area => console.log( 'area:', area ) ); // logs "area: 12" immediately
widthProperty.value = 5;                                    // logs "area: 15"
```

The derivation function receives the current `.value` of each dependency, in the same order as the `dependencies` array, and its return type determines `T`.

## Constructor

```ts
new DerivedProperty( dependencies, derivation, providedOptions? )
```

`dependencies` is an array of up to 15 `TReadOnlyProperty<...>` instances (any Property, including another `DerivedProperty`); overloads pick the matching arity so `derivation`'s parameter types line up automatically.

## Members

| Member | Effect |
| --- | --- |
| `recomputeDerivation()` | Force a recompute — useful when a non-Property event (an [`Emitter`](/api/axon/emitter), an observable array's `elementAddedEmitter`) should also trigger recomputation |
| `hasDependency( dependency )` | Whether a given Property is one of this DerivedProperty's dependencies |
| `dispose()` | Unlinks from every dependency; always dispose a `DerivedProperty` you own once it's no longer needed |

## Static factories

Rather than writing a derivation by hand for common cases, `DerivedProperty` offers static helpers that return a `TReadOnlyProperty`:

| Static method | Produces |
| --- | --- |
| `DerivedProperty.and( properties )` | `true` iff every boolean-valued Property is `true` |
| `DerivedProperty.or( properties )` | `true` iff any boolean-valued Property is `true` |
| `DerivedProperty.not( property )` | The logical inverse of a boolean Property |
| `DerivedProperty.valueEquals( a, b )` | `true` iff `a.value === b.value` |
| `DerivedProperty.valueNotEquals( a, b )` | `true` iff `a.value !== b.value` |
| `DerivedProperty.valueEqualsConstant( a, value )` | `true` iff `a.value === value` |
| `DerivedProperty.add( properties )` / `.multiply( properties )` | Sum / product of number-valued Properties |
| `DerivedProperty.toFixedProperty( numberProperty, decimalPlaces )` | A `string` Property formatting the number to a fixed number of decimals |
| `DerivedProperty.fromRecord( key, record )` | Looks up `record[key.value]`, following through if the record's value is itself a Property |
| `DerivedProperty.deriveAny( dependencies, derivation )` | Escape hatch for more than 15 dependencies or a dynamically-sized dependency array |

```ts
import { BooleanProperty } from 'scenerystack/axon';

const isRunningProperty = new BooleanProperty( true );
const isEnabledProperty = new BooleanProperty( true );

const isActiveProperty = DerivedProperty.and( [ isRunningProperty, isEnabledProperty ] );
```

::: warning Read-only — and remember to dispose
`DerivedProperty` overrides `set`/`value=` to throw; it's read-only by design (`phetioReadOnly: true` internally). It also `lazyLink`s to every dependency in its constructor, so an undisposed `DerivedProperty` keeps its dependencies alive — always call `.dispose()` when the derived value is no longer needed, symmetric with any Property you construct yourself.
:::

If you need to react to several Properties without producing a *new* Property value — just running a side-effecting callback — use [`Multilink`](/api/axon/multilink) instead.
