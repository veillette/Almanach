---
title: A PhET-iO State-Restorable Sim
description: A worked example that goes past basic instrumentation to a model whose ENTIRE state - including a runtime-created list of elements via PhetioGroup - can be saved and restored by PhET-iO with no bespoke save/restore code.
category: examples
tags: [example, tandem, phet-io, PhetioGroup, state, persistence]
status: complete
related:
  - /examples/phet-io-instrumented-sim-example
  - /patterns/state-persistence-and-save-restore-patterns
  - /guides/phet-io-deep-dive
  - /patterns/phet-io-instrumentation-pattern
  - /patterns/reset-all-pattern
prerequisites:
  - /examples/phet-io-instrumented-sim-example
  - /patterns/state-persistence-and-save-restore-patterns
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A PhET-iO State-Restorable Sim

[PhET-iO Instrumented Sim Example](/examples/phet-io-instrumented-sim-example) instruments a fixed set of `Property`s — enough for PhET-iO to read and write each one, but every piece of state there has a name and a tandem fixed at construction time. [State Persistence and Save/Restore Patterns](/patterns/state-persistence-and-save-restore-patterns) explains *why* that's the requirement for a full save/restore to work mechanically. This page goes one step further: a model where **saving and restoring the entire sim state** — including a list whose length changes at runtime — requires zero bespoke save/restore code, by following that pattern all the way through, including the one case ordinary `Property` instrumentation doesn't cover on its own: a runtime-created collection, via `PhetioGroup`.

The scenario: a simple particle-collector sim. A user can add particles (each with its own mass), toggle whether the simulation is running, and adjust a global "field strength" — and the *entire* resulting state, including however many particles currently exist, must round-trip through a PhET-iO save/restore intact.

## Every fixed piece of state is a Property

