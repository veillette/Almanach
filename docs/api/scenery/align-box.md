---
title: AlignBox
description: A single-child container for alignment and fixed-size placement within layouts.
category: api
library: scenery
tags: [scenery, AlignBox, layout]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/flow-box
  - /api/scenery/grid-box
  - /api/dot/bounds2
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AlignBox

`AlignBox` (from `scenerystack/scenery`) wraps a single content [`Node`](/api/scenery/node) and positions it within a bounding box (`alignBounds`) according to horizontal/vertical alignment and margins — the scenery equivalent of centering or pinning one element inside a fixed-size slot. It's the standard way to reserve a consistent amount of space for content whose size can vary (e.g. a translated string) inside a [`FlowBox`](/api/scenery/flow-box) or [`GridBox`](/api/scenery/grid-box) cell, without the varying content shifting its neighbors.

```ts
import { AlignBox, Circle } from 'scenerystack/scenery';
import { Bounds2 } from 'scenerystack/dot';

const icon = new Circle( 12, { fill: 'seagreen' } );

const centeredSlot = new AlignBox( icon, {
  alignBounds: new Bounds2( 0, 0, 60, 60 ),
  xAlign: 'center',
  yAlign: 'center'
} );
```

If `alignBounds` isn't provided, `AlignBox` sizes itself to fit the content plus margins, with a left-top corner at `(0, 0)` — in that case it behaves mostly as a margin wrapper rather than a fixed-size slot. Passing a preferred width/height (e.g. from a parent layout container) also drives `alignBounds` automatically.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `alignBounds` | `null` (fits content) | The `Bounds2` the content is aligned within; see [`Bounds2`](/api/dot/bounds2) |
| `alignBoundsProperty` | — | Drives `alignBounds` dynamically from a `TReadOnlyProperty<Bounds2>`; mutually exclusive with `alignBounds` |
| `align` | — | Shorthand setting both `xAlign` and `yAlign` (only `'center'` or `'stretch'` are valid for both axes at once) |
| `xAlign` | `'center'` | `'left'`, `'center'`, `'right'`, or `'stretch'` |
| `yAlign` | `'center'` | `'top'`, `'center'`, `'bottom'`, or `'stretch'` |
| `margin` | `0` | Shorthand for all four margins |
| `xMargin` / `yMargin` | `0` | Shorthand for left+right / top+bottom margins |
| `leftMargin` / `rightMargin` / `topMargin` / `bottomMargin` | `0` | Per-side margin |
| `group` | `null` | An `AlignGroup` that synchronizes this box's `alignBounds` with sibling boxes in the same group, so they all end up the same size |

## Methods

| Method | Effect |
| --- | --- |
| `getContent()` / `.content` | Returns the wrapped content `Node` |
| `setAlignBounds( bounds )` | Updates the bounds content is aligned within |
| `invalidateAlignment()` | Forces an immediate re-layout — useful when content changed in a way that doesn't automatically trigger it |
| `getContentBounds()` | Returns the content's current bounds within the alignment frame |
| `dispose()` | Releases the box's internal listeners on the content and any `alignBoundsProperty`/`group` |

::: tip `sizable` defaults to `false`
Unlike most layout-participating Nodes, `AlignBox` defaults to `sizable: false` — it's usually used to carve out a fixed amount of space, not to grow/shrink with its parent. Pass `sizable: true` (or set `xAlign`/`yAlign` to `'stretch'` with a resizable content Node) if you want it to participate in a parent's `grow`/`stretch` layout.
:::

::: warning Layout can lag by one frame
`AlignBox` recomputes its layout when the content's bounds change, but per the source's own documentation, that update "may not happen immediately, and may be delayed until bounds of a alignBox's child occurs." Reading `alignBox.getBounds()` right after mutating content does not force a refresh and can return stale bounds — call `invalidateAlignment()` if you need the new layout synchronously, or rely on it settling before the next [`Display.updateDisplay()`](/api/scenery/display).
:::
