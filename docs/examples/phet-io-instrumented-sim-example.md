---
title: PhET-iO Instrumented Sim Example
description: A minimal simulation instrumented end-to-end with Tandem.
category: examples
tags: [example, tandem, phet-io]
status: verified
related:
  - /getting-started/your-first-simulation
  - /examples/demo-simulation-walkthrough
  - /patterns/reset-all-pattern
  - /api/axon/number-property
  - /api/axon/derived-property
  - /api/sun/checkbox
prerequisites:
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhET-iO Instrumented Sim Example

Every `Screen` in [Your First Simulation](/getting-started/your-first-simulation) already requires a `Tandem` — but a *minimally* instrumented sim and a *fully* instrumented one differ in how deliberately every piece of state, every `IOType`, and every UI control is wired into that one `Tandem` tree. This page builds a small sim end to end where every stateful `Property` and every user-facing control is instrumented, so its full state can be saved, restored, and controlled externally by the PhET-iO wrapper suite.

The scenario: a "Temperature" screen with a `NumberProperty` for the reading, a `DerivedProperty` classifying it as `'cold'`/`'warm'`/`'hot'`, and a `Checkbox` toggling whether the reading is shown in Celsius or Fahrenheit — three different instrumentation shapes in one small model.

## The Tandem tree

Every instrumented object's `Tandem` is a child of another, forming a tree that mirrors the sim's structure. Start from `Tandem.ROOT` and branch per screen, then per model/view:

```ts
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'temperatureScreen' );
const modelTandem = screenTandem.createTandem( 'model' );
const viewTandem = screenTandem.createTandem( 'view' );
```

`createTandem` is idempotent for the same name — calling it twice with the same string returns the same child `Tandem`, so it's safe to derive a sub-tandem in more than one place as long as the name matches.

## The model: three kinds of instrumented state

```ts
import { NumberProperty, BooleanProperty, DerivedProperty, type TReadOnlyProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { StringIO, Tandem } from 'scenerystack/tandem';

type Category = 'cold' | 'warm' | 'hot';

class TemperatureModel {
  // 1. Directly-instrumented numeric state - PhET-iO can read AND write this.
  public readonly temperatureProperty: NumberProperty;

  // 2. Directly-instrumented boolean state - a user-facing toggle.
  public readonly useFahrenheitProperty: BooleanProperty;

  // 3. A read-only DERIVED value - PhET-iO can read it (for state save/restore
  //    and data logging) but never write it directly; it always tracks its dependency.
  //    Typed as TReadOnlyProperty since DerivedProperty's own generic parameters are
  //    positional per-dependency (see the DerivedProperty API page) rather than a single tuple.
  public readonly categoryProperty: TReadOnlyProperty<Category>;

  public constructor( tandem: Tandem ) {
    this.temperatureProperty = new NumberProperty( 20, {
      range: new Range( -20, 45 ),
      tandem: tandem.createTandem( 'temperatureProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The current temperature reading, in Celsius.'
    } );

    this.useFahrenheitProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'useFahrenheitProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether the readout is displayed in Fahrenheit instead of Celsius.'
    } );

    this.categoryProperty = new DerivedProperty(
      [ this.temperatureProperty ],
      ( temperature: number ): Category => temperature < 10 ? 'cold' : temperature < 25 ? 'warm' : 'hot',
      {
        tandem: tandem.createTandem( 'categoryProperty' ),
        phetioValueType: StringIO,
        phetioDocumentation: 'A qualitative classification of temperatureProperty, derived automatically.'
      }
    );
  }

  public reset(): void {
    this.temperatureProperty.reset();
    this.useFahrenheitProperty.reset();
    // categoryProperty needs no reset() call - it recomputes from temperatureProperty automatically.
  }
}
```

Every `Property` constructor above takes `tandem` plus documentation options; a `DerivedProperty` additionally requires `phetioValueType` the moment it's instrumented (there's no default value type PhET-iO can infer for a derived value the way `NumberProperty` defaults to `NumberIO`).

