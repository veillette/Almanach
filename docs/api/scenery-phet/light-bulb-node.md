---
title: LightBulbNode
description: A bulb image that glows and casts light rays as a function of a 0-1 brightness Property.
category: api
library: scenery-phet
tags: [scenery-phet, LightBulbNode, LightRaysNode, light, bulb]
status: complete
related:
  - /api/scenery-phet/light-rays-node
  - /api/axon/number-property
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LightBulbNode

`LightBulbNode` (from `scenerystack/scenery-phet`) draws a light bulb that glows in response to a `brightnessProperty` in the range `[0, 1]`: at `0` only the "off" bulb image is shown, and as brightness rises the "on" image fades in (via opacity) while a [`LightRaysNode`](/api/scenery-phet/light-rays-node) radiates more and longer rays behind it. It's the standard "is this circuit/light source active, and how strongly" visual used across circuit and light-related simulations.

```ts
import { LightBulbNode } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const brightnessProperty = new NumberProperty( 0 ); // 0 (off) to 1 (full brightness)

const bulbNode = new LightBulbNode( brightnessProperty, {
  bulbImageScale: 0.5
} );

// Later, as current/voltage changes:
brightnessProperty.value = 0.75;
```

<SceneryDemo demo="light-bulb-node" />

## Constructor

```ts
new LightBulbNode(
  brightnessProperty: TReadOnlyProperty<number>,
  providedOptions?: LightBulbNodeOptions
)
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `bulbImageScale` | `0.33` | Scale applied to both the "on" and "off" bulb images |
| `lightBulbOnImage` / `lightBulbOffImage` | PhET's standard bulb mipmaps | Override to use custom bulb artwork |
| `lightRaysNodeOptions` | `{}` | Options forwarded to the internal [`LightRaysNode`](/api/scenery-phet/light-rays-node) (`x`/`y` are computed automatically to center the rays behind the bulb) |

::: warning `brightnessProperty` must stay within `[0, 1]`, and updates pause while invisible
`LightBulbNode` asserts that `brightnessProperty.value` is between `0` and `1` inclusive. For performance, it also skips recomputing the "on" image's opacity and the rays while the node is invisible, and only catches up (via a `visibleProperty` listener) the next time it becomes visible — so don't expect a `LightBulbNode` hidden behind another screen's content to be pixel-accurate the instant you show it if brightness changed many times while hidden; it will simply jump straight to the current value.
:::

`LightBulbNode` links to `brightnessProperty` for the lifetime of the Node and unlinks in its own `dispose()` override — see [Dispose and Memory Management](/patterns/dispose-and-memory-management) if you're creating and destroying bulbs dynamically (e.g. one per circuit element in a list).
