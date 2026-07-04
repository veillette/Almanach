---
title: Trail
description: An indexed path of Nodes from a root to a descendant, used for hit-testing, ordering, and coordinate transforms across the scene graph.
category: api
library: scenery
tags: [scenery, Trail, scene-graph, hit-testing, coordinates]
status: verified
related:
  - /api/scenery/node
  - /api/scenery/display
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Trail

`Trail` (from `scenerystack/scenery`) represents one path through the scene graph — an ordered array of [`Node`](/api/scenery/node)s from some root down to a descendant, plus the child index at each step. Because a `Node` can appear under more than one parent (a DAG, not just a tree), a single `Node` can be reached by multiple distinct trails; `Trail` is what disambiguates *which* instance of a Node is meant when computing bounds, transforms, or picking. Scenery hands you a `Trail` on every input event (`event.trail`) and uses trails internally to walk the [`Display`](/api/scenery/display)'s rendered tree.

```ts
import { Node, Circle } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';

const root = new Node();
const group = new Node();
const dot = new Circle( 5, { fill: 'crimson' } );

root.addChild( group );
group.addChild( dot );

const trail = new Trail( [ root, group, dot ] );

trail.lastNode();  // dot
trail.rootNode();  // root
trail.getMatrix();          // Matrix3: dot's full transform relative to root
trail.localToGlobalPoint( new Vector2( 0, 0 ) ); // dot's local origin, in root's frame
```

## Building and inspecting a Trail

| Method | Effect |
| --- | --- |
| `new Trail( nodes )` | Builds a trail from a `Node[]` (root-to-leaf order), a single `Node`, or copies another `Trail` |
| `addAncestor( node, index? )` / `addDescendant( node, index? )` | Extends the trail at the root end / leaf end |
| `removeAncestor()` / `removeDescendant()` | Shortens the trail from either end |
| `slice( start, end? )` / `subtrailTo( node, excludeNode? )` | Returns a new `Trail` covering part of this one |
| `copy()` | Independent copy that can be mutated without affecting the original |
| `reindex()` | Recomputes `indices` after the scene graph has changed, since indices can go stale |
| `lastNode()` / `rootNode()` | The leaf Node / the root Node of the trail |
| `nodes` / `indices` / `length` | The raw `Node[]`, per-step child indices, and trail length |

## Queries used for hit-testing and visibility

| Method | Meaning |
| --- | --- |
| `isValid()` | Whether every node in the trail is still actually connected root-to-leaf (reindexes first) |
| `isVisible()` | `true` only if every Node along the trail has `visible: true` |
| `isPickable()` | Whether this trail would actually be hit-tested, given `pickable`/`visible`/attached listeners along the way |
| `getOpacity()` | Combined (multiplied) opacity of every Node on the trail |
| `containsNode( node )` | Whether `node` appears anywhere on this trail |
| `isExtensionOf( other, allowSameTrail? )` | Whether this trail continues on from `other` (i.e. `other` is a prefix) |
| `equals( other )` / `compare( other )` | Structural equality, or a stable ordering comparison (for z-order-like sorting) |

## Coordinate transforms

| Method | Effect |
| --- | --- |
| `getMatrix()` | `Matrix3` transforming the leaf Node's local coordinates into the root's coordinate frame |
| `getTransform()` | Same, wrapped as a `Transform3` |
| `localToGlobalPoint( point )` / `globalToLocalPoint( point )` | Converts a `Vector2` between the leaf's local frame and the trail's root frame |
| `localToGlobalBounds( bounds )` / `globalToLocalBounds( bounds )` | Same, for a `Bounds2` |
| `getTransformTo( otherTrail )` / `getMatrixTo( otherTrail )` | Transform between two trails that share a common ancestor |

::: tip A Node's `Trail` isn't unique — request it when you need it
Because Nodes can have multiple parents, there's no single "the trail" for a Node in general; that's why `Trail` objects are handed to you contextually (an input event's `event.trail`, or `node.getUniqueTrail()` when a Node is only used once) rather than stored permanently on the `Node` itself. Don't cache a `Trail` across scene graph edits without calling `reindex()` or rechecking `isValid()` first — added/removed/reordered children can make its `indices` stale.
:::
