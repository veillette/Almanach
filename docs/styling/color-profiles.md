---
title: Color Profiles
description: Centralizing colors with ProfileColorProperty so an application can switch between default and projector color schemes at runtime.
category: styling
tags: [scenery, ProfileColorProperty, colorProfileProperty, projector-mode, colors]
status: complete
related:
  - /patterns/model-view-separation
---

# Color Profiles

SceneryStack applications support multiple **color profiles** — named color schemes that can be switched at runtime. The canonical example is *projector mode*: a light-background scheme that stays legible on a washed-out classroom projector, versus the default dark-background scheme designed for screens.

The mechanism is `ProfileColorProperty` (from `scenerystack/scenery`): a `Property<Color>` whose value switches automatically when the global `colorProfileProperty` changes.

## The pattern: one Colors file per project

All colors live in a single namespace-style file, never inline in view code:

```ts
// MySimColors.ts
import { ProfileColorProperty } from 'scenerystack/scenery';
import mySim from './mySim.js';

const MySimColors = {

  screenBackgroundColorProperty: new ProfileColorProperty( mySim, 'screenBackground', {
    default: 'black',
    projector: 'white'
  } ),

  bodyFillProperty: new ProfileColorProperty( mySim, 'bodyFill', {
    default: 'rgb( 255, 200, 60 )',
    projector: 'rgb( 200, 130, 0 )'
  } ),

  gridLineColorProperty: new ProfileColorProperty( mySim, 'gridLine', {
    default: 'rgba( 255, 255, 255, 0.4 )',
    projector: 'rgba( 0, 0, 0, 0.4 )'
  } )
};

export default MySimColors;
```

Every entry must define `default`; other profiles (like `projector`) fall back to `default` when they don't override.

## Using the colors

Scenery fills and strokes accept a `Property<Color>` directly, so views stay declarative and update automatically on profile switches:

```ts
import { Circle } from 'scenerystack/scenery';
import MySimColors from './MySimColors.js';

const bodyNode = new Circle( 25, {
  fill: MySimColors.bodyFillProperty,          // live — no .value, no link needed
  stroke: MySimColors.gridLineColorProperty
} );
```

Screens take the background the same way:

```ts
new Screen( createModel, createView, {
  backgroundColorProperty: MySimColors.screenBackgroundColorProperty
} );
```

## Switching profiles

The active profile is the global `colorProfileProperty` (a `Property<string>` in `scenerystack/scenery`). In PhET simulations it is toggled from Preferences or the `colorProfile` query parameter; you can also set it programmatically:

```ts
import { colorProfileProperty } from 'scenerystack/scenery';

colorProfileProperty.value = 'projector';
```

::: tip Why not plain constants?
A `static readonly COLOR = 'black'` can never change at runtime and scatters color decisions across files. `ProfileColorProperty` gives you a single audit point for every color in the project, live profile switching for free, and (in PhET-iO contexts) external color customization — for the cost of one extra file.
:::
