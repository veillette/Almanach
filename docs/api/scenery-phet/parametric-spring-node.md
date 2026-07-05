---
title: ParametricSpringNode
description: A coiled spring drawn from a parametric (cycloid-like) equation, with live-adjustable loop count, radius, and phase.
category: api
library: scenery-phet
tags: [scenery-phet, ParametricSpringNode, spring, coil]
status: complete
related:
  - /api/scenery-phet/gauge-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ParametricSpringNode

`ParametricSpringNode` (from `scenery-phet`) draws a coiled spring using a parametric curve (a variation on a prolate cycloid), rendered as two separate front/back `Path`s so the coil reads with a pseudo-3D over/under weave. Every shape parameter — loop count, radius, aspect ratio, phase, line width — is exposed as its own `NumberProperty`, so you can animate the spring (e.g. stretching it as a mass drags down on it) just by setting those Properties; the Node recomputes its shape automatically.

The origin `(0, 0)` of a `ParametricSpringNode` is at its **left-center**, not its bounds' top-left — useful to know when positioning it next to an anchor point.

```ts
import { ParametricSpringNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const springNode = new ParametricSpringNode( {
  loops: 8,
  radius: 15,
  aspectRatio: 3,
  frontColor: 'lightBlue',
  middleColor: 'blue',
  backColor: 'darkblue',
  left: 100,
  centerY: 200
} );

// Stretch the spring by changing the loop radius live:
springNode.radiusProperty.value = 20;
```

## Constructor

```ts
new ParametricSpringNode( providedOptions?: ParametricSpringNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `loops` | `10` | Number of coil loops (seeds `loopsProperty`) |
| `pointsPerLoop` | `40` | Points used to approximate one loop (seeds `pointsPerLoopProperty`); higher is smoother but costlier |
| `radius` | `10` | Radius of a loop at aspect ratio 1:1 (seeds `radiusProperty`) |
| `aspectRatio` | `4` | y:x aspect ratio of each loop, i.e. how "squashed" the coil looks (seeds `aspectRatioProperty`) |
| `phase` | `Math.PI` | Phase angle where the loop starts, in `(0, 2π)` (seeds `phaseProperty`) |
| `deltaPhase` | `Math.PI / 2` | Controls how much the coil "leans," a Lissajous-style parameter (seeds `deltaPhaseProperty`) |
| `xScale` | `2.5` | Multiplier stretching the coil horizontally as it progresses (seeds `xScaleProperty`) |
| `lineWidth` | `3` | Stroke width of both the front and back paths (seeds `lineWidthProperty`) |
| `leftEndLength` / `rightEndLength` | `15` / `25` | Length of the straight horizontal segments added at the left/right ends of the coil |
| `frontColor` / `middleColor` / `backColor` | `'lightGray'` / `'gray'` / `'black'` | Colors used to build the front and back paths' gradients (`middleColor` is the dominant color) |
| `boundsMethod` | `'accurate'` | Forwarded to the internal `Path`s; set to `'none'` for a large performance win if you only rely on `x`/`y` (not bounds-based layout) for positioning |

## Public API

| Member | Description |
| --- | --- |
| `loopsProperty`, `radiusProperty`, `aspectRatioProperty`, `pointsPerLoopProperty`, `lineWidthProperty`, `phaseProperty`, `deltaPhaseProperty`, `xScaleProperty` | Public `NumberProperty` for each shape parameter above; set any of them to reshape the spring live |
| `reset()` | Resets every one of the Properties above to its initial value |

::: warning Changing `loops`, `pointsPerLoop`, `aspectRatio`, `phase`, or `deltaPhase` rebuilds the point array; changing `radius`/`xScale` alone is cheaper
The first group of Properties changes how many points exist or how they're allocated to the front/back paths, so `ParametricSpringNode` regenerates the coil's `Vector2` points from scratch. `radiusProperty` and `xScaleProperty` alone only need to *mutate* the existing points in place — a meaningfully cheaper path internally. If you're animating a spring every frame, prefer driving `radiusProperty` (e.g. to simulate stretch) over the other parameters.
:::
