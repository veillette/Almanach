---
title: Constants File Pattern
description: The convention of one MySimConstants.ts module holding every shared magic number, color, and font - the same convention scenery-phet/sun's own SceneryPhetConstants and SunConstants follow.
category: patterns
tags: [conventions, constants, architecture, SceneryPhetConstants, SunConstants]
status: complete
related:
  - /styling/spacing-and-sizing-constants
  - /patterns/multi-screen-sim-structure
  - /patterns/options-pattern
prerequisites:
  - /patterns/model-view-separation
---

# Constants File Pattern

A single, project-wide module — conventionally named `MySimConstants.ts` — holds every shared magic number, color, and font a simulation's view code depends on, exported as one plain object and imported by name everywhere that value is needed. [Spacing and Sizing Constants](/styling/spacing-and-sizing-constants) already covers the layout-dimension slice of this convention in depth; this page is the general pattern it's one application of — the same "one file, referenced by name, never retyped" rule applies just as much to colors, fonts, and any other sim-wide constant, not spacing alone.

## The pattern, generalized beyond spacing

```ts
// MySimConstants.ts
import { PhetFont } from 'scenerystack/scenery-phet';

const MySimConstants = {

  // Spacing/sizing - see Spacing and Sizing Constants for this slice in depth
  SCREEN_MARGIN: 15,
  PANEL_CORNER_RADIUS: 10,

  // Color
  CONTROL_PANEL_FILL: '#f0f0f0',
  ACCENT_COLOR: '#3182ce',

  // Font
  LABEL_FONT: new PhetFont( 16 ),
  TITLE_FONT: new PhetFont( { size: 22, weight: 'bold' } )
};

export default MySimConstants;
```

```ts
// Anywhere in view code - reference by name, never retype a literal color/font/number.
import MySimConstants from '../MySimConstants.js';
import { Panel } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';

const panel = new Panel( content, {
  cornerRadius: MySimConstants.PANEL_CORNER_RADIUS,
  fill: MySimConstants.CONTROL_PANEL_FILL
} );

const title = new Text( 'My Sim', { font: MySimConstants.TITLE_FONT } );
```

The value of centralizing this goes up, not down, once colors and fonts are included alongside spacing: a color used in five places that's supposed to be "the sim's one accent color" is exactly the kind of value that silently drifts (one call site gets nudged during a design review, the other four don't) if it's retyped as a literal at each site, the same drift [Spacing and Sizing Constants](/styling/spacing-and-sizing-constants#the-anti-pattern-magic-numbers-at-each-call-site) describes for margins.

## Precedent: this is how SceneryStack's own libraries are structured

This isn't a convention invented for individual sim repos in isolation — it mirrors how `scenery-phet` and `sun` structure their own shared, cross-component constants: a `SceneryPhetConstants`-style module holds values common-code components across `scenery-phet` share (for instance, the default button radius `ResetAllButton` falls back to, referenced as `SceneryPhetConstants.DEFAULT_BUTTON_RADIUS` in that button's own option defaults — see [ResetAllButton](/api/scenery-phet/reset-all-button)), and a parallel `SunConstants`-style module plays the same role for `sun` (e.g. the default placeholder token `NumberDisplay` substitutes a value into, referenced as `SunConstants.VALUE_NAMED_PLACEHOLDER` — see [NumberDisplay](/api/scenery-phet/number-display)). A project's own `MySimConstants.ts` is the same idea applied one level down: instead of a library centralizing values shared across *its own* components, a sim centralizes values shared across *its own* screens.

## What belongs in the constants file

The same test [Spacing and Sizing Constants](/styling/spacing-and-sizing-constants#what-belongs-in-the-constants-file-and-what-doesnt) applies generalized beyond dimensions: a value belongs in the constants file if a design review would refer to it as "the project's standard X" — its accent color, its label font, its panel margin — regardless of whether X is a number, a color string, or a `Font` instance. A value that's genuinely local to one Node (the exact shade of one decorative flourish, a one-off font size nothing else shares) stays where it's used; promoting every literal in a codebase into the constants file regardless of whether it's actually shared just relocates the clutter instead of removing it.

::: tip One file per project, organized by category - not one file per screen
As [Multi-Screen Sim Structure](/patterns/multi-screen-sim-structure) establishes for shared code generally, a constants module belongs in `common/`, imported by every screen that needs it — never duplicated per-screen, and never one screen's constants file imported by a second screen out of convenience. Structure the file's contents by *kind* (spacing, color, font) rather than by which screen first needed a given value, the same guidance [Spacing and Sizing Constants](/styling/spacing-and-sizing-constants#tip-group-by-role-not-by-screen) gives for the spacing-only case.
:::
