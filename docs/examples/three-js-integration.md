---
title: Three.js Integration
description: Embedding a Three.js WebGL scene inside a scenery Node.
category: examples
tags: [example, three.js, webgl]
status: verified
related:
  - /getting-started/your-first-simulation
  - /patterns/model-view-separation
  - /api/dot/vector2
  - /api/dot/vector3
prerequisites:
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://github.com/phetsims/mobius
---

# Three.js Integration

SceneryStack's WebGL/3D integration layer is **mobius** (`scenerystack/mobius`), a thin bridge that embeds a real `THREE.Scene`/`THREE.PerspectiveCamera`/`THREE.WebGLRenderer` (mobius re-exports `three` itself as `THREE`, so no separate `three` dependency is needed) inside a scenery `Node`, so 3D content can sit in the scene graph next to ordinary 2D controls. This page walks through the joist-integrated path: subclassing `MobiusScreenView`, which wires up an isometric 3D stage (`ThreeIsometricNode`) as part of the `ScreenView` for you.

## Subclassing MobiusScreenView

`MobiusScreenView` (exported from `scenerystack/sim`, alongside `Sim`/`Screen`/`ScreenView` — see the [warning in Your First Simulation](/getting-started/your-first-simulation)) extends `ScreenView` and creates `this.sceneNode`, a `ThreeIsometricNode` sized to the screen's `layoutBounds`. Its own `step()` re-renders the 3D stage every frame, so a subclass only needs to add THREE objects to the scene and animate them:

```ts
import { MobiusScreenView, type MobiusScreenViewOptions } from 'scenerystack/sim';
import { THREE } from 'scenerystack/mobius';
import { Vector3 } from 'scenerystack/dot';

class CubeScreenView extends MobiusScreenView {
  private readonly cube: THREE.Mesh;

  public constructor( providedOptions: MobiusScreenViewOptions ) {
    super( providedOptions );

    // this.sceneNode (a ThreeIsometricNode) and this.sceneNode.stage.threeScene
    // come from MobiusScreenView - no separate Display/renderer setup needed.
    const geometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
    const material = new THREE.MeshNormalMaterial();
    this.cube = new THREE.Mesh( geometry, material );
    this.sceneNode.stage.threeScene.add( this.cube );

    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 1, 1 );
    this.sceneNode.stage.threeScene.add( light );
  }

  public override step( dt: number ): void {
    // Animate before the superclass call, which is what actually re-renders the stage.
    this.cube.rotation.x += dt;
    this.cube.rotation.y += dt * 0.6;

    super.step( dt );
  }
}
```

`ThreeIsometricNode`'s constructor also accepts a `cameraPosition` (a `Vector3`, forwarded from `MobiusScreenViewOptions.sceneNodeOptions`) if the default isometric framing doesn't suit your content:

```ts
const cubeScreen = new CubeScreenView( {
  sceneNodeOptions: {
    cameraPosition: new Vector3( 0, 0.4, 2 )
  },
  tandem: screenTandem.createTandem( 'view' )
} );
```

## Wiring it into a Screen

Otherwise, a mobius-backed screen is an ordinary `Screen` — the model doesn't need to know THREE.js exists at all:

```ts
import { Screen } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

class CubeModel {
  public reset(): void { /* no state in this minimal example */ }
  public step( dt: number ): void { /* handled in the view for this example */ }
}

const screenTandem = Tandem.ROOT.createTandem( 'cubeScreen' );

const cubeScreen = new Screen(
  () => new CubeModel(),
  model => new CubeScreenView( { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Cube' ),
    backgroundColorProperty: new Property( 'black' ),
    tandem: screenTandem
  }
);
```

::: tip Checked against source, not against a running sim
Every class, method, and option shown here (`MobiusScreenView.sceneNode`/`step`/`showWebGLWarning`, `ThreeIsometricNode.stage`, `ThreeStage.threeScene`, `cameraPosition` on `ThreeIsometricNodeOptions` via `ThreeStageOptions`, mobius's re-export of `three` as `THREE`, and `phet.joist.sim.dimensionProperty` feeding `MobiusScreenView.layout()`) was independently confirmed against the real `mobius`/`joist` source, not just this page's own prior claims. What hasn't been exercised is the actual rendered output in a browser — the isometric camera framing and animation timing are worth a visual check in a running sim before relying on exact values.
:::

## Where to go next

- [Your First Simulation](/getting-started/your-first-simulation) — the `Sim`/`Screen`/`ScreenView` shell this example builds on
- [Vector3](/api/dot/vector3) — the type used for 3D camera and mesh positions
- [Standalone Scenery App Example](/examples/standalone-scenery-app-example) — running scenery (and, in principle, mobius) without a `Sim` at all
