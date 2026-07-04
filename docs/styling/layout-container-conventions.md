---
title: Layout Container Conventions
description: Styling conventions when composing FlowBox/GridBox/AlignBox layouts.
category: styling
tags: [scenery, layout, styling]
status: verified
related:
  - /styling/panels-and-backgrounds
  - /styling/typography-and-fonts
  - /api/sun/panel
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Layout Container Conventions

`VBox`, `HBox`, `FlowBox`, `GridBox`, and `AlignBox` (all from `scenerystack/scenery`) position children without you computing `x`/`y` by hand. This page is about the *conventions* for using them consistently, not their full option lists.

## Prefer VBox/HBox over raw FlowBox

`VBox` and `HBox` are just `FlowBox` pre-configured with `orientation: 'vertical'`/`'horizontal'`. Reach for `FlowBox` directly only when the orientation itself needs to change at runtime; otherwise `VBox`/`HBox` communicate intent at a glance:

```ts
import { VBox, HBox, Text, Checkbox } from 'scenerystack/scenery';

const controlsColumn = new VBox( {
  spacing: 8,
  align: 'left',
  children: [
    new Text( 'Options' ),
    new Checkbox( gravityEnabledProperty, new Text( 'Gravity' ) ),
    new Checkbox( frictionEnabledProperty, new Text( 'Friction' ) )
  ]
} );

const buttonRow = new HBox( {
  spacing: 12,
  children: [ playPauseButton, stepButton ]
} );
```

## One spacing scale per project

Pick a small set of spacing constants (commonly a tight value for closely related items and a looser one for grouped-but-distinct sections) and reuse them instead of scattering magic numbers:

```ts
// MySimConstants.ts
const MySimConstants = {
  CONTROL_SPACING: 8,     // between closely related controls (a checkbox list)
  PANEL_SPACING: 16,      // between distinct sections of a panel
  SCREEN_MARGIN: 15       // between content and the screen edge
};
```

## Alignment: say what you mean

`align` on a `VBox`/`HBox` controls cross-axis alignment (e.g. `align: 'left'` on a `VBox` left-aligns children of different widths). Set it explicitly rather than relying on the `'center'` default whenever children have varying sizes — a checkbox list that's meant to read as a left-aligned list looks unintentionally centered otherwise:

```ts
const checkboxList = new VBox( {
  spacing: 6,
  align: 'left',     // be explicit: this is a left-reading list, not a centered stack
  children: [ checkbox1, checkbox2, checkbox3 ]
} );
```

## Grids for tabular content, AlignBox for matching sizes

Use `GridBox` when content is genuinely tabular (rows and columns of related values), not as a substitute for nested `VBox`/`HBox`:

```ts
import { GridBox, Text } from 'scenerystack/scenery';

const readoutGrid = new GridBox( {
  xSpacing: 10,
  ySpacing: 4,
  rows: [
    [ new Text( 'Mass:' ), massReadout ],
    [ new Text( 'Speed:' ), speedReadout ]
  ]
} );
```

Use `AlignBox` (often paired with an `AlignGroup`) when several sibling Nodes of different natural sizes need to occupy matching bounds — e.g. making a row of buttons with icons of different aspect ratios all reserve the same width:

```ts
import { AlignGroup, AlignBox, HBox } from 'scenerystack/scenery';

const buttonGroup = new AlignGroup();

const row = new HBox( {
  spacing: 10,
  children: [
    new AlignBox( iconButtonA, { group: buttonGroup } ),
    new AlignBox( iconButtonB, { group: buttonGroup } )
  ]
} );
```

Each `AlignBox` sharing a `group` is resized to the union of all group members' bounds, so the buttons line up even though their icons differ in size.

## Margins live on the container, not the children

`FlowBox`/`GridBox` support `xMargin`/`yMargin` (uniform padding around every cell) in addition to `spacing` (the gap *between* cells). Prefer setting margins on the container over wrapping every child in its own spacer `Node`:

```ts
const paddedRow = new HBox( {
  spacing: 8,
  xMargin: 4,   // padding at the start/end of the row, per cell
  children: [ checkboxA, checkboxB ]
} );
```

::: tip Don't fight layout containers with manual positioning
Once a Node is a child of a `FlowBox`/`GridBox`, that container owns its `x`/`y` (via an internal layout constraint) — setting `x`/`y`/`left`/`top` on the child directly will be overwritten on the next layout pass. If a child needs a one-off offset, wrap it in its own `Node` (or use `layoutOptions`) rather than fighting the parent container.
:::
