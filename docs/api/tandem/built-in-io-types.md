---
title: Built-in IOTypes
description: A survey of tandem's ready-made IOType instances for JS primitives and common container shapes, and when to reach for one instead of writing a custom IOType.
category: api
library: tandem
tags: [tandem, phet-io, IOType, BooleanIO, NumberIO, StringIO, ReferenceIO, ArrayIO, EnumerationIO, MapIO, NullableIO, ObjectLiteralIO, OrIO, Float64ArrayIO, VoidIO]
status: complete
related:
  - /api/tandem/io-type
  - /api/tandem/phetio-object
  - /api/axon/property
prerequisites:
  - /api/tandem/io-type
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Built-in IOTypes

`scenerystack/tandem` ships a set of ready-made [`IOType`](/api/tandem/io-type) instances covering JS primitives and the handful of container shapes PhET-iO serialization needs over and over — so most `phetioValueType`/`phetioType` options in sim code reference one of these rather than a hand-authored `IOType`. Some are plain constants (`BooleanIO`); others are parametric *functions* that build (and cache) a fresh `IOType` for a given parameter type the first time you call them with it (`ArrayIO( NumberIO )`).

```ts
import {
  BooleanIO, NumberIO, StringIO, ReferenceIO, ArrayIO, EnumerationIO,
  MapIO, NullableIO, ObjectLiteralIO, OrIO, Float64ArrayIO, VoidIO
} from 'scenerystack/tandem';
```

## Non-parametric IOTypes

| IOType | Wraps | Notes |
| --- | --- | --- |
| `BooleanIO` | JS `boolean` | Identity serialization; state schema is a plain `'boolean'` value |
| `NumberIO` | JS `number` | Identity serialization; rejects `NaN` and `±Infinity` in its state-object validity check (see `InfiniteNumberIO` if you need to allow those) |
| `StringIO` | JS `string` | Identity serialization |
| `ObjectLiteralIO` | A plain object literal (`Object.getPrototypeOf(x) === Object.prototype`) | For ad hoc data bags that aren't worth a dedicated class; identity serialization |
| `VoidIO` | "no value" | Used to mark a function's return type (in an `IOType`'s `methods`) as having nothing meaningful to serialize back to the client |

## Parametric IOTypes (call them with parameter type(s))

| IOType | Signature | Notes |
| --- | --- | --- |
| `ArrayIO` | `ArrayIO( elementType )` | State is `elementType.toStateObject(x)` mapped over the array; validates every element against `elementType`'s validator |
| `NullableIO` | `NullableIO( parameterType )` | Adds `null` on top of `parameterType`'s existing behavior — `toStateObject`/`fromStateObject` both special-case `null` before delegating |
| `ReferenceIO` | `ReferenceIO( parameterType )` | Serializes to `{ phetioID }` (the referenced element's address) rather than its data — see warning below |
| `MapIO` | `MapIO( keyType, valueType )` | Serializes a JS `Map` as an array of `[keyState, valueState]` tuples |
| `OrIO` | `OrIO( [ typeA, typeB, … ] )` | A composite for "one of several types" — tries each `parameterType`'s validator in order and tags the serialized state with which one matched (`{ index, state }`) |
| `EnumerationIO` | `EnumerationIO( MyEnumeration )` | Given a `phet-core` `Enumeration`, serializes each value as its string key (e.g. `'HIGH'`) |
| `Float64ArrayIO` | (non-parametric, but listed here since it wraps a typed array) | Serializes a `Float64Array` as a plain `number[]`; supports `applyState` for updating an existing typed array in place |

## When to use a built-in IOType vs. defining a custom one

Composing built-in `IOType`s covers almost everything: a `Property<number>` uses `phetioValueType: NumberIO`; a `Property<number | null>` uses `NullableIO( NumberIO )`; a `Property<MyEnum>` uses `EnumerationIO( MyEnumeration )`. You reach for a **custom** `IOType` (as described in [IOType](/api/tandem/io-type)) only when:

- Your class isn't a `Property` wrapping one of these shapes — it's a [`PhetioObject`](/api/tandem/phetio-object) subclass with several fields that together need one composite `stateSchema`.
- You need custom `methods` exposed to PhET-iO clients (the built-in types expose none).
- None of the built-ins compose to describe your shape — e.g. a fixed-shape object (not a `Map`/`Array`) with several typed fields is usually better served by a `stateSchema` object literal (`{ x: NumberIO, y: NumberIO }`) directly on a custom `IOType`, rather than `ObjectLiteralIO`, which validates only that the value is *some* plain object with no schema at all.

::: warning `ReferenceIO` only works for instrumented `PhetioObject`s
`ReferenceIO(SomeIOType).toStateObject(x)` asserts that `x.isPhetioInstrumented()` is `true` under `Tandem.VALIDATION` — it serializes to `{ phetioID: x.tandem.phetioID }`, a pointer, not the object's data. If you reach for `ReferenceIO` for a value that isn't itself a real PhET-iO Element with a stable `phetioID` (e.g. a plain data object), you want a data-type `IOType` (with a real `toStateObject`/`stateSchema`) instead — `ReferenceIO` will look like it works until you try to deserialize state and hit `CouldNotYetDeserializeError` for an element that was never registered.
:::
