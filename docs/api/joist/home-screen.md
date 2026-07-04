---
title: HomeScreen
description: The auto-created Screen showing icon buttons for every screen in a multi-screen Sim.
category: api
library: joist
tags: [joist, HomeScreen, Screen, Sim]
status: verified
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/screen-icon
  - /api/joist/navigation-bar
prerequisites:
  - /api/joist/sim
  - /api/joist/screen
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HomeScreen

`HomeScreen` is itself a [`Screen`](/api/joist/screen) subclass — the one showing a grid of icon buttons, one per entry in `sim.simScreens`, so the user can pick which screen to run. `Sim` constructs a `HomeScreen` automatically whenever it's given more than one screen; with exactly one screen, there's nothing to choose between and no `HomeScreen` is created at all. You don't construct or configure a `HomeScreen` directly — it's entirely managed by `Sim` — but you do control what it shows via each screen's [`Screen`](/api/joist/screen) options (`name`, `homeScreenIcon`).

::: warning `HomeScreen` is exported from `scenerystack/sim`, not `scenerystack/joist`
Same gotcha as [`Sim`](/api/joist/sim), [`Screen`](/api/joist/screen), and [`ScreenIcon`](/api/joist/screen-icon): despite living in the `joist` repository, it's exported from **`scenerystack/sim`**.
:::

```ts
import { Sim, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';

onReadyToLaunch( () => {
  // Passing 2+ screens is what causes Sim to auto-create a HomeScreen.
  const sim = new Sim( new Property( 'My Simulation' ), [ firstScreen, secondScreen ] );
  sim.start();
  sim.screens[ 0 ]; // the auto-created HomeScreen (always first in sim.screens when one exists)
} );
```

## Constructor

```ts
new HomeScreen(
  simNameProperty: TReadOnlyProperty<string>,
  getScreenProperty: () => Property<AnyScreen>,
  simScreens: AnyScreen[],
  activeSimScreensProperty: ReadOnlyProperty<AnyScreen[]>,
  providedOptions: HomeScreenOptions
)
```

Constructed once by `Sim` during startup, when `allSimScreens.length > 1`; not intended to be called from simulation code.

## Behavior worth knowing

| Aspect | Detail |
| --- | --- |
| `sim.screens` vs `sim.simScreens` | `sim.screens` includes the auto-created `HomeScreen` first (when one exists); `sim.simScreens` excludes it — use `simScreens` when iterating "the sim's actual content screens" |
| `BACKGROUND_COLOR` (static) | Black — also what [`NavigationBar`](/api/joist/navigation-bar)'s fill matches while the home screen is selected, so the bar blends in rather than reading as a separate strip |
| `name` | Defaults to a localized "Home" label; not usually overridden |
| Icon buttons | Each button is built from the corresponding screen's `homeScreenIcon` (a [`ScreenIcon`](/api/joist/screen-icon)) and `name`; clicking one sets `sim.selectedScreenProperty` to that screen |
| `instrumentNameProperty` | `false` by default for `HomeScreen` (unlike ordinary screens) — its name isn't independently PhET-iO instrumented |

## Related

- [Sim](/api/joist/sim) — decides whether to auto-create a `HomeScreen`, based on `allSimScreens.length`.
- [Screen](/api/joist/screen) — the base class `HomeScreen` extends, and the source of the icons/names it displays.
- [ScreenIcon](/api/joist/screen-icon) — builds each screen's `homeScreenIcon`.
- [NavigationBar](/api/joist/navigation-bar) — matches its fill to `HomeScreen.BACKGROUND_COLOR` while the home screen is active.
