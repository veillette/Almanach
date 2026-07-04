---
title: Panels and Backgrounds
description: Conventions for grouping controls with Panel/AccordionBox.
category: styling
tags: [sun, Panel, styling]
status: verified
related:
  - /api/sun/panel
  - /api/sun/accordion-box
  - /styling/layout-container-conventions
  - /styling/color-profiles
prerequisites:
  - /api/sun/panel
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Panels and Backgrounds

[`Panel`](/api/sun/panel) and [`AccordionBox`](/api/sun/accordion-box) are the two standard ways to give a group of controls a visible background. This page is about *when to reach for which*, and how their appearance options should be set consistently across a project — not their full option lists.

## Panel for always-visible groups, AccordionBox for optional ones

Use `Panel` when the controls inside should always be visible — a persistent control panel in a screen's corner. Use `AccordionBox` when the content is secondary or optional and the user should be able to collapse it to reclaim space:

```ts
import { Panel, AccordionBox } from 'scenerystack/sun';
import { VBox, Text } from 'scenerystack/scenery';

// Always visible
const controlPanel = new Panel( controlsVBox, {
  fill: '#f0f0f0',
  stroke: 'black'
} );

// Collapsible, secondary content
const graphAccordionBox = new AccordionBox( graphContent, {
  titleNode: new Text( 'Graph' ),
  expandedDefaultValue: false
} );
```

Both take exactly one content `Node` — build the actual controls with a [layout container](/styling/layout-container-conventions) (`VBox`/`GridBox`) first, then wrap that in the `Panel`/`AccordionBox`.

## One appearance, reused everywhere

A project should settle on one `fill`/`stroke`/`cornerRadius`/`xMargin`/`yMargin` combination for its panels and reuse it via a shared options object, rather than repeating literals (or worse, drifting slightly) at every call site:

```ts
// MySimConstants.ts
const MySimConstants = {
  PANEL_OPTIONS: {
    fill: '#f0f0f0',
    stroke: 'black',
    lineWidth: 1,
    cornerRadius: 8,
    xMargin: 10,
    yMargin: 8
  }
};

// Usage
import { combineOptions } from 'scenerystack/phet-core';

const controlPanel = new Panel( controlsVBox, MySimConstants.PANEL_OPTIONS );

const wideControlPanel = new Panel( otherControlsVBox,
  combineOptions( {}, MySimConstants.PANEL_OPTIONS, { minWidth: 220 } )
);
```

`combineOptions` (from `scenerystack/phet-core`) merges a base options object with per-instance overrides without mutating the shared constant.

## Route panel fills through a colors file

Don't hard-code `fill: '#f0f0f0'` inline — pull it from the project's [color profile](/styling/color-profiles) file so the panel automatically adapts to projector mode:

```ts
import MySimColors from './MySimColors.js';

const controlPanel = new Panel( controlsVBox, {
  fill: MySimColors.panelFillProperty,
  stroke: MySimColors.panelStrokeProperty
} );
```

`Panel`'s `fill`/`stroke` accept a `Property<Color>` directly (like any scenery paint), so the panel updates live when the profile switches.

## Nesting panels sparingly

A `Panel` inside another `Panel` reads as visual clutter — two borders and two background tints stacked for no additional grouping information. If a sub-group truly needs separation, prefer a `HSeparator`/`VSeparator` line or extra `spacing` within a single outer `Panel` over nesting.

::: tip Match cornerRadius across the sitewide component set
`Panel` defaults to `cornerRadius: 10`; sun's buttons and other components have their own default corner radii. If a project's panels use a different radius than its buttons, the mismatch reads as an inconsistency even when nothing else changed — pick one radius (or a small set: e.g. panels slightly more rounded than buttons) and apply it everywhere via shared constants, as above.
:::
