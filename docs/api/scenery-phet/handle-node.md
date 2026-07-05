---
title: HandleNode
description: A purely decorative graphic of a grippable handle attached to a surface by one or two elbow-shaped mounts.
category: api
library: scenery-phet
tags: [scenery-phet, HandleNode, handle]
status: complete
related:
  - /api/scenery-phet/drawer
  - /api/scenery/path
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HandleNode

`HandleNode` (from `scenerystack/scenery-phet`) draws a horizontal bar with finger-shaped indents along its top and bottom edges — the "grip" — mounted to a surface by one or two elbow-shaped "attachment" bars. It's a static, decorative graphic: `HandleNode` has no drag behavior, Property, or model connection of its own. Sims use it as the visual affordance suggesting "this is grabbable," typically layered underneath or alongside a separate drag listener attached to the draggable object it represents.

```ts
import { HandleNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const handleNode = new HandleNode( {
  gripBaseColor: 'orange',
  cursor: 'pointer'
} );
handleNode.center = layoutBounds.center;
screenView.addChild( handleNode );
```

Since `HandleNode` is purely visual, making it interactive means adding your own input listener (e.g. a `DragListener`) to it, the same as with any other `Node`.

## Constructor

```ts
new HandleNode( providedOptions?: HandleNodeOptions )
```

`HandleNode` takes no required arguments — every visual choice is made through options.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `gripBaseColor` | `'rgb( 183, 184, 185 )'` | Base color of the vertical gradient painted on the grip |
| `gripStroke` | `'black'` | Stroke color of the grip's outline |
| `gripLineWidth` | `3` | Stroke width of the grip's outline |
| `attachmentFill` | `'gray'` | Solid fill color of the attachment bar(s) |
| `attachmentStroke` | `'black'` | Stroke color of the attachment bar(s) |
| `attachmentLineWidth` | `3` | Stroke width of the attachment bar(s) |
| `hasLeftAttachment` | `true` | Whether an attachment is drawn on the left side of the grip |
| `hasRightAttachment` | `true` | Whether an attachment is drawn on the right side of the grip |

```ts
// A handle mounted only on its left side, e.g. hanging off the edge of a panel.
const wallHandle = new HandleNode( {
  hasRightAttachment: false,
  attachmentFill: 'darkgray'
} );
```

::: tip At least one attachment is required
`HandleNode` asserts at construction that `hasLeftAttachment || hasRightAttachment` — a handle with no attachments at all isn't a supported configuration, since the grip alone doesn't read as "mounted to something."
:::

::: tip Not the same graphic [`Drawer`](/api/scenery-phet/drawer) uses
`Drawer`'s pull-tab is drawn independently (a small rounded-rectangle with dots), not by composing a `HandleNode`. If you need a drawer-style component with `HandleNode`'s specific grip-and-attachment look, you'll need to build it yourself rather than configuring `Drawer`.
:::
