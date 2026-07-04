---
title: Sim
description: The top-level application object owning Screens, the navigation bar, and the sim loop.
category: api
library: joist
tags: [joist, Sim]
status: verified
related:
  - /api/joist/screen
  - /api/joist/screen-view
  - /api/tandem/tandem
  - /getting-started/your-first-simulation
prerequisites:
  - /getting-started/your-first-simulation
  - /api/joist/screen
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Sim

`Sim` is the single top-level object for a simulation: it owns the list of `Screen`s, builds the home screen (for multi-screen sims) and navigation bar, drives the `requestAnimationFrame` loop that steps the active screen, and manages global concerns like credits, PhET-iO state, and preferences. Every simulation constructs exactly one `Sim` and calls `start()` on it.

::: warning `Sim` is exported from `scenerystack/sim`, not `scenerystack/joist`
The class lives in the `joist` repository internally, but the published package puts `Sim`, [`Screen`](/api/joist/screen), and [`ScreenView`](/api/joist/screen-view) on the **`scenerystack/sim`** subpath. `scenerystack/joist` still exists, but only exports supporting pieces (preferences panels, `CreditsNode`, locale utilities) — not these three classes.
:::

```ts
import { Sim, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Simulation' ), [ myScreen, anotherScreen ], {
    credits: {
      leadDesign: 'Ada Lovelace'
    }
  } );
  sim.start();
} );
```

Always construct and start the `Sim` from inside `onReadyToLaunch` — it waits for SceneryStack's asynchronous asset loader (fonts, images, translated strings) to finish before it's safe to build the scene graph.

## Constructor

```ts
new Sim(
  simNameProperty: TReadOnlyProperty<string>,
  allSimScreens: AnyScreen[],
  providedOptions?: SimOptions
)
```

`simNameProperty` is a string Property (not a plain string) so the sim's title can be translated; `allSimScreens` is the full ordered list of [`Screen`](/api/joist/screen) instances, in the order they should appear in the navigation bar.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `credits` | `{}` | A `CreditsData` object rendered in the About dialog (`leadDesign`, `softwareDevelopment`, `team`, etc.) |
| `homeScreenWarningNode` | `null` | A `Node` placed onto the home screen, e.g. for an experimental-build warning |
| `preferencesModel` | auto-created | A `PreferencesModel` describing which Preferences dialog panels/features are available; omit it to get the default (no extra preferences) |
| `webgl` | `SimDisplay.DEFAULT_WEBGL` | Whether the underlying `Display` may use WebGL rendering |
| `detachInactiveScreenViews` | `false` | If `true`, only the active screen's `ScreenView` stays in the scene graph (saves memory/perf at the cost of slower screen switches); if `false`, all screens' views remain children and only one is visible |

## Public API

| Member | Description |
| --- | --- |
| `screens` | All screens in the running sim, with the auto-created `HomeScreen` first if one exists |
| `simScreens` | Just the sim-specific screens (excludes the `HomeScreen`) |
| `selectedScreenProperty` | `Property<AnyScreen>` — which screen is currently showing |
| `activeProperty` | `Property<boolean>` — settable; whether the whole sim is running and processing user input. Setting it to `false` pauses the sim. Distinct from `browserTabVisibleProperty` (`TReadOnlyProperty<boolean>`), which tracks the actual browser tab's visibility state |
| `isConstructionCompleteProperty` | `TReadOnlyProperty<boolean>` — becomes `true` once every screen's model and view have been constructed (useful for PhET-iO tooling) |
| `dimensionProperty` | `TReadOnlyProperty<Dimension2>` — current browser viewport size |
| `lookAndFeel` | A `LookAndFeel` instance controlling navigation bar fill/text colors |
| `start()` | Kicks off asynchronous screen initialization, then begins the animation-frame loop. Call this once, after construction |
| `stepOneFrame()` | Advances model/view/display by a single frame — used by embedding contexts that need manual frame control |

::: tip A single-screen sim needs no home screen icons
`Screen` options like `homeScreenIcon`/`navigationBarIcon` only matter once a sim has more than one entry in `allSimScreens` — with exactly one screen, there's no home screen or navigation bar screen button to show them in. See [Screen](/api/joist/screen) and [Your First Simulation](/getting-started/your-first-simulation) for the smallest possible wiring.
:::
