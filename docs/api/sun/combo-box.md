---
title: ComboBox
description: A dropdown selector bound to a Property over an enumerated set of items.
category: api
library: sun
tags: [sun, ComboBox]
status: verified
related:
  - /api/sun/radio-button-group
  - /api/sun/checkbox
  - /api/sun/list-box
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ComboBox

`ComboBox` (from `scenerystack/sun`) is a dropdown selector: a button showing the current selection, which opens a popup list box of items when pressed. It's bound to a settable `Property<T>` over a fixed, enumerated set of values — reach for it instead of a [radio button group](/api/sun/radio-button-group) when there are too many options (or too little screen space) to show them all at once.

```ts
import { ComboBox, type ComboBoxItem } from 'scenerystack/sun';
import { Text, Node } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Units = 'meters' | 'feet';
const unitsProperty = new Property<Units>( 'meters' );

// The list box pops up above this Node, so it renders in front of everything else.
const listParent = new Node();

const items: ComboBoxItem<Units>[] = [
  { value: 'meters', createNode: () => new Text( 'meters' ) },
  { value: 'feet', createNode: () => new Text( 'feet' ) }
];

const unitsComboBox = new ComboBox( unitsProperty, items, listParent, {
  tandem: Tandem.REQUIRED
} );

// listParent must be added to the scene graph as an ancestor of unitsComboBox,
// typically near the top of the ScreenView so the popup list isn't clipped.
screenView.addChild( unitsComboBox );
screenView.addChild( listParent );
```

## Constructor arguments

| Argument | Effect |
| --- | --- |
| `property` | The settable `Property<T>` whose value the combo box displays and controls |
| `items` | `ComboBoxItem<T>[]` — `{ value, createNode, tandemName?, accessibleName?, soundPlayer? }`, in the order they appear in the list |
| `listParent` | The `Node` the popup list box is added to; give it an ancestor high enough in the scene graph that the list isn't clipped or drawn behind other content |

## Options

| Option | Effect |
| --- | --- |
| `listPosition` | `'above'` or `'below'` the button (default `'below'`) |
| `align` | `'left'` \| `'right'` \| `'center'` alignment of each item within the button/list |
| `buttonFill` / `buttonStroke` | Button appearance |
| `listFill` / `listStroke` | List box appearance |
| `highlightFill` | Highlight shown behind the item under the pointer |
| `cornerRadius` | Applied to both button and list box |
| `xMargin` / `yMargin` | Margins around content in the button and list |
| `buttonTouchAreaXDilation` / `buttonTouchAreaYDilation` | Expand the button's touch hit area |

::: warning `createNode`, not a shared `node`
Each `ComboBoxItem` supplies a `createNode: ( tandem ) => Node` factory, not a pre-built `Node` instance — `ComboBox` calls it once per item to create the Node actually placed in the list. This lets the same item description be reused safely and lets each item's Node be tandem-instrumented individually.
:::
