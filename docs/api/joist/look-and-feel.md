---
title: LookAndFeel
description: The Sim-wide manager of the current screen's background color and the derived navigation-bar colors that keep it readable against either black or white.
category: api
library: joist
tags: [joist, LookAndFeel, Sim, Screen, color, navigation-bar]
status: complete
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/navigation-bar
  - /api/scenery/color-property-and-profile-color-property
prerequisites:
  - /api/joist/sim
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LookAndFeel

`LookAndFeel` (from `scenerystack/joist`) is a small class, one instance per running [`Sim`](/api/joist/sim), that owns the single source of truth for the currently-displayed screen's background color and derives the navigation bar's fill/text colors from it. A `Sim` creates its own `LookAndFeel` and exposes it as `sim.lookAndFeel`; each [`Screen`](/api/joist/screen)'s `backgroundColorProperty` is wired to update `lookAndFeel.backgroundColorProperty` whenever that screen is the one currently selected.

```ts
import { LookAndFeel } from 'scenerystack/joist';

// Typically accessed from the running Sim, not constructed directly by sim code:
declare const lookAndFeel: LookAndFeel;

lookAndFeel.backgroundColorProperty.link( backgroundColor => {
  console.log( 'Current screen background:', backgroundColor.toCSS() );
} );

console.log( lookAndFeel.navigationBarDarkProperty.value ); // true when the nav bar background is black
```

## Constructor

```ts
new LookAndFeel()
```

Takes no options — sim code virtually never constructs a `LookAndFeel` itself; use the one already created by `Sim` (`sim.lookAndFeel`).

## Public API

| Member | Description |
| --- | --- |
| `backgroundColorProperty` | `Property<Color>`, initially `Color.BLACK`. Set by `Sim` to track whichever screen is currently selected; this is also the `Color` applied to the `Display`'s `backgroundColor` |
| `navigationBarDarkProperty` | `TReadOnlyProperty<boolean>` — `true` exactly when `backgroundColorProperty` equals `Color.BLACK` |
| `navigationBarFillProperty` | `TReadOnlyProperty<Color>` — `white` when the background is black, `black` otherwise (i.e. the navigation bar always contrasts with the current screen background) |
| `navigationBarTextFillProperty` | `TReadOnlyProperty<Color>` — the readable text/icon color for whatever `navigationBarFillProperty` currently is (`white` text on a black nav bar, `black` text on a white nav bar) |
| `reset()` | Resets `backgroundColorProperty` to its initial value (`Color.BLACK`); the three derived Properties update automatically since they're `DerivedProperty`s |

## How this ties into `Screen`

Every `Screen` accepts a `backgroundColorProperty` option; whichever screen is currently active has its background color propagated into `sim.lookAndFeel.backgroundColorProperty` by `Sim`'s screen-selection logic. Because `navigationBarFillProperty`/`navigationBarTextFillProperty` are derived from that single Property, the navigation bar's contrast is automatically correct for every screen without each screen needing to compute or declare its own navigation bar colors.

::: tip Read from `LookAndFeel`, don't write to it, outside of `Sim` internals
The only Property on `LookAndFeel` meant to be set from outside is `backgroundColorProperty`, and even that is normally driven by `Sim`'s screen-switching logic rather than sim code setting it directly. Screen and view code should treat `lookAndFeel`'s Properties as read-only signals for "what should currently contrast well," not as a general-purpose theming API — for broader theming, use [`ColorProperty`/`ProfileColorProperty`](/api/scenery/color-property-and-profile-color-property).
:::
