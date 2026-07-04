---
title: High-Contrast / Projector-Mode Deep Dive
description: Palette-design considerations specific to projector mode - contrast ratios, saturation, and what breaks on a washed-out classroom projector.
category: styling
tags: [scenery, ProfileColorProperty, projector-mode, contrast, colors]
status: verified
related:
  - /styling/color-profiles
  - /guides/preferences-and-feature-flags
prerequisites:
  - /styling/color-profiles
---

# High-Contrast / Projector-Mode Deep Dive

[Color Profiles](/styling/color-profiles) covers the mechanism — `ProfileColorProperty` and the `colorProfileProperty` switch. This page is about the design problem that mechanism exists to solve: a classroom projector is not just "a monitor with worse colors," it specifically crushes contrast, washes out saturated darks, and is usually viewed in a partially-lit room. A `projector` profile that's simply "the default profile but lighter" tends to still fail in an actual classroom. `visualOptions.supportsProjectorMode` on `PreferencesModel` (see [Preferences and Feature Flags](/guides/preferences-and-feature-flags)) is what surfaces the toggle to users — this page is about designing the palette that toggle switches into.

## What actually breaks on a projector

- **Dark backgrounds lose shadow detail.** The default profile's near-black background and dark, muted fills often render as a single flat gray blob under projector light falloff — projector mode should default to a light or white background, not a slightly-lightened dark one.
- **Low-saturation colors collapse into each other.** Two default-profile fills that are clearly distinct on a monitor (a muted teal and a muted gray-blue) can become visually identical when contrast is compressed. Projector-mode fills should be *more* saturated and higher-contrast against the background than a naive "just invert lightness" swap would produce, not merely relocated to the light end of the same palette.
- **Thin strokes and light gridlines disappear.** A `rgba(255,255,255,0.4)` gridline that reads fine on a dark background becomes nearly invisible as `rgba(0,0,0,0.4)` on white under projector glare — err toward higher alpha or a heavier stroke width specifically for the projector value, not just a hue-inverted color at the same alpha.

## Designing the pair, not just the default

Treat `default` and `projector` as two palettes designed together for the same semantic roles, not one palette with the other auto-derived:

```ts
// MySimColors.ts
import { ProfileColorProperty } from 'scenerystack/scenery';
import mySim from './mySim.js';

const MySimColors = {

  screenBackgroundColorProperty: new ProfileColorProperty( mySim, 'screenBackground', {
    default: 'black',
    projector: 'white'
  } ),

  // Not a simple lightness-inversion of the default value - chosen independently so it
  // stays clearly distinct from bodyBFillProperty and legible against a white background.
  bodyAFillProperty: new ProfileColorProperty( mySim, 'bodyAFill', {
    default: 'rgb( 255, 200, 60 )',
    projector: 'rgb( 180, 90, 0 )'
  } ),

  bodyBFillProperty: new ProfileColorProperty( mySim, 'bodyBFill', {
    default: 'rgb( 100, 180, 255 )',
    projector: 'rgb( 0, 70, 160 )'
  } ),

  // Gridlines need more opacity in projector mode to stay visible against glare,
  // not just an inverted hue at the same alpha.
  gridLineColorProperty: new ProfileColorProperty( mySim, 'gridLine', {
    default: 'rgba( 255, 255, 255, 0.4 )',
    projector: 'rgba( 0, 0, 0, 0.6 )'
  } )
};

export default MySimColors;
```

## A practical review checklist

- View every screen in `projector` mode side by side with `default`, not just spot-check one panel — set `colorProfileProperty.value = 'projector'` during development (see [Color Profiles](/styling/color-profiles)) rather than only exercising it through the Preferences UI.
- Check every pair of colors that must stay *distinguishable from each other* (two body colors, a selected-vs-unselected state), not just each color's contrast against the background individually — two colors can each individually pass a contrast check against white and still be indistinguishable from each other.
- Re-check thin strokes, gridlines, and low-opacity fills specifically — they're the elements most likely to have been carried over from the default profile with only a hue flip and no alpha/weight adjustment.
- If possible, view the actual projector-mode screen on a real projector (or a monitor with brightness/contrast pushed to a washed-out extreme) rather than trusting an accurate desktop monitor's rendering — the whole point of the mode is to compensate for a display class the palette author usually isn't looking at directly.

::: warning Projector mode is not "invert the default profile"
Every `ProfileColorProperty` entry needs its `projector` value chosen for its own legibility goal — high contrast against a light background, distinguishability from sibling colors, and visibility of thin/low-alpha elements — rather than mechanically computed from the `default` value. A palette where every projector color is `default`'s color run through a lightness inversion is the most common way this feature ships broken: it passes a quick glance in a bright office and fails in an actual classroom.
:::
