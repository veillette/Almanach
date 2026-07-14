---
title: FaucetNode
description: A faucet control with a draggable pinball-shooter-style handle that drives a flow-rate Property, used in fluid/flow simulations.
category: api
library: scenery-phet
tags: [scenery-phet, FaucetNode, faucet, fluid, flow-rate]
status: verified
related:
  - /api/scenery-phet/bicycle-pump-node
  - /api/dot/range
  - /patterns/drag-listeners
  - /patterns/phet-io-instrumentation-pattern
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# FaucetNode

`FaucetNode` (from `scenerystack/scenery-phet`) draws a faucet whose interactive part is a "shooter" that behaves like a horizontal slider — sliding it out increases a `flowRateProperty`, and the visuals (pipe, spout, track, knob) are all pre-built PNG-based image assets. It's used in fluid/flow sims like pH Scale and Molarity wherever the user needs to turn on a flow of something.

```ts
import { FaucetNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const maxFlowRate = 10; // L/s
const flowRateProperty = new Property( 0 );
const enabledProperty = new Property( true );

const faucetNode = new FaucetNode( maxFlowRate, flowRateProperty, enabledProperty, {
  tandem: tandem.createTandem( 'faucetNode' )
} );
```

`FaucetNode`'s origin is the bottom-center of its spout, which makes it easy to align against wherever fluid should visually emerge.

<SceneryDemo demo="faucet-node" />

## Constructor

```ts
new FaucetNode(
  maxFlowRate: number,
  flowRateProperty: Property<number>,
  enabledProperty: TReadOnlyProperty<boolean>,
  providedOptions?: FaucetNodeOptions
)
```

`FaucetNode` extends `AccessibleSlider`, so `flowRateProperty` also drives keyboard alt-input the same way a slider's value would.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `horizontalPipeLength` | spout's x-center | Distance from the left edge of the horizontal pipe to the spout's center |
| `verticalPipeLength` | `43` | Length of the vertical pipe connecting the body to the spout |
| `closeOnRelease` | `true` | If `true`, releasing the shooter always sets flow to zero ("close-on-release"); if `false`, it stays wherever released ("slider mode") |
| `tapToDispenseEnabled` | `true` | Tapping the shooter without dragging toggles a burst of flow on/off |
| `tapToDispenseAmount` | `0.25 * maxFlowRate` | Amount dispensed per tap, in L |
| `tapToDispenseInterval` | `500` | Duration (ms) that a tap-to-dispense burst runs |
| `interactiveProperty` | always-`true` `Property` | When `false`, hides the shooter and track entirely (the flow control becomes non-interactive) |
| `rasterizeHorizontalPipeNode` | `false` | Rasterizes the tiled horizontal pipe image, to work around flickering seen in some sims |
| `grabSoundPlayer` / `releaseSoundPlayer` | shared grab/release sounds | Sounds played on drag-start / on flow reaching zero |
| `shooterOptions` | — | Options for the internal shooter (e.g. `knobScale`, touch/mouse area dilation) |

::: warning `closeOnRelease` defaults to `true`
Out of the box, dragging the shooter and letting go snaps the flow rate back to zero — it is **not** slider-like persistence by default. If you want the faucet to stay open at whatever rate the user left it at (as with a real tap), you must explicitly pass `closeOnRelease: false`.
:::
