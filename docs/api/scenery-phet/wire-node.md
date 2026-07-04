---
title: WireNode
description: A cubic-bezier wire Path that continuously reconnects two moving points, typically a ProbeNode and its readout body.
category: api
library: scenery-phet
tags: [scenery-phet, WireNode, wire, cable, circuit]
status: verified
related:
  - /api/scenery-phet/probe-node
  - /api/axon/multilink
  - /patterns/multilink-pattern
  - /api/axon/derived-property
prerequisites:
  - /api/scenery-phet/probe-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# WireNode

`WireNode` (from `scenerystack/scenery-phet`) is a `Path` subclass that draws a cubic Bezier curve between two positions and keeps redrawing it as either position changes — the classic use is visually connecting a `ProbeNode` to the body that shows its reading, but it works for any two moving endpoints (including circuit-style connections between components).

```ts
import { WireNode } from 'scenerystack/scenery-phet';
import { DerivedProperty } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';
```

## A minimal example

```ts
// Typically these are DerivedProperties following the probe/body Nodes' translations.
const probePositionProperty = new DerivedProperty( [ probeNode.boundsProperty ], () => probeNode.centerBottom );
const probeNormalProperty = new DerivedProperty( [], () => new Vector2( 0, 50 ) );

const bodyPositionProperty = new DerivedProperty( [ bodyNode.boundsProperty ], () => bodyNode.centerTop );
const bodyNormalProperty = new DerivedProperty( [], () => new Vector2( 0, -50 ) );

const wireNode = new WireNode(
  probePositionProperty, probeNormalProperty,
  bodyPositionProperty, bodyNormalProperty,
  { stroke: 'gray', lineWidth: 3 }
);
```

## Constructor

```ts
new WireNode(
  position1Property: TReadOnlyProperty<Vector2>,
  normal1Property: TReadOnlyProperty<Vector2>,
  position2Property: TReadOnlyProperty<Vector2>,
  normal2Property: TReadOnlyProperty<Vector2>,
  options?: WireNodeOptions
)
```

`positionXProperty` is where that end of the wire attaches. `normalXProperty` is **not** a second point — it's an offset (a vector, in the same coordinate frame) added to `positionXProperty` to get the cubic curve's control point at that end, which is what gives the wire its droop/curve direction and how pronounced it is. `WireNode` internally wires up a `Multilink` across all four Properties and recomputes its `shape` whenever any of them changes.

## Options

`WireNodeOptions` is just `PathOptions` (no wire-specific self options beyond the constructor arguments above); the one default `WireNode` sets is:

| Option | Default | Effect |
| --- | --- | --- |
| `stroke` | `'black'` | Color of the wire |

::: tip The "normal" is a control-point offset, not a direction to normalize
Despite the name, `normal1Property`/`normal2Property` values are used directly as `position.plus( normal )` to compute the cubic curve's control points — their magnitude controls how far the curve bulges out before bending toward the other end, not just its direction. A `Vector2(0, 50)` and a `Vector2(0, 5)` point the same way but produce very differently shaped wires.
:::
