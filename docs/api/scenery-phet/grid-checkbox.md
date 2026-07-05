---
title: GridCheckbox and GridIcon
description: A Checkbox pre-built with a small NxN-grid icon, for toggling a coordinate grid's visibility.
category: api
library: scenery-phet
tags: [scenery-phet, GridCheckbox, GridIcon, checkbox, grid]
status: complete
related:
  - /api/sun/checkbox
  - /api/scenery-phet/grid-node
  - /api/axon/boolean-property
prerequisites:
  - /api/sun/checkbox
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GridCheckbox and GridIcon

`GridCheckbox` (from `scenerystack/scenery-phet`) is a [`Checkbox`](/api/sun/checkbox) whose label is a small grid-of-squares icon instead of text — the standard PhET affordance for "show/hide the coordinate grid" controls, most often paired with a [`GridNode`](/api/scenery-phet/grid-node) via a shared `Property<boolean>`. `GridIcon` is the icon itself (an NxN grid of lines drawn as a single `Path`), exported separately in case you need the icon without the checkbox behavior — e.g. inside a toolbar button or a legend.

```ts
import { GridCheckbox, GridIcon } from 'scenerystack/scenery-phet';
import { BooleanProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const gridVisibleProperty = new BooleanProperty( false );

const gridCheckbox = new GridCheckbox( gridVisibleProperty, {
  tandem: tandem.createTandem( 'gridCheckbox' )
} );

// Elsewhere, a GridNode reacts to the same Property:
gridNode.visibleProperty = gridVisibleProperty;
```

## Constructors

```ts
new GridCheckbox( property: Property<boolean>, providedOptions?: GridCheckboxOptions )

new GridIcon( providedOptions?: GridIconOptions )
```

`GridCheckboxOptions` is `{ iconOptions?: GridIconOptions } & CheckboxOptions` — `GridCheckbox` accepts every [`Checkbox`](/api/sun/checkbox) option (`boxWidth`, `touchAreaXDilation`, `tandem`, etc.) plus `iconOptions` to customize the grid icon it builds internally.

## GridIcon options

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `30` | Width and height of the icon, in pixels (the icon is always square) |
| `numberOfRows` | `4` | Number of rows (and, since the grid is always N×N, columns) of cells; must be an integer greater than `2` |
| `stroke` | `'rgb( 100, 100, 100 )'` | Line color of the grid lines (any `PathOptions` field is also accepted) |
| `lineWidth` | `1` | Line thickness of the grid lines |

```ts
const bigGridIcon = new GridIcon( { size: 20, numberOfRows: 3, stroke: 'black' } );
const gridCheckbox = new GridCheckbox( gridVisibleProperty, { iconOptions: { size: 20 } } );
```

::: tip `GridCheckbox` and `GridNode` are independent — you wire them together
Neither Node knows about the other; `GridCheckbox` only flips a `Property<boolean>`, and [`GridNode`](/api/scenery-phet/grid-node) only draws lines. The common pattern is to pass the same `BooleanProperty` as `gridCheckbox`'s bound property and as `gridNode`'s `visibleProperty`, so checking the box shows the grid and unchecking it hides it — but nothing stops you from using `GridCheckbox` to drive a completely different piece of grid-shaped state.
:::
