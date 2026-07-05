---
title: Filter and the Node.filters visual effects
description: The Filter base class and its named subtypes (Brightness, Contrast, Grayscale, Invert, Sepia, HueRotate, Saturate) applied via Node.filters.
category: api
library: scenery
tags: [scenery, Filter, Brightness, Contrast, Grayscale, Invert, Sepia, HueRotate, Saturate, ColorMatrixFilter, Node]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/color-property-and-profile-color-property
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Filter and the Node.filters visual effects

`Filter` (from `scenerystack/scenery`) is the abstract base class behind [`Node`](/api/scenery/node)'s `filters` option — an array of post-processing effects applied to that Node's rendered subtree, the scenery equivalent of the CSS `filter` property. You rarely construct a `Filter` directly; instead you construct one of its named subtypes (`Brightness`, `Contrast`, `Grayscale`, `Invert`, `Sepia`, `HueRotate`, `Saturate`, or a custom `ColorMatrixFilter`) and assign an array of them to `filters`.

```ts
import { Node, Circle, Grayscale, Brightness, Contrast } from 'scenerystack/scenery';

const icon = new Node( {
  children: [ new Circle( 30, { fill: 'crimson' } ) ]
} );

// Applied in array order: grayscale first, then brighten the result.
icon.filters = [ new Grayscale( 1 ), new Brightness( 1.2 ) ];

// A disabled-looking control, built from two filters composed together:
const disabledLookFilters = [ new Contrast( 0.6 ), new Brightness( 1.1 ) ];
```

## The shared pattern

Every named filter is a small class that computes a fixed CSS filter string (e.g. `grayscale(1)`) and, where the effect can be expressed as a 4x5 color matrix (all of them except `Invert`), extends `ColorMatrixFilter` so the same math also works under SVG and Canvas rendering — not just DOM/CSS. `Node.filters` accepts an array so multiple effects can stack; they apply in array order.

All of these filters live under `scenerystack/scenery`. Most take a single `amount` constructor argument that behaves like the equivalent CSS filter function:

| Filter | Constructor | `amount` meaning |
| --- | --- | --- |
| `Brightness` | `new Brightness( amount )` | `0` = black, `1` = normal, greater = brighter. Non-negative, required |
| `Contrast` | `new Contrast( amount )` | `0` = flat gray, `1` = normal, greater = higher contrast. Non-negative, required |
| `Grayscale` | `new Grayscale( amount = 1 )` | `0` = unchanged, `1` = fully gray-scale. Must be in `[0, 1]` |
| `Invert` | `new Invert( amount = 1 )` | `0` = unchanged, `1` = fully inverted. Must be in `[0, 1]` |
| `Sepia` | `new Sepia( amount = 1 )` | `0` = unchanged, `1` = fully sepia-toned. Must be in `[0, 1]` |
| `Saturate` | `new Saturate( amount )` | `0` = fully desaturated (grayscale), `1` = normal, greater = over-saturated. Non-negative, required |
| `HueRotate` | `new HueRotate( amount )` | Hue rotation **in radians** (converted to degrees internally for the CSS string). Non-negative, required |

`Brightness` and `Grayscale` each expose a convenience static: `Brightness.BLACKEN` (`new Brightness( 0 )`) and `Grayscale.FULL` (`new Grayscale( 1 )`); `Contrast.GRAY` (`new Contrast( 0 )`) similarly turns content flat gray.

## `ColorMatrixFilter`

```ts
new ColorMatrixFilter(
  m00, m01, m02, m03, m04,
  m10, m11, m12, m13, m14,
  m20, m21, m22, m23, m24,
  m30, m31, m32, m33, m34
)
```

Every named filter above (except `Invert`) is implemented purely by calling `super(...)` with 20 fixed matrix values — `ColorMatrixFilter` multiplies this 4x5 matrix against each pixel's `[r, g, b, a, 1]` column to produce a new `[r, g, b, a]`. Writing a custom `ColorMatrixFilter` is possible but PhET's own guidance is to prefer the named subtypes wherever they cover the need: a custom matrix filter is SVG/Canvas-compatible but is **not** compatible with WebGL or DOM content, and forces everything under it into a single SVG or Canvas block, which can reduce rendering performance.

## `Filter` (the abstract base)

You won't subclass `Filter` directly in ordinary sim code, but its interface is why every filter can be mixed freely: each subclass implements `getCSSFilterString()` (for DOM/Canvas), `applySVGFilter( svgFilter, inName, resultName? )` (for SVG), and `applyCanvasFilter( wrapper )` (the ImageData fallback path), plus compatibility checks (`isDOMCompatible()`, `isSVGCompatible()`, `isCanvasCompatible()`, `isWebGLCompatible()`) that scenery uses to decide which rendering strategy can honor a given `filters` array.

::: tip Filters apply to the whole subtree, and can be animated like any other option
Because `filters` is a plain `Node` option, it can be set/replaced at any time — e.g. swap in `[ new Grayscale( fraction ) ]` on every frame of a fade-to-grayscale transition by recomputing the array as `fraction` changes. There's no `Filter` `Property` API for interpolating an amount smoothly; you construct a fresh filter instance with the new amount.
:::

::: warning Mixed compatibility can force a slower rendering path
Not every filter works under every renderer. If a Node's subtree can't be placed in a single SVG block or Canvas (e.g. because of a `layerSplit` or DOM content), some filters may fall back to a more expensive strategy, or in the case of custom `ColorMatrixFilter`s under WebGL/DOM content, may not be supported at all. Prefer the DOM-compatible named filters (all of the ones listed above are DOM-compatible) when performance matters and the content underneath isn't guaranteed to be single-block SVG or Canvas.
:::
