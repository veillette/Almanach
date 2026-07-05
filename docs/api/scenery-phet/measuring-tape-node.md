---
title: MeasuringTapeNode
description: A draggable measuring tape with a base, an extendable tip, and a live distance readout, common in physics sims.
category: api
library: scenery-phet
tags: [scenery-phet, MeasuringTapeNode, measurement, drag]
status: complete
related:
  - /api/scenery-phet/ruler-node
  - /api/phetcommon/model-view-transform
  - /api/axon/derived-property
  - /api/tandem/tandem
prerequisites:
  - /api/axon/property
  - /api/phetcommon/model-view-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# MeasuringTapeNode

`MeasuringTapeNode` (from `scenerystack/scenery-phet`) draws a classic tape-measure image with two independently draggable ends — a base (the case) and a tip (the free end of the tape) — connected by a line, with a text readout showing the distance between them in whatever units you supply. Dragging the base moves the whole tape (tip included); dragging the tip alone extends or retracts the tape. It's the standard "let the user measure something" tool across PhET simulations, distinct from [`RulerNode`](/api/scenery-phet/ruler-node), which is a rigid ruler graphic rather than a two-point tape.

```ts
import { MeasuringTapeNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const unitsProperty = new Property( { name: 'cm', multiplier: 100 } );

const measuringTapeNode = new MeasuringTapeNode( unitsProperty, {
  tandem: tandem.createTandem( 'measuringTapeNode' ),
  dragBounds: layoutBounds.eroded( 20 ) // model-coordinate Bounds2 the tape stays within
} );

// Position it explicitly (base at model origin, tip 1 model unit to the right)
measuringTapeNode.basePositionProperty.value = new Vector2( 0, 0 );
measuringTapeNode.tipPositionProperty.value = new Vector2( 1, 0 );
```

The `multiplier` in `unitsProperty`'s value converts the internal model-coordinate distance into display units before formatting the readout — a `multiplier: 100` reading of `0.5` model units displays as `50 cm`.

## Constructor

```ts
new MeasuringTapeNode(
  unitsProperty: TReadOnlyProperty<MeasuringTapeUnits>,
  providedOptions?: MeasuringTapeNodeOptions
)
```

where `MeasuringTapeUnits = { name: string; multiplier: number }`.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `basePositionProperty` | new `Vector2Property( (0,0) )` | Model-coordinate position of the base (case); supply your own to share it with model code |
| `tipPositionProperty` | new `Vector2Property( (1,0) )` | Model-coordinate position of the tip |
| `hasValue` | `true` | Set `false` to hide the text readout entirely (useful when building an icon) |
| `dragBounds` | `Bounds2.EVERYTHING` | Model-coordinate bounds constraining the base (and, if `isTipDragBounded`, the tip) |
| `modelViewTransform` | identity | Must have equal x/y scale factors — asserted at construction |
| `significantFigures` | `1` | Digits shown in the distance readout |
| `isTipDragBounded` | `true` | Whether the tip is also constrained to `dragBounds`, or free to roam anywhere |
| `interactive` | `true` | Set `false` to disable the built-in drag/keyboard-drag listeners, e.g. when using `MeasuringTapeNode.createIcon()` |
| `baseScale` | `0.8` | Scales the base image, and with it the crosshair/text layout that's positioned relative to it |
| `textColor` / `textBackgroundColor` | `'white'` / `null` | Readout text and background colors |
| `baseDragStarted` / `baseDragEnded` | no-ops | Callbacks fired when a base drag starts/ends — handy for "dropped into toolbox" detection |
| `phetioFeaturedMeasuredDistanceProperty` | `false` | Whether `measuredDistanceProperty` is marked `phetioFeatured` |

## Instance properties

| Property | Type | Description |
| --- | --- | --- |
| `measuredDistanceProperty` | `TReadOnlyProperty<number>` | Model-coordinate distance between base and tip, as a `DerivedProperty` |
| `basePositionProperty` / `tipPositionProperty` | `Property<Vector2>` | Live positions, read-write unless you passed your own |
| `isBaseUserControlledProperty` / `isTipUserControlledProperty` | `TReadOnlyProperty<boolean>` | Whether the user is actively dragging that end right now |
| `modelViewTransformProperty` | `Property<ModelViewTransform2>` | Wraps the `modelViewTransform` option; update it to re-project the tape live |

## Methods

| Method | Effect |
| --- | --- |
| `reset()` | Resets `basePositionProperty`/`tipPositionProperty` — only the ones this Node created itself (see warning below) |
| `setDragBounds( bounds )` / `getDragBounds()` | Changes the model-coordinate drag bounds, immediately clamping the current base (and tip, if bounded) into them |
| `startBaseDrag( event )` | Programmatically begins a base drag from a Scenery input event |
| `getLocalBaseCenter()` / `getLocalBaseBounds()` | Base image geometry in the Node's local coordinate frame |
| `MeasuringTapeNode.createIcon( options? )` *(static)* | Builds a non-interactive, valueless snapshot `Node` suitable for a toolbox icon |

::: warning `reset()` and `dispose()` only touch Properties `MeasuringTapeNode` created itself
If you pass your own `basePositionProperty`/`tipPositionProperty` (so your model can read them directly), `MeasuringTapeNode` does **not** reset or dispose them — you own their lifecycle. `reset()`/`dispose()` only reset/dispose the default `Vector2Property` instances it constructs internally when you *don't* supply your own. Forgetting this is a common source of "reset all doesn't move the tape back" bugs when a model-owned position Property is involved.
:::
