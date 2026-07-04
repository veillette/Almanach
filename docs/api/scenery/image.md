---
title: Image
description: A Node that renders a raster image with optional Property-driven swapping.
category: api
library: scenery
tags: [scenery, Image, mipmap]
status: complete
related:
  - /api/scenery/node
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Image

`Image` (from `scenerystack/scenery`) is a [`Node`](/api/scenery/node) that displays a single raster image, accepting a URL string, an `HTMLImageElement`, an `HTMLCanvasElement`, or a mipmap data structure (`ImageableImage`).

```ts
import { Image } from 'scenerystack/scenery';

const icon = new Image( '/assets/icon.png', {
  scale: 0.5,
  imageOpacity: 0.9
} );

icon.image = '/assets/icon-hover.png'; // swap the displayed image later
```

## Swapping the image via a Property

Pass a `TReadOnlyProperty<ImageableImage>` directly as the constructor argument (or as the `imageProperty` option) to have the displayed image track a `Property`, e.g. for theme or state-driven artwork:

```ts
import { Image } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';

const sourceProperty = new Property<string>( '/assets/switch-off.png' );
const switchImage = new Image( sourceProperty );

sourceProperty.value = '/assets/switch-on.png'; // switchImage updates automatically
```

## Options

| Option | Effect |
| --- | --- |
| `image` | The image source: a URL string, `HTMLImageElement`, `HTMLCanvasElement`, or mipmap array |
| `imageProperty` | Sets forwarding of the image source from a `TReadOnlyProperty<ImageableImage>` |
| `imageOpacity` | Opacity applied to just this image (not its children), in `[0, 1]` |
| `imageBounds` | Overrides what region of the image is considered "inside" for bounds/hit-testing purposes |
| `initialWidth`, `initialHeight` | Placeholder dimensions to use for layout before the image has finished loading |
| `mipmap` | Whether mipmapped rendering is enabled, trading memory for smoother minification |
| `mipmapBias`, `mipmapInitialLevel`, `mipmapMaxLevel` | Fine-tune mipmap generation and level selection |
| `hitTestPixels` | Whether hit-testing should respect per-pixel transparency instead of the bounding rectangle |

`Image` also accepts the full set of [`Node` options](/api/scenery/node).

::: tip Give not-yet-loaded images a size
If an image URL hasn't finished loading when a layout container ([`FlowBox`](/api/scenery/flow-box), [`GridBox`](/api/scenery/grid-box)) measures it, its bounds will be empty and layout will shift once it loads. Set `initialWidth`/`initialHeight` to the image's known final dimensions to reserve the right amount of space up front.
:::
