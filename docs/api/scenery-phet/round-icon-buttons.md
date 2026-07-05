---
title: Small Icon Utility Buttons
description: RefreshButton, RestartButton, ReturnButton, CameraButton, ClapperboardButton, and StarButton — one-shot push buttons distinguished mainly by a fixed icon.
category: api
library: scenery-phet
tags: [scenery-phet, RefreshButton, RestartButton, ReturnButton, CameraButton, ClapperboardButton, StarButton, button]
status: complete
related:
  - /api/scenery-phet/trash-buttons
  - /api/scenery-phet/back-button
  - /api/scenery-phet/close-button
  - /api/sun/rectangular-push-button
  - /api/sun/round-push-button
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Small Icon Utility Buttons

`scenerystack/scenery-phet` ships a handful of small, single-purpose push buttons whose entire job is "one fixed icon, one momentary action." Each is a thin wrapper: pick a base push button class ([`RectangularPushButton`](/api/sun/rectangular-push-button) for most, [`RoundPushButton`](/api/sun/round-push-button) for `RestartButton`), build a `Path`/`Shape` icon in the constructor, assign it to `content`, and forward everything else. None of them add meaningful behavior beyond their parent class — no state, no toggling — so once you know one, you know the shape of all of them.

```ts
import { RefreshButton, RestartButton, ReturnButton, CameraButton, StarButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const refreshButton = new RefreshButton( {
  listener: () => model.reshuffle(),
  tandem: tandem.createTandem( 'refreshButton' )
} );

const restartButton = new RestartButton( {
  listener: () => model.restart(),
  tandem: tandem.createTandem( 'restartButton' )
} );
```

## The family

| Class | Base class | Icon | Typical use |
| --- | --- | --- | --- |
| `RefreshButton` | `RectangularPushButton` | A circular "sync" arrows glyph (`iconHeight` option, default `35`) | Re-randomizing or reshuffling a scene without a full reset |
| `RestartButton` | `RoundPushButton` | Two back-to-back triangles plus a bar — a "restart from beginning" glyph | Restarting an activity or animation from its start state |
| `ReturnButton` | `RectangularPushButton` | `ReturnIcon` (a curved "undo/return" arrow), `xMargin`/`yMargin` `5` | Undoing the last action or returning to a previous state |
| `CameraButton` | `RectangularPushButton` | A solid camera glyph, `iconFill`/`iconScale` options (default `'black'` / `0.587`); **requires** a `tandem` | Taking a snapshot of the current sim state |
| `ClapperboardButton` | `Node` (not a push button subclass) | A `RectangularPushButton` labeled "Synchronize Recording" plus a flashing/sounding overlay | Emitting a synchronized audio+visual+PhET-iO marker for aligning screen recordings — a data-collection prototype tool, not a typical sim UI element |
| `StarButton` | `RectangularPushButton` | A filled `StarShape` | A star-icon affordance, sized (`xMargin` ≈ `8.13`) to match `RefreshButton`/`RestartButton` when the three appear together |

All except `ClapperboardButton` default `baseColor` to `PhetColorScheme.BUTTON_YELLOW`, PhET's standard yellow for one-shot action buttons — the same color you'll see on `RefreshButton`, `ReturnButton`, `CameraButton`, `StarButton`, `ZoomButton`, and others.

## Options

Because each class just fixes `content` on top of its base button, the option surface is the base button's own options (`listener`, `xMargin`/`yMargin`, `enabledProperty`, `touchAreaXDilation`, `tandem`, …) plus the small icon-specific knobs called out above. None of these classes expose a settable `content` option.

::: tip `ClapperboardButton` is not a plain icon button
Unlike the rest of this page, `ClapperboardButton` is a composite `Node` — it contains its own `RectangularPushButton` internally, plays a tone via `tambo`, and flashes a full-screen overlay. Its source comments explicitly flag it as "prototype code... not a typical UI component," intended for data-collection studies rather than general sim use.
:::
