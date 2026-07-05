---
title: Trash Buttons
description: MoveToTrashButton, MoveToTrashLegendButton, and TrashButton — the standard trash-can icon buttons, with and without a "move to" arrow.
category: api
library: scenery-phet
tags: [scenery-phet, MoveToTrashButton, MoveToTrashLegendButton, TrashButton, button]
status: complete
related:
  - /api/scenery-phet/round-icon-buttons
  - /api/scenery-phet/eraser-button
  - /api/sun/rectangular-push-button
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Trash Buttons

`scenerystack/scenery-phet` has three [`RectangularPushButton`](/api/sun/rectangular-push-button) subclasses built around the same trash-can `Path` (`trashShape`), differing in whether a curved "move to" arrow is added and how muted the styling is. All are one-shot action buttons — pressing one removes or discards something, they hold no toggle state.

```ts
import { MoveToTrashButton, TrashButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const moveToTrashButton = new MoveToTrashButton( {
  arrowColor: 'blue',
  listener: () => {
    particlesProperty.value = [];
  },
  tandem: tandem.createTandem( 'moveToTrashButton' )
} );

const trashButton = new TrashButton( {
  listener: () => {
    selectedItemProperty.value = null;
  },
  tandem: tandem.createTandem( 'trashButton' )
} );
```

## The family

| Class | Icon | Notable options | Typical use |
| --- | --- | --- | --- |
| `MoveToTrashButton` | Trash can plus a curved arrow pointing into it (`arrowColor`, default `'black'`; `iconScale`, default `0.46`) | `arrowColor` lets the arrow be color-coded to the thing being deleted (e.g. match a particle's color) | "Send this specific thing to the trash," where the arrow communicates *moving* something rather than an instantaneous delete |
| `MoveToTrashLegendButton` | Same icon as `MoveToTrashButton` (it's a direct subclass) | Muted, flat styling: `baseColor: 'rgb( 230, 230, 240 )'`, `buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy`, smaller `cornerRadius`/margins/`iconScale` | Appearing inside a legend or as part of a bar-chart label, where a bold yellow 3D button would be visually too loud |
| `TrashButton` | Plain trash can only, no arrow (`iconOptions`, default `{ scale: 0.95, fill: 'black' }`) | Simplest of the three — just the can | A direct "delete" action where the "moving into the trash" metaphor of the arrow isn't needed |

`MoveToTrashButton` and `TrashButton` both default `baseColor` to `PhetColorScheme.BUTTON_YELLOW` (inherited from `RectangularPushButtonOptions`, not overridden); `MoveToTrashLegendButton` overrides it to a muted gray-blue since it's meant to sit quietly inside other content.

::: tip Pick the icon based on whether "moving" is meaningful
Use `MoveToTrashButton` when the action reads as relocating a specific object (a draggable item, a data point) into a trash can — the arrow reinforces that. Use plain `TrashButton` for a generic "delete/clear" action where there's nothing being visually "moved." Reach for `MoveToTrashLegendButton` only when the button itself is a label inside a legend, not a primary interactive control.
:::
