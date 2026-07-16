---
title: BackButton
description: A rectangular button with a leftward arrow icon, used for navigating back (e.g. to a level-selection screen).
category: api
library: scenery-phet
tags: [scenery-phet, BackButton, button]
status: verified
related:
  - /api/sun/rectangular-push-button
  - /api/scenery-phet/eraser-button
  - /api/scenery-phet/close-button
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BackButton

`BackButton` (from `scenerystack/scenery-phet`) is a [`RectangularPushButton`](/api/sun/rectangular-push-button) preloaded with a leftward arrow icon (built from `ArrowShape`, not an image), PhET's standard yellow button color, and margins tuned to visually match a refresh/step button of the same height. It originated for returning to a level-selection screen from a PhET game, and is generally appropriate anywhere a sim needs a "go back" affordance distinct from a browser's own back button.

```ts
import { BackButton } from 'scenerystack/scenery-phet';
```

<SceneryDemo demo="back-button" />

## A minimal example

```ts
const backButton = new BackButton( {
  listener: () => {
    sceneProperty.value = 'levelSelection';
  },
  tandem: tandem.createTandem( 'backButton' )
} );
```

## Options

`BackButtonOptions` adds one option on top of the [same `RectangularPushButtonOptions`](/api/sun/rectangular-push-button) every rectangular push button accepts — `content` is fixed and not settable, since the arrow icon defines this button.

| Option | Default | Effect |
| --- | --- | --- |
| `soundPlayer` | the shared `'goBack'` sound player | Overridable if a different button in the same sim needs a distinct sound |
| `baseColor` | `PhetColorScheme.BUTTON_YELLOW` | The standard PhET yellow |
| `xMargin` / `yMargin` | `8` / `10.9` | Tuned specifically so `BackButton` matches the height of PhET's refresh button, since the two often appear side by side — avoid overriding lightly |

::: tip Margins are tuned to match other same-height buttons
`BackButton`'s default `xMargin`/`yMargin` values aren't arbitrary — they were chosen so this button's overall height lines up with PhET's refresh/step buttons when placed in the same row. Overriding them can introduce a visible height mismatch in a control strip.
:::
