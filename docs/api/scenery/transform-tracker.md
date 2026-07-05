---
title: TransformTracker
description: Efficiently watches a Trail's cumulative transform for changes, without re-deriving it from scratch on every check.
category: api
library: scenery
tags: [scenery, TransformTracker, Trail, transform]
status: complete
related:
  - /api/scenery/trail
  - /api/scenery/drag-listener
  - /api/scenery/highlight-rendering
  - /api/scenery/node
prerequisites:
  - /api/scenery/trail
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TransformTracker

`TransformTracker` (from `scenerystack/scenery`) watches every Node along a [`Trail`](/api/scenery/trail) and notifies you when the trail's *cumulative* transform (the composed local-to-global matrix) changes — without recomputing the whole matrix chain from scratch each time. It caches the composed matrix and only recomputes the portion downstream of whichever Node actually changed, using a dirty index. Scenery uses it internally for exactly this reason: [`DragListener`](/api/scenery/drag-listener)'s `trackAncestors` option creates one to reposition a dragged Node when an ancestor moves, and the [highlight-rendering overlay](/api/scenery/highlight-rendering) uses one per active focus highlight to keep it aligned with the Node it surrounds.

```ts
import { TransformTracker } from 'scenerystack/scenery';

const trail = someNode.getUniqueTrail();
const tracker = new TransformTracker( trail );

tracker.addListener( () => {
  console.log( 'cumulative transform changed:', tracker.matrix );
} );

// ... later, when this tracker is no longer needed:
tracker.dispose();
```

## Constructor and options

`new TransformTracker( trail, providedOptions? )` takes the `Trail` to watch and:

| Option | Default | Effect |
| --- | --- | --- |
| `isStatic` | `false` | If `true`, listeners are notified synchronously without defensively copying the listener array first — a minor performance win when you're certain listeners won't add/remove other listeners during notification |

## Methods

| Method | Effect |
| --- | --- |
| `addListener( listener )` | Registers a no-argument callback fired synchronously whenever any Node in the trail (except the root) changes its transform |
| `removeListener( listener )` | Removes a previously added listener |
| `getMatrix()` / `.matrix` | Returns the current local-to-global `Matrix3` for the trail's leaf node — recomputed lazily, only as far up the dirty chain as needed |
| `dispose()` | Removes all the internal per-Node listeners this tracker installed; call this when you're done, or the tracked Nodes will hold references indefinitely |

::: tip Exclude the leaf node's own transform with `trail.copy().removeDescendant()`
A `TransformTracker` includes every Node in the given trail. If you only care about *ancestor* transform changes (not the dragged/highlighted Node's own transform, which you're presumably setting yourself), pass a trail with the leaf removed — this is exactly the pattern `DragListener` uses internally: `new TransformTracker( pressedTrail.copy().removeDescendant() )`.
:::
