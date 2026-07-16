---
title: ShadowText
description: A Text node rendered twice - an offset dark copy behind a foreground copy - to fake a drop shadow.
category: api
library: scenery-phet
tags: [scenery-phet, ShadowText, text, shadow]
status: complete
related:
  - /api/scenery-phet/phet-font
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ShadowText

`ShadowText` (from `scenerystack/scenery-phet`) draws a string as two overlapping `Text` nodes: a shadow copy offset by a few pixels and drawn first, and a foreground copy drawn on top. It's a cheap way to make a label stand out against a busy or variable-color background without a real CSS/canvas drop-shadow filter.

```ts
import { ShadowText } from 'scenerystack/scenery-phet';
import { PhetFont } from 'scenerystack/scenery-phet';
```

<SceneryDemo demo="shadow-text" />

## A minimal example

```ts
const scoreText = new ShadowText( 'Score: 100', {
  font: new PhetFont( 32 ),
  fill: 'yellow',
  shadowFill: 'black',
  shadowXOffset: 2,
  shadowYOffset: 2
} );
```

## Constructor

```ts
new ShadowText( text: string, providedOptions?: ShadowTextOptions )
```

`text` is passed once at construction — `ShadowText` has no settable `stringProperty` of its own; to change the text later, construct a new instance or drop down to its two internal `Text` children directly (not part of the public API).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `font` | `new PhetFont(24)` | Font shared by both the foreground and shadow text |
| `fill` / `stroke` | `'lightGray'` / `null` | Fill and stroke of the foreground text |
| `shadowFill` | `'black'` | Fill of the background (shadow) text |
| `shadowXOffset` / `shadowYOffset` | `3` / `1` | Offset of the shadow copy relative to the foreground copy |

::: tip Pick a `fill`/`shadowFill` pair with real contrast
Because both copies use the same `font`, the "shadow" effect only reads clearly when `fill` and `shadowFill` contrast strongly (e.g. a light `fill` over a `'black'` `shadowFill`, as in the default). Two similar colors just look like slightly blurry text rather than a shadow.
:::
