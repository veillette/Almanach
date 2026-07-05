---
title: A Colorblind-Safe Palette
description: Practical guidance and a worked ProfileColorProperty palette that stays distinguishable under common color-vision deficiencies.
category: cookbook
tags: [scenery, Color, ProfileColorProperty, accessibility, styling]
status: complete
related:
  - /api/scenery/color
  - /styling/color-profiles
prerequisites:
  - /styling/color-profiles
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Colorblind-Safe Palette

**Task:** a sim distinguishes several categories by color alone (particle types, chart series, on/off states) and needs to stay usable for the ~8% of men and ~0.5% of women with red-green color-vision deficiency (the most common forms: deuteranopia/protanopia), without requiring a whole colorimetry background to get right.

The two practical rules that cover almost every case: **never make red vs. green the only distinguishing signal**, and **pair color with a second channel** (shape, position, a text label, a line pattern) wherever color is conveying information a user must act on. Everything below is applying those two rules through the wiki's existing color tools — [`Color`](/api/scenery/color) and [`ProfileColorProperty`](/styling/color-profiles) — not a separate palette system.

## A palette that avoids the classic failure mode

The most common colorblind-safe palette strategy is picking hues that stay separated along the blue-yellow axis (which red-green color blindness doesn't affect), rather than relying on red-vs-green separation:

```ts
// MySimColors.ts
import { ProfileColorProperty } from 'scenerystack/scenery';
import mySim from './mySim.js';

const MySimColors = {

  // A three-category palette (e.g. particle types) chosen so no two entries
  // rely on red/green alone to be told apart - blue, orange, and a distinct
  // purple remain distinguishable under deuteranopia/protanopia/tritanopia.
  categoryAColorProperty: new ProfileColorProperty( mySim, 'categoryA', {
    default: 'rgb( 0, 114, 178 )',   // blue
    projector: 'rgb( 0, 90, 140 )'
  } ),
  categoryBColorProperty: new ProfileColorProperty( mySim, 'categoryB', {
    default: 'rgb( 230, 159, 0 )',   // orange
    projector: 'rgb( 200, 130, 0 )'
  } ),
  categoryCColorProperty: new ProfileColorProperty( mySim, 'categoryC', {
    default: 'rgb( 204, 121, 167 )', // reddish-purple
    projector: 'rgb( 170, 90, 140 )'
  } )
};

export default MySimColors;
```

This is the same "one Colors file per project" pattern documented in [Color Profiles](/styling/color-profiles) — the colorblind-safe requirement changes *which* hues you pick, not the mechanism for declaring or switching them.

## Pairing color with a second channel

Wherever a color distinction is the only way a user tells two things apart, add a redundant, non-color signal alongside it:

```ts
import { Circle, Rectangle, Node, Text } from 'scenerystack/scenery';
import MySimColors from './MySimColors.js';

// Not just color - shape also differs, so the distinction survives even if
// the two fills become indistinguishable to a given viewer.
const categoryAToken = new Circle( 10, { fill: MySimColors.categoryAColorProperty } );
const categoryBToken = new Rectangle( -8, -8, 16, 16, { fill: MySimColors.categoryBColorProperty } );

// A chart legend that repeats the distinction as text, not just a color swatch.
const legendEntry = ( swatch: Node, label: string ) => {
  const swatchAndLabel = new Node( { children: [ swatch, new Text( label, { x: 20 } ) ] } );
  return swatchAndLabel;
};
```

For line charts specifically (see [LinePlot](/api/bamboo/line-plot)), pairing color with `lineDash` (a dashed vs. solid stroke) is the equivalent move — two series that are only distinguished by hue in a legend become distinguishable by dash pattern too.

## A quick checklist

| Check | Why |
| --- | --- |
| No two categories differ *only* by red vs. green | The most common color-vision deficiencies collapse exactly that distinction |
| Every color-coded distinction has a second channel (shape, position, dash pattern, text) | Redundant coding means the information survives even for a viewer who can't perceive the color difference at all |
| Palette is defined once via `ProfileColorProperty`, not inline literals | Lets an accessibility review swap the whole palette without hunting through view code — see [Color Profiles](/styling/color-profiles) |
| Checked under at least one simulation of deuteranopia/protanopia | Confirms the intended separation actually holds, rather than relying on the choice of hues alone |

::: tip Use `Color.isDarkColor`/`isLightColor` for text-on-swatch contrast, not for category separation
[`Color`](/api/scenery/color)'s luminance helpers (`Color.isDarkColor`, `Color.getLuminance`) are the right tool for "is this background dark enough that its label text should be white" — they say nothing about whether two different hues are distinguishable to a colorblind viewer, which is a separate concern from contrast against a background.
:::

::: warning This is practical guidance, not a substitute for testing with real users
The palette above follows a widely-used qualitative strategy (blue/orange/purple hues that stay separated for the common red-green deficiencies), but no fixed palette is guaranteed safe for every form and severity of color-vision deficiency. Treat it as a strong default, and verify any color-coded UI that matters with an actual colorblindness simulator or user testing before treating "colorblind-safe" as fully confirmed.
:::
