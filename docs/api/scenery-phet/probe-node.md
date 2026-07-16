---
title: ProbeNode
description: A physical-looking sensor probe graphic — a circular sensing head on a handle — typically wired to a readout body via WireNode.
category: api
library: scenery-phet
tags: [scenery-phet, ProbeNode, sensor, probe]
status: verified
related:
  - /api/scenery-phet/wire-node
  - /styling/color-profiles
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ProbeNode

`ProbeNode` (from `scenerystack/scenery-phet`) draws a stylized, beveled sensor probe: a circular sensing head with a handle at the bottom, shaded with gradients to look physical. It was generalized out of Bending Light and Beer's Law Lab, where it's dragged around a scene and connected by a `WireNode` to a body that displays the reading. `ProbeNode` itself has no Property or reading logic — it's pure graphics, plus a slot (`sensorTypeFunction`) for what's drawn inside the circular sensor area.

```ts
import { ProbeNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const probeNode = new ProbeNode( {
  radius: 50,
  innerRadius: 35,
  sensorTypeFunction: ProbeNode.crosshairs( { intersectionRadius: 6 } ),
  cursor: 'pointer'
} );
```

The origin of a `ProbeNode` is the center of its circular sensor area, not its top-left bounding-box corner — useful to remember when positioning it against a model coordinate.

<SceneryDemo demo="probe-node" />

## Constructor

```ts
new ProbeNode( providedOptions?: ProbeNodeOptions )
```

There are no required positional arguments — everything, including size, is an option.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `50` | Outer radius of the circular sensor head |
| `innerRadius` | `35` | Radius of the cut-out sensor area inside the head (clamped to `<= radius`) |
| `handleWidth` | `50` | Width of the handle at the bottom |
| `handleHeight` | `30` | Height of the handle |
| `handleCornerRadius` | `10` | Corner radius of the handle |
| `lightAngle` | `1.35 * Math.PI` | Angle (radians) the simulated light comes from, used to place the gradient highlight; `0` is from the right, `PI/2` from the bottom — since scenery's y-axis points down, increasing angle rotates clockwise on screen (right → bottom → left → top) |
| `color` | `'#008541'` (dark green) | Base color of the probe body; all gradient shades are derived from it |
| `sensorTypeFunction` | `ProbeNode.glass()` | A `(radius) => Node` factory that produces what's drawn inside the sensor cut-out; pass `null` to leave it empty |

## Static factories for `sensorTypeFunction`

| Static member | Produces |
| --- | --- |
| `ProbeNode.glass( { centerColor, middleColor, edgeColor } )` | A radial-gradient "glass lens" look (the default) |
| `ProbeNode.crosshairs( { stroke, lineWidth, intersectionRadius } )` | A crosshairs pattern, with a gap at the center |
| `ProbeNode.DEFAULT_PROBE_NODE_OPTIONS` | The full set of default option values, useful for `combineOptions` when writing a custom `sensorTypeFunction` |

::: tip `lightAngle` is not auto-derived from the Node's rotation
Because `ProbeNode` can't reliably know its own global rotation within a scene graph, `lightAngle` must be set explicitly by whoever places it — it does not update automatically if you rotate the probe. PhET's convention is a light source from the upper-left, so rotate `lightAngle` to match however you've oriented this particular probe.
:::
