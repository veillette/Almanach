---
title: Scenery Layout Examples
description: Worked FlowBox/GridBox layouts for common UI arrangements.
category: examples
tags: [example, scenery, layout]
status: verified
related:
  - /patterns/options-pattern
  - /accessibility/pdom
  - /api/sun/panel
  - /api/sun/hslider
  - /api/sun/combo-box
  - /api/scenery-phet/phet-font
prerequisites:
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Scenery Layout Examples

Scenery ships two layout containers — `FlowBox` (one-dimensional, CSS-flexbox-like) and `GridBox` (two-dimensional, CSS-grid-like) — that automatically reposition their children whenever a child's bounds change, so you stop computing `x`/`y` by hand. This page works through four arrangements that come up in almost every simulation: a horizontal toolbar, a vertical control stack, a labeled settings grid, and nesting the two together.

`HBox` and `VBox` are just `FlowBox` with `orientation` fixed to `'horizontal'`/`'vertical'` — the examples below use them directly since that's what you reach for day to day, and switch to a bare `FlowBox` only when the orientation itself needs to change.

## A horizontal toolbar (HBox)

Evenly spaced buttons, vertically centered on each other regardless of individual height:

```ts
import { HBox } from 'scenerystack/scenery';
import { RectangularPushButton } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';

const toolbar = new HBox( {
  spacing: 8,
  align: 'center',
  children: [
    new RectangularPushButton( { content: new Text( 'Undo' ) } ),
    new RectangularPushButton( { content: new Text( 'Redo' ) } ),
    new RectangularPushButton( { content: new Text( 'Clear' ) } )
  ]
} );
```

`align: 'center'` controls placement on the *cross* axis (vertical, since this box is horizontal) — every button's vertical center lines up even if one has taller content.

## A vertical control stack (VBox)

Controls of varying width, all left-aligned, with each control's own left edge sharing one column:

```ts
import { VBox } from 'scenerystack/scenery';
import { HSlider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const speedProperty = new NumberProperty( 1, { range: new Range( 0, 5 ) } );
const volumeProperty = new NumberProperty( 0.5, { range: new Range( 0, 1 ) } );

const controlStack = new VBox( {
  spacing: 12,
  align: 'left',
  children: [
    new HSlider( speedProperty, new Range( 0, 5 ) ),
    new HSlider( volumeProperty, new Range( 0, 1 ) )
  ]
} );
```

Reordering `children`, adding, or removing an item automatically reflows everything below it — nothing needs to be repositioned by hand.

## A labeled settings grid (GridBox)

`GridBox` places each child at an explicit `row`/`column` using per-child `layoutOptions`, rather than relying purely on array order — handy for a two-column "label, control" settings form:

```ts
import { GridBox, Node, Text } from 'scenerystack/scenery';
import { Checkbox, ComboBox } from 'scenerystack/sun';
import { BooleanProperty, Property } from 'scenerystack/axon';

const soundEnabledProperty = new BooleanProperty( true );
const languageProperty = new Property( 'en' );

// The ComboBox's popup list is added here, high enough in the scene graph to avoid being clipped.
const listParent = new Node();

const settingsGrid = new GridBox( {
  xSpacing: 20,
  ySpacing: 10,
  xAlign: 'left',
  children: [
    new Text( 'Sound' , { layoutOptions: { row: 0, column: 0 } } ),
    new Checkbox( soundEnabledProperty, new Text( 'Enabled' ), { layoutOptions: { row: 0, column: 1 } } ),

    new Text( 'Language', { layoutOptions: { row: 1, column: 0 } } ),
    new ComboBox( languageProperty, [
      { value: 'en', createNode: () => new Text( 'English' ) },
      { value: 'fr', createNode: () => new Text( 'Français' ) }
    ], listParent, { layoutOptions: { row: 1, column: 1 } } )
  ]
} );
```

`listParent` itself must still be added to the scene graph as an ancestor of `settingsGrid` (see [ComboBox](/api/sun/combo-box)) — it's omitted from `settingsGrid.children` on purpose so the popup list isn't laid out as a grid cell.

Every child's `layoutOptions.row`/`layoutOptions.column` places it in the grid; `xAlign`/`yAlign` control alignment *within* each cell, and `xSpacing`/`ySpacing` control the gaps between columns/rows.

::: tip `row`/`column` live in `layoutOptions`, not on the child directly
`GridBox` reads placement from each child's `layoutOptions` object (`{ row, column, horizontalSpan, verticalSpan }`), not from a constructor argument to `GridBox` itself. Setting `someNode.layoutOptions = { row: 2, column: 0 }` after construction re-triggers layout the same way changing `children` does.
:::

## Nesting FlowBox inside GridBox

Layout containers are themselves `Node`s, so they nest freely — a common shape is a `GridBox` of labeled rows where each row's control is itself an `HBox` (e.g. a slider plus a numeric readout):

```ts
import { GridBox, HBox, VBox, Text } from 'scenerystack/scenery';
import { HSlider } from 'scenerystack/sun';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const massProperty = new NumberProperty( 50, { range: new Range( 10, 200 ) } );

const massRow = new HBox( {
  spacing: 10,
  children: [
    new HSlider( massProperty, new Range( 10, 200 ) ),
    new Text( massProperty.value.toFixed( 0 ) ) // update via massProperty.link in real code
  ]
} );

const panelContent = new VBox( {
  spacing: 15,
  align: 'left',
  children: [
    new Text( 'Mass (kg)' ),
    massRow
  ]
} );
```

Wrap the result in a [`Panel`](/api/sun/panel) to give the whole cluster a border and background, as shown in the [Accessible Control Panel Example](/examples/accessible-control-panel-example).

::: warning `resize: false` freezes a layout container's own bounds, not its children's positions
By default (`resize: true`), a `FlowBox`/`GridBox` re-runs layout whenever a child's bounds change and updates its own bounds to match. Setting `resize: false` stops it from *resizing itself* after the first layout — it still repositions children on the next explicit layout pass, so use it deliberately (e.g. to reserve a fixed footprint) rather than as a general "stop updating" switch.
:::

## Where to go next

- [The Options Pattern](/patterns/options-pattern) — how `layoutOptions` and every other options object are typed and merged
- [Panel](/api/sun/panel) — bordering a layout container's output
- [The Parallel DOM](/accessibility/pdom) — controlling *keyboard* traversal order independently of layout order
- [Accessible Control Panel Example](/examples/accessible-control-panel-example) — a full worked panel combining these layouts with PDOM
