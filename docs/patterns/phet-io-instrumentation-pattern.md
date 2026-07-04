---
title: PhET-iO Instrumentation Pattern
description: Deciding what to instrument with Tandem and structuring a PhET-iO-ready model.
category: patterns
tags: [tandem, phet-io, architecture]
status: complete
related:
  - /api/tandem/tandem
  - /api/joist/sim
  - /api/joist/screen
  - /patterns/model-view-separation
  - /patterns/reset-all-pattern
  - /patterns/multi-screen-sim-structure
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhET-iO Instrumentation Pattern

A `Tandem` is a stable, hierarchical name (like a file path) that a `PhetioObject` — a `Property`, a `Node`, a `Screen`, the `Sim` itself — carries so PhET-iO wrappers can find and control it from outside the sim. Every simulation carries this plumbing whether or not PhET-iO is ever enabled for it, so the convention is to always pass `tandem` down through your model and view constructors and let each state-bearing `Property` create its own child tandem — rather than deciding instrumentation is "a PhET-iO feature" to bolt on later, which in practice means rewriting the whole model.

## The core idea

```ts
import { NumberProperty, BooleanProperty, DerivedProperty } from 'scenerystack/axon';
import { Tandem, NumberIO } from 'scenerystack/tandem';
import { Range } from 'scenerystack/dot';

class ProjectileModel {

  // A state Property a PhET-iO client can read, save, and restore: instrumented.
  public readonly angleProperty: NumberProperty;

  // A state Property a PhET-iO client can also set from outside (a control, not just an output): instrumented.
  public readonly isRunningProperty: BooleanProperty;

  // Recomputed automatically from angleProperty - no independent state to save, so it needs
  // a phetioValueType but is marked phetioReadOnly (it is never *set* directly by a client).
  public readonly heightAtLaunchProperty: DerivedProperty<number>;

  public constructor( tandem: Tandem ) {

    this.angleProperty = new NumberProperty( 45, {
      range: new Range( 0, 90 ),
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioDocumentation: 'Launch angle, in degrees above the horizontal.'
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' )
    } );

    this.heightAtLaunchProperty = new DerivedProperty( [ this.angleProperty ], angle => Math.sin( angle ), {
      tandem: tandem.createTandem( 'heightAtLaunchProperty' ),
      phetioValueType: NumberIO,
      phetioDocumentation: 'Derived from angleProperty; not independently settable.'
    } );
  }

  public reset(): void {
    this.angleProperty.reset();
    this.isRunningProperty.reset();
    // heightAtLaunchProperty needs no reset() call - it recomputes from angleProperty.
  }
}
```

Wiring the model's tandem in from its `Screen`, the way [Multi-Screen Sim Structure](/patterns/multi-screen-sim-structure) already threads `tandem` down to each screen's view:

```ts
import { Screen, ScreenView, type ScreenViewOptions } from 'scenerystack/sim';

class ProjectileScreenView extends ScreenView {
  public constructor( model: ProjectileModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );
  }
}

const screenTandem = Tandem.ROOT.createTandem( 'introScreen' );

const introScreen = new Screen(
  () => new ProjectileModel( screenTandem.createTandem( 'model' ) ),
  model => new ProjectileScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    tandem: screenTandem
    // ...name, icons, etc. - see Multi-Screen Sim Structure
  }
);
```

## Deciding what to instrument

| Instrument it | Leave it uninstrumented (no `tandem` option passed) |
| --- | --- |
| Model `Property`s a user can change or that represent saveable state (`angleProperty`, `isRunningProperty`) | Purely transient view state (a tooltip's hover flag, an in-progress animation position) |
| `DerivedProperty`s a client might want to read, even if read-only (`heightAtLaunchProperty`) | Internal implementation-detail Properties nothing outside the class ever needs to see |
| Every `Screen` and the `Sim` itself (required — `Screen`'s `tandem` option is `Tandem.REQUIRED` by default) | One-off local variables and closures that never outlive a single method call |

Each child tandem's name should describe what it names, not how it's implemented (`angleProperty`, not `_angle` or `p1`) — PhET-iO wrappers and the state-saving system address the object by that name, so renaming it later is a breaking change for anyone automating the sim.

::: tip Uninstrumented is the safe default; over-instrumenting is the expensive mistake
Passing `Tandem.REQUIRED` (or a real tandem) into every constructor and only actually calling `createTandem` for the state above costs nothing when PhET-iO is off. Instrumenting something that is really transient view state, on the other hand, makes it part of the sim's saved/restored PhET-iO state forever — removing it later is a compatibility break for any wrapper depending on it. When in doubt, leave it uninstrumented; it's cheap to add a tandem later, expensive to remove one.
:::
