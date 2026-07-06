---
title: ThreeIsometricNode
description: A scenery Node that fills a ScreenView's layout bounds with an isometric-scaled three.js viewport for full-screen 3D content.
category: api
library: mobius
tags: [mobius, ThreeIsometricNode, ThreeNode, three.js, 3d, isometric]
status: verified
prerequisites:
  - /api/mobius/scene-and-camera-setup
  - /api/mobius/node-wrapping-conventions
related:
  - /api/mobius/node-wrapping-conventions
  - /examples/three-js-integration
  - /api/dot/bounds2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# ThreeIsometricNode

`ThreeIsometricNode` (from `scenerystack/mobius`) is the full-screen counterpart to [`ThreeNode`](/api/mobius/node-wrapping-conventions): instead of hosting a fixed-size three.js canvas as one child among other scenery Nodes, it takes a `ScreenView`'s `layoutBounds` and fills them with an isometric-scaled three.js viewport. `MobiusScreenView` and the [Three.js Integration](/examples/three-js-integration) example use this shape when 3D content is the primary backdrop for an entire screen.

```ts
import { ThreeIsometricNode } from 'scenerystack/mobius';
import { Bounds2 } from 'scenerystack/dot';
import { THREE } from 'scenerystack/mobius';

const threeIsometricNode = new ThreeIsometricNode( layoutBounds, {
  cameraPosition: new THREE.Vector3( 0, 0, 5 ),
  fov: 50
} );

threeIsometricNode.stage.threeScene.add( myMesh );
this.addChild( threeIsometricNode );
```

## Constructor

```ts
new ThreeIsometricNode( layoutBounds: Bounds2, providedOptions?: ThreeIsometricNodeOptions )
```

`ThreeIsometricNodeOptions` combines `NodeOptions` with `ThreeStageOptions` plus mobius-specific fields:

| Option | Default | Effect |
| --- | --- | --- |
| `fov` | `50` | Perspective camera field of view in degrees |
| `parentMatrixProperty` | identity `Matrix3` | Optional parent transform applied when projecting between screen and 3D space |
| `viewOffset` | `(0, 0)` | Pixel offset applied when mapping layout bounds to the embedded canvas |
| `getPhetioMouseHit` | `null` | Optional `( point: Vector2 ) => PhetioObject | null | 'phetioNotSelectable'` callback for PhET-iO Studio autoselect on background clicks |

Most `ThreeStageOptions` (`cameraPosition`, `backgroundColor`, `rendererParameters`, …) pass through to the internal [`ThreeStage`](/api/mobius/scene-and-camera-setup) the node constructs.

## Public members

| Member | Description |
| --- | --- |
| `stage` | The internal `ThreeStage` — add meshes/lights to `stage.threeScene` and read `stage.threeCamera` |
| `backgroundEventTarget` | A transparent `Rectangle` sized to `layoutBounds` that receives pointer events on empty background areas (useful for drag-to-rotate handlers) |

## When to use `ThreeIsometricNode` vs. `ThreeNode`

| Shape | Use when |
| --- | --- |
| `ThreeIsometricNode` | 3D fills (or dominates) an entire screen's layout bounds — typical mobius sim screens |
| `ThreeNode` | 3D is one fixed-size panel among other 2D UI — a small 3D preview, an inset viewport |

Both embed the renderer canvas via a `DOM` node with `preventTransform: true` so scenery never CSS-transforms the WebGL surface directly.
