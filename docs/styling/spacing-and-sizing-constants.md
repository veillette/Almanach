---
title: Spacing and Sizing Constants
description: Centralizing margins, spacing, and icon sizes in one constants file instead of hardcoding magic numbers throughout view code.
category: styling
tags: [scenery, constants, spacing, layout, conventions]
status: complete
related:
  - /styling/layout-container-conventions
  - /patterns/options-pattern
prerequisites:
  - /styling/layout-container-conventions
---

# Spacing and Sizing Constants

[Layout Container Conventions](/styling/layout-container-conventions) already recommends picking a small spacing scale; this page is the general version of that convention applied to every hardcoded visual number in a project — margins, panel corner radii, icon dimensions, stroke widths — not spacing alone. The rule: a bare numeric literal for a visual dimension belongs in exactly one constants file, referenced everywhere by name, never retyped at each call site.

## The pattern: one constants file

```ts
// MySimConstants.ts
const MySimConstants = {

  // Spacing (see also Layout Container Conventions)
  CONTROL_SPACING: 8,       // between closely related controls
  PANEL_SPACING: 16,        // between distinct sections within a panel
  SCREEN_MARGIN: 15,        // between content and the screen edge

  // Sizing
  PANEL_CORNER_RADIUS: 10,
  CHECKBOX_ICON_SIZE: 24,
  SLIDER_TRACK_SIZE: { width: 150, height: 4 },

  // Stroke
  PANEL_STROKE: 'black',
  PANEL_LINE_WIDTH: 1
};

export default MySimConstants;
```

```ts
// Anywhere in view code, reference the constant by name - never retype "16" or "10".
import MySimConstants from '../MySimConstants.js';
import { Panel } from 'scenerystack/sun';

const controlPanel = new Panel( content, {
  xMargin: MySimConstants.PANEL_SPACING,
  cornerRadius: MySimConstants.PANEL_CORNER_RADIUS,
  stroke: MySimConstants.PANEL_STROKE,
  lineWidth: MySimConstants.PANEL_LINE_WIDTH
} );
```

## The anti-pattern: magic numbers at each call site

```ts
// Don't do this - three panels each retype "roughly 15" with no shared source of
// truth, so nudging the project's margin convention means hunting every call site
// and hoping none were missed.
const panelA = new Panel( contentA, { xMargin: 15, cornerRadius: 8 } );
const panelB = new Panel( contentB, { xMargin: 14, cornerRadius: 10 } ); // already drifted
const panelC = new Panel( contentC, { xMargin: 16, cornerRadius: 8 } );  // already drifted
```

Once a number like this is retyped at more than one call site, the values silently drift apart the first time only one of them gets tweaked during a design pass — there is no longer a single "the project's panel margin" to point to, just several similar-looking numbers that happened to start out equal.

## What belongs in the constants file, and what doesn't

| Centralize it | Leave it local |
| --- | --- |
| Any dimension reused across more than one class, or that represents a project-wide convention ("this project's standard panel margin") | A dimension that is genuinely specific to one Node and unlikely to ever be reused (the exact radius of one decorative flourish) |
| Values a designer/reviewer would think of as "the project's spacing scale" | Values derived by computation from other constants (compute those inline from the constant, don't duplicate the computed result as its own constant) |

A value doesn't need to be reused *today* to earn a place in the constants file — if it's the kind of number a design review would refer to as "the standard spacing," it belongs there so the next screen that needs "the standard spacing" finds it instead of guessing a new number that happens to look similar.

::: tip Group by role, not by screen
Structure the constants file by what each value *is* (spacing, sizing, stroke) rather than by which screen introduced it. A `MySimConstants.SCREEN_MARGIN` used by every screen is more discoverable than a `IntroScreenConstants.MARGIN` that a second screen either duplicates or, worse, imports from the first screen's file out of convenience.
:::
