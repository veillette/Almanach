---
title: ToggleNode and BooleanToggleNode
description: Show exactly one of several child Nodes, chosen by the current value of a Property.
category: api
library: sun
tags: [sun, ToggleNode, BooleanToggleNode]
status: complete
related:
  - /api/sun/checkbox
  - /api/sun/on-off-switch
  - /api/axon/derived-property
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ToggleNode and BooleanToggleNode

`ToggleNode<T>` (from `scenerystack/sun`) shows exactly one of several child `Node`s at a time, chosen by which value in a list matches a `TReadOnlyProperty<T>`'s current value — useful for swapping an icon, a message, or an entire sub-scene based on model state without manually managing `visible` on each child yourself. `BooleanToggleNode` is a convenience subclass for the common two-state (`true`/`false`) case.

```ts
import { ToggleNode, type ToggleNodeElement } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';

type Phase = 'solid' | 'liquid' | 'gas';
const phaseProperty = new Property<Phase>( 'liquid' );

const elements: ToggleNodeElement<Phase>[] = [
  { value: 'solid', createNode: () => new Text( 'Solid' ) },
  { value: 'liquid', createNode: () => new Text( 'Liquid' ) },
  { value: 'gas', createNode: () => new Text( 'Gas' ) }
];

const phaseNode = new ToggleNode( phaseProperty, elements );
```

Each `ToggleNodeElement`'s `createNode()` builds the Node shown for that value; exactly one must match `phaseProperty.value` at all times (`ToggleNode` asserts on a mismatch count). When the Property changes, `ToggleNode` shows the matching child and hides the rest.

<SceneryDemo demo="toggle-node" />

## BooleanToggleNode

`BooleanToggleNode` fixes the two-state case so you don't need to build the `ToggleNodeElement[]` array yourself — pass the `true`-state and `false`-state `Node`s directly:

```ts
import { BooleanToggleNode } from 'scenerystack/sun';
import { Path } from 'scenerystack/scenery';
import { BooleanProperty } from 'scenerystack/axon';

const isPlayingProperty = new BooleanProperty( false );

const playPauseIcon = new BooleanToggleNode(
  isPlayingProperty,
  new Path( pauseShape ),  // shown when isPlayingProperty is true
  new Path( playShape )    // shown when isPlayingProperty is false
);
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `alignChildren` | `ToggleNode.CENTER` | A function `(children) => void` run whenever children resize, to align them relative to each other. Static alternatives: `ToggleNode.CENTER_X`, `CENTER_Y`, `LEFT`, `RIGHT`, `BOTTOM`, `CENTER_BOTTOM`, `NONE` |
| `unselectedChildrenSceneGraphStrategy` | `'included'` | `'included'`: unselected children stay in the scene graph, hidden via `visible: false` (bounds are the union of all children); `'excluded'`: unselected children are removed entirely, so bounds match only the currently-selected child, which can improve performance |

::: warning Don't add or remove children yourself after construction
`ToggleNode` manages its own `children` array to track visibility per value; adding/removing children directly on a `ToggleNode` instance after construction isn't supported and will break its internal bookkeeping. If the *set* of possible values needs to change, construct a new `ToggleNode`.
:::

::: tip Reach for `BooleanToggleNode` over `Checkbox`/`OnOffSwitch` for content, not controls
`ToggleNode`/`BooleanToggleNode` swap *what's displayed* based on a Property someone else changes — they have no click/drag interaction of their own. If you need the user to be able to flip the Property by interacting with the Node itself, use [`Checkbox`](/api/sun/checkbox) or [`OnOffSwitch`](/api/sun/on-off-switch) instead (or alongside — it's common to pair a `BooleanToggleNode` icon with an `OnOffSwitch` control for the same Property).
:::
