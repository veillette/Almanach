---
title: ColorConstants and SunConstants
description: The small set of shared default colors and constant values reused across sun's UI components.
category: api
library: sun
tags: [sun, ColorConstants, SunConstants]
status: complete
related:
  - /api/sun/rectangular-radio-button
  - /api/sun/hslider
  - /api/scenery/color
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ColorConstants and SunConstants

`ColorConstants` and `SunConstants` (both from `scenerystack/sun`) are small plain-object modules of shared default values reused across `scenerystack/sun` components — mainly so a handful of default colors and magic numbers exist in exactly one place rather than being copy-pasted into every button/slider/spinner that needs them. Neither is a class; both are `readonly`-style constant objects you read values from directly.

```ts
import { ColorConstants, SunConstants } from 'scenerystack/sun';
import { RectangularPushButton } from 'scenerystack/sun';

// Matches the default look of PhET's boxed buttons/radio buttons
const button = new RectangularPushButton( {
  baseColor: ColorConstants.LIGHT_BLUE
} );

console.log( SunConstants.VALUE_NAMED_PLACEHOLDER ); // '{{value}}'
```

## ColorConstants

| Constant | Value | Used for |
| --- | --- | --- |
| `LIGHT_BLUE` | `new Color( 153, 206, 255 )` | The default `baseColor` for most `scenerystack/sun` buttons, including [`RectangularRadioButton`](/api/sun/rectangular-radio-button) |
| `LIGHT_GRAY` | `new Color( 220, 220, 220 )` | The conventional "disabled" fill color used in several components |

Both are `Color` instances (from `scenerystack/scenery`), so they support the usual `Color` methods (`brighterColor`, `darkerColor`, `withAlpha`, …) if you want a variant rather than the exact default.

## SunConstants

| Constant | Value | Used for |
| --- | --- | --- |
| `VALUE_NAMED_PLACEHOLDER` | `'{{value}}'` | The named placeholder convention for value-substitution string patterns (used with `StringUtils.fillIn`), e.g. in a `NumberDisplay`'s format string |
| `VALUE_NUMBERED_PLACEHOLDER` | `'{0}'` | The older numbered-placeholder convention (used with `StringUtils.format`); **deprecated** — prefer named placeholders in new code |
| `SLIDER_VERTICAL_ROTATION` | `-Math.PI / 2` | The rotation angle [`Slider`](/api/sun/slider) applies internally to lay out a vertical slider using the same horizontal-authored geometry |

::: tip These are defaults, not requirements
Nothing forces you to use `ColorConstants.LIGHT_BLUE` or `SunConstants.VALUE_NAMED_PLACEHOLDER` — components fall back to them only when you don't supply your own `baseColor`/format string. They're documented here mainly so custom components can match PhET's conventional look-and-feel intentionally, rather than by guessing at hardcoded hex values.
:::
