---
title: Your First Simulation
description: Scaffolding a minimal one-screen simulation with Sim, Screen, and ScreenView.
category: getting-started
tags: [joist, sim, screen, tutorial]
status: complete
related:
  - /getting-started/scenery-application-vs-standalone-library
  - /guides/building-your-first-screen
  - /patterns/model-view-separation
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/screen-view
prerequisites:
  - /getting-started/installation-and-setup
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/learn/simulation/
---

# Your First Simulation

A SceneryStack simulation is a `Sim` containing one or more `Screen`s, each pairing a plain model class with a `ScreenView`. This page walks through the smallest possible one-screen simulation, wired together by hand so you can see every piece that `npm create scenerystack@latest` normally generates for you.

::: warning `Sim`, `Screen`, and `ScreenView` live in `scenerystack/sim`, not `scenerystack/joist`
It's easy to assume the application shell classes are exported from `scenerystack/joist` since the underlying repository is named `joist`. In the published package they are actually exported from the **`scenerystack/sim`** subpath. `scenerystack/joist` exists too, but only exports supporting pieces (preferences panels, `CreditsNode`, locale utilities, and similar) — not `Sim`, `Screen`, or `ScreenView` themselves.
:::

## The model

Every screen's model just needs a `reset()` method (and, optionally, a `step(dt)` method if it animates):

```ts
class MyModel {
  public reset(): void {
    // reset any Properties here
  }

  public step( dt: number ): void {
    // advance the model by dt seconds, if needed
  }
}
```

## The view

A `ScreenView` is a `Node` with a `layoutBounds` describing its design-time coordinate frame:

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Text } from 'scenerystack/scenery';

class MyScreenView extends ScreenView {
  public constructor( model: MyModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const greetingText = new Text( 'Hello, SceneryStack!', {
      font: '24px sans-serif'
    } );
    greetingText.center = this.layoutBounds.center;
    this.addChild( greetingText );
  }
}
```

## Wiring up the Screen and Sim

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';
import { Tandem } from 'scenerystack/tandem';
import { Property } from 'scenerystack/axon';

const screenTandem = Tandem.ROOT.createTandem( 'myScreen' );

const myScreen = new Screen(
  () => new MyModel(),
  model => new MyScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'My Screen' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My First Simulation' ), [ myScreen ] );
  sim.start();
} );
```

A few things worth noting:

| Piece | Why it's there |
| --- | --- |
| `onReadyToLaunch` | Waits for SceneryStack's asynchronous asset loader (fonts, images, strings) before constructing the `Sim`. Always launch this way, never call `new Sim(...)` directly at module scope. |
| `Tandem` | PhET-iO's instrumentation identifier. Every `Screen` requires one, even if you never enable instrumentation — see [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation). |
| `name` | A `TReadOnlyProperty<string>`, not a plain string — this is what lets the sim title be translated. See [Translation and Localization](/guides/translation-and-localization). |

Since a single-screen sim has no home screen or navigation-bar screen icons, `homeScreenIcon`/`navigationBarIcon` can be omitted; they become required in practice once you add a second screen (see [Building Your First Screen](/guides/building-your-first-screen)).

## Where to go next

- [Building Your First Screen](/guides/building-your-first-screen) — adding a second screen and the model/view split in more depth
- [Model-View Separation](/patterns/model-view-separation) — the architecture this example already follows
- [Scenery Basics](/guides/scenery-basics) — everything you can put inside a `ScreenView`
- [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) — what `Tandem` actually buys you
