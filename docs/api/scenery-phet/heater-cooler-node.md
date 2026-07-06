---
title: HeaterCoolerNode
description: A stove-style heating/cooling control driven by a bidirectional -1-to-+1 Property, with an embedded vertical slider.
category: api
library: scenery-phet
tags: [scenery-phet, HeaterCoolerNode, heat-cool-control, heater, cooler, slider]
status: verified
related:
  - /api/scenery-phet/gauge-node
  - /api/axon/number-property
  - /patterns/model-view-separation
prerequisites:
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HeaterCoolerNode

There is no `HeatCoolControl` export in `scenerystack/scenery-phet` — the real class backing a bidirectional heat/cool control is `HeaterCoolerNode`. It draws a stove-like bucket with a flame/ice graphic (split into `HeaterCoolerBack` and `HeaterCoolerFront` so other Nodes can be layered inside the opening for a 3D effect) and an embedded vertical slider that drives a single `heatCoolAmountProperty` from `-1` (max cooling) through `0` (off) to `+1` (max heating). It's used in sims like States of Matter and Energy Forms and Changes wherever the user needs to add or remove heat from a system.

```ts
import { HeaterCoolerNode } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const heatCoolAmountProperty = new NumberProperty( 0, {
  range: new Range( -1, 1 )
} );

const heaterCoolerNode = new HeaterCoolerNode( heatCoolAmountProperty, {
  tandem: tandem.createTandem( 'heaterCoolerNode' )
} );
```

Step your model's heat/cool logic off `heatCoolAmountProperty` directly (e.g. `heatCoolAmountProperty.value * maxHeatingRate`); `HeaterCoolerNode` only reflects and lets the user drag the value, it does not apply any heating/cooling itself.

## Constructor

```ts
new HeaterCoolerNode(
  heatCoolAmountProperty: NumberProperty,
  providedOptions?: HeaterCoolerNodeOptions
)
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `baseColor` | `HeaterCoolerBack.DEFAULT_BASE_COLOR` | Color of the stove body, applied consistently to both the front and back parts |
| `frontOptions` | — | Options forwarded to the internal `HeaterCoolerFront` (which owns the labels, stove body, and slider) |
| `backOptions` | — | Options forwarded to the internal `HeaterCoolerBack` (the opening and flame/ice graphics) |

Both `frontOptions` and `backOptions` reject an explicit `baseColor` — `HeaterCoolerNode` asserts against it, since it sets `baseColor` on both children itself from the top-level option.

## Members

| Member | Description |
| --- | --- |
| `heatCoolAmountProperty` | The `NumberProperty` passed to the constructor, ranging `-1` to `+1` |
| `slider` | The internal `VSlider` (from `scenerystack/sun`) that drives `heatCoolAmountProperty`; public so PhET-iO/Studio and edge-case client code can reach it directly |

::: tip `slider` is exposed, but treat it as read-mostly
`HeaterCoolerNode` deliberately makes its internal `VSlider` public (the source comment reads "with public visibility annotation comes great power — use it wisely") so tooling can instrument or inspect it. Reaching in to change its layout or behavior couples you to `HeaterCoolerFront`'s internals; prefer driving everything through `heatCoolAmountProperty` and the top-level options instead.
:::
