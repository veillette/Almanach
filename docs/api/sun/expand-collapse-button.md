---
title: ExpandCollapseButton
description: The square plus/minus toggle button that AccordionBox uses internally for its expand/collapse control.
category: api
library: sun
tags: [sun, ExpandCollapseButton, button]
status: verified
related:
  - /api/sun/accordion-box
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ExpandCollapseButton

`ExpandCollapseButton` (from `scenerystack/sun`) is a small square button that shows a `+` or `-` symbol and toggles a `Property<boolean>` — it's a thin, specialized wrapper around [`BooleanRectangularToggleButton`](/api/sun/toggle-button) with the plus/minus content, coloring (green when collapsed, orange when expanded), and `aria-expanded` PDOM attribute built in. [`AccordionBox`](/api/sun/accordion-box) constructs one of these internally for its own expand/collapse control (via its `expandCollapseButtonOptions`) — reach for `ExpandCollapseButton` directly only when you want that exact plus/minus affordance somewhere other than an `AccordionBox` title bar.

```ts
import { ExpandCollapseButton } from 'scenerystack/sun';
import { BooleanProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const detailsExpandedProperty = new BooleanProperty( false );

const detailsButton = new ExpandCollapseButton( detailsExpandedProperty, {
  sideLength: 20,
  tandem: Tandem.REQUIRED
} );
```

Pressing the button flips `detailsExpandedProperty.value`; the button's fill and `+`/`-` symbol update automatically, from any source that changes the Property, not just from a button press.

<SceneryDemo demo="expand-collapse-button" />

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `sideLength` | `25` | Length of one side of the square button; the `+`/`-` symbol and margins scale proportionally |
| `touchAreaXDilation` / `touchAreaYDilation` | `5` / `5` | Expand the touch-friendly hit area beyond the visual bounds |
| `stroke` | `'black'` | Outline color of the square button |

`ExpandCollapseButtonOptions` otherwise accepts the same `BooleanRectangularToggleButtonOptions` as documented in [Toggle Buttons](/api/sun/toggle-button#options), minus `cornerRadius`/`xMargin`/`yMargin`/`buttonAppearanceStrategy` — those four are fixed internally so the plus/minus symbol always renders correctly relative to `sideLength`.

::: tip It's exactly what `AccordionBox` uses under the hood
If you're building a custom expandable panel that isn't quite an `AccordionBox` (e.g. different layout for the title/content), you can drop in an `ExpandCollapseButton` bound to your own `expandedProperty` and get the same visual language users already recognize from every `AccordionBox` in the sim, without reimplementing the plus/minus icon yourself.
:::
