---
title: PageControl
description: An iOS-style row of dots indicating the current page, typically paired with Carousel.
category: api
library: sun
tags: [sun, PageControl, Carousel]
status: complete
related:
  - /api/sun/carousel
  - /api/sun/carousel-combo-box
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PageControl

`PageControl` (from `scenerystack/sun`) renders the classic iOS "row of dots" pagination indicator: one dot per page, with the current page's dot drawn distinctly. It's driven by two Properties rather than owning any paging state itself, which is exactly the shape [`Carousel`](/api/sun/carousel) exposes — `pageNumberProperty` and `numberOfPagesProperty` — so the two are typically constructed together, with `PageControl` reflecting (and, if `interactive`, controlling) which page of the carousel is showing.

```ts
import { Carousel, PageControl, type CarouselItem } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const items: CarouselItem[] = [
  { createNode: () => new Text( 'Apple' ) },
  { createNode: () => new Text( 'Banana' ) },
  { createNode: () => new Text( 'Cherry' ) },
  { createNode: () => new Text( 'Date' ) },
  { createNode: () => new Text( 'Elderberry' ) }
];

const fruitCarousel = new Carousel( items, {
  itemsPerPage: 2,
  tandem: Tandem.REQUIRED.createTandem( 'fruitCarousel' )
} );

const pageControl = new PageControl(
  fruitCarousel.pageNumberProperty,
  fruitCarousel.numberOfPagesProperty,
  {
    interactive: true, // clicking a dot jumps to that page
    tandem: Tandem.REQUIRED.createTandem( 'pageControl' )
  }
);

const carouselWithPaging = new VBox( {
  spacing: 6,
  children: [ fruitCarousel, pageControl ]
} );
```

`pageNumberProperty` must be a settable `TProperty<number>` (not just readable) precisely because `PageControl` writes to it when `interactive: true` and a dot is clicked — `Carousel.pageNumberProperty` satisfies this directly.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `interactive` | `false` | Whether clicking a dot navigates to that page |
| `orientation` | `'horizontal'` | `'horizontal'` (dots left-to-right) or `'vertical'` (top-to-bottom); match your carousel's `orientation` |
| `dotRadius` | `3` | Radius of each dot |
| `dotSpacing` | `10` | Space between adjacent dots |
| `lineWidth` | `1` | Stroke width, if `currentPageStroke`/`pageStroke` are set |
| `dotTouchAreaDilation` / `dotMouseAreaDilation` | `4` / `4` | Pointer-area dilation beyond each dot's radius, when `interactive` |
| `currentPageFill` / `currentPageStroke` | `'black'` / `null` | Appearance of the dot for the current page |
| `pageFill` / `pageStroke` | `'rgb( 200, 200, 200 )'` / `null` | Appearance of every other dot |

::: tip Dots are recreated whenever the page count changes
`PageControl` rebuilds its dots from scratch every time `numberOfPagesProperty` fires — including at construction — so it stays correct if a `Carousel`'s visible item count changes at runtime (e.g. via `Carousel.setItemVisible`), without any extra wiring on your part.
:::
