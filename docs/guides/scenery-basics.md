---
title: Scenery Basics
description: Introduction to the scene graph - the Node tree, render layers, and coordinate frames.
category: guides
tags: [scenery, scene-graph, rendering]
status: verified
related:
  - /getting-started/scenery-application-vs-standalone-library
  - /guides/scenery-layout
  - /guides/scenery-input
  - /api/scenery/node
  - /api/scenery/rectangle
  - /api/scenery/text
prerequisites:
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Scenery Basics

`scenery` is a retained-mode scene graph: instead of issuing draw calls yourself, you build a tree of `Node` instances describing *what* to show, and a `Display` figures out how to paint it (via Canvas, SVG, or WebGL) and keeps the painting in sync as the tree changes. Every visual element in a SceneryStack application — shapes, text, images, and every UI component from `sun`/`scenery-phet` — is a `Node`.

## The Node tree

```ts
import { Node, Rectangle, Circle, Text } from 'scenerystack/scenery';

const root = new Node();

const background = new Rectangle( 0, 0, 400, 300, { fill: '#eef' } );
const ball = new Circle( 20, { fill: 'crimson', center: background.center } );
const label = new Text( 'Scene graph demo', { font: '18px sans-serif', top: 10, left: 10 } );

root.children = [ background, ball, label ];
```

A `Node` with no visual content of its own (like `root` above) is a plain container — its only job is grouping children so you can move, hide, or style them together. `children` is drawn in array order: **later entries paint on top of earlier ones**, exactly like DOM stacking order or z-index by declaration order.

| Way to change children | Effect |
| --- | --- |
| `node.children = [ a, b, c ]` | Replaces the entire children array |
| `node.addChild( child )` | Appends one Node to the end (drawn on top) |
| `node.insertChild( index, child )` | Inserts at a specific stacking position |
| `node.removeChild( child )` | Removes one Node |

A `Node` can have multiple parents (it's a DAG, not strictly a tree) — the same `Node` instance can appear in two different places in the graph and both stay in sync, though this is an advanced technique most simulations don't need.

## Render layers: Canvas, SVG, and WebGL

Scenery doesn't require you to pick a rendering technology per element. Each `Node` has a `renderer` option (`'svg' | 'canvas' | 'webgl' | 'dom' | null`) that's normally left `null`, letting scenery choose — and internally batch adjacent compatible Nodes into as few underlying Canvas/SVG/WebGL "layers" as it can, to minimize the number of separate surfaces the browser has to composite. You rarely think about layers directly; the practical knobs you do use are `visible`, `opacity`, and `pickable`:

```ts
ball.visible = false;   // removed from painting and from input, but stays in the tree
ball.opacity = 0.5;     // still painted, semi-transparent
ball.pickable = false;  // still painted, but input events pass through it
```

See [Supported Browsers](/getting-started/supported-browsers) for how renderer fallback behaves across platforms.

## Coordinate frames

Every `Node` has its own **local coordinate frame** — the one its constructor arguments and internal geometry are expressed in — and a transform (translation, rotation, scale) that places it within its **parent's** coordinate frame:

```ts
ball.translation = ball.translation.plusXY( 50, 0 ); // move 50 units right, in the parent's frame
ball.rotation = Math.PI / 4;                          // rotate 45 degrees about its own origin
ball.scale( 1.5 );                                    // scale about its own origin
```

| Property | Meaning |
| --- | --- |
| `x` / `y` / `translation` | Position of this Node's origin in its parent's coordinate frame |
| `rotation` | Rotation in radians about the local origin |
| `localBounds` | Bounding box of this Node's own content, in its own local frame |
| `bounds` | Bounding box of this Node *and all its children*, in the parent's frame |

Converting a point between frames uses the Node's transform chain directly:

```ts
const parentPoint = ball.localToParentPoint( someLocalPoint );
const globalPoint = ball.localToGlobalPoint( someLocalPoint ); // all the way to the Display's root frame
```

::: tip `bounds` is not the same as `localBounds`
`localBounds` is one Node's own content, unaffected by its children. `bounds` includes every descendant, already transformed into the parent's frame — it's what determines layout and hit-testing for anything that treats this Node as a single unit (see [Scenery Layout](/guides/scenery-layout)).
:::

## Where to go next

- [Scenery Layout](/guides/scenery-layout) — arranging children automatically instead of setting `x`/`y` by hand
- [Scenery Input](/guides/scenery-input) — pointers, listeners, and how events traverse this same tree
- [Scenery Application vs. Standalone Library](/getting-started/scenery-application-vs-standalone-library) — putting a Node tree in a page via `Display`