## The view: instrumenting the controls, not just the model

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Text, VBox } from 'scenerystack/scenery';
import { Checkbox } from 'scenerystack/sun';
import { ResetAllButton } from 'scenerystack/scenery-phet';

class TemperatureScreenView extends ScreenView {
  public constructor( model: TemperatureModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const readoutText = new Text( '', { font: '20px sans-serif' } );
    const updateReadout = () => {
      const celsius = model.temperatureProperty.value;
      const displayValue = model.useFahrenheitProperty.value ? celsius * 9 / 5 + 32 : celsius;
      const unit = model.useFahrenheitProperty.value ? '°F' : '°C';
      readoutText.string = `${displayValue.toFixed( 1 )}${unit} (${model.categoryProperty.value})`;
    };
    model.temperatureProperty.link( updateReadout );
    model.useFahrenheitProperty.link( updateReadout );

    const fahrenheitCheckbox = new Checkbox(
      model.useFahrenheitProperty,
      new Text( 'Show in Fahrenheit' ),
      { tandem: this.tandem.createTandem( 'fahrenheitCheckbox' ) }
    );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      tandem: this.tandem.createTandem( 'resetAllButton' )
    } );

    this.children = [
      new VBox( {
        spacing: 15,
        align: 'left',
        center: this.layoutBounds.center,
        children: [ readoutText, fahrenheitCheckbox, resetAllButton ]
      } )
    ];
  }
}
```

`fahrenheitCheckbox` is instrumented under `this.tandem` (the *view's* tandem) even though it controls model state — the convention is that a `Property` is instrumented once, under the model, and every UI control that reads/writes it is instrumented separately, under the view, at the point it's created. PhET-iO's data stream can then distinguish "the model value changed" from "this specific control changed it."

## Wiring the Sim

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'temperatureScreen' );

const temperatureScreen = new Screen(
  () => new TemperatureModel( screenTandem.createTandem( 'model' ) ),
  model => new TemperatureScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Temperature' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'Temperature Demo' ), [ temperatureScreen ] );
  sim.start();
} );
```

Nothing about launching an instrumented sim differs from an uninstrumented one — instrumentation is a property of the `Tandem`s you create and pass in, not a separate mode `Sim` is put into. The same code runs identically whether or not a PhET-iO wrapper is attached; passing `?phetioStandalone` (or driving it from a PhET-iO wrapper) is what actually activates state save/restore against the tandem tree built here.

::: tip `phetioFeatured` marks what matters to PhET-iO users, not what's instrumented
Every `Property` above has a `tandem` and is therefore part of the PhET-iO API. `phetioFeatured: true` is a *further* signal: "this is one of the handful of elements a PhET-iO user is likely to want to see by default," used to build curated, filtered views of a large API surface. Don't set it on every Property reflexively — reserve it for state that's genuinely central to the sim, the same way `temperatureProperty` and `useFahrenheitProperty` are here but `categoryProperty` (purely derived, not independently controllable) is not.
:::

::: warning A `DerivedProperty` needs `phetioValueType`, a plain `NumberProperty`/`BooleanProperty` does not
`NumberProperty` and `BooleanProperty` already know their own value's `IOType` (`NumberIO`/`BooleanIO`) and set it for you. `DerivedProperty` (and plain `Property`) don't know what they'll compute ahead of time, so instrumenting one without an explicit `phetioValueType` fails validation the moment PhET-iO tries to serialize it — as shown above with `phetioValueType: StringIO` for `categoryProperty`.
:::

## Where to go next

- [Demo Simulation Walkthrough](/examples/demo-simulation-walkthrough) — the same shape without the instrumentation detail
- [DerivedProperty](/api/axon/derived-property) — more on when a derived value needs its own `IOType`
- [The Reset-All Pattern](/patterns/reset-all-pattern) — why `reset()` only needs to touch `temperatureProperty` and `useFahrenheitProperty`, not `categoryProperty`
