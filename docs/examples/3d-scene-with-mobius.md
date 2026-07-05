---
title: A 3D Scene with Mobius
description: A worked example setting up a basic mobius 3D scene and camera two ways - a full-screen isometric stage via MobiusScreenView, and a fixed-size viewport via ThreeNode - built entirely from already-documented mobius classes.
category: examples
tags: [example, mobius, ThreeStage, ThreeNode, three.js, 3d, webgl]
status: complete
related:
  - /api/mobius/scene-and-camera-setup
  - /api/mobius/three-utils-helpers
  - /api/mobius/node-wrapping-conventions
  - /examples/three-js-integration
  - /api/dot/vector3
prerequisites:
  - /examples/three-js-integration
  - /api/mobius/scene-and-camera-setup
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://github.com/phetsims/mobius
---

# A 3D Scene with Mobius

[Three.js Integration](/examples/three-js-integration) already walks through the most common mobius setup — subclassing `MobiusScreenView` for a full-screen isometric 3D stage. [`ThreeStage`](/api/mobius/scene-and-camera-setup) and [`ThreeUtils`](/api/mobius/three-utils-helpers) document the lower-level pieces underneath that path. This page builds directly on both: it repeats the full-screen `MobiusScreenView` shape briefly for contrast, then focuses on the other common shape — a **fixed-size 3D viewport** (`ThreeNode`) placed as one ordinary child alongside 2D scenery content, which is the better fit when 3D content is a small part of a screen rather than its entire backdrop.

No new mobius APIs are introduced here beyond what [Three.js Integration](/examples/three-js-integration), [ThreeStage](/api/mobius/scene-and-camera-setup), and [ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject](/api/mobius/node-wrapping-conventions) already document.

## Option A: full-screen isometric stage (MobiusScreenView)

For 3D content that *is* the screen — the shape [Three.js Integration](/examples/three-js-integration) covers in depth — subclass `MobiusScreenView`, which builds a `ThreeIsometricNode` (`this.sceneNode`) sized to the screen automatically:

```ts
import { MobiusScreenView, type MobiusScreenViewOptions } from 'scenerystack/sim';
import { THREE } from 'scenerystack/mobius';

class OrbitScreenView extends MobiusScreenView {
  private readonly planet: THREE.Mesh;

  public constructor( providedOptions: MobiusScreenViewOptions ) {
    super( providedOptions );

    const geometry = new THREE.SphereGeometry( 0.4, 32, 16 );
    const material = new THREE.MeshNormalMaterial();
    this.planet = new THREE.Mesh( geometry, material );
    this.sceneNode.stage.threeScene.add( this.planet );
    this.sceneNode.stage.threeScene.add( new THREE.DirectionalLight( 0xffffff, 1 ) );
  }

  public override step( dt: number ): void {
    this.planet.rotation.y += dt * 0.5;
    super.step( dt ); // re-renders the stage
  }
}
```

Reach for this when 3D content occupies the whole screen and should pan/scale with the layout the way [Three.js Integration](/examples/three-js-integration) describes.

## Option B: a fixed-size viewport alongside 2D content (ThreeNode)

