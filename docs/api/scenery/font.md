---
title: Font
description: Scenery's immutable font-description object used by Text and RichText, and the lower-level class PhetFont builds on.
category: api
library: scenery
tags: [scenery, Font, typography, text]
status: complete
related:
  - /api/scenery/text
  - /styling/typography-and-fonts
prerequisites:
  - /api/scenery/text
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Font

`Font` (from `scenerystack/scenery`) is an immutable object describing a CSS-style font — style, variant, weight, stretch, size, line-height, and family — used by [`Text`](/api/scenery/text) and `RichText`'s `font` option. Simulation code almost always reaches for `PhetFont` (from `scenerystack/scenery-phet`) instead of constructing a plain `Font` directly; see [Typography and Fonts](/styling/typography-and-fonts) for that convention. This page documents the lower-level `Font` class itself.

```ts
import { Font, Text } from 'scenerystack/scenery';

const font = new Font( {
  family: '"Times New Roman", serif',
  style: 'italic',
  size: 16,
  weight: 'bold'
} );

const label = new Text( 'Hello', { font } );

font.font;   // "italic bold 16px 'Times New Roman', serif" — the combined CSS shorthand
font.family; // "'Times New Roman', serif"
```

`Font` is immutable: every property is set once at construction and there are no setters, only getters — to change a Text's font, construct a new `Font` (or use `Text`'s `fontSize`/`fontWeight`/etc. shorthand setters, which do this for you).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `style` | `'normal'` | `'normal' \| 'italic' \| 'oblique'` |
| `variant` | `'normal'` | `'normal' \| 'small-caps'` |
| `weight` | `'normal'` | A CSS font-weight keyword (`'normal'`, `'bold'`, `'bolder'`, `'lighter'`) or a `'100'`–`'900'` string/number |
| `stretch` | `'normal'` | A CSS font-stretch keyword, e.g. `'condensed'`, `'expanded'` |
| `size` | `'10px'` | A number (treated as a pixel count) or any valid CSS font-size string |
| `lineHeight` | `'normal'` | A CSS line-height value |
| `family` | `'sans-serif'` | A comma-separated CSS font-family list |

## Reading values

| Member | Returns |
| --- | --- |
| `font` | The combined CSS font shorthand string, e.g. `"bold 10px sans-serif"` |
| `style`, `variant`, `weight`, `stretch`, `size`, `lineHeight`, `family` | The individual component, as given (or defaulted) at construction |

## Static helpers

| Static member | Effect |
| --- | --- |
| `Font.DEFAULT` | The shared default `Font` instance (`10px sans-serif`) |
| `Font.isFontStyle( s )` / `isFontVariant( s )` / `isFontWeight( s )` / `isFontStretch( s )` | Type-guard validators for each component's valid string values |
| `Font.fromCSS( cssString )` | Parses a CSS font shorthand string (e.g. `"italic bold 16px serif"`) into a `Font` instance |

::: tip Prefer `PhetFont`, not raw `Font`
`PhetFont` (from `scenerystack/scenery-phet`) wraps `Font` with the project's standard typeface and a guaranteed `sans-serif` fallback, so simulation code stays visually consistent. Reach for plain `Font` only when working outside a PhET-style project, or when building `PhetFont` itself. See [Typography and Fonts](/styling/typography-and-fonts) for the full convention.
:::
