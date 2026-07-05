---
title: CarouselComboBox
description: A ComboBox-like dropdown whose popup is a scrollable Carousel, for item lists too long for a plain list box.
category: api
library: sun
tags: [sun, CarouselComboBox, ComboBox, Carousel, PageControl]
status: complete
related:
  - /api/sun/combo-box
  - /api/sun/carousel
  - /api/sun/page-control
  - /api/sun/carousel-button
prerequisites:
  - /api/axon/property
  - /api/sun/combo-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# CarouselComboBox

`CarouselComboBox<T>` (from `scenerystack/sun`) behaves like [`ComboBox`](/api/sun/combo-box) from the outside — a button showing the current selection, bound to a `Property<T>` over a fixed set of `ComboBoxItem<T>`s — but its popup is a [`Carousel`](/api/sun/carousel) with a [`PageControl`](/api/sun/page-control) instead of a scrolling list box. `ComboBox`'s own list box has no pagination, so once an item list gets long enough that it would overflow the screen, `CarouselComboBox` lets users page through it instead.

```ts
import { CarouselComboBox, type ComboBoxItem } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Element = 'hydrogen' | 'helium' | 'lithium' | 'beryllium' | 'boron' | 'carbon';
const elementProperty = new Property<Element>( 'hydrogen' );

const items: ComboBoxItem<Element>[] = [
  { value: 'hydrogen', createNode: () => new Text( 'Hydrogen' ) },
  { value: 'helium', createNode: () => new Text( 'Helium' ) },
  { value: 'lithium', createNode: () => new Text( 'Lithium' ) },
  { value: 'beryllium', createNode: () => new Text( 'Beryllium' ) },
  { value: 'boron', createNode: () => new Text( 'Boron' ) },
  { value: 'carbon', createNode: () => new Text( 'Carbon' ) }
];

const elementComboBox = new CarouselComboBox( elementProperty, items, {
  carouselOptions: { itemsPerPage: 4 },
  tandem: Tandem.REQUIRED
} );
```

Unlike `ComboBox`, `CarouselComboBox` needs no separate `listParent` argument — the carousel pops open as a sibling `Node` inside `CarouselComboBox` itself, toggled visible/invisible by the button, rather than being added to an ancestor near the top of the scene graph.

::: warning "Think twice before using this in a sim"
That's a direct warning from the SceneryStack source: `CarouselComboBox` was built to solve internal demo apps with dozens of options, and PhET's own design guidance is to avoid long option lists in real sims. If you're reaching for `CarouselComboBox`, first consider whether a [radio button group](/api/sun/radio-button-group), a shorter list, or restructuring the UI would give users a better experience than paging through a dropdown.
:::

## Options

| Option | Effect |
| --- | --- |
| `itemNodeOptions` | Passed to each carousel item's wrapper: `align`, `xMargin`/`yMargin`, `overColor` (pointer-over background), `selectedColor` (selected-item background) |
| `carouselOptions` | Forwarded to the internal `Carousel`; `orientation` must stay `'vertical'` (the only orientation supported) and defaults `itemsPerPage` to `15`, capped at the number of items |
| `pageControlOptions` | Forwarded to the internal `PageControl` (only created if there's more than one page); defaults `interactive: true` |
| `buttonOptions` | Forwarded to the internal `ComboBoxButton`; `arrowDirection` must stay `'down'` |
| `openedSoundPlayer` / `closedSoundPlayer` | Sounds played when the carousel is shown/hidden |

::: tip Same `ComboBoxItem<T>` shape as `ComboBox`
`CarouselComboBox` reuses `ComboBoxItem<T>` (`{ value, createNode, ... }`) directly — if you already have items defined for a `ComboBox`, they work unchanged here; only the container around them differs.
:::
