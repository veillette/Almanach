---
title: ThreeUtils
description: Static helpers for converting between dot and three.js vector types, building quad geometry, loading textures, and detecting WebGL support.
category: api
library: mobius
tags: [mobius, ThreeUtils, three.js, webgl, 3d]
status: complete
related:
  - /api/mobius/scene-and-camera-setup
  - /api/mobius/node-wrapping-conventions
  - /api/dot/vector3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ThreeUtils

`ThreeUtils` (from `scenerystack/mobius`) is a plain object of static helper functions (not a class you instantiate) that bridges SceneryStack's own `dot`/`scenery` types and three.js's equivalents, provides low-level vertex-buffer writers for building simple quad geometry, and exposes the WebGL-availability check that `ThreeStage` uses to decide whether to create a `WebGLRenderer` at all.

```ts
import { ThreeUtils } from 'scenerystack/mobius';
import { Vector3 } from 'scenerystack/dot';
```

## A minimal example

```ts
// Guard before doing any WebGL-dependent setup.
if ( ThreeUtils.isWebGLEnabled() ) {
  const modelPosition = new Vector3( 1, 2, 3 );
  mesh.position.copy( ThreeUtils.vectorToThree( modelPosition ) );
}

// Build a single front-facing quad's position buffer, e.g. for a custom BufferGeometry.
import { Bounds2 } from 'scenerystack/dot';
const positions = ThreeUtils.frontVertices( new Bounds2( -1, -1, 1, 1 ), 0 );
geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
```

## Methods

| Member | Description |
| --- | --- |
| `vectorToThree( vector: Vector3 )` → `THREE.Vector3` | Converts a dot `Vector3` to a three.js vector |
| `threeToVector( vector: THREE.Vector3 )` → `Vector3` | The inverse conversion |
| `colorToThree( color: Color )` → `THREE.Color` | Converts a scenery `Color` to a three.js color |
| `frontVertices( bounds2: Bounds2, z )` → `Float32Array` | Vertices for a quad facing the camera (+z), spanning `bounds2` in x/y |
| `topVertices( bounds2: Bounds2, y )` → `Float32Array` | Vertices for an up-facing quad, spanning `bounds2` in x/z |
| `rightVertices( bounds2: Bounds2, x )` / `leftVertices( bounds2: Bounds2, x )` → `Float32Array` | Vertices for a right- or left-facing quad, spanning `bounds2` in z/y |
| `writeTriangle( array, index, x0, y0, z0, ..., x2, y2, z2 )` → `number` | Writes 9 floats (one triangle, counterclockwise winding) into `array` at `index`, returns the next free index |
| `writeQuad( array, index, ... 4 vertices ... )` → `number` | Writes 18 floats (two triangles) into `array`, returns the next free index |
| `textureLoader` (getter) | Singleton `THREE.TextureLoader`, created lazily on first access |
| `imageToTexture( image: HTMLImageElement, waitForLoad? )` → `THREE.Texture` | Loads a texture from an already-loaded `<img>`; pass `waitForLoad: true` to register an `asyncLoader` lock until it decodes |
| `isWebGLEnabled()` → `boolean` | `true` if the `webgl` query parameter allows it *and* `Utils.isWebGLSupported` — what `ThreeStage` checks before constructing a `WebGLRenderer` |

::: tip Check `isWebGLEnabled()` before assuming a renderer exists
`ThreeStage.threeRenderer` is only non-null when `ThreeUtils.isWebGLEnabled()` was true at construction time. Any code that builds textures, geometry, or renderer-dependent state outside of `ThreeStage` itself should perform the same check first, rather than assuming WebGL is always available (some embedding contexts and the `?webgl=false` query parameter can disable it).
:::
