---
title: NavigationBar
description: The bar of screen buttons, title, and PhET menu shown at the bottom of every running Sim.
category: api
library: joist
tags: [joist, NavigationBar, Screen, Sim]
status: verified
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/screen-icon
  - /api/joist/home-screen
prerequisites:
  - /api/joist/sim
  - /api/joist/screen
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# NavigationBar

`NavigationBar` is the strip shown at the bottom of every running [`Sim`](/api/joist/sim): the sim's title on the left, a row of per-[`Screen`](/api/joist/screen) buttons and a home button for multi-screen sims, and the PhET/accessibility menu buttons on the right. `Sim` constructs exactly one `NavigationBar` internally — you never build one yourself, and its constructor even takes the owning `Sim` instance as an argument. Documented here because you'll see it referenced when reading `Sim`/`Screen` internals or customizing sim chrome via [`LookAndFeel`](/api/joist/sim), and because its static size constants are occasionally useful for layout math.

```ts
import { NavigationBar } from 'scenerystack/sim';

NavigationBar.NAVIGATION_BAR_SIZE; // Dimension2 - the bar's un-scaled design size (width matches HomeScreenView's layout bounds; height 40)
```

::: tip You configure the navigation bar through `Screen` and `Sim`, not `NavigationBar` itself
As a sim author, everything you'd want to change about the navigation bar is exposed elsewhere: a screen's button icon and label come from [`Screen`](/api/joist/screen)'s `navigationBarIcon`/`name` options (built with [`ScreenIcon`](/api/joist/screen-icon)), and the bar's fill/text colors come from `Sim.lookAndFeel` (a `LookAndFeel` instance, exported from `scenerystack/joist`). There's no supported way to construct or restyle a `NavigationBar` directly.
:::

## Constructor

```ts
new NavigationBar( sim: Sim, tandem: Tandem )
```

Constructed once by `Sim` during startup; not intended to be called from simulation code.

## Behavior worth knowing

| Aspect | Detail |
| --- | --- |
| Single-screen sims | Shows only the sim title (left) and PhET/a11y buttons (right) — no home button or per-screen buttons, since there's nothing to switch between |
| Multi-screen sims | Adds a home button and one button per entry in `sim.simScreens`, laid out and centered via `ManualConstraint`, with each screen's width driven by its `navigationBarIcon`'s label |
| Fill when on the home screen | The bar's background matches `HomeScreen.BACKGROUND_COLOR` (black) while the home screen is selected, so it visually blends into the [`HomeScreen`](/api/joist/home-screen) rather than showing as a separate bar |
| `layout( scale, width, height )` | Called by `Sim` on window resize to rescale/reposition the bar's contents; not meant to be called directly by simulation code |

## Related

- [Sim](/api/joist/sim) — owns the single `NavigationBar` instance and its `lookAndFeel`.
- [Screen](/api/joist/screen) — supplies the `name`/`navigationBarIcon` each screen button displays.
- [ScreenIcon](/api/joist/screen-icon) — builds the icon `navigationBarIcon` expects.
- [HomeScreen](/api/joist/home-screen) — the screen the home button switches to, and whose background color the bar matches when selected.
