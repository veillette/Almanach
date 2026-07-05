---
title: BucketFront and BucketHole
description: The two view Nodes that render a phetcommon Bucket model — a hole behind draggable contents and a front in front of them.
category: api
library: scenery-phet
tags: [scenery-phet, BucketFront, BucketHole, bucket, drag-and-drop]
status: complete
related:
  - /api/phetcommon/bucket
  - /api/phetcommon/model-view-transform
  - /api/scenery/node
prerequisites:
  - /api/phetcommon/bucket
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BucketFront and BucketHole

`BucketFront` and `BucketHole` (both from `scenerystack/scenery-phet`) are the two view halves of the "bucket" UI element used across PhET sims for dragging model objects (atoms, balls, particles) in and out of a container. Together they create the illusion of depth: `BucketHole` is added to the scene graph *behind* the draggable contents, and `BucketFront` is added *in front* of them, so a dragged object visually passes "into" the bucket's opening as it's released.

Both Nodes are purely presentational — they read their shape, position, and colors from a [`Bucket`](/api/phetcommon/bucket) model instance (or a subclass like `SphereBucket`) and a `ModelViewTransform2`, but do nothing on their own with the objects being dragged. That's on you (or a helper like a drag listener) to implement, typically by reparenting a dragged object's Node between "in front of `BucketHole`, behind `BucketFront`" and "in front of `BucketFront`" as it's picked up and released.

```ts
import { BucketFront, BucketHole } from 'scenerystack/scenery-phet';
import { Bucket } from 'scenerystack/phetcommon';
import { ModelViewTransform2 } from 'scenerystack/phetcommon';
import { Vector2, Dimension2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const bucket = new Bucket( {
  position: new Vector2( 0, 0 ),
  size: new Dimension2( 220, 60 ),
  baseColor: '#4d92c0',
  captionText: 'Atoms'
} );

const modelViewTransform = ModelViewTransform2.createIdentity();

const bucketHole = new BucketHole( bucket, modelViewTransform );
const bucketFront = new BucketFront( bucket, modelViewTransform );

// Layer order matters: hole first, then draggable contents, then front.
screenView.addChild( bucketHole );
screenView.addChild( atomsLayer ); // the draggable content Nodes
screenView.addChild( bucketFront );
```

::: tip The model class lives in `phetcommon`, not here
`Bucket` (and its contents-managing subclass `SphereBucket`) is exported from `scenerystack/phetcommon` and is entirely separate from these two view Nodes — see [`Bucket`](/api/phetcommon/bucket) for the model-side API (`holeShape`, `containerShape`, `addParticleFirstOpen()`, etc.). `BucketFront`/`BucketHole` never mutate the model; they only read its shapes and colors to draw themselves and reposition themselves at `bucket.position`.
:::

## Constructors

```ts
new BucketFront(
  bucket: Bucket,
  modelViewTransform: ModelViewTransform2,
  providedOptions?: BucketFrontOptions
)

new BucketHole(
  bucket: Bucket,
  modelViewTransform: ModelViewTransform2,
  providedOptions?: BucketHoleOptions
)
```

Both constructors set the Node's `translation` from `modelViewTransform.modelToViewPosition( bucket.position )` — you don't position them manually.

## BucketFront

`BucketFront` draws the tilted 3D-ish body of the bucket (`bucket.containerShape`, filled with a left-to-right gradient derived from `bucket.baseColor`) and a caption label centered on it.

| Option | Default | Effect |
| --- | --- | --- |
| `labelNode` | an owned `Text` showing `bucket.captionText` | Supply your own label Node instead of the default caption text |
| `gradientLuminanceLeft` | `0.5` | Luminance adjustment (`-1` to `1`) applied to `bucket.baseColor` for the left edge of the front's gradient |
| `gradientLuminanceRight` | `-0.5` | Luminance adjustment for the right edge |

| Member | Description |
| --- | --- |
| `bucket` | Public read-only reference to the `Bucket` model this Node renders |
| `setLabel( labelNode )` | Swaps out the label Node shown on the bucket's front, re-centering it |

## BucketHole

`BucketHole` draws `bucket.holeShape` as a dark elliptical `Path` with a gradient (always black-to-light-gray, independent of `bucket.baseColor`) and a thin stroke — it has no options of its own beyond standard `NodeOptions`.

::: warning Add `BucketHole` and `BucketFront` on either side of the draggable contents
Neither Node clips or layers its sibling automatically — the "objects go into the bucket" illusion only works if *you* add `bucketHole`, then the layer holding the draggable contents, then `bucketFront`, in that z-order. Getting the order wrong makes dragged objects appear to sit permanently on top of (or disappear behind) the bucket.
:::
