---
title: AlignGroup
description: Coordinates multiple independent AlignBoxes so they all share one common size.
category: api
library: scenery
tags: [scenery, AlignGroup, AlignBox, layout]
status: verified
related:
  - /api/scenery/align-box
  - /api/scenery/node
  - /api/scenery/flow-box
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/align-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AlignGroup

`AlignGroup` (from `scenerystack/scenery`) coordinates a set of [`AlignBox`](/api/scenery/align-box)es that don't otherwise share a parent, so they all end up sized to the same width/height — the largest of the group's minimum content sizes. Where a single `AlignBox` just centers/aligns one child in a bounding box you specify, `AlignGroup` computes that bounding box *for* you from whichever member currently needs the most space, and every box in the group is resized to match, guaranteeing every box ends up sized identically without measuring anything by hand.

```ts
import { AlignGroup, AlignBox, Text } from 'scenerystack/scenery';

const group = new AlignGroup();

const shortLabel = group.createBox( new Text( 'Short' ), { xAlign: 'left' } );
const longLabel = group.createBox( new Text( 'A much longer label' ), { xAlign: 'left' } );
// Both boxes now report the same (largest) size to whatever lays them out — e.g. side-by-side panels.
```

`createBox()` is the usual way to add a member — it constructs an `AlignBox` with `group: this` already set. You can also build an `AlignBox` yourself and assign `group` on it directly.

## Constructor options

| Option | Default | Effect |
| --- | --- | --- |
| `matchHorizontal` | `true` | Whether every box in the group is forced to the same width (the group's max content width) |
| `matchVertical` | `true` | Whether every box in the group is forced to the same height (the group's max content height) |

Also accepts `DisposableOptions` (e.g. `disposer`), inherited from `Disposable`.

If only one of `matchHorizontal`/`matchVertical` is `false`, boxes use their own preferred size on that axis instead of the group's max — useful when you want boxes to share a common width but keep independent heights, for example.

## Methods

| Method | Effect |
| --- | --- |
| `createBox( content, options? )` | Creates and registers a new `AlignBox` in this group, wrapping `content` |
| `updateLayout()` | Forces an immediate recomputation of the shared size and reapplies it to every member box — normally you don't need this, since bounds changes on any member trigger it automatically |
| `setMatchHorizontal( value )` / `.matchHorizontal` | Toggles horizontal size-matching after construction |
| `setMatchVertical( value )` / `.matchVertical` | Toggles vertical size-matching after construction |
| `getMaxWidth()` / `.maxWidth` | The group's current shared width |
| `getMaxHeight()` / `.maxHeight` | The group's current shared height |
| `getMaxWidthProperty()` / `.maxWidthProperty` | A `TProperty<number>` tracking the shared width, for cases that need to observe it |
| `getMaxHeightProperty()` / `.maxHeightProperty` | A `TProperty<number>` tracking the shared height |
| `dispose()` | Disposes every `AlignBox` the group created — disposing the group is enough to clean up its members too |

::: tip Populate largest-content boxes first
Per source: since many `sun` UI components don't support resizing their contents dynamically after construction, populate an `AlignGroup` in order from largest expected content to smallest, so the group's shared size is established correctly from the start rather than needing every box to grow into a later-discovered maximum.
:::
