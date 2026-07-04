---
title: Typography and Fonts
description: Using PhetFont consistently and font-size/weight conventions.
category: styling
tags: [scenery-phet, PhetFont, typography]
status: complete
related:
  - /api/scenery-phet/phet-font
  - /styling/panels-and-backgrounds
  - /styling/layout-container-conventions
prerequisites:
  - /api/scenery-phet/phet-font
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Typography and Fonts

Every piece of text in a SceneryStack application should be built from [`PhetFont`](/api/scenery-phet/phet-font) rather than scenery's plain `Font`. This page covers the conventions for *which* sizes and weights to reach for, not the mechanics of the class itself (see the linked API page for that).

## The core idea

`PhetFont` guarantees the standard PhET typeface and a `sans-serif` fallback. Pick a size, optionally a weight, and hand the result to a `Text` or `RichText`:

```ts
import { PhetFont } from 'scenerystack/scenery-phet';
import { Text } from 'scenerystack/scenery';

// Convenience shorthand: just a size
const bodyFont = new PhetFont( 16 );

// Full options form when you also need weight/style
const titleFont = new PhetFont( { size: 22, weight: 'bold' } );

const title = new Text( 'Gravity and Orbits', { font: titleFont } );
const label = new Text( 'Mass (kg)', { font: bodyFont } );
```

## A shared type-scale, not ad-hoc sizes

Rather than sprinkling `new PhetFont( 17 )`, `new PhetFont( 18 )`, `new PhetFont( 15 )` across a codebase, define a small, named scale once (alongside a project's [colors file](/styling/panels-and-backgrounds)) and reuse it everywhere:

```ts
// MySimConstants.ts
import { PhetFont } from 'scenerystack/scenery-phet';

const MySimConstants = {
  TITLE_FONT: new PhetFont( { size: 22, weight: 'bold' } ),
  CONTROL_PANEL_TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  CONTROL_FONT: new PhetFont( 16 ),
  READOUT_FONT: new PhetFont( 18 )
};

export default MySimConstants;
```

A handful of sizes is normally enough: a screen/title size, a panel-heading size (usually bold at the same or one step down from body text), a body/control size, and occasionally a larger "readout" size for prominent numeric displays. Resist introducing a new size for a single label — reuse the nearest existing one.

## Weight and emphasis

`PhetFont`'s `weight` option (part of scenery's `FontOptions`) takes any valid CSS font-weight, but in practice PhET sims only use two: the default (regular) weight and `'bold'` for headings or emphasis. Avoid `italic` for emphasis — it reads poorly at small sizes on projectors; use `weight: 'bold'` or a color/size change instead.

## Sizing for fit, not just readability

Text inside a fixed-width control (a [`Panel`](/styling/panels-and-backgrounds) title, a button label) needs to fit the available space at every supported browser width. Two common techniques:

```ts
import { RichText } from 'scenerystack/scenery';

// MaxWidth: scenery scales the Node down (preserving aspect ratio) if it would
// otherwise exceed this width, rather than clipping or overflowing.
const readout = new RichText( speedStringProperty, {
  font: MySimConstants.READOUT_FONT,
  maxWidth: 120
} );
```

`maxWidth` (and its vertical counterpart `maxHeight`) are `Node` options available on `Text`/`RichText` — they matter especially for translated strings, which can run much longer than the English source string.

::: tip Don't hand-roll font strings
Never construct a raw CSS font string (`'bold 16px Arial'`) or use scenery's plain `Font` class directly. `PhetFont` is the one audit point for the project's typography, and skipping it means losing the guaranteed `sans-serif` fallback documented on the [`PhetFont` API page](/api/scenery-phet/phet-font).
:::
