---
title: Focus Highlights
description: Customizing focus highlights for focusable Nodes.
category: accessibility
tags: [scenery, focus, accessibility]
status: complete
related:
  - /accessibility/pdom
  - /accessibility/alternative-input-overview
  - /accessibility/voicing
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Focus Highlights

Any focusable Node in scenery is automatically outlined with a focus highlight when it receives keyboard focus — a double-stroked "glow" (an outer lighter stroke and an inner darker one) drawn just outside the Node's bounds. You rarely need to customize this, but when the default rectangular-bounds highlight is wrong for a Node's shape, `focusHighlight` (from `ParallelDOM`, the mixin behind every Node's accessibility options) lets you replace it.

## The default highlight is automatic

```ts
import { Rectangle } from 'scenerystack/scenery';

const resetButton = new Rectangle( 0, 0, 40, 40, {
  tagName: 'button',
  accessibleName: 'Reset'
} );
```

No `focusHighlight` option is needed here — scenery draws a highlight sized to `resetButton`'s bounds whenever it has focus, and removes it on blur.

## Customizing the shape with HighlightFromNode

The most common customization is sizing the highlight around a *different* Node than the focusable one — e.g. a small hit-target Node whose highlight should instead trace a larger visual icon. `HighlightFromNode` (from `scenerystack/scenery`) builds a highlight from any Node's bounds and keeps it updated as that Node's bounds change:

```ts
import { Node, Path, HighlightFromNode } from 'scenerystack/scenery';

const iconNode = new Path( iconShape );
const draggableIcon = new Node( {
  children: [ iconNode ],
  tagName: 'div',
  focusable: true,
  accessibleName: 'Movable planet'
} );

// Highlight traces iconNode's bounds, not draggableIcon's (which may be larger, e.g. for touch area)
draggableIcon.focusHighlight = new HighlightFromNode( iconNode );
```

## Fully custom highlight shapes

For a highlight that isn't just "these bounds, dilated," set `focusHighlight` to any `Shape` or `Node` directly — most often a `HighlightPath` built from a custom `kite` `Shape`:

```ts
import { HighlightPath } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const customHighlight = new HighlightPath( Shape.circle( 0, 0, 30 ) );

circularButton.focusHighlight = customHighlight;
```

`HighlightPath` renders the same two-tone outer/inner stroke look as the default highlight, just around whatever `Shape` you give it, so custom highlights stay visually consistent with the rest of the application.

## Group focus highlights

A container of several small focusable Nodes (e.g. cells in a grid) can additionally get an outer highlight around the whole group, shown while focus is *anywhere inside* the group — set `groupFocusHighlight` on the container Node:

```ts
grid.groupFocusHighlight = true; // or a custom Node/Shape, same as focusHighlight
```

## Options

| Option | Effect |
| --- | --- |
| `focusHighlight` | `Shape \| Node \| 'invisible' \| null` — the highlight shown when this Node has focus; `null`/omitted uses the automatic bounds-based highlight, `'invisible'` suppresses it entirely |
| `focusHighlightLayerable` | If `true`, you take responsibility for placing the highlight Node in the scene graph yourself (e.g. to draw it behind other content) instead of scenery's overlay drawing it on top of everything |
| `groupFocusHighlight` | `Node \| boolean` — an additional highlight shown around this Node while focus is anywhere within its subtree |

::: tip Don't suppress highlights to "clean up" the visuals
Setting `focusHighlight: 'invisible'` removes the only visual indicator that keyboard focus has moved to a Node — do this only when a custom highlight is drawn some other way (e.g. a semantically equivalent selected-state look), never simply because the default highlight looks visually busy. See [Alternative Input Overview](/accessibility/alternative-input-overview) for why focus is the organizing concept for all non-pointer input.
:::
