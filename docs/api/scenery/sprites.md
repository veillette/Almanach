---
title: Sprites, Sprite, SpriteImage, and SpriteSheet
description: The high-performance rendering system for drawing many instances of a small set of images in a single Node, instead of one scenery Node per instance.
category: api
library: scenery
tags: [scenery, Sprites, Sprite, SpriteImage, SpriteSheet, SpriteInstance, performance, particles, webgl, canvas]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/image
  - /api/scenery/visual-filters
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Sprites, Sprite, SpriteImage, and SpriteSheet

`Sprites` (from `scenerystack/scenery`) is a single `Node` that draws a large number of image instances — hundreds or thousands of particles, molecules, coins, whatever — with far less overhead than giving each instance its own [`Image`](/api/scenery/image) `Node`. Where an ordinary scene graph pays a per-Node cost for transforms, bounds, and picking, `Sprites` collapses an entire population of same-looking-but-differently-placed images into one `Node` and one WebGL/Canvas draw call, driven by a plain array you mutate directly rather than a tree of children.

The pieces work together like this: a `Sprite` wraps a `SpriteImage` (the actual pixel content plus a center offset); a `SpriteInstance` is a lightweight, poolable record of "this sprite, at this matrix, with this alpha"; and `Sprites` is the `Node` that takes an array of `Sprite`s and an array of `SpriteInstance`s and paints them all. `SpriteSheet` is a lower-level utility (a single Canvas/WebGL texture packing multiple source images together) that most sim code won't touch directly — it exists so custom WebGL drawables can batch several distinct images into one texture.

```ts
import { Sprites, Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';
import { Bounds2 } from 'scenerystack/dot';

// Build one Sprite from a loaded image, offset so (0,0) is the image's center.
const particleImage: HTMLImageElement = document.createElement( 'img' ); // in practice, an already-loaded image
const particleSpriteImage = new SpriteImage( particleImage, new Vector2( particleImage.width / 2, particleImage.height / 2 ) );
const particleSprite = new Sprite( particleSpriteImage );

// Create (or pool-fetch) one SpriteInstance per on-screen particle.
const instances: SpriteInstance[] = [];
for ( let i = 0; i < 500; i++ ) {
  const instance = SpriteInstance.pool.fetch();
  instance.sprite = particleSprite;
  instance.transformType = SpriteInstanceTransformType.TRANSLATION;
  instance.matrix.setToTranslation( Math.random() * 400, Math.random() * 400 );
  instances.push( instance );
}

const spritesNode = new Sprites( {
  sprites: [ particleSprite ],
  spriteInstances: instances,
  canvasBounds: new Bounds2( 0, 0, 400, 400 )
} );

// After mutating positions in the model's step function:
instances.forEach( instance => instance.matrix.setToTranslation( /* new x */ 0, /* new y */ 0 ) );
spritesNode.invalidatePaint(); // tell Sprites to repaint with the updated matrices
```

## `Sprite`

`new Sprite( spriteImage: SpriteImage )` wraps a `SpriteImage` in a mutable `imageProperty`, so the same `Sprite` object referenced by many `SpriteInstance`s can have its underlying image swapped (e.g. regenerated at a different resolution) without touching every instance. `Sprite` exposes `getShape()` and `containsPoint( point )`, both delegating to the current `SpriteImage`.

## `SpriteImage`

`new SpriteImage( image, offset: Vector2, providedOptions? )` — `image` is an `HTMLImageElement` or `HTMLCanvasElement` (or a `TReadOnlyProperty` of one), and `offset` is the 2D point (in image pixels, top-left origin) that should be treated as the sprite's local "center" — this is what a `SpriteInstance`'s matrix positions.

| Option | Default | Effect |
| --- | --- | --- |
| `hitTestPixels` | `false` | If `true`, hit-testing uses the actual non-transparent pixels instead of the full rectangular bounds |
| `pickable` | `true` | Whether this image participates in hit-testing at all |

## `SpriteInstance`

`SpriteInstance` is deliberately a bare data container, not something you subclass or configure via options — instances are meant to be created via `SpriteInstance.pool.fetch()` and mutated directly for performance, then returned with `freeToPool()` when no longer needed.

| Field | Meaning |
| --- | --- |
| `sprite` | The `Sprite` to display for this instance (`null` means nothing is drawn) |
| `matrix` | A `Matrix3` positioning this instance; mutate it directly rather than replacing it |
| `transformType` | A `SpriteInstanceTransformType` telling `Sprites` how much of `matrix` to trust — see below |
| `alpha` | Per-instance opacity, `0` to `1` |

`SpriteInstanceTransformType` has four values, each a performance/flexibility tradeoff: `TRANSLATION` (fastest — only `matrix`'s translation is used), `TRANSLATION_AND_SCALE`, `TRANSLATION_AND_ROTATION`, and `AFFINE` (slowest — the full matrix is respected). Pick the cheapest one that describes how your instances actually move.

## `Sprites` options

| Option | Default | Effect |
| --- | --- | --- |
| `sprites` | `[]` | The fixed set of `Sprite`s this Node can draw; cannot be changed after construction |
| `spriteInstances` | `[]` | The array of `SpriteInstance`s to paint, in order (later entries draw on top); mutate this array in place |
| `canvasBounds` | — | The `Bounds2` scenery uses for layout/repainting/hit-testing fallback — must cover everywhere the sprites actually draw, or content can be clipped |
| `hitTestSprites` | `false` | If `true`, picking calls each instance's `containsPoint()`; if `false`, any point inside `canvasBounds` counts as a hit |
| `renderer` | `'webgl'` | `Sprites` defaults to WebGL rendering (unlike most Nodes), since that's normally why you'd reach for it; Canvas is also supported |

## Updating what's drawn

Because `spriteInstances` is a plain array you mutate directly (add, remove, or change `sprite`/`matrix`/`alpha` on existing entries), `Sprites` has no automatic dirty-tracking — call `invalidatePaint()` after any change you want reflected on the next frame.

::: tip Sprites exists for populations too large for one Node each
If you have a handful of images, ordinary [`Image`](/api/scenery/image) Nodes in the scene graph are simpler and get you free input handling, layout participation, and per-Node transforms. Reach for `Sprites` specifically when the population is large enough (hundreds-plus, changing every frame) that per-Node overhead becomes the bottleneck — it trades scene-graph convenience for one big, hand-managed draw call.
:::

::: warning `canvasBounds` is not computed automatically
Unlike most Nodes, `Sprites` has no way to infer its own bounds from its content — you must set `canvasBounds` yourself (initially via the option, or later via `setCanvasBounds()`) to a region that covers every instance's drawn extent, and keep it updated as instances move.
:::
