---
title: ThreeStage
description: The three.js scene, camera, and WebGLRenderer that every mobius 3D view is built around.
category: api
library: mobius
tags: [mobius, ThreeStage, three.js, webgl, 3d]
status: verified
prerequisites:
  - /getting-started/what-is-scenerystack
  - /getting-started/scenery-application-vs-standalone-library
related:
  - /api/mobius/three-utils-helpers
  - /api/mobius/node-wrapping-conventions
  - /examples/three-js-integration
  - /api/dot/vector3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ThreeStage

`ThreeStage` (from `scenerystack/mobius`) encapsulates the three main three.js primitives needed to render a 3D scene: a `THREE.Scene`, a `THREE.PerspectiveCamera`, and (when WebGL is available) a `THREE.WebGLRenderer`. It is a plain class, not a scenery `Node` — the two Nodes that actually place mobius content in a scene graph, `ThreeNode` and `ThreeIsometricNode`, each construct one `ThreeStage` internally and embed its renderer's `<canvas>` via a `DOM` node (see [ThreeNode and Object3D Instrumentation](/api/mobius/node-wrapping-conventions)). `ThreeStage` is where camera position, background color, dimensions, and screen-space/3D-space projection all live.

```ts
import { ThreeStage, THREE } from 'scenerystack/mobius';
import { Vector3 } from 'scenerystack/dot';
import { Color } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const stage = new ThreeStage( {
  cameraPosition: new Vector3( 0, 0, 5 ),
  backgroundColorProperty: new Property( new Color( 'black' ) )
} );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh( geometry, material );
stage.threeScene.add( cube );

stage.threeScene.add( new THREE.DirectionalLight( 0xffffff, 1 ) );

stage.setDimensions( 400, 300 );
stage.render( undefined, true );
```

In an actual scenery-based sim you would not construct a bare `ThreeStage` like this — you'd get one for free from `ThreeNode`/`ThreeIsometricNode` (`someThreeNode.stage`), as shown in [Three.js Integration](/examples/three-js-integration). This snippet shows the pieces `ThreeStage` itself owns.

## Constructor

```ts
new ThreeStage( providedOptions?: ThreeStageOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `backgroundColorProperty` | `new Property( Color.BLACK )` | `TReadOnlyProperty<Color>` — sets `threeRenderer`'s clear color/alpha whenever it changes |
| `cameraPosition` | `new Vector3( 0, 0, 10 )` | Initial position of `threeCamera` |
| `threeRendererOptions` | `{ antialias, alpha: true, preserveDrawingBuffer }`, with `antialias`/`preserveDrawingBuffer` sourced from `MobiusQueryParameters` (`threeRendererAntialias`, `threeRendererPreserveDrawingBuffer`) — `alpha` is always hardcoded `true` | Forwarded to `new THREE.WebGLRenderer(...)` |
| `threeRendererPixelRatio` | from `MobiusQueryParameters` | Forwarded to `threeRenderer.setPixelRatio(...)` |

## Properties and methods

| Member | Description |
| --- | --- |
| `threeScene` | `THREE.Scene` — add your `THREE.Object3D`s (meshes, lights, groups) here |
| `threeCamera` | `THREE.PerspectiveCamera` — `near`/`far` are fixed to `1`/`100`; `fov`/`aspect` are set by the hosting Node |
| `threeRenderer` | `THREE.WebGLRenderer \| null` — `null` if WebGL isn't available (see `ThreeUtils.isWebGLEnabled()`) |
| `canvasWidth` / `canvasHeight`, `width`/`height` getters | Current renderer dimensions |
| `activeScale` | Scale factor applied to non-screen-coordinate interactions (e.g. rotation drags); maintained by the hosting Node's layout |
| `dimensionsChangedEmitter` / `contextLostEmitter` / `contextRestoredEmitter` | `TEmitter`s for size changes and WebGL context loss/restore |
| `setDimensions( width, height )` | Sets `canvasWidth`/`canvasHeight`, resizes the renderer, calls `threeCamera.updateProjectionMatrix()`, and fires `dimensionsChangedEmitter` — it does **not** itself change `threeCamera.aspect`; the hosting Node (or `adjustViewOffset`) is responsible for that |
| `render( target, autoClear )` | Renders `threeScene`/`threeCamera` into `target` (or the canvas, if `target` is `undefined`) |
| `renderToCanvas( supersampleMultiplier?, backingMultiplier?, scale? )` | Renders offscreen into a returned `HTMLCanvasElement` (used for screenshots) |
| `projectPoint( Vector3 )` → `Vector2` | Projects a 3D world point to a 2D global (screen) point |
| `unprojectPoint( Vector2, modelZ? )` → `Vector3` | Projects a 2D screen point back into the 3D scene at a given model z |
| `getRayFromScreenPoint( Vector2 )` → `Ray3` | Returns the camera ray through a given screen point (useful for picking) |
| `adjustViewOffset( cameraBounds: Bounds2 )` | Shifts the camera's projection view offset so its output lines up with `cameraBounds` — used internally for isometric layout/pan/zoom |
| `ThreeStage.computeIsometricFOV( fov, canvasWidth, canvasHeight, layoutWidth, layoutHeight )` | Static helper computing the FOV needed to keep isometric content correctly scaled across aspect ratios |
| `dispose()` | Disposes `threeRenderer` and `threeScene`, unlinks `backgroundColorProperty` |

::: warning `threeRenderer` can be `null`
`ThreeStage` only creates a `THREE.WebGLRenderer` if `ThreeUtils.isWebGLEnabled()` returns true at construction time. Every renderer-touching call in `ThreeStage` itself already guards with `this.threeRenderer && ...` — if you call `threeRenderer` methods directly from your own code, guard the same way rather than assuming WebGL is always available.
:::
