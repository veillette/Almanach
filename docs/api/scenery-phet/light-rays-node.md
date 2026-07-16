---
title: LightRaysNode
description: A Path of radiating line segments whose count and length scale with a 0-1 brightness value.
category: api
library: scenery-phet
tags: [scenery-phet, LightRaysNode, light, rays]
status: complete
related:
  - /api/scenery-phet/light-bulb-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LightRaysNode

`LightRaysNode` (from `scenerystack/scenery-phet`) draws a fan of straight line segments radiating outward from a circle of a given radius, filling roughly three-quarters of the surrounding circle. It's the "glow" effect behind [`LightBulbNode`](/api/scenery-phet/light-bulb-node) — which constructs one internally — but it's a standalone `Path` you can attach to any circular light source (a laser aperture, a glowing indicator, etc.) and drive directly.

```ts
import { LightRaysNode } from 'scenerystack/scenery-phet';
```

<SceneryDemo demo="light-rays-node" />

## A minimal example

```ts
const bulbRadius = 20;

const raysNode = new LightRaysNode( bulbRadius, {
  stroke: 'yellow',
  maxRays: 40,
  maxRayLength: 150
} );

raysNode.setBrightness( 0.75 ); // 0 (no rays, invisible) to 1 (maxRays, full length)
```

## Constructor

```ts
new LightRaysNode( bulbRadius: number, providedOptions?: LightRaysNodeOptions )
```

`bulbRadius` is the radius of the circle the rays emanate from (they start at that radius, not at the origin).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `minRays` / `maxRays` | `8` / `60` | Number of rays at brightness `0` (rays only appear above brightness `0`) and brightness `1` |
| `minRayLength` / `maxRayLength` | `0` / `200` | Ray length at the low and high ends of the brightness range |
| `shortRayLineWidth` / `mediumRayLineWidth` / `longRayLineWidth` | `0.5` / `1` / `1.5` | Stroke widths interpolated across as computed ray length grows |
| `stroke` (inherited `PathOptions`) | `'yellow'` | Color of the rays |

## Methods

| Method | Effect |
| --- | --- |
| `setBrightness( brightness )` | Recomputes the number, length, and line width of rays for a brightness in `[0, 1]`, and sets `visible = false` when `brightness` is exactly `0` |

::: tip At brightness `0`, the shape becomes an invisible circle, not an empty shape
When `numberOfRays` drops to `0`, `LightRaysNode` still assigns an (invisible, since `visible` is set to `false`) circle of radius `bulbRadius` as its shape rather than clearing it entirely — this keeps local bounds well-defined at construction time instead of momentarily reporting empty bounds.
:::
