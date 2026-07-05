---
title: RectangularButton
description: The abstract rectangular button shape and appearance layer that every rectangular sun button builds on.
category: api
library: sun
tags: [sun, RectangularButton, ButtonNode, button]
status: complete
related:
  - /api/sun/round-button
  - /api/sun/push-button-model
  - /api/sun/rectangular-push-button
  - /api/sun/toggle-button
  - /api/sun/radio-button-group
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RectangularButton

`RectangularButton` (from `scenerystack/sun`) is the visual base class every rectangular button in `sun` is built from — `RectangularPushButton`, `RectangularToggleButton`/`BooleanRectangularToggleButton`, `RectangularStickyToggleButton`, `RectangularMomentaryButton`, `RectangularRadioButton`, `ArrowButton`, and `CarouselButton` all extend it. It in turn extends `ButtonNode`, the shared base of *both* rectangular and round buttons. You won't construct either class directly in normal sim code — they're both `protected` constructors — but understanding the split matters when you need a fully custom button that none of the concrete subclasses quite covers, and when you're deciphering an options type like `RectangularPushButtonOptions` that's actually assembled from several layers.

## The layering

| Class | Owns | Notes |
| --- | --- | --- |
| `ButtonModel` | Non-visual interaction state (`overProperty`, `downProperty`, `enabledProperty`, `looksPressedProperty`) | See [PushButtonModel](/api/sun/push-button-model) for the concrete subclasses |
| `ButtonNode` | Content layout, `baseColor`, `buttonAppearanceStrategy`, `contentAppearanceStrategy`, PDOM/Voicing wiring | Shape-agnostic; takes a pre-built `buttonBackground` Path |
| `RectangularButton` | The rectangular `buttonBackground` shape itself, corner radii, `size`/`minWidth`/`minHeight`, pointer-area dilation | This page |
| `RectangularPushButton`, etc. | Wires a specific `ButtonModel` subclass to `RectangularButton` | The classes you actually construct |

Every concrete rectangular button constructs its own `ButtonModel` subclass and a `TReadOnlyProperty<ButtonInteractionState>`, then passes both to `super()` — that's the seam `RectangularButton`'s `protected constructor` exposes to its subclasses:

```ts
// Simplified sketch of what RectangularPushButton does internally —
// you would only write code like this if none of the built-in subclasses fit.
class MyCustomRectangularButton extends RectangularButton {
  public constructor( buttonModel: ButtonModel, interactionStateProperty: TReadOnlyProperty<ButtonInteractionState> ) {
    super( buttonModel, interactionStateProperty, {
      baseColor: 'orange',
      cornerRadius: 8
    } );
  }
}
```

In practice, reach for [`PushButtonModel`](/api/sun/push-button-model) (or `ToggleButtonModel`, `StickyToggleButtonModel`, `MomentaryButtonModel`) plus a matching `*InteractionStateProperty` only when building a genuinely new interaction pattern — for anything that fires once, toggles, latches, or is momentary, the ready-made subclasses in [RectangularPushButton](/api/sun/rectangular-push-button), [Toggle Buttons](/api/sun/toggle-button), [Sticky Toggle Buttons](/api/sun/sticky-toggle-button), and [Momentary Buttons](/api/sun/momentary-button) already cover it.

## Options

`RectangularButtonOptions` (shape) combines with `ButtonNodeOptions` (appearance/content), and this combination is what every concrete `RectangularButtonOptions`-based type (`RectangularPushButtonOptions`, `RectangularToggleButtonOptions`, …) is built from:

| Option | Layer | Effect |
| --- | --- | --- |
| `content` | `ButtonNode` | The `Node` shown on the button |
| `xMargin` / `yMargin` | `ButtonNode` | Margin between `content` and the button's edge (defaults `8`/`5`, deliberately asymmetric) |
| `baseColor` | `ButtonNode` | Background color other colors are derived from |
| `buttonAppearanceStrategy` | `ButtonNode` | `RectangularButton.ThreeDAppearanceStrategy` (default, gradient/shaded look) or `ButtonNode.FlatAppearanceStrategy` (flat, color-swap-only look used by e.g. `CarouselButton`) |
| `size` | `RectangularButton` | Fixed `Dimension2`; `content` is scaled to fit instead of sizing the button to `content` |
| `cornerRadius` | `RectangularButton` | Applied to all four corners (default `4`) |
| `leftTopCornerRadius` / `rightTopCornerRadius` / `leftBottomCornerRadius` / `rightBottomCornerRadius` | `RectangularButton` | Per-corner overrides of `cornerRadius` — this is how `CarouselButton` gets square inner corners and rounded outer ones |
| `stroke` / `lineWidth` | `RectangularButton` | When `stroke` is `null` (default), one is derived from `baseColor` |
| `touchAreaXDilation` / `touchAreaYDilation` / `mouseAreaXDilation` / `mouseAreaYDilation` | `RectangularButton` | Expand the pointer-area rectangle beyond the visual bounds |

::: warning `buttonAppearanceStrategy` decides the whole look
Swapping `buttonAppearanceStrategy` from the default `ThreeDAppearanceStrategy` to `ButtonNode.FlatAppearanceStrategy` changes far more than "flat vs. gradient" — it also changes which sub-options (`overStroke`, `selectedLineWidth`, `deselectedFill`, …) inside `buttonAppearanceStrategyOptions` actually apply, since each strategy defines its own set. `CarouselButton` uses the flat strategy so its arrow buttons read as part of the carousel's chrome rather than as a shaded, standalone button.
:::
