---
title: ComboBoxDisplay
description: A ComboBox whose items are live NumberDisplay readouts instead of static labels - pick which of several dynamic quantities to show.
category: api
library: scenery-phet
tags: [scenery-phet, ComboBoxDisplay, NumberDisplay, ComboBox]
status: complete
related:
  - /api/sun/combo-box
  - /api/scenery-phet/number-display
  - /api/dot/range
prerequisites:
  - /api/sun/combo-box
  - /api/scenery-phet/number-display
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ComboBoxDisplay

`ComboBoxDisplay<T>` (from `scenerystack/scenery-phet`) combines a [`ComboBox`](/api/sun/combo-box) with a [`NumberDisplay`](/api/scenery-phet/number-display) per item: instead of choosing among static labels, the user chooses which of several *dynamic numeric quantities* to display, and the selected item's live value is what's shown in the closed combo box. It's the control to reach for when a sim lets the user pick, say, "voltage" vs. "current" vs. "resistance" to watch in one readout, rather than showing all three permanently.

Ordinary `ComboBox` items are built once with a `createNode` factory and don't grow or shrink afterward — `ComboBoxDisplay` adds the bookkeeping needed to keep each item's `NumberDisplay` from resizing as its underlying number changes, so the dropdown's layout doesn't jitter as values update in the background.

```ts
import { ComboBoxDisplay, type ComboBoxDisplayItem } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
import { Node } from 'scenerystack/scenery';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
type Quantity = 'voltage' | 'current';
const choiceProperty = new Property<Quantity>( 'voltage' );

const voltageProperty = new Property<number | null>( 9 );
const currentProperty = new Property<number | null>( 0.5 );

const listParent = new Node();

const items: ComboBoxDisplayItem<Quantity>[] = [
  { choice: 'voltage', numberProperty: voltageProperty, range: new Range( 0, 12 ), units: 'V' },
  { choice: 'current', numberProperty: currentProperty, range: new Range( 0, 2 ), units: 'A' }
];

const display = new ComboBoxDisplay( choiceProperty, items, listParent, {
  tandem: tandem.createTandem( 'quantityDisplay' )
} );

screenView.addChild( display );
screenView.addChild( listParent ); // must be an ancestor high enough not to be clipped
```

## Constructor

```ts
new ComboBoxDisplay<T>(
  choiceProperty: Property<T>,
  items: ComboBoxDisplayItem<T>[],
  listParent: Node,
  providedOptions?: ComboBoxDisplayOptions
)
```

As with plain `ComboBox`, `listParent` needs to be added to the scene graph as an ancestor high enough that the popup list isn't clipped or drawn behind other content.

## `ComboBoxDisplayItem<T>`

| Field | Effect |
| --- | --- |
| `choice` | The value of `choiceProperty` this item corresponds to |
| `numberProperty` | `TReadOnlyProperty<number \| null>` — the live value shown when this item is selected |
| `range` | The display range used to size this item's `NumberDisplay` (as with `NumberDisplay` itself, this bounds the layout width, not the value) |
| `units` | A string or `TReadOnlyProperty<string>` label appended to the formatted value |
| `numberDisplayOptions` | Per-item overrides, applied on top of `ComboBoxDisplayOptions.numberDisplayOptions` |
| `tandemName` | Tandem name for this item, as with a regular `ComboBoxItem` |

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `numberDisplayOptions` | borderless, right-aligned, zero-margin `NumberDisplay` styling | Propagated to every item's internal `NumberDisplay`; overridden per-item by that item's own `numberDisplayOptions` |
| `align` | `'right'` | Inherited from `ComboBoxOptions` — right-aligned suits numeric content better than `ComboBox`'s usual default |

::: tip Each item's `NumberDisplay` is capped to its initial size
`ComboBoxDisplay` sets `maxWidth`/`maxHeight` on each item's `NumberDisplay` to its size at construction time, so a value growing wider later (more digits, a longer unit string) gets clipped rather than resizing the dropdown. Pick a `range` (and `decimalPlaces`, if you override `numberDisplayOptions`) generous enough to cover every value the item will ever show.
:::
