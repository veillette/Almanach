---
title: Icon Sizing and Button Padding Standards
description: Standardizing icon dimensions and button touch-target padding once you already have icons and buttons, so a sim's controls read as one consistent set rather than a collection of individually-reasonable sizes.
category: styling
tags: [sun, styling, icons, touchArea, conventions, spacing]
status: complete
related:
  - /styling/iconography-conventions
  - /styling/spacing-and-sizing-constants
  - /styling/layout-container-conventions
  - /api/sun/rectangular-push-button
prerequisites:
  - /styling/iconography-conventions
  - /styling/spacing-and-sizing-constants
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Icon Sizing and Button Padding Standards

[Iconography Conventions](/styling/iconography-conventions) covers *building* an icon — reaching for a stock `scenery-phet` icon, drawing a custom one from a `kite` `Shape`, routing its color through the project's palette. This page is the next layer once icons exist: **standardizing their size and the padding around them** so every button in a sim reads as part of one consistent set, rather than each button's designer independently picking "something that looked about right."

## Pick a small icon-size scale, not a size per button

Just as [Spacing and Sizing Constants](/styling/spacing-and-sizing-constants) centralizes margins, a project should settle on two or three icon sizes — not one fixed size for every icon regardless of context, and not a bespoke size chosen freehand at each call site:

```ts
// MySimConstants.ts
const MySimConstants = {
  // Icon sizes: a small scale, not one-off numbers per button.
  SMALL_ICON_SIZE: 16,   // dense toolbars, inline icons next to text
  STANDARD_ICON_SIZE: 24, // the default for most push/toggle buttons
  LARGE_ICON_SIZE: 32     // a screen's one or two most prominent actions
};
```

```ts
import { GridIcon } from 'scenerystack/scenery-phet';
import MySimConstants from '../MySimConstants.js';

const gridToggleIcon = new GridIcon( {
  size: MySimConstants.STANDARD_ICON_SIZE
} );
```

A button's icon size should come from this scale based on the button's *role* (a dense toolbar of secondary actions vs. a screen's one primary action), not from what happens to look balanced in isolation — two buttons of the same visual weight and importance should use the same named size, even if they live on different screens.

## Standardize xMargin/yMargin per button "weight," not per button

`RectangularPushButton` (and every other `sun` button) exposes `xMargin`/`yMargin` — the padding between `content` and the button's edge (see [`RectangularPushButton`](/api/sun/rectangular-push-button)). Pair each icon size in the scale with a matching margin pair so the *ratio* of icon to button stays consistent, and reuse the pair via a shared options object:

```ts
// MySimConstants.ts
const MySimConstants = {
  STANDARD_ICON_SIZE: 24,

  STANDARD_BUTTON_OPTIONS: {
    xMargin: 8,
    yMargin: 8,
    cornerRadius: 6
  }
};

// Usage
import { RectangularPushButton } from 'scenerystack/sun';
import { GridIcon } from 'scenerystack/scenery-phet';
import MySimConstants from '../MySimConstants.js';

const gridToggleButton = new RectangularPushButton( {
  content: new GridIcon( { size: MySimConstants.STANDARD_ICON_SIZE } ),
  listener: () => model.toggleGrid(),
  ...MySimConstants.STANDARD_BUTTON_OPTIONS
} );
```

A button with a tiny icon and a huge margin (or a large icon crammed against the edge with almost no margin) both read as visually off in a way that's easy to miss reviewing one button at a time — comparing every button on a screen side by side is the practical way to catch a margin that drifted from the rest.

## Touch-target padding is a separate concern from visual padding

`xMargin`/`yMargin` control how much space content has *inside* the button's visible bounds — they affect appearance. `touchAreaXDilation`/`touchAreaYDilation` (also on `RectangularPushButton` and most other `sun` components) instead expand the *invisible* hit-testing region beyond the button's visible edge, so a visually compact button is still comfortably tappable on a touchscreen without looking oversized. These two are independent and both matter:

```ts
const compactIconButton = new RectangularPushButton( {
  content: new GridIcon( { size: MySimConstants.SMALL_ICON_SIZE } ),
  xMargin: 4,                  // visually tight - this button should look small
  yMargin: 4,
  touchAreaXDilation: 10,       // but still easy to tap - invisible, doesn't affect appearance
  touchAreaYDilation: 10,
  listener: () => model.toggleGrid()
} );
```

A common mistake is trying to solve the touch-target problem by inflating `xMargin`/`yMargin` instead — that makes the button visually larger too, which is often not the intended look for a dense toolbar. Reach for `touchAreaXDilation`/`touchAreaYDilation` (and the matching `mouseArea` dilation options, less critical but sometimes useful for small precision targets on desktop too) to solve touch-target size without changing how the button looks.

## A minimum touch target, applied consistently

A commonly cited baseline for a comfortably tappable control is roughly 44×44 CSS pixels (drawn from mobile platform accessibility guidance, not a SceneryStack-specific constant); treat it as a floor, not a target to hit exactly. Compute each button family's total dilated hit area against that floor once, store the dilation as a named constant, and apply it everywhere that button family appears, rather than tuning dilation per instance until each one "feels about right":

```ts
// MySimConstants.ts — a 24x24 visual button + xMargin/yMargin of 8 already reaches 40x40;
// a small additional dilation pushes every standard button comfortably past the ~44px floor.
const MySimConstants = {
  STANDARD_TOUCH_DILATION: 4
};
```

::: tip Audit sizes/margins across a whole screen at once, not button by button
Any single icon size or button margin looks "fine" reviewed in isolation — inconsistency across a set of buttons only becomes obvious when they're compared side by side. Periodically pull up every button on a screen at once (or in a shared component gallery, if the project has one) and check that same-role buttons genuinely share the same icon size and margin pair, rather than three subtly different numbers that each individually looked reasonable when they were written.
:::
