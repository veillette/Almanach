---
title: PhET-iO Deep Dive
description: PhetioGroup and PhetioCapsule for dynamically created elements, authoring a custom IOType, and how PhET-iO state save/restore actually works.
category: guides
tags: [phet-io, tandem, instrumentation, phetio-group, phetio-capsule]
status: verified
related:
  - /guides/phet-io-and-instrumentation
  - /patterns/phet-io-instrumentation-pattern
  - /api/tandem/tandem
prerequisites:
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhET-iO Deep Dive

[PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) covers the basics: every instrumentable object takes a `Tandem`, and instrumentation is opt-in and additive. That page's model is *static* — a fixed set of `Property`s and `Node`s, each with a tandem assigned once at construction. This page covers what happens once your model creates and destroys elements at runtime (particles, graph points, anything with a variable count), how to describe serialization for a class that isn't just composed `Property`s, and what "state save/restore" is actually doing under the hood.

## The problem with dynamic elements

A `Tandem` is a fixed, hierarchical path assigned once. That works fine for a model with a fixed shape — one `massProperty`, one `positionProperty` — but breaks down the moment the model creates elements at runtime: if a user can add particles to a simulation, each particle needs *some* tandem, but you don't know at construction time how many there will be or what to name them. `PhetioGroup` and `PhetioCapsule` (both from `scenerystack/tandem`) solve this by taking over both creation *and* tandem-naming for exactly this case.

## PhetioGroup: a homogeneous, growable collection

`PhetioGroup` manages a runtime-created array of `PhetioObject`s, generating each one's tandem automatically:

```ts
import { PhetioGroup, Tandem } from 'scenerystack/tandem';
import { NumberProperty } from 'scenerystack/axon';

class Particle extends PhetioObject {
  public readonly massProperty: NumberProperty;

  public constructor( tandem: Tandem, initialMass: number ) {
    super( { tandem, phetioType: Particle.ParticleIO } );
    this.massProperty = new NumberProperty( initialMass, {
      tandem: tandem.createTandem( 'massProperty' )
    } );
  }

  public static ParticleIO = /* an IOType, see below */ null!;
}

const particleGroup = new PhetioGroup(
  ( tandem: Tandem, initialMass: number ) => new Particle( tandem, initialMass ),
  [ 1 ], // default arguments, used to build the group's "archetype" — see below
  {
    tandem: someParentTandem.createTandem( 'particleGroup' )
  }
);

const newParticle = particleGroup.createNextElement( 2.5 );
```

A few things are worth understanding, not just copying:

- **`createElement` never wires up listeners itself** — the constructor function's only job is building the element and giving it its tandem. If code elsewhere needs to react whenever a new element is created (adding a view Node for each new particle, for instance), listen to the group's own creation notifications rather than adding side effects inside `createElement` — mixing "create the object" and "wire up its effects" into one function is a documented anti-pattern for `PhetioGroup`, because the PhET-iO state engine re-invokes `createElement` when *restoring* saved state, and any side effect baked into it fires again on every restore, not just on genuine user-driven creation.
- **The tandem name must end in the container's suffix** (`'Group'` by default) — `particleGroup`'s own tandem name ends in `Group`, and each created element's base tandem name is that group name with the suffix stripped, followed by an index (`particle_0`, `particle_1`, ...). This is why the naming isn't arbitrary: it's what lets the PhET-iO API tooling recognize "this whole namespace is one dynamic group" rather than treating each element as an unrelated fixed object.
- **`defaultArguments` build the group's archetype** — an extra, always-present instance created from those defaults purely so the PhET-iO API has a static example of what elements in this group look like (their nested Properties, their `IOType`), even though the group might have zero real elements at a given moment. You don't interact with the archetype directly; it exists for API generation and validation.
- **`countProperty`** is a built-in, read-only `NumberProperty` tracking how many elements currently exist — useful for a view layer (or a PhET-iO client) to observe the group's size without walking the array itself.

