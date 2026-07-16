---
title: VerticalCheckboxGroup
description: A convenience VBox layout of several independent Checkboxes, one per boolean Property.
category: api
library: sun
tags: [sun, VerticalCheckboxGroup, Checkbox]
status: complete
related:
  - /api/sun/checkbox
  - /api/scenery/v-box
prerequisites:
  - /api/sun/checkbox
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# VerticalCheckboxGroup

`VerticalCheckboxGroup` (from `scenerystack/sun`) is a `VBox` of several [`Checkbox`](/api/sun/checkbox)es, each bound to its own independent `PhetioProperty<boolean>` — unlike a radio button group, there's no shared selection Property; each checkbox in the list can be checked or unchecked independently. Reach for it whenever you'd otherwise construct several `Checkbox`es and a `VBox` by hand and want consistent spacing/pointer-area dilation across all of them for free.

```ts
import { VerticalCheckboxGroup, type VerticalCheckboxGroupItem } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { BooleanProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const gravityEnabledProperty = new BooleanProperty( true );
const frictionEnabledProperty = new BooleanProperty( false );

const items: VerticalCheckboxGroupItem[] = [
  { property: gravityEnabledProperty, createNode: () => new Text( 'Gravity' ), tandemName: 'gravityCheckbox' },
  { property: frictionEnabledProperty, createNode: () => new Text( 'Friction' ), tandemName: 'frictionCheckbox' }
];

const optionsGroup = new VerticalCheckboxGroup( items, {
  tandem: Tandem.REQUIRED
} );
```

Each `VerticalCheckboxGroupItem` needs its own `property` and a `createNode()` that builds the checkbox's label — this is the same `createNode`-per-item shape used by `ToggleNode`, `AquaRadioButtonGroup`, and `RectangularRadioButtonGroup` elsewhere in `scenerystack/sun`.

<SceneryDemo demo="vertical-checkbox-group" />

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `spacing` | `10` | Vertical spacing between checkboxes (this is a `VBoxOptions` passthrough) |
| `checkboxOptions` | — | Options applied to every individual `Checkbox` (`boxWidth`, `checkboxColor`, …) |
| `touchAreaXDilation` | `5` | X dilation of each checkbox's touch area (Y dilation is computed automatically from `spacing`) |
| `mouseAreaXDilation` | `5` | Same, for mouse areas |
| `align` | `'left'` | Inherited `VBoxOptions` default — left-aligns all checkboxes |

Per-item `options` (on each `VerticalCheckboxGroupItem`) override `checkboxOptions` for that one checkbox, same precedence as `RectangularRadioButtonGroupItem.options` overriding `radioButtonOptions`.

::: tip Each checkbox keeps its own PhET-iO identity
Give every item a `tandemName` (e.g. `'gravityCheckbox'`) rather than relying on index-based naming — `VerticalCheckboxGroup` creates each `Checkbox`'s tandem via `options.tandem.createTandem( item.tandemName )` when supplied, or falls back to `Tandem.OPTIONAL` otherwise.
:::

::: warning This is a layout convenience, not a mutually-exclusive group
Because each checkbox is bound to its own `Property<boolean>`, any number of them (including zero or all) can be checked simultaneously. If you need exactly-one-of-N selection, reach for [Radio Button Groups](/api/sun/radio-button-group) instead — `VerticalCheckboxGroup` and radio button groups solve different problems despite the similar vertical-list appearance.
:::
