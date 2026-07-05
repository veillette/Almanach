---
title: RoundButton
description: The abstract round button shape and appearance layer that every circular sun button builds on.
category: api
library: sun
tags: [sun, RoundButton, ButtonNode, button]
status: complete
related:
  - /api/sun/rectangular-button
  - /api/sun/push-button-model
  - /api/sun/round-push-button
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RoundButton

`RoundButton` (from `scenerystack/sun`) is the circular counterpart to [`RectangularButton`](/api/sun/rectangular-button): the shared visual base class for `RoundPushButton`, `RoundToggleButton`/`BooleanRoundToggleButton`, `RoundStickyToggleButton`, and `RoundMomentaryButton`. Like `RectangularButton`, it extends `ButtonNode` (which owns content layout and appearance strategies) and adds the shape-specific parts: a circular `buttonBackground`, `radius`, and radius-based pointer-area dilation. Its constructor is `protected` — you build one of the concrete subclasses, not `RoundButton` itself, unless you're implementing an entirely new round interaction pattern (see [PushButtonModel](/api/sun/push-button-model) for when that's warranted).

## Sizing: `radius`, not `size`

The biggest practical difference from `RectangularButton` is how sizing works: there's no `size` option, just `radius`. If you supply `content` and no `radius`, the button sizes itself to fit the content plus margins (whichever of width/height is larger determines the radius); if you supply `radius` explicitly, `content` is scaled down to fit inside it.

```ts
import { RoundButton } from 'scenerystack/sun'; // for type reference only — construct a concrete subclass
import { RoundPushButton } from 'scenerystack/sun';
import { Path } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import iconShape from './iconShape.js';

// A concrete RoundButton-based class, sized explicitly rather than by content:
const iconButton = new RoundPushButton( {
  content: new Path( iconShape, { fill: 'black', maxWidth: 20 } ),
  radius: 24,
  baseColor: 'yellow',
  listener: () => model.reset(),
  tandem: Tandem.REQUIRED
} );
```

## Options

`RoundButtonOptions` combines with `ButtonNodeOptions` the same way `RectangularButtonOptions` does — this combination is what `RoundPushButtonOptions`, `RoundToggleButtonOptions`, etc. are built from:

| Option | Effect |
| --- | --- |
| `content` | The `Node` shown on the button; if omitted, `radius` must be supplied |
| `radius` | Fixed radius; `null` (with `content` set) sizes the button to the content |
| `xMargin` / `yMargin` | Minimum margin between `content` and the circular edge (default `5`/`5`) |
| `baseColor` / `buttonAppearanceStrategy` | Same appearance-layer options as `RectangularButton` — `RoundButton.ThreeDAppearanceStrategy` is the default |
| `stroke` / `lineWidth` | When `stroke` is `null` (default), derived from `baseColor` |
| `touchAreaDilation` / `mouseAreaDilation` | Radius dilation of the pointer areas beyond the visual circle |
| `touchAreaXShift` / `touchAreaYShift` / `mouseAreaXShift` / `mouseAreaYShift` | Offset the (dilated) pointer-area circle away from the button's center |

::: warning A round button can be sizable in at most one dimension
`RoundButton` asserts if both `widthSizable` and `heightSizable` are set at once — a circle's width and height are coupled through its single `radius`, so a layout container can drive at most one of them (the other is derived to match). This is the same constraint noted on [RoundPushButton](/api/sun/round-push-button#options).
:::
