---
title: ScreenIcon
description: A Node wrapper that centers and scales an icon onto a fixed-size background, for use as a Screen's homeScreenIcon or navigationBarIcon.
category: api
library: joist
tags: [joist, ScreenIcon, Screen]
status: verified
related:
  - /api/joist/screen
  - /api/joist/home-screen
  - /api/joist/navigation-bar
prerequisites:
  - /api/joist/screen
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ScreenIcon

`ScreenIcon` is a `Node` that wraps an arbitrary icon `Node` in a fixed-size background rectangle, automatically scaling and centering the icon to fit — it's the standard way to build the `homeScreenIcon`/`navigationBarIcon` options a [`Screen`](/api/joist/screen) takes. Without it, you'd have to hand-compute scale factors and centering every time an icon's own bounds change (e.g. because it contains a string `Property` that changes with locale).

::: warning `ScreenIcon` is exported from `scenerystack/sim`, not `scenerystack/joist`
Same gotcha as [`Screen`](/api/joist/screen), [`Sim`](/api/joist/sim), and [`ScreenView`](/api/joist/screen-view): despite living in the `joist` repository, it's exported from **`scenerystack/sim`**.
:::

```ts
import { Screen, ScreenIcon } from 'scenerystack/sim';
import { Circle } from 'scenerystack/scenery';

const homeScreenIcon = new ScreenIcon( new Circle( 40, { fill: 'blue' } ), {
  fill: 'white'
} );

const myScreen = new Screen( createModel, createView, {
  name: myScreenNameProperty,
  homeScreenIcon: homeScreenIcon,
  tandem: screenTandem
} );
```

## Constructor

```ts
new ScreenIcon( iconNode: Node, providedOptions?: ScreenIconOptions )
```

`iconNode` is made `pickable: false` internally (icons shouldn't intercept input), and a listener on `iconNode.localBoundsProperty` keeps it centered and re-scaled if its bounds ever change after construction.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `Screen.MINIMUM_HOME_SCREEN_ICON_SIZE` (`Dimension2( 548, 373 )`) | Size of the background rectangle. There's no `ScreenIcon.MINIMUM_HOME_SCREEN_ICON_SIZE` static — the default value is mirrored on `Screen` (and also importable as the standalone `MINIMUM_HOME_SCREEN_ICON_SIZE` export). Pass `Screen.MINIMUM_NAVBAR_ICON_SIZE` when building a `navigationBarIcon` specifically, so it matches the navigation bar's smaller aspect |
| `maxIconWidthProportion` | `0.85` | Max proportion of the background's width the icon is scaled to fill |
| `maxIconHeightProportion` | `0.85` | Max proportion of the background's height the icon is scaled to fill |
| `fill` | `'white'` | Background rectangle fill |
| `stroke` | `null` | Background rectangle stroke |

`iconNode` is scaled uniformly (never stretched) by `Math.min` of the two proportion-based limits, then centered on the background — so a non-square icon never overflows either dimension.

::: tip `homeScreenIcon` and `navigationBarIcon` must share the same aspect ratio
`Screen` asserts this at construction time, because the navigation bar's icon is effectively a scaled-down version of the home screen's — if you only build one `ScreenIcon`, `navigationBarIcon` defaults to a scaled copy of `homeScreenIcon`, which is usually what you want. Build `navigationBarIcon` separately (with `size: Screen.MINIMUM_NAVBAR_ICON_SIZE`) only if the two icons genuinely need different content, not just different sizes.
:::

## Related

- [Screen](/api/joist/screen) — the `homeScreenIcon`/`navigationBarIcon` options that consume a `ScreenIcon`.
- [HomeScreen](/api/joist/home-screen) — renders each sim screen's `homeScreenIcon` as a selectable button.
- [NavigationBar](/api/joist/navigation-bar) — renders each sim screen's `navigationBarIcon`.
