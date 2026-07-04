---
title: ManualConstraint
description: A low-level layout constraint for one-off imperative positioning logic that should automatically rerun when the involved Nodes' bounds change.
category: api
library: scenery
tags: [scenery, ManualConstraint, layout, constraint]
status: verified
related:
  - /api/scenery/node
  - /api/scenery/flow-box
  - /api/scenery/grid-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ManualConstraint

`ManualConstraint` (from `scenerystack/scenery`) exists for the cases [`FlowBox`](/api/scenery/flow-box)/[`GridBox`](/api/scenery/grid-box) don't cover: one-off imperative positioning code like `node.left = otherNode.right + 5` that needs to automatically rerun whenever any of the involved Nodes' bounds change. Unlike writing that assignment once in application code, `ManualConstraint` also handles Nodes that don't share a coordinate frame directly — only a common ancestor — by giving the callback `LayoutProxy` objects (bounds-based positional getters/setters, like a Node's own `left`/`right`/`centerY`, but transformed into the ancestor's coordinate frame).

```ts
import { ManualConstraint, Node, Circle, Rectangle } from 'scenerystack/scenery';

const ancestor = new Node();
const label = new Rectangle( 0, 0, 100, 30, { fill: 'white' } );
const icon = new Circle( 8, { fill: 'crimson' } );
ancestor.children = [ label, icon ];

new ManualConstraint( ancestor, [ label, icon ], ( labelProxy, iconProxy ) => {
  iconProxy.left = labelProxy.right + 5;
  iconProxy.centerY = labelProxy.centerY;
} );
```

The constraint reruns the callback automatically whenever `label` or `icon`'s bounds change (or they're reparented) — you never call the assignment again yourself.

## Constructor

`new ManualConstraint( ancestorNode, nodes, layoutCallback )`

| Parameter | Meaning |
| --- | --- |
| `ancestorNode` | The common ancestor `Node` whose coordinate frame the layout is computed relative to; must be an ancestor of every entry in `nodes` |
| `nodes` | A tuple of `Node`s the callback needs to position — each becomes one `LayoutProxy` argument, in the same order |
| `layoutCallback` | `( ...proxies: LayoutProxy[] ) => void` — read/write positional properties on the proxies to perform layout |

A static `ManualConstraint.create( ancestorNode, nodes, layoutCallback )` is equivalent to calling the constructor directly, useful when you want a factory function reference instead of `new`.

## Behavior notes

- The callback only runs once every involved Node currently has a connected `Trail` back to `ancestorNode` — if a Node is temporarily removed from the tree, the constraint simply skips re-running until it's reconnected.
- Each `LayoutProxy` exposes the same bounds-based getters/setters as [`Node`](/api/scenery/node) (`left`, `right`, `top`, `bottom`, `centerX`, `centerY`, `center`, `width`, `height`, …), but reads/writes them in `ancestorNode`'s coordinate frame rather than the proxied Node's own parent frame.
- `dispose()` releases the constraint's internal `LayoutCell`s and stops listening to the constrained Nodes.

::: tip Reach for `FlowBox`/`GridBox`/`AlignBox` first
`ManualConstraint` is intentionally low-level — it doesn't know about spacing, alignment, or growth, it just reruns a callback you wrote. Prefer [`FlowBox`](/api/scenery/flow-box) or [`GridBox`](/api/scenery/grid-box) for anything expressible as a row/column/grid; reach for `ManualConstraint` only for relationships those containers can't express, such as positioning one Node relative to another that lives in a completely different part of the tree.
:::
