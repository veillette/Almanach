---
title: Demo Simulation Walkthrough
description: Annotated tour of a minimal end-to-end demo sim.
category: examples
tags: [example, joist, walkthrough]
status: verified
related:
  - /getting-started/your-first-simulation
  - /patterns/model-view-separation
  - /patterns/reset-all-pattern
  - /accessibility/pdom
  - /api/scenery-phet/reset-all-button
  - /api/axon/number-property
  - /api/sun/hslider
prerequisites:
  - /getting-started/what-is-scenerystack
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Demo Simulation Walkthrough

[Your First Simulation](/getting-started/your-first-simulation) shows the smallest possible `Sim`/`Screen`/`ScreenView` skeleton with a static `Text` node. This page walks through a slightly larger, fully working demo — a single screen with a real model, a slider-controlled view, accessibility, and a reset button — annotated section by section so you can see how the pieces named in other pages fit into one file.

The scenario: a circle whose radius is driven by a `NumberProperty`, controlled by an `HSlider`, restorable with a `ResetAllButton`, and reachable from the keyboard.

## The model

The model owns exactly one piece of state and knows nothing about scenery:

```ts
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

class DemoModel {
  public readonly radiusProperty: NumberProperty;

  public constructor( tandem: Tandem ) {
    this.radiusProperty = new NumberProperty( 30, {
      range: new Range( 10, 100 ),
      tandem: tandem.createTandem( 'radiusProperty' )
    } );
  }

  public reset(): void {
    this.radiusProperty.reset();
  }

  // No time-dependent behavior in this demo, but step() is where it would go.
  public step( dt: number ): void {
    // nothing to advance
  }
}
```

This is the [model-view separation](/patterns/model-view-separation) discipline: `DemoModel` could be unit-tested with no DOM at all.

## The view

The `ScreenView` observes `radiusProperty` and lays out its controls with a `VBox`. The circle's radius is driven purely by the link — nothing else ever assigns `circle.radius` directly:

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Circle, VBox } from 'scenerystack/scenery';
import { HSlider } from 'scenerystack/sun';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

class DemoScreenView extends ScreenView {
  public constructor( model: DemoModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    // The circle is a pure function of the model - the view never writes radiusProperty.
    const circle = new Circle( model.radiusProperty.value, {
      fill: 'cornflowerblue'
    } );
    model.radiusProperty.link( radius => {
      circle.radius = radius;
    } );

    // The one place radiusProperty IS written: user interaction with the slider.
    const slider = new HSlider( model.radiusProperty, new Range( 10, 100 ), {
      accessibleName: 'Circle radius',
      tandem: this.tandem.createTandem( 'slider' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      tandem: this.tandem.createTandem( 'resetAllButton' )
    } );

    const controls = new VBox( {
      spacing: 15,
      children: [ slider, resetAllButton ],
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20
    } );

    circle.center = this.layoutBounds.center;

    this.children = [ circle, controls ];

    // Explicit PDOM traversal order: circle isn't interactive, so it's left out entirely.
    this.pdomOrder = [ slider, resetAllButton ];
  }
}
```

A few things worth noticing:

| Piece | Why it's there |
| --- | --- |
| `model.radiusProperty.link(...)` | The *only* code path that moves the circle — see [Model-View Separation](/patterns/model-view-separation) |
| `HSlider`'s second argument | The `Range`, matching the one given to `NumberProperty` — see [HSlider](/api/sun/hslider) |
| `accessibleName` on the slider | Sliders and buttons already have PDOM structure from `sun`; you only need to name them — see [The Parallel DOM](/accessibility/pdom) |
| `resetAllButton.listener` calling `model.reset()` | The [reset-all pattern](/patterns/reset-all-pattern): the button never touches Properties directly |
| `this.pdomOrder` | Explicit keyboard-traversal order, independent of scene-graph (paint) order |

## Wiring the Screen and Sim

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'demoScreen' );

const demoScreen = new Screen(
  () => new DemoModel( screenTandem.createTandem( 'model' ) ),
  model => new DemoScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Demo' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'Demo Simulation' ), [ demoScreen ] );
  sim.start();
} );
```

::: tip Every path from a click to a pixel change goes through a Property
Trace the demo end to end: the slider writes `radiusProperty`, the `link` callback assigns `circle.radius`, and scenery repaints. There is no code anywhere that assigns to `circle.radius` outside that one `link` — that's what makes `resetAllButton`'s single call to `model.reset()` sufficient to restore the *entire* view.
:::

## Where to go next

- [Building a Two-Screen Simulation](/examples/building-a-two-screen-simulation) — the same shape, scaled to multiple screens
- [Scenery Layout Examples](/examples/scenery-layout-examples) — more on `VBox`/`FlowBox`/`GridBox` arrangements
- [Accessible Control Panel Example](/examples/accessible-control-panel-example) — a deeper PDOM-focused control cluster
- [PhET-iO Instrumented Sim Example](/examples/phet-io-instrumented-sim-example) — instrumenting this same shape of sim fully
