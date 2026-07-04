---
title: Iconography Conventions
description: Building consistent icons for buttons and controls.
category: styling
tags: [icons, styling, sun]
status: complete
related:
  - /api/sun/rectangular-push-button
  - /api/scenery-phet/arrow-node
  - /styling/stroke-and-line-styling
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Iconography Conventions

Buttons, toggle buttons, and menu items in `sun` all take an arbitrary `Node` as their `content` — an icon is just a `Node` sized and styled to read clearly at button scale. This page covers the conventions for building that Node consistently, not the buttons themselves (see [`RectangularPushButton`](/api/sun/rectangular-push-button)).

## Reach for a stock icon before building your own

`scenery-phet` ships a set of ready-made icon `Node`s (all thin `Path` wrappers) for common actions — reuse these instead of redrawing the same shape:

```ts
import { PlusNode, MinusNode, BackspaceIcon, ReturnIcon, GridIcon } from 'scenerystack/scenery-phet';
import { RectangularPushButton } from 'scenerystack/sun';

const incrementButton = new RectangularPushButton( {
  content: new PlusNode(),
  listener: () => model.increment()
} );

const decrementButton = new RectangularPushButton( {
  content: new MinusNode(),
  listener: () => model.decrement()
} );
```

For a vector/callout arrow, use [`ArrowNode`](/api/scenery-phet/arrow-node) rather than a hand-built `Shape`.

## Sizing icons relative to their button, not in isolation

An icon's `size` (most stock icons take a `size` option, `PlusNode`/`MinusNode` take a `Dimension2`, `GridIcon` takes a number) should be chosen relative to the button it sits inside, not as an absolute constant reused everywhere — a 16px icon looks tiny in a large button and cramped in a small one. Set icon size as a fraction of the button's content area:

```ts
import { GridIcon } from 'scenerystack/scenery-phet';

const gridToggleIcon = new GridIcon( {
  size: 24,          // sized for this specific button's content area
  numberOfRows: 4
} );
```

## Custom icons: build from Shape, keep them monochrome

When no stock icon fits, build a small `Path` from a `kite` `Shape` rather than an `Image`/PNG — vector icons stay crisp at any zoom and can be recolored to match the color profile:

```ts
import { Shape } from 'scenerystack/kite';
import { Path } from 'scenerystack/scenery';

const triangleIconShape = new Shape()
  .moveTo( 0, 0 )
  .lineTo( 14, 7 )
  .lineTo( 0, 14 )
  .close();

const playTriangleIcon = new Path( triangleIconShape, {
  fill: 'black'
} );
```

Keep custom icons single-color (`fill` only, no gradients or strokes) unless the whole icon set uses the same embellishment — a mix of flat and outlined icons across a toolbar reads as inconsistent.

## Route icon colors through the project's color profile

Just as with [panels](/styling/panels-and-backgrounds), an icon's `fill`/`stroke` should come from the shared colors file rather than a literal, so disabled/enabled and projector-mode variants stay consistent:

```ts
import MySimColors from './MySimColors.js';

const playTriangleIcon = new Path( triangleIconShape, {
  fill: MySimColors.iconFillProperty
} );
```

## Icons inside toggle buttons: one Node per state

A toggle button (play/pause, sound on/off) needs a distinct icon per state — build both up front and let `BooleanToggleNode`/the toggle button's `trueNode`/`falseNode`-style options swap visibility, rather than mutating one icon's `Shape` on every toggle:

```ts
import { PlayIconShape, PauseIconShape } from 'scenerystack/scenery-phet';
import { Path } from 'scenerystack/scenery';

const playIcon = new Path( new PlayIconShape( 16, 18 ), { fill: 'black' } );
const pauseIcon = new Path( new PauseIconShape( 16, 18 ), { fill: 'black' } );
```

::: tip Match icon stroke weight to the project's line-styling conventions
If custom icons use strokes rather than solid fills, pick the same `lineWidth`/`lineJoin` as the rest of the project's line art — see [Stroke and Line Styling](/styling/stroke-and-line-styling). A toolbar mixing 1px and 3px icon outlines reads as visually noisy even when every icon is individually fine.
:::
