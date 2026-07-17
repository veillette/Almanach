---
title: GridNode
description: A Path drawing an evenly-spaced coordinate grid, positioned and re-projected via a ModelViewTransform2 Property.
category: api
library: scenery-phet
tags: [scenery-phet, GridNode, grid, coordinates]
status: complete
related:
  - /api/phetcommon/model-view-transform
  - /api/scenery/path
  - /api/dot/vector2
prerequisites:
  - /api/phetcommon/model-view-transform
  - /api/scenery/path
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GridNode

`GridNode` (from `scenerystack/scenery-phet`) is a `Path` that draws a coordinate grid — evenly spaced horizontal and vertical lines centered on a model-coordinate point — to help users make quantitative comparisons between distances in the play area. It's a thin, purely-visual overlay: it takes a live `TReadOnlyProperty<ModelViewTransform2>` and redraws its shape every time the transform changes, so panning/zooming the view keeps the grid aligned with the model.

```ts
import { GridNode } from 'scenerystack/scenery-phet';
import { Vector2 } from 'scenerystack/dot';
```

<SceneryDemo demo="grid-node" />

## A minimal example

```ts
const gridNode = new GridNode(
  modelViewTransformProperty,  // TReadOnlyProperty<ModelViewTransform2>
  1,                           // spacing between grid lines, in model coordinates
  new Vector2( 0, 0 ),         // center of the grid, in model coordinates
  10,                          // numberOfGridLines on each side of center
  { stroke: 'gray' }
);
```

This draws 21 evenly spaced lines in each direction (10 on either side of `center`, plus the center line itself), each `spacing` model units apart.

## Constructor

```ts
new GridNode(
  transformProperty: TReadOnlyProperty<ModelViewTransform2>,
  spacing: number,
  center: Vector2,
  numberOfGridLines: number,
  providedOptions?: GridNodeOptions
)
```

`GridNodeOptions` is just `PathOptions` — `GridNode` has no options of its own beyond what any [`Path`](/api/scenery/path) accepts (it defaults `stroke` to `'gray'`).

## Parameters

| Parameter | Effect |
| --- | --- |
| `transformProperty` | Supplies the `ModelViewTransform2` used to project the grid's model-coordinate shape into view coordinates; re-projects on every change |
| `spacing` | Distance between adjacent grid lines, in model coordinates |
| `center` | The grid's center point, in model coordinates — lines are drawn symmetrically around it |
| `numberOfGridLines` | How many lines to draw on *each side* of `center`, per axis |

::: tip `spacing`, `center`, and `numberOfGridLines` are fixed at construction
Unlike `transformProperty`, the other three constructor arguments are plain values captured in a closure, not Properties — there's no way to change the spacing or extent of an existing `GridNode` later. If your sim needs a grid whose spacing changes at runtime (e.g. a "coarse/fine grid" toggle), construct a new `GridNode` (or swap between two pre-built ones) rather than mutating this one.
:::
