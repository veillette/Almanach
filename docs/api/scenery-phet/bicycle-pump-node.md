---
title: BicyclePumpNode
description: An animated bicycle-pump graphic whose handle, when dragged down, injects discrete units (particles, air, etc.) into a model quantity.
category: api
library: scenery-phet
tags: [scenery-phet, BicyclePumpNode, pump, particles]
status: complete
related:
  - /api/scenery-phet/faucet-node
  - /api/dot/range
  - /api/axon/boolean-property
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BicyclePumpNode

`BicyclePumpNode` (from `scenerystack/scenery-phet`) draws a bicycle pump — base, body, handle, hose, and a segmented "remaining capacity" indicator built into the body — and lets the user drag (or keyboard-drag) the handle down to inject discrete units into a model quantity. It's used in sims like States of Matter and Gas Properties to let users add particles one pump-stroke at a time.

```ts
import { BicyclePumpNode } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const numberOfParticlesProperty = new NumberProperty( 0 );
const rangeProperty = new Property( new Range( 0, 100 ) );

const pumpNode = new BicyclePumpNode( numberOfParticlesProperty, rangeProperty, {
  width: 200,
  height: 250,
  hoseAttachmentOffset: new Vector2( 100, -50 ),
  tandem: tandem.createTandem( 'pumpNode' )
} );
```

Call `pumpNode.reset()` from your screen's `reset()` to snap the handle back to its initial (fully raised) position and clear internal drag-accumulation state — this does not touch `numberOfParticlesProperty` itself.

## Constructor

```ts
new BicyclePumpNode(
  numberProperty: TProperty<number>,
  rangeProperty: TReadOnlyProperty<Range>,
  providedOptions?: BicyclePumpNodeOptions
)
```

`numberProperty` is incremented as the handle is dragged down; the pump refuses to push `numberProperty` above `rangeProperty.value.max`.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `width` / `height` | `200` / `250` | Overall size; every part of the pump is proportioned from these |
| `handleFill` / `shaftFill` / `bodyFill` / `bodyTopFill` / `baseFill` / `hoseFill` | assorted grays/red | Colors of each visual part |
| `indicatorBackgroundFill` / `indicatorRemainingFill` | dark gray / light gray | Colors of the segmented capacity indicator on the pump body |
| `hoseCurviness` | `1` | Larger values curve the hose more; smaller values straighten it |
| `hoseAttachmentOffset` | `Vector2(100, 100)` | Where the hose's far end attaches, relative to the pump's origin; its sign (x > 0 or < 0) decides which side of the cone the hose comes off |
| `nodeEnabledProperty` | `null` (an owned `BooleanProperty` is created) | Pass your own to share enabled-state externally; passing `null` means the Node owns and disposes its own |
| `injectionEnabledProperty` | always-`true` `BooleanProperty` | Throttle: when `false`, the pump stays visually interactive but stops actually adding particles (for model back-pressure) |
| `numberOfParticlesPerPumpAction` | `10` | How many full handle-down strokes worth of travel corresponds to one full "pump action" of particle additions |
| `addParticlesOneAtATime` | `true` | If `false`, particles accumulated during one stroke are added in a single batch at the end instead of one at a time as the threshold is crossed |
| `handleTouchAreaXDilation` / `handleTouchAreaYDilation` | `15` / `15` | Touch-area dilation around the handle |
| `dragListenerOptions` / `keyboardDragListenerOptions` | — | Passed through to the internal pointer/keyboard drag listeners |

## Methods

| Method | Effect |
| --- | --- |
| `reset()` | Returns the handle/shaft to their initial position and clears drag-accumulation state |

::: tip `injectionEnabledProperty` vs `nodeEnabledProperty`
These control two different things: `nodeEnabledProperty` (or the owned default) governs whether the handle can be grabbed at all — when disabled, the handle dims and stops responding to input. `injectionEnabledProperty` leaves the handle fully interactive but silently stops incrementing `numberProperty`, which is the hook meant for "the model can't accept particles this fast" without making the control itself look broken.
:::