When 3D content is one element among ordinary scenery Nodes — a small rotating preview next to a control panel, say — [`ThreeNode`](/api/mobius/node-wrapping-conventions#threenode-a-fixed-size-three-js-viewport) is the better fit: it hosts its own `ThreeStage` at a fixed pixel size and behaves like any other Node for layout purposes.

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { VBox, Text } from 'scenerystack/scenery';
import { ThreeNode, THREE } from 'scenerystack/mobius';
import { Vector3 } from 'scenerystack/dot';
import { Checkbox } from 'scenerystack/sun';
import { BooleanProperty } from 'scenerystack/axon';

// The model itself has nothing 3D-specific about it - it just owns a Property the view reads.
class MoleculePreviewModel {
  public readonly rotationEnabledProperty = new BooleanProperty( true );
  public reset(): void {
    this.rotationEnabledProperty.reset();
  }
}

class MoleculePreviewScreenView extends ScreenView {
  private readonly model: MoleculePreviewModel;
  private readonly moleculeThreeNode: ThreeNode;
  private readonly moleculeMesh: THREE.Mesh;

  public constructor( model: MoleculePreviewModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );
    this.model = model;

    this.moleculeThreeNode = new ThreeNode( 300, 300, {
      cameraPosition: new Vector3( 0, 0, 3 )
    } );

    const geometry = new THREE.IcosahedronGeometry( 0.6, 0 );
    const material = new THREE.MeshNormalMaterial();
    this.moleculeMesh = new THREE.Mesh( geometry, material );
    this.moleculeThreeNode.stage.threeScene.add( this.moleculeMesh );
    this.moleculeThreeNode.stage.threeScene.add( new THREE.DirectionalLight( 0xffffff, 1 ) );

    // ThreeNode is a plain Node - it composes with ordinary 2D layout containers.
    const rotateCheckbox = new Checkbox( model.rotationEnabledProperty, new Text( 'Rotate' ), {
      tandem: this.tandem.createTandem( 'rotateCheckbox' )
    } );

    const controlsColumn = new VBox( {
      spacing: 10,
      align: 'left',
      children: [ this.moleculeThreeNode, rotateCheckbox ],
      center: this.layoutBounds.center
    } );

    this.children = [ controlsColumn ];

    // ThreeNode needs an explicit layout() call once its position in the global
    // scene graph is settled, unlike MobiusScreenView (which handles this for you).
    this.moleculeThreeNode.layout();
  }

  public step( dt: number ): void {
    if ( this.model.rotationEnabledProperty.value ) {
      this.moleculeMesh.rotation.y += dt;
    }
    this.moleculeThreeNode.render();
  }
}
```

A few things worth noticing:

| Piece | Why it's there |
| --- | --- |
| `ThreeNode( 300, 300, ... )` | A fixed pixel size, unlike `MobiusScreenView`'s screen-filling `ThreeIsometricNode` — see the constructor signature on [ThreeNode](/api/mobius/node-wrapping-conventions#threenode-constructor) |
| `moleculeThreeNode` as a `VBox` child | `ThreeNode` extends `scenery`'s `Node`, so it participates in [layout containers](/styling/layout-container-conventions) exactly like any 2D Node — no special-casing needed in the layout code |
| `.layout()` called once, explicitly | Recomputes the stage's pixel dimensions from the Node's current global bounds; call it again after any transform change that affects `moleculeThreeNode`'s placement, since (unlike `MobiusScreenView`) nothing calls it for you automatically |
| `.render()` called every `step()` | `ThreeNode` doesn't render itself on a timer — the hosting `ScreenView`'s `step(dt)` is responsible, the same as `MobiusScreenView.step()` does internally for its own stage |

## Instrumenting a mesh for PhET-iO, if needed

If a specific `THREE.Object3D` needs its own PhET-iO identity (so Studio can select or reference it), wrap its constructor with `ThreeInstrumentable` rather than trying to attach a `tandem` to the plain three.js object directly — three.js objects have no PhET-iO concept of their own (see [ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject](/api/mobius/node-wrapping-conventions#instrumenting-individual-three-js-objects)):

```ts
import { ThreeInstrumentable, THREE } from 'scenerystack/mobius';

const InstrumentedMesh = ThreeInstrumentable( THREE.Mesh );

const instrumentedMolecule = new InstrumentedMesh( geometry, material, {
  tandem: this.tandem.createTandem( 'moleculeMesh' )
} );
this.moleculeThreeNode.stage.threeScene.add( instrumentedMolecule );
```

This only gives PhET-iO Studio an address for the object to select — it does **not** save/restore its position or rotation on state restore; model that state as ordinary `Property`s if it needs to survive a PhET-iO save/load.

## Choosing between the two options

| Use `MobiusScreenView` (full-screen) | Use `ThreeNode` (fixed-size) |
| --- | --- |
| 3D content is the entire screen's subject | 3D content is a small part of a larger, mostly-2D screen |
| Isometric framing that adapts to the layout bounds is wanted | A fixed pixel footprint next to ordinary controls is wanted |
| No 2D scenery siblings need to share layout with the 3D content | The 3D viewport needs to sit inside a `VBox`/`HBox`/`Panel` with 2D Nodes |

::: tip Both paths share the same ThreeStage underneath
Whichever Node you reach for, the actual three.js objects (`THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer`) live on the same `ThreeStage` type — `.stage` is available on both `ThreeIsometricNode`/`MobiusScreenView.sceneNode` and `ThreeNode`. Anything documented on [ThreeStage](/api/mobius/scene-and-camera-setup) (projecting points, checking `isWebGLEnabled()`, disposing) works identically regardless of which hosting Node you chose.
:::

## Where to go next

- [Three.js Integration](/examples/three-js-integration) — the full-screen `MobiusScreenView` path in depth
- [ThreeStage](/api/mobius/scene-and-camera-setup) — the scene/camera/renderer object both options above share
- [ThreeUtils](/api/mobius/three-utils-helpers) — coordinate conversions and the `isWebGLEnabled()` guard
- [ThreeNode, ThreeInstrumentable, and ThreeObject3DPhetioObject](/api/mobius/node-wrapping-conventions) — the fixed-size viewport and PhET-iO instrumentation details used above
