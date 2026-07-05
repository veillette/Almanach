---
title: AquaRadioButtonGroup
description: Aqua-style radio button groups bound to a Property, plus the Horizontal/VerticalAquaRadioButtonGroup orientation convenience subclasses.
category: api
library: sun
tags: [sun, AquaRadioButtonGroup, HorizontalAquaRadioButtonGroup, VerticalAquaRadioButtonGroup, RadioButtonGroup]
status: complete
related:
  - /api/sun/radio-button-group
  - /api/sun/aqua-radio-button
  - /api/sun/checkbox
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AquaRadioButtonGroup

`AquaRadioButtonGroup<T>` (from `scenerystack/sun`) lays out an [`AquaRadioButton`](/api/sun/aqua-radio-button) per item and manages selection, focus, and pointer areas as a group — this is the same class documented at a higher level on the [Radio Button Groups](/api/sun/radio-button-group) page; this page covers its API in more detail, plus its two orientation-fixing convenience subclasses.

```ts
import { AquaRadioButtonGroup, type AquaRadioButtonGroupItem } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Shape = 'circle' | 'square';
const shapeProperty = new Property<Shape>( 'circle' );

const items: AquaRadioButtonGroupItem<Shape>[] = [
  { value: 'circle', createNode: () => new Text( 'Circle' ) },
  { value: 'square', createNode: () => new Text( 'Square' ) }
];

const shapeGroup = new AquaRadioButtonGroup( shapeProperty, items, {
  orientation: 'vertical', // the default
  tandem: Tandem.REQUIRED
} );
```

Each item's `createNode` builds the *label* shown beside the round button — not the button's own content, which `AquaRadioButtonGroup` always draws itself. The group extends `FlowBox`, so it lays out like an `HBox`/`VBox` depending on `orientation`.

## HorizontalAquaRadioButtonGroup / VerticalAquaRadioButtonGroup

Both are thin subclasses with the exact same `(property, items, options?)` constructor as `AquaRadioButtonGroup`, minus the `orientation` option (which they fix for you):

| Class | Fixes |
| --- | --- |
| `HorizontalAquaRadioButtonGroup` | `orientation: 'horizontal'` |
| `VerticalAquaRadioButtonGroup` | `orientation: 'vertical'`, `align: 'left'` |
| `AquaRadioButtonGroup` | Neither — `orientation` defaults to `'vertical'` but can be set explicitly |

```ts
import { VerticalAquaRadioButtonGroup } from 'scenerystack/sun';

const verticalGroup = new VerticalAquaRadioButtonGroup( shapeProperty, items, {
  tandem: Tandem.REQUIRED
} );
```

Reach for the orientation-fixed subclasses for an ordinary fixed-layout group — they read more clearly and remove one option you'd otherwise remember to set; use `AquaRadioButtonGroup` directly when orientation needs to vary at runtime or your code is generic over it.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `orientation` | `'vertical'` | `'horizontal'` or `'vertical'` layout (fixed on the two subclasses) |
| `spacing` | `3` | Space between adjacent buttons |
| `radioButtonOptions` | — | Options applied to every individual `AquaRadioButton` (`radius`, `selectedColor`, `xSpacing`, …) |
| `touchAreaXDilation` / `touchAreaYDilation` | `0` / `0` | Dilation for each button's touch area (X ignored when horizontal, Y ignored when vertical) |
| `mouseAreaXDilation` / `mouseAreaYDilation` | `0` / `0` | Same, for mouse areas |
| `voicingHintResponse` | `null` | Spoken the first time focus lands in the group; falls back to `accessibleHelpText` |

Every item requires a unique `value`, and the group asserts that `property.value` matches one of the supplied items' values at construction — there is no "nothing selected" state.

## Methods

| Method | Effect |
| --- | --- |
| `getButton( value: T )` | Returns the `AquaRadioButton<T>` instance for a given value |

::: tip Choosing between Aqua and rectangular groups
Use `AquaRadioButtonGroup` for a traditional list of labeled options (settings panels, a vertical list of choices); use [`RectangularRadioButtonGroup`](/api/sun/radio-button-group) when the options are best shown as boxed buttons — icons or short labels the user clicks directly. See the [Radio Button Groups](/api/sun/radio-button-group) overview for the full comparison.
:::
