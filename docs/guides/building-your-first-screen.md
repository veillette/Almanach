---
title: Building Your First Screen
description: Step-by-step model/view/Screen wiring for a new screen in a multi-screen sim.
category: guides
tags: [screen, tutorial, joist]
status: complete
related:
  - /getting-started/your-first-simulation
  - /patterns/model-view-separation
  - /guides/scenery-layout
  - /guides/phet-io-and-instrumentation
  - /api/joist/screen
  - /api/joist/screen-view
prerequisites:
  - /getting-started/your-first-simulation
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Building Your First Screen

[Your First Simulation](/getting-started/your-first-simulation) builds a single screen with no home screen. Adding a **second** screen changes two things: `homeScreenIcon`/`navigationBarIcon` become effectively required (there's now a home screen to show them on), and each screen's model/view pair needs to be self-contained enough to run independently, since users can jump between screens freely.

## 1. The model

Keep the model free of any `scenery`/`sun` imports — see [Model-View Separation](/patterns/model-view-separation):

```ts
// model/BounceScreenModel.ts
import { NumberProperty, Property } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';

export default class BounceScreenModel {
  public readonly positionProperty = new Property( new Vector2( 0, 0 ) );
  public readonly speedProperty = new NumberProperty( 5 ); // m/s

  public step( dt: number ): void {
    // advance position by speed * dt, bounce off walls, etc.
  }

  public reset(): void {
    this.positionProperty.reset();
    this.speedProperty.reset();
  }
}
```

## 2. The view

A `ScreenView` composes your custom `Node`s plus the shared components every screen needs — commonly a `ResetAllButton` wired to the [Reset-All Pattern](/patterns/reset-all-pattern):

```ts
// view/BounceScreenView.ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Circle } from 'scenerystack/scenery';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import type BounceScreenModel from '../model/BounceScreenModel.js';

export default class BounceScreenView extends ScreenView {
  public constructor( model: BounceScreenModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const ball = new Circle( 15, { fill: 'crimson' } );
    model.positionProperty.link( position => {
      ball.translation = position; // through a ModelViewTransform2 in a real sim with non-1:1 scale
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20
    } );

    this.children = [ ball, resetAllButton ];
  }

  public step( dt: number ): void {
    // view-only animation, if any; model stepping happens via Screen's own step wiring
  }
}
```

Use [`FlowBox`/`GridBox`](/guides/scenery-layout) instead of hand-placed `Circle`s once a screen has more than a couple of controls.

## 3. Icons for the home screen and navigation bar

With more than one screen, each `Screen` needs a `ScreenIcon` — a small preview shown on the home screen and (scaled down) in the navigation bar:

```ts
import { ScreenIcon } from 'scenerystack/sim';
import { Rectangle } from 'scenerystack/scenery';

const bounceScreenIcon = new ScreenIcon( new Rectangle( 0, 0, 100, 100, { fill: 'crimson' } ), {
  maxIconWidthProportion: 0.85,
  maxIconHeightProportion: 0.85,
  fill: 'white' // background behind the icon content
} );
```

If `navigationBarIcon` is omitted, it defaults to `homeScreenIcon`, scaled down — supply a distinct one only if the default is illegible at navigation-bar size.

## 4. Wiring the Screen

```ts
// bounce-screen-main.ts
import { Screen } from 'scenerystack/sim';
import { Tandem } from 'scenerystack/tandem';
import { Property } from 'scenerystack/axon';
import BounceScreenModel from './model/BounceScreenModel.js';
import BounceScreenView from './view/BounceScreenView.js';

const screenTandem = Tandem.ROOT.createTandem( 'bounceScreen' );

export const bounceScreen = new Screen(
  () => new BounceScreenModel(),
  model => new BounceScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Bounce' ),
    backgroundColorProperty: new Property( 'white' ),
    homeScreenIcon: bounceScreenIcon,
    tandem: screenTandem
  }
);
```

## 5. Adding it to the Sim

Pass every screen's exported `Screen` instance to `Sim` in array order — that order becomes both the home screen layout and the navigation bar order:

```ts
import { Sim, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { firstScreen } from './first-screen-main.js';
import { bounceScreen } from './bounce-screen-main.js';

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Simulation' ), [ firstScreen, bounceScreen ] );
  sim.start();
} );
```

::: tip Each screen's model/view pair should assume nothing about other screens
Since `Screen`'s `createModel`/`createView` factories run lazily and users can switch screens at any point, a screen's model and view must be constructible and steppable in isolation — don't reach into another screen's model directly. Share state across screens (if genuinely needed) via a model object constructed once in the main file and passed to both screens' factories, not via one screen importing another's internals.
:::

## Where to go next

- [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) — what the `tandem` wiring above actually enables
- [Scenery Layout](/guides/scenery-layout) — arranging a screen's controls with `FlowBox`/`GridBox` instead of manual positions
- [The Reset-All Pattern](/patterns/reset-all-pattern) — the full contract for `model.reset()` and `ResetAllButton`
