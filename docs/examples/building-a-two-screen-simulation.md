---
title: Building a Two-Screen Simulation
description: Full example wiring two Screens with shared and per-screen model code.
category: examples
tags: [example, joist, multi-screen]
status: verified
related:
  - /getting-started/your-first-simulation
  - /examples/demo-simulation-walkthrough
  - /patterns/model-view-separation
  - /patterns/options-pattern
  - /api/axon/number-property
prerequisites:
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Building a Two-Screen Simulation

[Your First Simulation](/getting-started/your-first-simulation) builds one `Screen`; the moment a sim has two or more, a `HomeScreen` and screen-selector buttons appear automatically, and each `Screen` must supply icons for both. This page walks through a two-screen sim — "Intro" and "Lab" — that share a model constant and a common view convention, but otherwise have independent models and views.

The scenario: both screens show a circle whose radius is bound to a `NumberProperty`, sharing the same valid `Range`; "Lab" additionally lets the user change the circle's color, a feature "Intro" intentionally omits.

## Shared code

Code used by more than one screen lives in its own module, imported by both — it is not a third "shared screen":

```ts
// SharedConstants.ts - imported by both screens, owned by neither
import { Range } from 'scenerystack/dot';

const SharedConstants = {
  RADIUS_RANGE: new Range( 10, 100 ),
  SCREEN_VIEW_BACKGROUND: 'white'
};

export default SharedConstants;
```

## The Intro screen

```ts
// IntroModel.ts
import { NumberProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';
import SharedConstants from './SharedConstants';

export default class IntroModel {
  public readonly radiusProperty: NumberProperty;

  public constructor( tandem: Tandem ) {
    this.radiusProperty = new NumberProperty( 30, {
      range: SharedConstants.RADIUS_RANGE,
      tandem: tandem.createTandem( 'radiusProperty' )
    } );
  }

  public reset(): void {
    this.radiusProperty.reset();
  }

  public step( dt: number ): void {
    // Intro has no time-dependent behavior.
  }
}
```

```ts
// IntroScreenView.ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Circle } from 'scenerystack/scenery';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import type IntroModel from './IntroModel';

export default class IntroScreenView extends ScreenView {
  public constructor( model: IntroModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const circle = new Circle( model.radiusProperty.value, { fill: 'cornflowerblue' } );
    model.radiusProperty.link( radius => { circle.radius = radius; } );
    circle.center = this.layoutBounds.center;

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20,
      tandem: this.tandem.createTandem( 'resetAllButton' )
    } );

    this.children = [ circle, resetAllButton ];
  }
}
```

## The Lab screen

"Lab" reuses the same `RADIUS_RANGE`, but its model additionally tracks a color, and its view adds a color control the Intro screen doesn't have:

```ts
// LabModel.ts
import { NumberProperty, StringProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';
import SharedConstants from './SharedConstants';

export default class LabModel {
  public readonly radiusProperty: NumberProperty;
  public readonly colorProperty: StringProperty;

  public constructor( tandem: Tandem ) {
    this.radiusProperty = new NumberProperty( 30, {
      range: SharedConstants.RADIUS_RANGE,
      tandem: tandem.createTandem( 'radiusProperty' )
    } );
    this.colorProperty = new StringProperty( 'cornflowerblue', {
      tandem: tandem.createTandem( 'colorProperty' )
    } );
  }

  public reset(): void {
    this.radiusProperty.reset();
    this.colorProperty.reset();
  }

  public step( dt: number ): void {
    // Lab has no time-dependent behavior either, but could.
  }
}
```

