---
title: AccordionBox
description: An expandable/collapsible titled container bound to an expandedProperty.
category: api
library: sun
tags: [sun, AccordionBox]
status: verified
related:
  - /api/sun/panel
  - /api/axon/boolean-property
  - /api/sun/expand-collapse-button
prerequisites:
  - /api/sun/panel
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AccordionBox

`AccordionBox` (from `scenerystack/sun`) is a titled container that can be expanded or collapsed by clicking its title bar or expand/collapse button, backed by a `Property<boolean>` (`expandedProperty`). Use it for optional or secondary content you want available but don't want to occupy screen space by default — a "graph" or "advanced options" section is the typical case.

```ts
import { AccordionBox } from 'scenerystack/sun';
import { VBox, Text } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const graphContent = new VBox( {
  spacing: 6,
  children: [ /* ...plots, legends, etc. */ ]
} );

const graphAccordionBox = new AccordionBox( graphContent, {
  titleNode: new Text( 'Graph' ),
  expandedDefaultValue: false,
  tandem: Tandem.REQUIRED
} );
```

If you need to observe or control the expanded state from outside, supply your own `expandedProperty` instead of `expandedDefaultValue` — `AccordionBox` will use it directly rather than creating one internally:

```ts
import { BooleanProperty } from 'scenerystack/axon';

const isGraphExpandedProperty = new BooleanProperty( false );

const graphAccordionBox = new AccordionBox( graphContent, {
  titleNode: new Text( 'Graph' ),
  expandedProperty: isGraphExpandedProperty,
  tandem: Tandem.REQUIRED
} );
```

You cannot supply both `expandedProperty` and `expandedDefaultValue` — that combination asserts at construction time.

## Options

| Option | Effect |
| --- | --- |
| `titleNode` | Node shown in the title bar; a plain `Text` node is created for you if omitted |
| `expandedProperty` | Externally-owned `Property<boolean>` driving the expanded state |
| `expandedDefaultValue` | Initial value for the internally-created `expandedProperty` (default `true`) |
| `resize` | Whether the box resizes automatically as title/content bounds change (default `true`) |
| `fill` / `stroke` / `lineWidth` / `cornerRadius` | Box appearance, analogous to [`Panel`](/api/sun/panel#options) |
| `titleAlignX` / `titleAlignY` | Title position: `'left'`\|`'center'`\|`'right'` and `'top'`\|`'center'` |
| `buttonAlign` | Which side the expand/collapse button sits on: `'left'` (default) \| `'right'` |
| `showTitleWhenExpanded` | If `false`, the title is hidden once expanded and content is shown beside the button instead of below the title |
| `useExpandedBoundsWhenCollapsed` | If `true` (default), the collapsed box keeps the expanded box's width |
| `contentXMargin` / `contentYMargin` / `contentXSpacing` / `contentYSpacing` | Spacing around/between content, title, and button |
| `titleBarExpandCollapse` | Whether clicking the title bar (not just the button) toggles the box (default `true`) |

## Methods

| Method | Effect |
| --- | --- |
| `reset()` | Resets `expandedProperty` to its initial value (only meaningful if `AccordionBox` owns the Property, i.e. you used `expandedDefaultValue` rather than supplying your own) |
| `getExpandedBoxHeight()` / `getCollapsedBoxHeight()` | The ideal height in each state, ignoring stroke width |

::: warning `reset()` is a no-op if you supplied your own `expandedProperty`
If you pass `expandedProperty` explicitly, `AccordionBox.reset()` does nothing — you own that Property and are responsible for resetting it yourself (typically alongside your model's other Properties via `resetAllButton`). Only the internally-created Property (via `expandedDefaultValue`) is reset by `AccordionBox.reset()`.
:::
