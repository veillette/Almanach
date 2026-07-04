---
title: Radio Button Groups
description: Mutually-exclusive selection bound to a Property (rectangular and Aqua styles).
category: api
library: sun
tags: [sun, radio-button-group]
status: verified
related:
  - /api/sun/combo-box
  - /api/sun/checkbox
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Radio Button Groups

A radio button group binds a settable `Property<T>` to a fixed set of mutually-exclusive options, exactly one of which is ever selected. `scenerystack/sun` exports two visual styles: `RectangularRadioButtonGroup<T>` (boxed buttons, each showing a Node — icons or text) and `AquaRadioButtonGroup<T>` (the classic circular radio-button look, each with an associated label Node). Use rectangular groups when the options are best shown as buttons (icons, short labels); use Aqua groups for a traditional list of labeled options.

```ts
import { RectangularRadioButtonGroup, type RectangularRadioButtonGroupItem } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Shape = 'circle' | 'square';
const shapeProperty = new Property<Shape>( 'circle' );

const items: RectangularRadioButtonGroupItem<Shape>[] = [
  { value: 'circle', createNode: () => new Text( 'Circle' ) },
  { value: 'square', createNode: () => new Text( 'Square' ) }
];

const shapeRadioButtonGroup = new RectangularRadioButtonGroup( shapeProperty, items, {
  orientation: 'horizontal',
  tandem: Tandem.REQUIRED
} );
```

`AquaRadioButtonGroup` has the same `(property, items, options?)` shape, but each item's `createNode` supplies the *label* shown next to the round button, not the button's own content:

```ts
import { AquaRadioButtonGroup, type AquaRadioButtonGroupItem } from 'scenerystack/sun';

const items: AquaRadioButtonGroupItem<Shape>[] = [
  { value: 'circle', createNode: () => new Text( 'Circle' ) },
  { value: 'square', createNode: () => new Text( 'Square' ) }
];

const aquaGroup = new AquaRadioButtonGroup( shapeProperty, items, {
  orientation: 'vertical', // the default
  tandem: Tandem.REQUIRED
} );
```

`HorizontalAquaRadioButtonGroup` and `VerticalAquaRadioButtonGroup` are convenience subclasses that fix `orientation` for you, if you'd rather not pass it explicitly.

## Options

Both groups are laid out as a `FlowBox`, so `orientation`, `spacing`, and alignment options apply directly. Group-specific highlights:

| Option | Group | Effect |
| --- | --- | --- |
| `orientation` | both | `'horizontal'` or `'vertical'` (default `'vertical'` for both) |
| `spacing` | both | Space between adjacent buttons |
| `radioButtonOptions` | both | Options applied to every individual button (e.g. `baseColor`, `cornerRadius` for rectangular; `radius` for Aqua) |
| `labelAlign` | rectangular | Where an item's optional `label` (outside the button) appears: `'top'`\|`'bottom'`\|`'left'`\|`'right'` |
| `labelSpacing` | rectangular | Space between the button and its optional external `label` |
| `touchAreaXDilation` / `touchAreaYDilation` | both | Expand each button's touch hit area |
| `soundPlayers` | rectangular | Array of one `TSoundPlayer` per button, overriding the default selection sounds |

Every item requires a unique `value`, and the group asserts that `property.value` matches one of the supplied items' values at construction time — there is no "nothing selected" state.

::: tip Rectangular items can have an external `label` too
`RectangularRadioButtonGroupItem` supports an optional `label: Node` in addition to `createNode` — that label is placed *outside* the button (per `labelAlign`), which is handy when the button itself is just an icon and you want a caption beneath it.
:::

::: warning Aqua vs. rectangular items mean different things
For `RectangularRadioButtonGroupItem`, `createNode` builds the button's own content (what's inside the box). For `AquaRadioButtonGroupItem`, `createNode` builds the *label beside* the round button — the round indicator itself is drawn by `AquaRadioButtonGroup`, not by your Node. Swapping the two styles isn't a drop-in replacement.
:::
