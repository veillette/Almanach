---
title: PhET-iO and Instrumentation
description: Conceptual guide to PhET-iO - what instrumentation buys you and how Tandem fits in.
category: guides
tags: [phet-io, tandem, instrumentation]
status: draft
related:
  - /getting-started/your-first-simulation
  - /patterns/model-view-separation
  - /guides/building-your-first-screen
prerequisites:
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhET-iO and Instrumentation

PhET-iO is the layer that turns a running simulation into something an external program can inspect, record, and control: every instrumented object's state can be serialized, saved, restored, and set remotely — the same mechanism that powers PhET's state-saving, data-collection, and interoperability features. **Instrumentation is opt-in and additive**: an uninstrumented simulation runs identically, just without that external surface.

## Tandem: the instrumentation identifier

Every instrumentable object — `Property`, `Node`, `Screen`, `Emitter`, and the PhET-iO base class `PhetioObject` they build on — takes a `tandem` option. A `Tandem` is a hierarchical path name (mirroring where the object lives conceptually, not necessarily in the scene graph) that becomes that object's stable identifier in the PhET-iO API:

```ts
import { Tandem } from 'scenerystack/tandem';
import { NumberProperty } from 'scenerystack/axon';

const screenTandem = Tandem.ROOT.createTandem( 'myScreen' );
const modelTandem = screenTandem.createTandem( 'model' );

const massProperty = new NumberProperty( 5, {
  tandem: modelTandem.createTandem( 'massProperty' ),
  phetioDocumentation: 'the mass of the object, in kilograms'
} );
```

| Tandem | Meaning |
| --- | --- |
| `Tandem.ROOT` | The root of the tandem tree for the whole simulation |
| `Tandem.REQUIRED` | Placeholder meaning "this tandem must be supplied by the caller" — used in components designed to always be instrumented |
| `Tandem.OPTIONAL` | Placeholder meaning "instrumentation is optional here" |
| `someTandem.createTandem( name )` | Creates a child tandem, extending the hierarchical path |

Every `Screen` requires a `tandem`, even in a simulation that never enables PhET-iO — see [Your First Simulation](/getting-started/your-first-simulation). Uninstrumented (`tandem: Tandem.OPTIONAL`, unsupplied) objects simply don't appear in the PhET-iO API; nothing breaks by omitting instrumentation, but nothing is inspectable/settable externally either.

## What instrumentation buys you

| Capability | How |
| --- | --- |
| Save/restore full simulation state | Every instrumented `Property`'s value is captured and can be reapplied later |
| External control | Another program can set an instrumented `Property`'s value directly, driving the sim the same as a user interaction would |
| A documented, stable API | `phetioDocumentation` and the tandem hierarchy together describe the sim's state surface for tooling and other consumers |
| Data collection / logging | Instrumented `Emitter`s and state changes can be observed externally without modifying simulation code |

## IOType: describing serialization

Plain `Property<number>`/`Property<string>` instances serialize with the built-in `NumberIO`/`StringIO` `IOType`s automatically. Custom classes that extend `PhetioObject` (rather than composing existing instrumented Properties) describe their own serialization with an `IOType`:

```ts
import { IOType, NumberIO } from 'scenerystack/tandem';

type MyThingState = { x: number; y: number };

const MyThingIO = new IOType<MyThing, MyThingState>( 'MyThingIO', {
  valueType: MyThing,
  documentation: 'Serializes the position of a MyThing.',
  toStateObject: myThing => ( { x: myThing.x, y: myThing.y } ),
  applyState: ( myThing, state ) => {
    myThing.x = state.x;
    myThing.y = state.y;
  },
  stateSchema: {
    x: NumberIO,
    y: NumberIO
  }
} );
```

Most simulations never need to author a custom `IOType` directly — composing already-instrumented `Property`s (each with its own built-in `IOType`) inside a plain model class covers the overwhelming majority of cases, consistent with the [model-view separation](/patterns/model-view-separation) pattern where all state lives in `Property` instances.

::: tip Instrument by default, even before you need PhET-iO
Adding `tandem`/`phetioDocumentation` after the fact to a model that already has dozens of Properties is far more tedious than threading tandems through from the start. Most PhET simulations instrument their full model tree from day one, whether or not a given release actually ships PhET-iO features — the incremental cost per `Property` is one option.
:::

## Where to go next

- [Building Your First Screen](/guides/building-your-first-screen) — threading tandems through a new screen's model and view
- [Model-View Separation](/patterns/model-view-separation) — why instrumentable state lives in `Property` instances, not scattered fields
- [Your First Simulation](/getting-started/your-first-simulation) — the minimum tandem wiring every `Screen` requires
