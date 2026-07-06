---
title: ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject
description: The scenery Node that hosts a fixed-size three.js viewport, and the mixin/PhetioObject pair used to give individual three.js objects a PhET-iO address.
category: api
library: mobius
tags: [mobius, ThreeNode, ThreeInstrumentable, ThreeObject3DPhetioObject, three.js, phet-io]
status: verified
prerequisites:
  - /api/mobius/scene-and-camera-setup
  - /examples/three-js-integration
related:
  - /api/mobius/scene-and-camera-setup
  - /api/mobius/three-isometric-node
  - /api/mobius/three-utils-helpers
  - /patterns/phet-io-instrumentation-pattern
  - /examples/three-js-integration
  - /api/tandem/phetio-object
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject

These three exports from `scenerystack/mobius` solve two related but distinct problems: getting a three.js viewport onto the scenery scene graph at all (`ThreeNode`), and giving individual `THREE.Object3D` instances placed inside that viewport a PhET-iO identity (`ThreeInstrumentable` + `ThreeObject3DPhetioObject`).

## `ThreeNode`: a fixed-size three.js viewport

`ThreeNode` extends `scenerystack/scenery`'s `Node` and hosts one `ThreeStage` (see [ThreeStage](/api/mobius/scene-and-camera-setup)) at a fixed `width`/`height`, embedding the stage's renderer `<canvas>` via a `DOM` node (`preventTransform: true`, `pickable: false`) so scenery never tries to CSS-transform the canvas itself. It's the "content sits at one place in the scene graph" counterpart to `ThreeIsometricNode`, which instead takes over an entire `ScreenView`'s layout bounds with isometric scaling (that's the Node `MobiusScreenView` sets up for you — see [Three.js Integration](/examples/three-js-integration)). Use `ThreeNode` directly when you want 3D content as one ordinary-sized child among other scenery Nodes, rather than a full-screen 3D backdrop.

```ts
import { ThreeNode, THREE } from 'scenerystack/mobius';
import { Vector3 } from 'scenerystack/dot';

const threeNode = new ThreeNode( 400, 300, {
  cameraPosition: new Vector3( 0, 0, 3 )
} );

const geometry = new THREE.SphereGeometry( 0.5, 32, 16 );
const material = new THREE.MeshNormalMaterial();
threeNode.stage.threeScene.add( new THREE.Mesh( geometry, material ) );
threeNode.stage.threeScene.add( new THREE.DirectionalLight( 0xffffff, 1 ) );

// Call once the Node's transform/position in the global scene is settled...
threeNode.layout();
// ...and on every animation frame:
threeNode.render();
```

### `ThreeNode` constructor

```ts
new ThreeNode( width: number, height: number, providedOptions?: ThreeNodeOptions )
```

`ThreeNodeOptions` = `{ fov?: number }` (default `50`) plus every `ThreeStageOptions` (`cameraPosition`, `backgroundColorProperty`, `threeRendererOptions`, `threeRendererPixelRatio` — forwarded straight to the internal `ThreeStage`) plus ordinary `NodeOptions`.

| Member | Description |
| --- | --- |
| `stage` | The `ThreeStage` this Node hosts — add `THREE.Object3D`s to `stage.threeScene` |
| `backgroundEventTarget` | A `Rectangle` sized to `width`×`height`, added as the first child, for capturing drags/clicks that don't hit specific 3D content |
| `projectPoint( Vector3 )` → `Vector2` | Delegates to `stage.projectPoint` |
| `layout()` | Recomputes the stage's pixel dimensions from this Node's current global bounds and repositions the embedded canvas; call after any transform change |
| `render( target? )` | Renders the stage (`autoClear: true`) |
| `dispose()` | Disposes the `stage` |

## Instrumenting individual three.js objects

`ThreeNode`/`ThreeIsometricNode` give the *viewport* a place in the scene graph, but a `THREE.Object3D` you add to `stage.threeScene` (a `THREE.Mesh`, `THREE.Group`, etc.) is not itself a scenery `Node` or a `PhetioObject` — three.js has no concept of PhET-iO. `ThreeObject3DPhetioObject` and the `ThreeInstrumentable` mixin exist to attach a PhET-iO identity to such objects by composition, so PhET-iO Studio can see and select them in the tree.

```ts
import { ThreeInstrumentable, THREE } from 'scenerystack/mobius';

const InstrumentedMesh = ThreeInstrumentable( THREE.Mesh );

const sphere = new InstrumentedMesh( geometry, material, {
  tandem: tandem.createTandem( 'sphereMesh' )
} );
threeNode.stage.threeScene.add( sphere );
// sphere.phetioObject is the underlying ThreeObject3DPhetioObject.
```

### `ThreeObject3DPhetioObject`

```ts
new ThreeObject3DPhetioObject( providedOptions?: PhetioObjectOptions )
```

A `PhetioObject` subclass with no extra state of its own: `phetioType` defaults to its own `ThreeObject3DIO`, and `tandem` defaults to `Tandem.REQUIRED` (you must supply one). It's meant to be held *by composition* inside a three.js object, not extended.

### `ThreeInstrumentable( type )`

A memoized mixin function: `ThreeInstrumentable( SomeThreeClass )` returns a subclass of `SomeThreeClass` whose constructor takes the usual three.js constructor arguments plus a trailing `PhetioObjectOptions` object, and which exposes a `phetioObject: ThreeObject3DPhetioObject` (constructed from those options). Its overridden `dispose()` calls the wrapped type's own `dispose()` first, then disposes `phetioObject`.

| Member | Description |
| --- | --- |
| `phetioObject` | The `ThreeObject3DPhetioObject` instrumented for this instance |
| `dispose()` | Calls the wrapped type's own `dispose()` first (if present), then disposes `phetioObject` |

::: warning Instrumenting a three.js object does not capture its state
`ThreeObject3DIO`'s `toStateObject`/`stateSchema` are both empty (`{}`) — wrapping a `THREE.Object3D` with `ThreeInstrumentable` only gives it an address in the PhET-iO tree for Studio to select and reference. It does **not** serialize or restore position, rotation, material, or any other three.js state on PhET-iO save/load. If your sim needs 3D object state to survive a state restore, you must model that state separately (e.g. as `Property`s on your own model) and use it to drive the three.js object, rather than relying on this instrumentation.
:::
