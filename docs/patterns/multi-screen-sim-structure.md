---
title: Multi-Screen Sim Structure
description: Structuring model/view code across multiple Screens in one Sim.
category: patterns
tags: [joist, Screen, Sim, architecture]
status: complete
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/screen-view
  - /patterns/model-view-separation
  - /patterns/phet-io-instrumentation-pattern
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Multi-Screen Sim Structure

Each `Screen` owns exactly one model/view pair and is self-contained; the `Sim` itself does no screen-specific work — it only collects the screens and hands them a title. Code genuinely shared by more than one screen (a constants file, a reusable sub-model, a shared control) lives in a `common/` location that every screen imports from, never in one screen importing from another. This keeps a screen removable or reorderable without hunting for cross-screen dependencies.

## The core idea

```ts
import { Sim, Screen, ScreenView, ScreenIcon, onReadyToLaunch, type ScreenViewOptions } from 'scenerystack/sim';
import { Tandem } from 'scenerystack/tandem';
import { Property } from 'scenerystack/axon';
import { Rectangle, Text } from 'scenerystack/scenery';

// --- common/ : code shared by more than one screen ---
class SharedConstants {
  public static readonly PANEL_MARGIN = 10;
}

// --- intro/ : this screen's own model, never imported by other screens ---
class IntroModel {
  public reset(): void { /* reset this screen's Properties */ }
}

class IntroScreenView extends ScreenView {
  public constructor( model: IntroModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );
    const label = new Text( 'Intro', { font: '24px sans-serif' } );
    label.center = this.layoutBounds.center;
    this.addChild( label );
  }
}

function createIntroScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Rectangle( 0, 0, 10, 10, { fill: 'blue' } ) );
}

// --- advanced/ : a second, independent screen ---
class AdvancedModel {
  public reset(): void { /* reset this screen's Properties */ }
}

class AdvancedScreenView extends ScreenView {
  public constructor( model: AdvancedModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );
    const label = new Text( 'Advanced', { font: '24px sans-serif' } );
    label.center = this.layoutBounds.center;
    this.addChild( label );
  }
}

function createAdvancedScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Rectangle( 0, 0, 10, 10, { fill: 'red' } ) );
}

// --- top level: wire screens into the Sim, nothing screen-specific here ---
const introTandem = Tandem.ROOT.createTandem( 'introScreen' );
const introScreen = new Screen(
  () => new IntroModel(),
  model => new IntroScreenView( model, { tandem: introTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Intro' ),
    homeScreenIcon: createIntroScreenIcon(),
    backgroundColorProperty: new Property( 'white' ),
    tandem: introTandem
  }
);

const advancedTandem = Tandem.ROOT.createTandem( 'advancedScreen' );
const advancedScreen = new Screen(
  () => new AdvancedModel(),
  model => new AdvancedScreenView( model, { tandem: advancedTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Advanced' ),
    homeScreenIcon: createAdvancedScreenIcon(),
    backgroundColorProperty: new Property( 'white' ),
    tandem: advancedTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Multi-Screen Sim' ), [ introScreen, advancedScreen ] );
  sim.start();
} );
```

## What goes where

| Location | Contents |
| --- | --- |
| `common/` (or a shared module) | Constants, utility functions, and any sub-model/component genuinely used by two or more screens |
| `<screen-name>/model/` | That screen's model classes — imported only by that screen's own view and the top-level wiring |
| `<screen-name>/view/` | That screen's `ScreenView` subclass and any Nodes specific to it |
| Top level (where `Sim` is constructed) | Only the list of `Screen`s and the sim-wide title `Property` — no per-screen logic |

Each screen also gets its own `Tandem` subtree (`introTandem`, `advancedTandem` above), created from `Tandem.ROOT`, so PhET-iO's element tree mirrors the screen boundaries — see [The PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern).

::: warning `name` and the icons become required once there is more than one screen
`Screen`'s `name` (a `TReadOnlyProperty<string>`, not a plain string) and its `homeScreenIcon`/`navigationBarIcon` may be `null` for a single-screen sim, since there is no home screen or navigation bar to show them in. As soon as a second screen exists, `Sim` builds a home screen and navigation bar from these, so every screen must supply a real `name` and a `homeScreenIcon` (the `navigationBarIcon` falls back to a scaled copy of the home screen icon if omitted).
:::
