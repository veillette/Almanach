---
title: CloseButton
description: A red rectangular button with a white "X" icon, the standard control for dismissing a dialog or panel.
category: api
library: scenery-phet
tags: [scenery-phet, CloseButton, button]
status: verified
related:
  - /api/sun/rectangular-push-button
  - /api/scenery-phet/back-button
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# CloseButton

`CloseButton` (from `scenerystack/scenery-phet`) is a [`RectangularPushButton`](/api/sun/rectangular-push-button) preloaded with a white "X" icon (built from a `Shape`, not an image) on PhET's standard colorblind-safe red background. It's the standard control for dismissing a dialog, popup, or closable panel — distinct from [`BackButton`](/api/scenery-phet/back-button), which navigates rather than dismisses.

```ts
import { CloseButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const closeButton = new CloseButton( {
  listener: () => {
    dialog.hide();
  },
  tandem: tandem.createTandem( 'closeButton' )
} );
```

## Options

`CloseButtonOptions` adds two options on top of the [same `RectangularPushButtonOptions`](/api/sun/rectangular-push-button) every rectangular push button accepts — `content` is fixed and not settable, since the "X" icon defines this button.

| Option | Default | Effect |
| --- | --- | --- |
| `iconLength` | `16` | Side length of the square "X" icon |
| `pathOptions` | `{ stroke: 'white', lineWidth: 2.5, lineCap: 'round' }` | Options forwarded to the `Path` that draws the "X" strokes |
| `baseColor` | `PhetColorScheme.RED_COLORBLIND` | A red tuned to remain distinguishable in colorblind testing, rather than a plain CSS `'red'` |
| `xMargin` / `yMargin` | `4` / `4` | Margin between the icon and the button edge |
| `soundPlayer` | the shared `'generalClose'` sound player | Overridable if a different button in the same sim needs a distinct sound |

::: tip Use `PhetColorScheme.RED_COLORBLIND`, not plain `'red'`, for anything red
`CloseButton`'s default background isn't CSS `'red'` — it's `PhetColorScheme.RED_COLORBLIND`, chosen specifically to stay distinguishable from green under common forms of color blindness. If you ever need a custom red element elsewhere in a sim, reuse that same constant instead of a literal color string.
:::
