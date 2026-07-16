---
title: CarouselButton
description: The flat-styled next/previous arrow button Carousel builds and manages internally.
category: api
library: sun
tags: [sun, CarouselButton, Carousel, button]
status: complete
related:
  - /api/sun/carousel
  - /api/sun/rectangular-push-button
  - /api/sun/rectangular-button
  - /api/sun/arrow-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# CarouselButton

`CarouselButton` (from `scenerystack/sun`) is the arrow button [`Carousel`](/api/sun/carousel) creates for its next/previous controls — a `RectangularPushButton` subclass whose content is an arrow `Path`, styled flat (semi-transparent gray, `ButtonNode.FlatAppearanceStrategy`) so it reads as part of the carousel's frame rather than as a standalone button. You'll rarely construct one directly; it's documented here because `Carousel`'s `buttonOptions` is typed as `CarouselButtonOptions`, and you may want to know what you're actually configuring when you pass options through.

```ts
import { Carousel, type CarouselItem } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Dimension2 } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

const items: CarouselItem[] = [
  { createNode: () => new Text( 'A' ) },
  { createNode: () => new Text( 'B' ) },
  { createNode: () => new Text( 'C' ) }
];

const carousel = new Carousel( items, {
  itemsPerPage: 2,
  // Forwarded straight through to the two CarouselButtons Carousel creates.
  buttonOptions: {
    baseColor: 'rgb( 220, 220, 220 )',
    arrowSize: new Dimension2( 16, 6 )
  },
  tandem: Tandem.REQUIRED
} );
```

::: tip In practice, configure it through `Carousel`'s `buttonOptions`
The snippet above imports `CarouselButton` only conceptually — you rarely instantiate it yourself. `Carousel` creates two internally (previous/next), passing your `buttonOptions` through to both while filling in `arrowDirection` itself based on `orientation`.
:::

<SceneryDemo demo="carousel-button" />

## Options

`CarouselButtonOptions` is `RectangularPushButtonOptions` (minus `content`, corner-radius-per-corner options, and pointer-area shift options, which `CarouselButton` computes itself) plus:

| Option | Default | Effect |
| --- | --- | --- |
| `arrowDirection` | `'up'` | `'up'` \| `'down'` \| `'left'` \| `'right'` — `Carousel` sets this for you based on `orientation` and which button (previous/next) it is |
| `arrowSize` | `Dimension2( 20, 7 )` | Size of the arrow when pointing up, before rotation |
| `arrowPathOptions` | `{ stroke: 'black', lineWidth: 3, lineCap: 'round' }` | Styling of the arrow shape itself |

`CarouselButton` also derives its corner radii automatically: whichever corners face "outward" (away from the carousel's item area) get `cornerRadius`, and the inward-facing corners are square — so the two buttons look like they belong to the carousel's rounded frame rather than being independently rounded rectangles. It similarly halves and shifts touch/mouse area dilation on the inward side, so the buttons' hit targets don't overlap the carousel's scrollable content.

::: warning Corner-radius and pointer-shift options are computed, not settable
`CarouselButtonOptions` omits `leftTopCornerRadius`/etc. and `touchAreaXShift`/etc. from `RectangularPushButtonOptions` for exactly this reason — `CarouselButton` needs to control them itself based on `arrowDirection` to keep the "belongs to the frame" look consistent.
:::
