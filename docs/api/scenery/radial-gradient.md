---
title: RadialGradient
description: A paint type for circular color gradients between two circles, usable anywhere a Node accepts a fill or stroke.
category: api
library: scenery
tags: [scenery, RadialGradient, gradient, paint, fill, stroke]
status: verified
related:
  - /api/scenery/color
  - /api/scenery/linear-gradient
  - /api/scenery/node
prerequisites:
  - /api/scenery/color
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RadialGradient

`RadialGradient` (from `scenerystack/scenery`) is a paint type — assignable to a Node's `fill` or `stroke` just like [`Color`](/api/scenery/color) or [`LinearGradient`](/api/scenery/linear-gradient) — that renders a gradient between two circles (a start circle at ratio 0 and an end circle at ratio 1), matching the CSS/SVG/Canvas notion of a radial gradient. It extends the same abstract `Gradient` base class `LinearGradient` does, so color stops work identically.

```ts
import { Circle, RadialGradient } from 'scenerystack/scenery';

// Start circle: center (0,0), radius 0 (a point). End circle: center (0,0), radius 20.
const gradient = new RadialGradient( 0, 0, 0, 0, 0, 20 )
  .addColorStop( 0, 'white' )
  .addColorStop( 1, 'steelblue' );

const sphere = new Circle( 20, { fill: gradient } );
```

<SceneryDemo demo="radial-gradient" />

## Constructor

`new RadialGradient( x0, y0, r0, x1, y1, r1 )` — the start circle's center and radius (ratio 0), then the end circle's center and radius (ratio 1), all in the Node's local coordinate frame. A common "spherical" look uses the same center for both circles with `r0` near `0` and `r1` matching the shape's radius, as above; offsetting the start circle's center instead produces a highlight-style radial gradient.

## Color stops

`addColorStop( ratio, color )` is inherited from the same `Gradient` base class [`LinearGradient`](/api/scenery/linear-gradient) uses — stops must be added in non-decreasing `ratio` order, and `color` accepts `null`, a CSS string, a [`Color`](/api/scenery/color), or a `Property` resolving to one of those.

::: tip Safari gets a workaround for coincident-center radial gradients
Scenery detects Safari and nudges both circles' centers to their midpoint internally to work around a browser gradient-rendering bug — you don't need to do anything for this, but it's worth knowing if a `RadialGradient`'s rendered center looks *slightly* off from the coordinates you passed specifically on Safari; the visual difference is designed to be imperceptible.
:::
