---
title: Bucket
description: The model for a container UI element that other model objects can be dropped into and stacked within, as used in build-a-molecule-style sims.
category: api
library: phetcommon
tags: [phetcommon, Bucket, SphereBucket, model]
status: verified
prerequisites:
  - /api/tandem/phetio-object
related:
  - /api/phetcommon/model-view-transform
  - /api/phetcommon/string-utils
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Bucket

`Bucket` (from `scenerystack/phetcommon`) is the model half of the "bucket" UI element seen across PhET sims — a container drawn with a 3D-ish tilted opening that other model objects (atoms, molecules, balls) can be dragged out of and back into. `Bucket` itself only computes shapes and stores presentation data (position, size, colors, caption); it defines no notion of "contents," which is deliberately left to a subclass. It extends `PhetioObject` (from `scenerystack/tandem`), so a `Bucket` can be instrumented for PhET-iO like any other model element.

```ts
import { Bucket } from 'scenerystack/phetcommon';
import { Vector2, Dimension2 } from 'scenerystack/dot';

const bucket = new Bucket( {
  position: new Vector2( 0, 0 ),
  size: new Dimension2( 220, 60 ),
  baseColor: '#4d92c0',
  captionText: 'Atoms'
} );

// Shapes are computed at construction time from position/size:
bucket.holeShape;      // the elliptical "opening" of the bucket
bucket.containerShape; // the tilted 3D-ish body of the bucket
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `position` | `Vector2.ZERO` | Model position of the **center of the bucket's opening** — not the bottom or the visual center, since that's the point other code most often needs to align against |
| `size` | `Dimension2( 200, 50 )` | Overall dimensions used to derive `holeShape` and `containerShape` |
| `baseColor` | `'#ff0000'` | Base fill color for the bucket body (a view reads this to style itself) |
| `captionText` | `''` | Label text (plain string or `TReadOnlyProperty<string>` for translated/dynamic captions) |
| `captionColor` | `'white'` | Color for the caption text |
| `invertY` | `false` | Flips the bucket's shape vertically, for use with a y-down (inverted) model coordinate convention |

`Bucket` is a base class — the shapes it computes are for a view to render, but `Bucket` itself has no `addParticle`/`removeParticle`-style API for managing contents.

## Public state

| Member | Effect |
| --- | --- |
| `position` | The model position (mutable) of the bucket's opening center |
| `size` | The `Dimension2` used to compute the bucket's shapes |
| `holeShape` | A `Shape` (from `scenerystack/kite`) for the elliptical opening |
| `containerShape` | A `Shape` for the tilted body of the bucket |
| `baseColor`, `captionText`, `captionColor` | Presentation data for a view to read |

::: tip SphereBucket adds the actual contents-management API
`Bucket` only computes geometry — for a working bucket that spherical model objects can actually be added to, removed from, and stacked within (with automatic layout/relayout as items come and go), use `SphereBucket<Particle>` (also exported from `scenerystack/phetcommon`), which extends `Bucket` and adds `addParticleFirstOpen()`, `addParticleNearestOpen()`, `removeParticle()`, `extractClosestParticle()`, and `reset()`. It expects each particle to expose `positionProperty`, `destinationProperty`, `isDraggingProperty`, and `containerProperty` — see the `Spherical` type it's generic over.
:::

On the view side, `scenerystack/scenery-phet` exports matching `BucketFront` and `BucketHole` Nodes, which read a `Bucket`'s (or `SphereBucket`'s) `containerShape`/`holeShape`/colors/caption directly — `BucketHole` is drawn behind the draggable contents and `BucketFront` in front, so particles can appear to drop "into" the bucket.
