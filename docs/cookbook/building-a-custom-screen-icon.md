---
title: Building a Custom ScreenIcon
description: Composing a Node into a ScreenIcon for use as a Screen's home-screen or navigation-bar icon.
category: cookbook
tags: [joist, ScreenIcon, Screen, sim]
status: complete
related:
  - /api/joist/screen-icon
  - /api/joist/screen
  - /styling/iconography-conventions
prerequisites:
  - /api/joist/screen-icon
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Building a Custom ScreenIcon

**Task:** a `Screen` needs a `homeScreenIcon` (and usually a matching `navigationBarIcon`) that represents it visually on the home screen and in the navigation bar — built from your own icon artwork rather than a placeholder rectangle.

[`ScreenIcon`](/api/joist/screen-icon) is a `Node` wrapper that takes any icon `Node`, centers it on a fixed-size background, and scales it to fit — you build the icon content once as ordinary scenery Nodes, then hand it to `ScreenIcon` instead of computing scale factors yourself.

## The solution

```ts
import { Screen, ScreenIcon } from 'scenerystack/sim';
import { Circle, Rectangle, Node } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

// Build the icon's content out of ordinary scenery Nodes - here, a simple
// "ball on a ramp" glyph representing an Intro screen.
function createIntroIconNode(): Node {
  const ramp = new Rectangle( 0, 20, 80, 8, { fill: 'saddlebrown' } );
  const ball = new Circle( 12, { fill: 'crimson', x: 60, y: 8 } );
  return new Node( { children: [ ramp, ball ] } );
}

const homeScreenIcon = new ScreenIcon( createIntroIconNode(), {
  fill: 'white',
  maxIconWidthProportion: 0.85,
  maxIconHeightProportion: 0.85
} );

const introTandem = Tandem.ROOT.createTandem( 'introScreen' );

const introScreen = new Screen(
  () => ( {} ), // createModel - real sims pass an actual model factory
  () => ( {} ), // createView - real sims pass a ScreenView factory
  {
    name: new Property( 'Intro' ),
    homeScreenIcon: homeScreenIcon,
    // navigationBarIcon is omitted - Screen defaults it to a scaled copy of
    // homeScreenIcon, which is correct as long as one icon reads fine at
    // both sizes. Build a separate one only if it doesn't (see below).
    backgroundColorProperty: new Property( 'white' ),
    tandem: introTandem
  }
);
```

`ScreenIcon`'s constructor makes the icon `Node` `pickable: false` and keeps it centered/re-scaled automatically if its bounds ever change later (e.g. because a child Text label's string changes with locale) — you never need to recompute the centering yourself.

## Building a separate navigation-bar icon

The navigation bar renders its icon much smaller than the home screen does, so a detailed icon that reads fine at home-screen size can turn into a blur in the nav bar. When that happens, build a second, simplified `ScreenIcon` sized for the nav bar explicitly:

```ts
const navigationBarIcon = new ScreenIcon( createIntroIconNode(), {
  size: Screen.MINIMUM_NAVBAR_ICON_SIZE,
  fill: 'white'
} );
```

`homeScreenIcon` and `navigationBarIcon` must share the same aspect ratio — `Screen` asserts this at construction, so only pass a separate `navigationBarIcon` with the same width/height ratio as `Screen.MINIMUM_NAVBAR_ICON_SIZE` implies (it already shares an aspect ratio with `Screen.MINIMUM_HOME_SCREEN_ICON_SIZE`, so simply passing `size` is normally enough).

## Options used here

| Option | Effect |
| --- | --- |
| `size` | Background rectangle size; defaults to `Screen.MINIMUM_HOME_SCREEN_ICON_SIZE`, pass `Screen.MINIMUM_NAVBAR_ICON_SIZE` for a nav-bar-specific icon |
| `maxIconWidthProportion` / `maxIconHeightProportion` | Max fraction of the background the icon is scaled to fill (both default `0.85`) |
| `fill` / `stroke` | Background rectangle styling |

::: tip Reach for stock icon-building Nodes first
Before hand-drawing shapes for icon content, check [Iconography Conventions](/styling/iconography-conventions) for `scenery-phet`'s ready-made icon Nodes (`PlusNode`, `ArrowNode`, etc.) — a `ScreenIcon`'s content is just a `Node`, so any of those compose into it exactly like the custom `Node` above.
:::

::: warning Icon content should be static, not dynamic UI
`ScreenIcon`'s content is rendered once and displayed as a snapshot of what the screen looks like — don't pass live model-connected Nodes (things that would themselves need `dispose()` or ongoing Property links) as icon content. Build a small, self-contained decorative `Node` purely for the icon, as shown above.
:::