## PhetioCapsule: a single, replaceable dynamic element

`PhetioCapsule` is `PhetioGroup`'s sibling for the "exactly zero or one" case rather than "many": a dialog that's created lazily on first open, or a single dynamically-swapped model element, rather than an array of many. Its shape mirrors `PhetioGroup` closely — same `createElement`/`defaultArguments`/`options` constructor — but instead of `createNextElement` appending to an array, `create(...)` (re-)creates the single managed instance:

```ts
import { PhetioCapsule } from 'scenerystack/tandem';

const dialogCapsule = new PhetioCapsule(
  ( tandem: Tandem ) => new MyDialog( { tandem } ),
  [],
  { tandem: someParentTandem.createTandem( 'dialogCapsule' ) }
);

const dialog = dialogCapsule.create( [] );
```

Reach for `PhetioCapsule` when "at most one instance exists, created on demand" is the actual shape of the problem (a modal dialog, a singleton sub-panel) and `PhetioGroup` when the real shape is "an arbitrary, growing/shrinking collection" (particles, graph series, anything list-like).

## Authoring a custom IOType

[PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation#iotype-describing-serialization) shows the shape of an `IOType`: `toStateObject`/`applyState` plus a `stateSchema`. The one thing worth adding here is **when to reach for `ReferenceIO`** instead of writing full state serialization yourself. If your class's meaningful state already lives entirely in child `PhetioObject`s (nested `Property`s, for instance), those children already know how to serialize themselves — your `IOType`'s job is just to describe *which* children matter, via `stateSchema`, rather than manually re-implementing their serialization:

```ts
import { IOType, NumberIO, ReferenceIO } from 'scenerystack/tandem';

const ParticleIO = new IOType<Particle, unknown>( 'ParticleIO', {
  valueType: Particle,
  stateSchema: {
    massProperty: NumberIO // delegates entirely to NumberProperty's own IOType
  }
} );
```

`ReferenceIO` (also from `scenerystack/tandem`) is for the opposite situation: a field that points *at* another already-instrumented `PhetioObject` elsewhere in the tree, rather than owning its own copy of that state. Serializing that field as a reference (its `phetioID`) rather than embedding the referenced object's full state avoids duplicating state that's already captured once, at the referenced object's own tandem path.

## How state save/restore actually works

Every instrumented object's `IOType` (built-in or custom) contributes one entry to the sim's overall state object when a save is triggered — essentially a big `phetioID -> stateObject` map, built by calling `toStateObject` on every instrumented `PhetioObject` in the tree. Restoring reverses this: for each entry, the corresponding object's `applyState` is called with the saved value.

The part that trips people up is dynamic elements: restoring state for a `PhetioGroup`/`PhetioCapsule` doesn't just call `applyState` on existing elements — the group first has to *re-create* the right number of elements (by re-invoking `createElement`, the same function used for ordinary runtime creation) before `applyState` has anything to apply state to. This is precisely why `createElement` must be a pure "build the object" function: it runs during ordinary interactive use *and* during every state restore, and `isSettingPhetioStateProperty` (readable, though not normally something application code needs to check directly) is `true` for the duration of a restore specifically so framework code — like the assertion inside `PhetioGroup` guarding its `countProperty` — can distinguish "state is being restored" from "the user is doing this interactively" when the distinction matters.

::: tip Most simulations never author a custom IOType or a PhetioGroup
As [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) notes, composing already-instrumented `Property`s inside plain model classes covers most simulations without a custom `IOType` at all. `PhetioGroup`/`PhetioCapsule` specifically are for the subset of sims whose model genuinely creates/destroys elements at runtime — reach for them because the model shape requires it, not as a default pattern to apply everywhere.
:::

## Where to go next

- [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) — `Tandem` fundamentals and the basic `IOType` shape this page builds on
- [PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern) — deciding what to instrument in the first place
- [`Tandem`](/api/tandem/tandem) — the naming primitive both `PhetioGroup` and `PhetioCapsule` build on
