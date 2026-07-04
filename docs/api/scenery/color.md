---
title: Color
description: Scenery's RGBA color object - construction from RGB, hex, or CSS keywords, and mutation/derivation methods used as a Node's fill or stroke.
category: api
library: scenery
tags: [scenery, Color, paint, fill, stroke]
status: verified
related:
  - /api/scenery/node
  - /styling/color-profiles
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Color

`Color` (from `scenerystack/scenery`) represents an RGBA color in the sRGB space, and is one of the value types scenery's `fill`/`stroke` options accept directly (alongside a plain CSS string, `null`, or a `Property<Color | string | null>`). Unlike `Font`, `Color` is **mutable** — its `r`/`g`/`b`/`a` channels can be changed after construction, which lets you reuse one `Color` instance and get every Node using it to repaint automatically.

```ts
import { Color, Circle } from 'scenerystack/scenery';

const bodyColor = new Color( 255, 100, 0 );       // r, g, b (0-255), alpha defaults to 1
const fromHex = new Color( 0xff6400 );             // hex number
const fromKeyword = new Color( 'orange' );         // any CSS color keyword or string
const transparent = new Color( null );             // fully transparent

const body = new Circle( 20, { fill: bodyColor } );

bodyColor.red = 200;      // mutating the instance repaints every Node using it as fill/stroke
```

## Construction forms

The constructor is overloaded — pass one of:

| Form | Example |
| --- | --- |
| `r, g, b, a?` | `new Color( 255, 100, 0 )`, `new Color( 255, 100, 0, 0.5 )` |
| A single hex `number`, `a?` | `new Color( 0xff6400 )` |
| A CSS color `string` | `new Color( 'rgb(255,100,0)' )`, `new Color( 'orange' )`, `new Color( '#ff6400' )` |
| Another `Color` | `new Color( existingColor )` (copies channel values) |
| `null` | `new Color( null )` — fully transparent black |

## Mutating and deriving

| Method | Effect |
| --- | --- |
| `setRGBA( r, g, b, a )` | Sets all four channels at once, returns `this` for chaining |
| `red` / `green` / `blue` / `alpha` (get/set) | Individual channel accessors, e.g. `color.alpha = 0.5` |
| `setAlpha( a )` | Sets just the alpha channel, returns `this` |
| `withAlpha( a )` | Returns a **new** `Color` with a different alpha, leaving the original untouched |
| `blend( otherColor, ratio )` | Returns a new `Color` linearly interpolated between this color and `otherColor` |
| `brighterColor( factor? )` / `darkerColor( factor? )` | Returns a new, lighter/darker `Color`, useful for hover/pressed button states |
| `toCSS()` | Returns the CSS `rgba(...)` string form, e.g. for use outside scenery (DOM styling) |
| `equals( otherColor )` | Channel-wise equality check |

## Static helpers

| Static member | Effect |
| --- | --- |
| `Color.toColor( colorSpec )` | Normalizes a `TColor` (string, `Color`, `null`, or `Property` of one) into a `Color` instance |
| `Color.interpolateRGBA( c1, c2, distance )` | Interpolates between two colors at a given `distance` (0-1) |
| `Color.isDarkColor( color, threshold? )` / `isLightColor( color, threshold? )` | Luminance-based checks, useful for choosing readable text color on top of a background |
| `Color.getLuminance( color )` | Returns the color's perceptual luminance |
| `Color.grayColor( rgb, a? )` | Shorthand for an equal-channel gray |
| `Color.BLACK`, `Color.WHITE`, `Color.RED`, `Color.BLUE`, … | Named static `Color` constants for CSS basic color keywords (also available lowercase, e.g. `Color.black`) |

::: tip A shared, mutable `Color` beats an inline string when a color needs to change at runtime
Passing `'orange'` directly as `fill` works, but scenery can't push runtime updates to it — you'd have to reassign `node.fill` yourself. A shared `Color` instance (or better, a `Property<Color>` via `ProfileColorProperty`, see [Color Profiles](/styling/color-profiles)) lets every Node using it repaint automatically when the color changes, which is how PhET's light/dark ("projector") theme switching works.
:::
