---
title: PhetColorScheme, SceneryPhetColors, and SceneryPhetConstants
description: The shared default colors and numeric constants reused across scenery-phet components, so common physics-quantity colors and button sizing stay consistent across sims.
category: api
library: scenery-phet
tags: [scenery-phet, PhetColorScheme, SceneryPhetColors, SceneryPhetConstants, colors, constants]
status: complete
related:
  - /api/sun/color-constants
  - /api/scenery-phet/reset-all-button
  - /api/scenery-phet/gauge-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetColorScheme, SceneryPhetColors, and SceneryPhetConstants

`PhetColorScheme`, `SceneryPhetColors`, and `SceneryPhetConstants` (all from `scenerystack/scenery-phet`) are three small plain-object modules of shared defaults, in the same spirit as `scenerystack/sun`'s [`ColorConstants`/`SunConstants`](/api/sun/color-constants): reuse a fixed value from one of these tables instead of re-picking an RGB triple or a magic number every time a physics quantity or a round button shows up in a new sim. None of the three is a class — all are read directly as properties on a plain object (or, for `SceneryPhetColors`, a plain object of `ProfileColorProperty` instances).

```ts
import { PhetColorScheme, SceneryPhetColors, SceneryPhetConstants } from 'scenerystack/scenery-phet';
import { GaugeNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
// Color a force vector consistently with every other PhET sim that shows applied force:
const arrowFill = PhetColorScheme.APPLIED_FORCE;

// Size a custom round button the same as scenery-phet's own round buttons:
const buttonRadius = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS;

// Read (or link to) the currently-active fill for a beaker drawing:
const beakerFill = SceneryPhetColors.solutionFillProperty.value;
```

## PhetColorScheme

A flat table of `Color` (from `scenerystack/scenery`) and one plain hex-string constant, mostly named after the physical quantity each color conventionally represents in PhET sims (kinetic/potential energy, forces, momentum, and so on) — the exact palette PhET's own physics sims (Forces and Motion, Energy Skate Park, etc.) draw from so a "kinetic energy" bar chart segment looks the same color from one sim to the next.

| Constant | Value | Notes |
| --- | --- | --- |
| `ACCELERATION` | `Color(255, 255, 50)` | |
| `APPLIED_FORCE` | `Color(236, 153, 55)` | |
| `BUTTON_YELLOW` | `Color(254, 225, 5)` | Same value as `PHET_LOGO_YELLOW` |
| `ELASTIC_POTENTIAL_ENERGY` | `Color(0, 204, 255)` | |
| `FRICTION_FORCE` | `Color(255, 85, 0)` | Same value as `RED_COLORBLIND` |
| `GRAVITATIONAL_FORCE` | `Color(50, 130, 215)` | |
| `GRAVITATIONAL_POTENTIAL_ENERGY` | `Color(55, 130, 215)` | |
| `HEAT_THERMAL_ENERGY` | `Color(255, 85, 0)` | Same value as `RED_COLORBLIND` |
| `IMAGINARY_PART` | `Color(153, 51, 102)` | |
| `KINETIC_ENERGY` | `Color(30, 200, 45)` | |
| `MOMENTUM` | `Color(50, 50, 255)` | |
| `NET_WORK` | `Color(0, 200, 0)` | "Dark green" |
| `NORMAL_FORCE` | `Color(255, 235, 0)` | |
| `PHET_LOGO_BLUE` | `Color(106, 206, 245)` | The blue in the PhET logo |
| `PHET_LOGO_YELLOW` | `Color(254, 225, 5)` | The yellow in the PhET logo |
| `POSITION` | `Color.BLUE` | Scenery's built-in blue |
| `REAL_PART` | `Color(255, 153, 0)` | |
| `RED_COLORBLIND` | `Color(255, 85, 0)` | Reads well in colorblindness tests; used in place of plain `'red'` throughout PhET sims |
| `GREEN_COLORBLIND` | `Color(0, 135, 0)` | Pairs correctly with `RED_COLORBLIND` in colorblindness tests |
| `RESET_ALL_BUTTON_BASE_COLOR` | `Color(247, 151, 34)` | The standard PhET orange — [`ResetAllButton`](/api/scenery-phet/reset-all-button)'s default `baseColor` |
| `TOTAL_ENERGY` | `Color(180, 180, 0)` | |
| `TOTAL_FORCE` | `Color(0, 200, 0)` | Same value as `NET_WORK` |
| `VELOCITY` | `Color(50, 255, 50)` | |
| `WALL_FORCE` | `Color(153, 51, 0)` | |
| `SCREEN_ICON_FRAME` | `'#dddddd'` | The one plain CSS-string constant in the table (not a `Color` instance) |

::: tip Prefer `RED_COLORBLIND`/`GREEN_COLORBLIND` over plain `'red'`/`'green'`
These two are called out by name in the source comments as deliberately colorblind-safe substitutes — reach for them instead of literal `'red'`/`'green'` whenever a sim needs a red/green pair that must stay distinguishable under common color-vision deficiencies.
:::

## SceneryPhetColors

Unlike `PhetColorScheme`, every value here is a `ProfileColorProperty` (from `scenerystack/scenery`) rather than a bare `Color` — meaning these support PhET's color-profile system (e.g. a "projector mode" palette swap) and should be linked to, not read once, if you want a component to update live when the active profile changes. All are used for the beaker drawings shared by state-of-matter/fractions-style sims.

| Property | Default |
| --- | --- |
| `emptyBeakerFillProperty` | `Color(249, 253, 255, 0.2)` |
| `solutionFillProperty` | `Color(165, 217, 242)` |
| `beakerShineFillProperty` | `Color(255, 255, 255, 0.4)` |
| `solutionShadowFillProperty` | `Color(142, 198, 221)` |
| `solutionShineFillProperty` | `Color(180, 229, 249)` |
| `beakerStroke` | `'black'` |
| `tickStroke` | `'black'` |

## SceneryPhetConstants

The smallest of the three — just two numbers, used to keep round buttons visually consistent in size across components that don't otherwise share a base class.

| Constant | Value | Used for |
| --- | --- | --- |
| `DEFAULT_BUTTON_RADIUS` | `20.8` | Default radius for most round buttons (e.g. [`ResetAllButton`](/api/scenery-phet/reset-all-button)) |
| `PLAY_CONTROL_BUTTON_RADIUS` | `28` | Default radius for `PlayControlButton` and its subtypes (play/pause, step) |

::: warning `PhetColorScheme` values are plain `Color`s; `SceneryPhetColors` values are `ProfileColorProperty`s
Passing `PhetColorScheme.APPLIED_FORCE` directly as a `fill` works exactly like passing any other `Color`. Passing `SceneryPhetColors.solutionFillProperty` the same way is also valid (scenery accepts a `TReadOnlyProperty<Color>` as a paint), but reading `.value` off of it up front (as in the minimal example) discards the live color-profile updates you'd otherwise get for free — prefer passing the Property itself as the `fill`/`stroke` option when you want profile changes to repaint automatically.
:::
