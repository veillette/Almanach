---
title: EraserButton
description: A standard rectangular button with an eraser icon, typically wired to a "clear" or "reset the drawing" action.
category: api
library: scenery-phet
tags: [scenery-phet, EraserButton, button]
status: verified
related:
  - /api/sun/rectangular-push-button
  - /api/scenery-phet/reset-all-button
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# EraserButton

`EraserButton` (from `scenerystack/scenery-phet`) is a [`RectangularPushButton`](/api/sun/rectangular-push-button) preloaded with an eraser icon (an `Image` node built from an SVG asset baked into scenery-phet, not a `Shape`-based icon) and PhET's standard yellow button color. Use it for "clear" actions — wiping a drawing, clearing accumulated data points, removing user-placed objects — that are narrower in scope than a full [`ResetAllButton`](/api/scenery-phet/reset-all-button), which resets the entire screen.

```ts
import { EraserButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const clearButton = new EraserButton( {
  listener: () => {
    pointsProperty.reset();
  },
  tandem: tandem.createTandem( 'eraserButton' )
} );
```

## Options

`EraserButtonOptions` adds one option on top of the [same `RectangularPushButtonOptions`](/api/sun/rectangular-push-button) every rectangular push button accepts (`listener`, `xMargin`/`yMargin`, `fireOnHold`, `enabledProperty`, `touchAreaXDilation`/`touchAreaYDilation`, …) — note that `content` is fixed and not settable, since the icon is what defines this button.

| Option | Default | Effect |
| --- | --- | --- |
| `iconWidth` | `20` | Width the eraser icon is scaled to (height follows from the image's aspect ratio) |
| `baseColor` | `PhetColorScheme.BUTTON_YELLOW` | Overridable, but yellow is the PhET-standard color for this button |

::: tip Keep the yellow base color unless there's a strong reason not to
`EraserButton`'s default `baseColor` matches `PhetColorScheme.BUTTON_YELLOW` — the same convention [`BackButton`](/api/scenery-phet/back-button) uses. Sims that recolor individual buttons ad hoc make the UI harder to scan at a glance; prefer leaving PhET's standard button colors alone and reserve custom colors for content that specifically needs to stand out.
:::
