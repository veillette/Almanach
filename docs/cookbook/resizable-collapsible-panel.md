---
title: A Resizable/Collapsible Panel
description: Combining AccordionBox and Panel so a control group can be collapsed down to just its title bar.
category: cookbook
tags: [sun, Panel, AccordionBox, BooleanProperty]
status: complete
related:
  - /api/sun/panel
  - /api/sun/accordion-box
  - /api/axon/boolean-property
prerequisites:
  - /api/sun/panel
  - /api/sun/accordion-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Resizable/Collapsible Panel

**Task:** a group of controls (a settings cluster, a "graph" section) should be collapsible down to just a title bar, reclaiming screen space, while still being bordered and styled consistently with the rest of the sim's non-collapsible panels.

[`AccordionBox`](/api/sun/accordion-box) *is* the collapsible panel — it already draws its own bordered background (styled the same way [`Panel`](/api/sun/panel) is) and handles the expand/collapse interaction and layout resizing. You reach for a plain `Panel` only for a group that's never collapsible; reach for `AccordionBox` directly when collapsibility itself is the requirement, rather than trying to wrap a `Panel` in some separate show/hide mechanism.

## The solution

```ts
import { AccordionBox } from 'scenerystack/sun';
import { VBox, Text } from 'scenerystack/scenery';
import { Checkbox } from 'scenerystack/sun';
import { BooleanProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

// --- model-owned state the controls act on ---
const gravityEnabledProperty = new BooleanProperty( true );
const frictionEnabledProperty = new BooleanProperty( false );

// --- the collapsible state itself is also a Property, owned externally so
// it can be read/reset alongside the rest of the screen's state ---
const isControlsExpandedProperty = new BooleanProperty( true );

const controlsContent = new VBox( {
  spacing: 8,
  align: 'left',
  children: [
    new Checkbox( gravityEnabledProperty, new Text( 'Gravity' ), { tandem: Tandem.REQUIRED } ),
    new Checkbox( frictionEnabledProperty, new Text( 'Friction' ), { tandem: Tandem.REQUIRED } )
  ]
} );

const controlsAccordionBox = new AccordionBox( controlsContent, {
  titleNode: new Text( 'Controls' ),
  expandedProperty: isControlsExpandedProperty,
  cornerRadius: 8,
  titleAlignX: 'left',
  tandem: Tandem.REQUIRED
} );
```

Clicking the title bar (or its expand/collapse button) toggles `isControlsExpandedProperty`, which collapses `controlsAccordionBox` down to just the title row — `controlsContent`'s children are hidden, not destroyed, so re-expanding shows the same live controls with no rebuilding.

## Resetting the collapsed state with the rest of the screen

Because `isControlsExpandedProperty` is supplied externally (rather than using `expandedDefaultValue`), it needs to be reset explicitly alongside the model's own Properties — `AccordionBox.reset()` is a no-op for externally-supplied Properties:

```ts
class MyScreenModel {
  public reset(): void {
    gravityEnabledProperty.reset();
    frictionEnabledProperty.reset();
  }
}

// in the ResetAllButton's listener (see The Reset-All Pattern):
resetAllButton = new ResetAllButton( {
  listener: () => {
    model.reset();
    isControlsExpandedProperty.reset(); // view-owned, but still reset with everything else
  }
} );
```

If you don't need to observe or reset the expanded state from outside, skip the external `Property` entirely and just pass `expandedDefaultValue: false` — `AccordionBox` will create and own its own `expandedProperty`, and `controlsAccordionBox.reset()` resets it for you.

## Options used here

| Option | Effect |
| --- | --- |
| `titleNode` | Node shown in the always-visible title bar |
| `expandedProperty` | Externally-owned `Property<boolean>` driving expanded/collapsed state |
| `expandedDefaultValue` | Alternative to `expandedProperty` — lets `AccordionBox` own and reset its own Property |
| `cornerRadius` / `titleAlignX` | Visual styling, matching the conventions of a plain [`Panel`](/api/sun/panel) |

::: tip Collapsed width defaults to matching the expanded width
`useExpandedBoundsWhenCollapsed` defaults to `true`, so the collapsed title bar stays exactly as wide as the box is when expanded — this keeps a column of accordion boxes (or an accordion box next to a fixed-width sibling panel) visually aligned regardless of expanded state, instead of the collapsed row shrinking to just the title text's width.
:::

::: warning Don't nest a `Panel` inside an `AccordionBox`'s content expecting a second border
`AccordionBox` already draws the same kind of bordered background `Panel` does — wrapping `controlsContent` in its own `Panel` before passing it to `AccordionBox` just produces a border-within-a-border. Pass the bare content (a `VBox`/`GridBox` of controls) directly, as shown above.
:::
