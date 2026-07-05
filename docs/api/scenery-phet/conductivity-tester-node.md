---
title: ConductivityTesterNode
description: A light bulb wired to a battery and two draggable probes, visualizing circuit conductivity for chemistry sims.
category: api
library: scenery-phet
tags: [scenery-phet, ConductivityTesterNode, chemistry, probe, wire]
status: complete
related:
  - /api/scenery-phet/probe-node
  - /api/scenery-phet/wire-node
  - /api/phetcommon/model-view-transform
  - /api/tandem/tandem
prerequisites:
  - /api/phetcommon/model-view-transform
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ConductivityTesterNode

`ConductivityTesterNode` (from `scenerystack/scenery-phet`) draws a light bulb connected by wires to a battery and two draggable probes (a red "+" and a black "−"). When both probes are immersed in a conductive solution, the model sets `brightnessProperty` above zero and the bulb glows — the classic "does this liquid conduct electricity" apparatus used in chemistry sims like Acid-Base Solutions. It reuses [`ProbeNode`](/api/scenery-phet/probe-node)-style probe graphics and [`WireNode`](/api/scenery-phet/wire-node)-style cubic-bezier wires internally (as private helper classes local to this file, not the standalone exported `ProbeNode`/`WireNode`).

```ts
import { ConductivityTesterNode } from 'scenerystack/scenery-phet';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const brightnessProperty = new NumberProperty( 0, { range: { min: 0, max: 1 } } );
const positionProperty = new Property( new Vector2( 0, 0 ) );
const positiveProbePositionProperty = new Property( new Vector2( -0.5, -1 ) );
const negativeProbePositionProperty = new Property( new Vector2( 0.5, -1 ) );

const conductivityTesterNode = new ConductivityTesterNode(
  brightnessProperty,
  positionProperty,
  positiveProbePositionProperty,
  negativeProbePositionProperty,
  { tandem: tandem.createTandem( 'conductivityTesterNode' ) }
);
```

## Constructor

```ts
new ConductivityTesterNode(
  brightnessProperty: TReadOnlyProperty<number>,
  positionProperty: TProperty<Vector2>,
  positiveProbePositionProperty: TProperty<Vector2>,
  negativeProbePositionProperty: TProperty<Vector2>,
  providedOptions: ConductivityTesterNodeOptions // tandem is required
)
```

All four positions are in the model coordinate frame; `positionProperty` is the bottom-center of the bulb, and moving it translates both probes with it (their relative offset is preserved).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `modelViewTransform` | identity | Projects all four model positions into view coordinates |
| `probeSize` | `Dimension2(20, 68)` | Shared dimensions for both probe plates |
| `probeDragYRange` | `null` | If set, constrains how far probes can be dragged vertically relative to `positionProperty`, in view coordinates; `null` means unconstrained |
| `positiveProbeFill` / `negativeProbeFill` | `'red'` / `'black'` | Probe plate colors |
| `bulbToBatteryWireLength` | `40` | View-coordinate length of the wire between bulb and battery |
| `keyboardDragListenerOptions` | — | Forwarded to the shared `KeyboardDragListener` that moves both probes together |

## Instance API

| Member | Effect |
| --- | --- |
| `shortCircuit` *(getter/setter)* | Shows/hides a "Short Circuit" label above the bulb; it's the caller's responsibility to also set `brightnessProperty` appropriately when toggling this |

::: warning The two probes always drag together, vertically only
`ConductivityTesterNode` wires **one** `DragListener` to both probes (`positiveProbe` and `negativeProbe` share `probeDragListener`/`probeKeyboardDragListener`), and that listener only ever changes their shared y-coordinate — there's no way to drag the probes independently or horizontally with the built-in listeners. If your sim needs independently movable probes, you'll need to compose your own probe graphics rather than repurposing this Node's drag behavior.
:::
