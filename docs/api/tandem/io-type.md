---
title: IOType
description: Declares a class's PhET-iO serialization - state schema, methods, and documentation - independent of its runtime implementation.
category: api
library: tandem
tags: [tandem, phet-io, IOType]
status: verified
related:
  - /api/tandem/phetio-object
  - /api/tandem/phetio-group
  - /api/tandem/phetio-capsule
  - /guides/phet-io-and-instrumentation
prerequisites:
  - /guides/phet-io-and-instrumentation
  - /api/tandem/phetio-object
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# IOType

`IOType` (from `scenerystack/tandem`) is the class behind every `phetioType` option you pass to a [`PhetioObject`](/api/tandem/phetio-object) — it declares how a PhET-iO Element serializes to/from state, what public methods it exposes to the wrapper frame, and how it documents itself in Studio, all independent of the class's actual TypeScript implementation. `scenerystack/tandem` ships one for nearly every JS primitive (`BooleanIO`, `NumberIO`, `StringIO`, `ArrayIO`, `NullableIO`, …); you construct your own only when a custom class needs to describe serialization that composing existing `IOType`s doesn't already cover.

```ts
import { IOType, NumberIO } from 'scenerystack/tandem';

type PositionStateObject = { x: number; y: number };

const PositionIO = new IOType<Position, PositionStateObject>( 'PositionIO', {
  valueType: Position,
  documentation: 'A 2D position with x and y in model coordinates.',
  stateSchema: {
    x: NumberIO,
    y: NumberIO
  },
  toStateObject: position => ( { x: position.x, y: position.y } ),
  applyState: ( position, state ) => {
    position.x = state.x;
    position.y = state.y;
  }
} );
```

Every `IOType`'s name must end in `IO` (parametric types append their parameter in angle brackets, e.g. `PhetioGroupIO<ParticleIO>`) — `IOType` asserts this convention when computing a type's "core" name for documentation.

## The type hierarchy: `supertype`

`IOType`s form their own hierarchy via the `supertype` option, defaulting to `IOType.ObjectIO` (the root of the entire tree). Fields like `toStateObject`, `applyState`, and `methods` are inherited from `supertype` unless overridden at this level — so a `stateSchema` composed of already-declared `IOType`s (like `NumberIO` above) usually gets a working default `toStateObject`/`applyState` for free, without writing either function by hand.

## Key options

| Option | Default | Effect |
| --- | --- | --- |
| `supertype` | `IOType.ObjectIO` | Parent in the IOType hierarchy; inherited serialization/methods flow from here |
| `valueType` | — | A validator (constructor, string, or array of either) checking that instances are the expected runtime type |
| `documentation` | auto-generated | HTML-flavored text shown to PhET-iO clients in Studio |
| `stateSchema` | `null` | Either a composite object of `{ key: IOType }` pairs, or `StateSchema.asValue(...)` for primitive-like types (see `BooleanIO`) |
| `toStateObject` / `fromStateObject` | `null` | Explicit serialize/deserialize functions; often unnecessary if `stateSchema` is composite |
| `applyState` | `null` | Mutates an existing instance to match a deserialized state, used when setting PhET-iO state on a live object |
| `methods` | `{}` | Public methods exposed to PhET-iO clients, each with `parameterTypes`, `returnType`, and an `implementation` |
| `parameterTypes` | `[]` | For parametric types like `PhetioGroupIO<T>` — the `IOType`(s) this type is parameterized over |
| `events` | `[]` | Names of events this level of the hierarchy can emit to the data stream |

## Static member

| Member | Description |
| --- | --- |
| `IOType.ObjectIO` | The root of the entire `IOType` hierarchy; every other `IOType`'s `supertype` chain eventually reaches this |

::: tip Most simulations never author a custom `IOType`
Composing already-instrumented `Property`s inside a plain model class (each `Property` carrying its own built-in `IOType` like `NumberIO`/`BooleanProperty`'s `BooleanIO`) covers the overwhelming majority of PhET-iO instrumentation needs — see [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation#iotype-describing-serialization). Reach for a hand-written `IOType` only when a class holds state that isn't already expressed as instrumented `Property`s, such as the dynamic-element containers [`PhetioGroup`](/api/tandem/phetio-group) and [`PhetioCapsule`](/api/tandem/phetio-capsule).
:::
