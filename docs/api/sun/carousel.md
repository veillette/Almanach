---
title: Carousel
description: A paged, scrollable strip of items with next/previous buttons, animated between pages.
category: api
library: sun
tags: [sun, Carousel, layout]
status: complete
related:
  - /api/sun/panel
  - /api/sun/combo-box
prerequisites:
  - /patterns/dispose-and-memory-management
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Carousel

`Carousel` (from `scenerystack/sun`) divides a set of `CarouselItem`s into pages — however many fit per page, given `itemsPerPage` — and lets the user page through them with animated next/previous buttons. Use it when you have more choices than comfortably fit in one row/column but still want them all visually browsable, rather than hidden behind a [`ComboBox`](/api/sun/combo-box)'s dropdown.

```ts
import { Carousel, type CarouselItem } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const items: CarouselItem[] = [
  { createNode: () => new Text( 'Apple' ) },
  { createNode: () => new Text( 'Banana' ) },
  { createNode: () => new Text( 'Cherry' ) },
  { createNode: () => new Text( 'Date' ) },
  { createNode: () => new Text( 'Elderberry' ) }
];

const fruitCarousel = new Carousel( items, {
  itemsPerPage: 3,
  orientation: 'horizontal',
  tandem: Tandem.REQUIRED
} );
```

Each `CarouselItem` supplies a `createNode` factory (like `ComboBoxItem`), not a pre-built `Node` — `Carousel` wraps every created item Node in an `AlignBox` so all items share a uniform "footprint," regardless of their individual sizes.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `orientation` | `'horizontal'` | `'horizontal'` (paged left-right) or `'vertical'` (paged top-bottom) |
| `itemsPerPage` | `4` | How many items are visible per page |
| `defaultPageNumber` | `0` | Page shown initially |
| `spacing` / `margin` | `12` / `6` | Space between items (and between items and buttons) / space between items and the carousel's edge |
| `fill` / `stroke` / `lineWidth` / `cornerRadius` | `'white'` / `'black'` / `1` / `4` | Carousel background appearance |
| `buttonOptions` | — | Options forwarded to the next/previous `CarouselButton`s |
| `separatorsVisible` | `false` | Draw a separator line between adjacent items |
| `animationEnabled` | `true` | Whether page changes scroll smoothly; `false` jumps instantly |
| `animationOptions` | `{ duration: 0.4, easing: Easing.CUBIC_IN_OUT }` | Tuning for the scroll animation |

## Methods

| Method | Effect |
| --- | --- |
| `reset( animationEnabled? )` | Returns to `defaultPageNumber`; pass `true` to animate the reset (default `false`, i.e. instant) |
| `scrollToItem( item: CarouselItem )` | Pages to whichever page contains `item`, if it's currently visible |
| `setItemVisible( item, visible )` | Shows/hides one item; the layout reflows so hidden items don't leave a gap |
| `getNodeForItem( item: CarouselItem )` | Returns the `Node` that was created for a given item |

Public read-only state: `pageNumberProperty` (current page) and `numberOfPagesProperty` (derived from visible item count and `itemsPerPage`).

::: warning Disposing a Carousel disposes its item Nodes
`Carousel.dispose()` also disposes every `Node` that `createNode` produced for its items — don't hold onto references to those Nodes expecting them to survive the carousel's disposal, and don't pass in Nodes you need to reuse elsewhere afterward.
:::