```ts
// LabScreenView.ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Circle, VBox } from 'scenerystack/scenery';
import { RectangularRadioButtonGroup, type RectangularRadioButtonGroupItem } from 'scenerystack/sun';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import { Text } from 'scenerystack/scenery';
import type LabModel from './LabModel';

export default class LabScreenView extends ScreenView {
  public constructor( model: LabModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const circle = new Circle( model.radiusProperty.value, { fill: model.colorProperty.value } );
    model.radiusProperty.link( radius => { circle.radius = radius; } );
    model.colorProperty.link( color => { circle.fill = color; } );
    circle.center = this.layoutBounds.center;

    const colorItems: RectangularRadioButtonGroupItem<string>[] = [
      { value: 'cornflowerblue', createNode: () => new Text( 'Blue' ) },
      { value: 'orangered', createNode: () => new Text( 'Red' ) }
    ];
    const colorRadioButtonGroup = new RectangularRadioButtonGroup( model.colorProperty, colorItems, {
      orientation: 'horizontal',
      tandem: this.tandem.createTandem( 'colorRadioButtonGroup' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      tandem: this.tandem.createTandem( 'resetAllButton' )
    } );

    const controls = new VBox( {
      spacing: 15,
      children: [ colorRadioButtonGroup, resetAllButton ],
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20
    } );

    this.children = [ circle, controls ];
  }
}
```

## Wiring both Screens and the Sim

Each `Screen` needs its own `Tandem` subtree, its own `homeScreenIcon`/`navigationBarIcon`, and a translated `name`:

```ts
import { Sim, Screen, ScreenIcon, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Rectangle } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import IntroModel from './IntroModel';
import IntroScreenView from './IntroScreenView';
import LabModel from './LabModel';
import LabScreenView from './LabScreenView';

function createIcon( fill: string ): ScreenIcon {
  return new ScreenIcon( new Rectangle( 0, 0, 100, 100, { fill } ), {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1
  } );
}

const introTandem = Tandem.ROOT.createTandem( 'introScreen' );
const introScreen = new Screen(
  () => new IntroModel( introTandem.createTandem( 'model' ) ),
  model => new IntroScreenView( model, { tandem: introTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Intro' ),
    homeScreenIcon: createIcon( 'cornflowerblue' ),
    navigationBarIcon: createIcon( 'cornflowerblue' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: introTandem
  }
);

const labTandem = Tandem.ROOT.createTandem( 'labScreen' );
const labScreen = new Screen(
  () => new LabModel( labTandem.createTandem( 'model' ) ),
  model => new LabScreenView( model, { tandem: labTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Lab' ),
    homeScreenIcon: createIcon( 'orangered' ),
    navigationBarIcon: createIcon( 'orangered' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: labTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'Two-Screen Demo' ), [ introScreen, labScreen ] );
  sim.start();
} );
```

::: warning `homeScreenIcon` and `navigationBarIcon` are optional, but the fallback is a plain colored rectangle
If you omit either icon, `Screen` synthesizes a default from `backgroundColorProperty` (a bare rectangle, no `navigationBarIcon` falls back to whatever `homeScreenIcon` resolved to) rather than throwing — so a multi-screen sim without real icons still runs, it just shows indistinguishable blank rectangles on the home screen and nav bar. Supply real icons for any sim with more than one screen so it stays usable, even though nothing enforces it for you.
:::

## What's shared vs. per-screen

| Concern | Shared | Per-screen |
| --- | --- | --- |
| `SharedConstants.RADIUS_RANGE` | Yes — both models validate against the same `Range` | — |
| Model class (`IntroModel` / `LabModel`) | No | Each screen owns its own model class and `Tandem` subtree |
| View class | No | Each screen owns its own `ScreenView` subclass |
| `ResetAllButton` wiring | Conceptually (both call `model.reset()`) | Instantiated once per screen, under that screen's own tandem |

## Where to go next

- [Demo Simulation Walkthrough](/examples/demo-simulation-walkthrough) — the same one-screen shape in more annotated detail
- [Model-View Separation](/patterns/model-view-separation) — why `SharedConstants` holds data, not behavior
- [PhET-iO Instrumented Sim Example](/examples/phet-io-instrumented-sim-example) — instrumenting a sim like this one fully