Following [State Persistence and Save/Restore Patterns](/patterns/state-persistence-and-save-restore-patterns#why-property-based-state-is-what-makes-this-mechanical), nothing here lives in a plain field:

```ts
import { NumberProperty, BooleanProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

class FieldSettings {
  public readonly fieldStrengthProperty: NumberProperty;
  public readonly isRunningProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {
    this.fieldStrengthProperty = new NumberProperty( 1, {
      range: new Range( 0, 5 ),
      tandem: tandem.createTandem( 'fieldStrengthProperty' ),
      phetioFeatured: true
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.fieldStrengthProperty.reset();
    this.isRunningProperty.reset();
  }
}
```

Nothing about this differs from [PhET-iO Instrumented Sim Example](/examples/phet-io-instrumented-sim-example) — it's the baseline every instrumented model needs, restated briefly because the interesting part of this page is what comes next.

## The part fixed Properties can't cover: a runtime-created list

A user adding particles at runtime is exactly the case [PhET-iO Deep Dive](/guides/phet-io-deep-dive#the-problem-with-dynamic-elements) flags: no tandem can be assigned to "the third particle" at construction time, because there is no third particle yet at construction time. `PhetioGroup` (from `scenerystack/tandem`) is what makes this restorable anyway — it owns both creation and tandem-naming for every element it produces, and critically, the PhET-iO state engine can *re-invoke the same creation function* during a restore to rebuild however many elements existed at save time, before applying each one's saved state:

```ts
import { PhetioObject, type PhetioObjectOptions } from 'scenerystack/tandem';
import { PhetioGroup, Tandem, IOType, NumberIO } from 'scenerystack/tandem';
import { NumberProperty } from 'scenerystack/axon';

class Particle extends PhetioObject {
  public readonly massProperty: NumberProperty;

  public constructor( tandem: Tandem, initialMass: number ) {
    super( { tandem, phetioType: Particle.ParticleIO } );

    this.massProperty = new NumberProperty( initialMass, {
      tandem: tandem.createTandem( 'massProperty' )
    } );
  }

  // Delegates entirely to massProperty's own IOType - see PhET-iO Deep Dive's
  // "Authoring a custom IOType" section for when ReferenceIO is the better fit instead.
  public static readonly ParticleIO = new IOType<Particle, unknown>( 'ParticleIO', {
    valueType: Particle,
    stateSchema: {
      massProperty: NumberIO
    }
  } );
}

class ParticleCollectorModel {
  public readonly fieldSettings: FieldSettings;
  public readonly particleGroup: PhetioGroup<Particle>;

  public constructor( tandem: Tandem ) {
    this.fieldSettings = new FieldSettings( tandem.createTandem( 'fieldSettings' ) );

    this.particleGroup = new PhetioGroup(
      ( particleTandem: Tandem, initialMass: number ) => new Particle( particleTandem, initialMass ),
      [ 1 ], // default constructor arguments, used only to build the group's PhET-iO archetype
      {
        tandem: tandem.createTandem( 'particleGroup' ),
        phetioDocumentation: 'The collection of particles currently in the field.'
      }
    );
  }

  public addParticle( mass: number ): Particle {
    return this.particleGroup.createNextElement( mass );
  }

  public reset(): void {
    this.fieldSettings.reset();
    this.particleGroup.clear(); // removes every element the user created, restoring the empty starting collection
  }
}
```

`particleGroup.clear()` (or the equivalent element-by-element `disposeElement` calls, if a group needs partial clearing) belongs in `reset()` for exactly the same reason every ordinary `Property` does: without it, particles created before a reset would silently survive, contradicting the "reset means back to how the sim started" invariant from [The Reset-All Pattern](/patterns/reset-all-pattern).

## Why this combination is what makes *full* state restorable

Walk through what a PhET-iO save/restore actually needs to reproduce, and check each is covered:

| To restore... | This model provides |
| --- | --- |
| `fieldStrengthProperty`/`isRunningProperty`'s exact values | Ordinary instrumented `Property`s — restored via their built-in `IOType`s, no custom code |
| However many particles existed, each with the right mass | `particleGroup`'s saved state records the element count; the state engine re-invokes `createElement` that many times (see [how state save/restore actually works](/guides/phet-io-deep-dive#how-state-save-restore-actually-works)) *before* applying each particle's own `massProperty` state |
| Nothing left over from a previous run bleeding into a freshly-restored state | `reset()`'s `particleGroup.clear()` — restore itself also removes stale elements first, but a correct `reset()` is what keeps the *interactive* (non-PhET-iO) reset path consistent with what a state restore produces |

If `Particle` had instead been built as a plain class with a `massProperty` living in an ordinary uninstrumented array, none of this would be visible to PhET-iO at all — a save would silently omit every particle, and a restore would silently produce zero of them. The `PhetioGroup` wrapper is not an optional enhancement here; it's the specific piece that makes a *variable-length* collection round-trip at all, the same way a plain instrumented `Property` is what makes a single fixed value round-trip.

## What the sim itself does *not* need to do

Nothing shown above calls a "save" or "restore" method directly — that's deliberate. Triggering an actual state save/restore is the job of the PhET-iO wrapper suite (Studio, or a custom wrapper) driving the sim from outside via `?phetioStandalone`, not something application code inside the sim initiates itself. The work above is entirely about making sure that *when* an external save/restore happens, every piece of state — fixed or dynamic — is actually captured; see [PhET-iO Deep Dive](/guides/phet-io-deep-dive#how-state-save-restore-actually-works) for what the wrapper side of that exchange looks like.

::: tip A model is state-restorable by construction, not by a separate save/restore feature you build
Nothing in `ParticleCollectorModel` was written *for* save/restore specifically — every piece exists because it's also what the model needs for ordinary interactive use (instrumented `Property`s for PhET-iO visibility, `PhetioGroup` because particles are genuinely created at runtime, `reset()` for the ordinary reset button). Full state-restorability falls out as a consequence of following [State Persistence and Save/Restore Patterns](/patterns/state-persistence-and-save-restore-patterns) throughout, rather than being a separate feature bolted on afterward.
:::

## Where to go next

- [PhET-iO Instrumented Sim Example](/examples/phet-io-instrumented-sim-example) — the simpler, fixed-shape instrumentation case this page builds on
- [State Persistence and Save/Restore Patterns](/patterns/state-persistence-and-save-restore-patterns) — the general architecture rule this example follows end to end
- [PhET-iO Deep Dive](/guides/phet-io-deep-dive) — `PhetioGroup`/`PhetioCapsule` in full, and the mechanics of how a state save/restore actually walks the tandem tree
- [The Reset-All Pattern](/patterns/reset-all-pattern) — why `particleGroup.clear()` belongs in `reset()`, not just in a PhET-iO-specific code path
