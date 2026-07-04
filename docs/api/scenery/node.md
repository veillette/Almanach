---
title: Node
description: The base class of every item in the scene graph and its core options.
category: api
library: scenery
tags: [scenery, Node, scene-graph, transform, bounds]
status: complete
related:
  - /api/scenery/path
  - /api/scenery/display
  - /api/scenery/flow-box
  - /guides/scenery-layout
prerequisites:
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Node

`Node` (from `scenerystack/scenery`) is the base class for every visual element in a scenery scene graph. On its own a `Node` draws nothing — it's a container that holds `children` and applies a transform (translation/rotation/scale), visibility, opacity, input behavior, and layout options to that subtree. Every other page in this section — [`Path`](/api/scenery/path), [`Text`](/api/scenery/text), [`Image`](/api/scenery/image), the layout containers — is a `Node` subclass, so the options and methods documented here apply everywhere.

```ts
import { Node, Circle, Rectangle } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';

const group = new Node( {
  children: [
    new Circle( 20, { fill: 'orange' } ),
    new Rectangle( 30, -10, 40, 20, { fill: 'teal' } )
  ],
  x: 100,
  y: 50,
  scale: 1.5,
  visible: true
} );

group.addChild( new Circle( 5, { fill: 'black', x: 60 } ) );
```

## Building the scene graph

| Method | Effect |
| --- | --- |
| `addChild( node )` | Appends `node` as the last (topmost) child |
| `insertChild( index, node )` | Inserts `node` at a specific position in the children order |
| `removeChild( node )` | Removes a specific child |
| `removeChildAt( index )` | Removes the child at a given index |
| `removeAllChildren()` | Clears all children |
| `mutate( options )` | Applies a `NodeOptions` object all at once, in a fixed, documented order |

Children later in the list are drawn on top of earlier ones — order matters for visual stacking, not just structure.

## Frequently used options

| Option | Effect |
| --- | --- |
| `children` | Initial list of child `Node`s, added in order |
| `visible` | Whether this Node (and its subtree) is displayed; invisible subtrees are also excluded from picking by default |
| `pickable` | `true`/`false`/`null` — overrides whether this subtree can receive input events |
| `enabled` | Application-level enabled state (paired with `enabledProperty`) |
| `inputEnabled` | Whether input events are allowed to reach this subtree |
| `inputListeners` | Array of input listeners attached at construction, e.g. a [`FireListener`](/api/scenery/fire-listener) |
| `opacity` | 0 (transparent) to 1 (opaque) applied to the whole subtree |
| `cursor` | CSS cursor shown when the pointer is over this Node |
| `x`, `y`, `translation` | Translation of this Node relative to its parent |
| `rotation` | Rotation in radians |
| `scale` | Uniform or `Vector2` scale |
| `left`, `right`, `top`, `bottom`, `centerX`, `centerY`, `center`, `leftTop`, `rightBottom`, … | Positioning shortcuts based on this Node's (parent-coordinate-frame) bounds — applied *after* other transform options |
| `maxWidth` / `maxHeight` | Automatically scales the Node down (never up) to fit within the given local-bounds dimensions |
| `clipArea` | A `Shape` (see [kite `Shape`](/api/kite/shape)) outside of which content is hidden |
| `mouseArea` / `touchArea` | Overrides the hit-testing region, independent of the drawn shape |
| `layoutOptions` | Options consumed by a parent layout container, e.g. [`FlowBox`](/api/scenery/flow-box) or [`GridBox`](/api/scenery/grid-box) |

## Reading bounds and position

```ts
const b = group.bounds;       // Bounds2 in the parent coordinate frame
const local = group.localBounds; // Bounds2 in this Node's own coordinate frame

group.center = new Vector2( 0, 0 ); // reposition using the bounds-based setter
```

`Node` also exposes coordinate-conversion helpers: `localToGlobalPoint( point )` and `globalToLocalPoint( point )` convert between this Node's local frame and the `Display`'s root frame — useful when translating pointer coordinates.

::: tip Order of options in `mutate()`
Node options are applied in a fixed, documented order (transform options like `x`/`scale` before bounds-based options like `left`/`center`). This is why you can safely pass both a `scale` and a `center` in the same options object and get the expected result — the centering happens after scaling.
:::

::: warning Dispose subtrees you remove permanently
Removing a `Node` from its parent does not automatically dispose it. If a subtree is being discarded for good (not just hidden), call `dispose()` (or `disposeSubtree()`) to release its listeners, `Property` links, and other resources — otherwise removed simulation elements can leak memory.
:::
