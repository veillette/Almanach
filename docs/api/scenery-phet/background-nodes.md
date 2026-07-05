---
title: Background Nodes
description: Small building blocks for scene backgrounds — the sky/ground gradient family (SkyNode, GroundNode, OutsideBackgroundNode) plus BackgroundNode and GradientRectangle.
category: api
library: scenery-phet
tags: [scenery-phet, BackgroundNode, GradientBackgroundNode, GradientRectangle, SkyNode, GroundNode, OutsideBackgroundNode, background, gradient]
status: complete
related:
  - /api/scenery/rectangle
  - /api/scenery/linear-gradient
  - /api/scenery/radial-gradient
  - /api/scenery/node
prerequisites:
  - /api/scenery/rectangle
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Background Nodes

`scenerystack/scenery-phet` exports a handful of small, unrelated-but-similarly-named "background" helpers. Four of them — `OutsideBackgroundNode`, `SkyNode`, `GroundNode`, and `GradientBackgroundNode` — form one family: the sky-over-ground gradient scene backdrop used by outdoor-themed sims (projectile motion, gravity/forces sims, anything with a horizon). The other two, `BackgroundNode` and `GradientRectangle`, are general-purpose, standalone utilities that happen to live in the same file group. This page covers all six together since each is too small to warrant its own page.

```ts
import {
  OutsideBackgroundNode, SkyNode, GroundNode, GradientBackgroundNode,
  BackgroundNode, GradientRectangle
} from 'scenerystack/scenery-phet';
```

## The sky/ground gradient family

`GradientBackgroundNode` is the base class: a `Rectangle` filled with a single vertical `LinearGradient` between two colors. `SkyNode` and `GroundNode` are thin subclasses that fix sensible default colors (sky: blue-to-pale-blue; ground: green-to-darker-green) and orient the gradient correctly for "up" (sky) or "down" (ground). `OutsideBackgroundNode` composes one `SkyNode` and one `GroundNode` into a single ready-to-use backdrop.

### A minimal example

```ts
// A full-screen outdoor backdrop: sky above, ground below, centered horizontally.
const backgroundNode = new OutsideBackgroundNode(
  layoutBounds.centerX, // centerX
  layoutBounds.centerY, // centerY — the horizon, where sky meets ground
  layoutBounds.width * 3, // width
  layoutBounds.height,    // skyHeight
  layoutBounds.height     // groundDepth
);
screenView.addChild( backgroundNode );
```

`OutsideBackgroundNode` has no options object — every parameter is positional, and colors can only be customized by building `SkyNode`/`GroundNode` yourself instead of using the composite:

```ts
const sky = new SkyNode( 0, -300, 800, 300, 150, {
  topColor: 'midnightblue',
  bottomColor: 'skyblue'
} );
const ground = new GroundNode( 0, 0, 800, 200, 100 );
```

### Constructors

| Class | Constructor |
| --- | --- |
| `GradientBackgroundNode` | `( x, y, width, height, color1: TColor, color2: TColor, y1: number, y2: number )` — plain two-stop vertical gradient between `y1` and `y2` |
| `SkyNode` | `( x, y, width, height, gradientEndHeight: number, providedOptions?: SkyNodeOptions )` |
| `GroundNode` | `( x, y, width, height, gradientEndDepth: number, providedOptions?: GroundNodeOptions )` |
| `OutsideBackgroundNode` | `( centerX, centerY, width, skyHeight, groundDepth )` — no options |

`SkyNodeOptions` and `GroundNodeOptions` are both just `{ topColor?: TColor; bottomColor?: TColor }` — `SkyNode` defaults to a blue-to-pale-blue gradient, `GroundNode` to a green-to-darker-green one.

::: tip `gradientEndHeight` / `gradientEndDepth` control gradient extent, not visual extent
For `SkyNode`, the rectangle always spans the full `height` you pass, but the gradient itself only transitions over `gradientEndHeight` (from the bottom of the sky, going up) — past that point the color is solid `topColor`. `GroundNode` works the same way in reverse. `OutsideBackgroundNode` passes half of `skyHeight`/`groundDepth` for these, giving a gradient that fades out before reaching the horizon on one side and before reaching the far edge on the other.
:::

## BackgroundNode

`BackgroundNode` is unrelated to the sky/ground family — it puts an arbitrary `Node` on top of a translucent rectangle sized to fit it, dynamically resizing as the wrapped Node's bounds change. It's a quick way to keep text or an icon readable when it might overlap other content (e.g. a label drawn on top of a photo or a `WireNode`).

```ts
import { Text } from 'scenerystack/scenery';

const label = new Text( 'Voltage' );
const labelWithBackground = new BackgroundNode( label, {
  xMargin: 4,
  yMargin: 4,
  rectangleOptions: { fill: 'white', opacity: 0.85 }
} );
```

### `BackgroundNode` options

| Option | Default | Effect |
| --- | --- | --- |
| `xMargin` / `yMargin` | `2` / `2` | Margin between the wrapped Node's bounds and the background rectangle's edge |
| `rectangleOptions` | `{ fill: 'white', opacity: 0.75 }` | Options forwarded to the internal background [`Rectangle`](/api/scenery/rectangle) |

## GradientRectangle

`GradientRectangle` is also unrelated to the sky/ground family — it's a `Rectangle` whose edges fade out via [`LinearGradient`](/api/scenery/linear-gradient)s on each side and [`RadialGradient`](/api/scenery/radial-gradient)s at the corners, instead of having a hard edge. Use it where content needs to visually fade at its boundary, e.g. the edge of a scrolling or clipped region.

```ts
const fadingPanel = new GradientRectangle( {
  rectWidth: 200,
  rectHeight: 100,
  fill: 'white',
  margin: 20,       // all four sides fade over a 20px band
  roundMargins: true
} );
```

### `GradientRectangle` options

| Option | Default | Effect |
| --- | --- | --- |
| `margin` | `0` | Sets `leftMargin`, `rightMargin`, `topMargin`, `bottomMargin` together — width of the fade band on each side |
| `xMargin` / `yMargin` | `0` / `0` | Set left+right or top+bottom margins together |
| `leftMargin` / `rightMargin` / `topMargin` / `bottomMargin` | `0` | Fade-band width for one side individually |
| `roundMargins` | `true` | Whether the corners fade with a rounded (radial) gradient or a squared-off one |
| `extension` | `0` | Where (from `0` to `<1`, as a fraction of the margin) the fade actually starts — `0` starts fading immediately at the rectangle edge |
| `border` | `null` | The color the fade transitions *to*; `null` means "fully transparent version of `fill`" |

::: warning Only `fill` is supported, not `stroke`
`GradientRectangle` overrides `setStroke()` to assert that the stroke is always `null` — the fading effect is implemented as fill-only child shapes, so a stroke has no sensible rendering here. Set `fill` (a solid `ColorDef`, not a gradient/pattern) and let `GradientRectangle` build its own internal gradients from it.
:::
