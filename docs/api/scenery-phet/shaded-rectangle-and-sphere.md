---
title: ShadedRectangle and ShadedSphereNode
description: Two pseudo-3D shading primitives - a beveled rounded rectangle and a specular-highlighted sphere - built from gradients rather than images.
category: api
library: scenery-phet
tags: [scenery-phet, ShadedRectangle, ShadedSphereNode, shading, gradient, pseudo-3d]
status: complete
related:
  - /api/scenery-phet/gauge-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ShadedRectangle and ShadedSphereNode

`ShadedRectangle` and `ShadedSphereNode` (both from `scenerystack/scenery-phet`) are small, self-contained pseudo-3D shading primitives: rather than importing beveled-button or glossy-marble artwork, you give each a size/diameter and a base color, and it builds the highlight/shadow gradients procedurally. They're unrelated as classes (different base types, different constructors) but share the same purpose — cheap faux-3D chrome — so they're documented together.

```ts
import { ShadedRectangle, ShadedSphereNode } from 'scenerystack/scenery-phet';
import { Bounds2 } from 'scenerystack/dot';
```

## ShadedRectangle

Draws a rounded rectangle with a beveled, embossed look: light and dark gradients along each edge and rounded corner, as if lit from one direction.

```ts
const panel = new ShadedRectangle( new Bounds2( 0, 0, 120, 60 ), {
  baseColor: 'rgb(80,130,230)',
  cornerRadius: 8,
  lightSource: 'leftTop'
} );
```

### Constructor

```ts
new ShadedRectangle( rectBounds: Bounds2, providedOptions?: ShadedRectangleOptions )
```

`rectBounds` sets the rectangle's exact size and position (in the parent coordinate frame) — it isn't resized afterward by mutating `bounds`.

### Options

| Option | Default | Effect |
| --- | --- | --- |
| `baseColor` | `new Color(80,130,230)` | The rectangle's nominal (unshaded) color |
| `lightSource` | `'leftTop'` | Which corner the light appears to come from: `'leftTop'`, `'rightTop'`, `'leftBottom'`, `'rightBottom'` |
| `cornerRadius` | `10` | Corner radius; also determines how far the shading gradients extend |
| `lightFactor` / `lighterFactor` | `0.5` / `0.1` | How much lighter the lit edges are, and how much lighter the lit *corner* is than the lit edges |
| `darkFactor` / `darkerFactor` | `0.5` / `0.1` | How much darker the shadowed edges are, and how much darker the shadowed *corner* is than the shadowed edges |
| `lightOffset` / `darkOffset` | `0.525` / `0.375` | Fraction of `cornerRadius` the light/dark gradients extend into the rectangle (must each be `< 1`) |

## ShadedSphereNode

Extends `Circle` and fills it with a `RadialGradient` positioned off-center, giving the impression of a glossy 3D sphere lit from one corner.

```ts
const marble = new ShadedSphereNode( 40, {
  mainColor: 'red',
  highlightColor: 'white',
  shadowColor: 'darkred'
} );
```

### Constructor

```ts
new ShadedSphereNode( diameter: number, providedOptions?: ShadedSphereNodeOptions )
```

### Options

| Option | Default | Effect |
| --- | --- | --- |
| `mainColor` | `'gray'` | The sphere's dominant color |
| `highlightColor` | `'white'` | Color of the specular highlight |
| `shadowColor` | `'black'` | Color at the sphere's outer edge |
| `highlightDiameterRatio` | `0.5` | How large the highlight is, as a fraction of the diameter (must be `< 1`) |
| `highlightXOffset` / `highlightYOffset` | `-0.4` / `-0.4` | Position of the highlight, as a fraction of the radius in `[-1, 1]` — negative values move it toward the top-left |

::: tip `ShadedSphereNode` is the base for `AtomNode` and lens/bulb graphics elsewhere in scenery-phet
Several other Nodes across scenerystack subclass `ShadedSphereNode` directly rather than reimplementing sphere shading — for example the `laser-pointer-node`'s glass lens. If you need a round, glossy indicator (a status light, a ball, an atom), check whether extending `ShadedSphereNode` covers it before building a custom gradient.
:::
