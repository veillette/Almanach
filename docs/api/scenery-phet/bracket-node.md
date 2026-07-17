---
title: BracketNode
description: A curly-brace-like bracket Path with a single tip, optionally labeled, pointing in one of four directions.
category: api
library: scenery-phet
tags: [scenery-phet, BracketNode, bracket, label]
status: complete
related:
  - /api/scenery/path
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BracketNode

`BracketNode` (from `scenerystack/scenery-phet`) draws a single smooth bracket — two curved end caps joined by straight sides that meet at one rounded tip — with an optional label centered on that tip. It's the shape used to visually group a span of other content and attach one caption to the group, e.g. spanning several bars in a graph with a bracket labeled "total," rather than labeling each bar individually.

```ts
import { BracketNode } from 'scenerystack/scenery-phet';
import { Text } from 'scenerystack/scenery';
```

<SceneryDemo demo="bracket-node" />

## A minimal example

```ts
const bracketNode = new BracketNode( {
  orientation: 'down',
  bracketLength: 150,
  labelNode: new Text( 'Total distance' )
} );
bracketNode.centerX = layoutBounds.centerX;
bracketNode.top = 50;
screenView.addChild( bracketNode );
```

With the default `orientation: 'down'`, the bracket's tip points downward and the label is centered just below it — position `bracketNode` so its straight top edge spans whatever content it's grouping, with the tip/label hanging below.

## Constructor

```ts
new BracketNode( providedOptions?: BracketNodeOptions )
```

`BracketNode` takes no required arguments — the bracket's length, tip position, and appearance are all options.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `orientation` | `'down'` | `'left'` \| `'right'` \| `'up'` \| `'down'` — the direction the bracket's tip points |
| `labelNode` | `null` | An optional `Node` (typically `Text`) centered on the tip, offset by `spacing` |
| `bracketLength` | `100` | Overall length of the bracket, along its straight (non-tip) axis |
| `bracketTipPosition` | `0.5` | Where along `bracketLength` (exclusive `0` to `1`) the tip sits — `0.5` centers it |
| `bracketEndRadius` | `5` | Radius of the curved caps at each end of the bracket |
| `bracketTipRadius` | `6` | Radius of the two small curves forming the tip's point |
| `bracketStroke` | `'black'` | Stroke color/paint of the bracket path |
| `bracketLineWidth` | `1` | Stroke width of the bracket path |
| `spacing` | `2` | Gap between the bracket's tip and `labelNode` |

```ts
// A bracket pointing right, with its tip 30% of the way down its length.
const sideBracket = new BracketNode( {
  orientation: 'right',
  bracketLength: 80,
  bracketTipPosition: 0.3,
  labelNode: new Text( 'Δy' )
} );
```

::: tip `bracketTipPosition` must leave room for the end and tip radii
`BracketNode` is built as a horizontal, downward-pointing shape and then rotated into place for other orientations. It asserts that the computed tip position falls strictly between `bracketEndRadius + bracketTipRadius` and `bracketLength - ( bracketEndRadius + bracketTipRadius )` — pushing `bracketTipPosition` too close to `0` or `1` (especially combined with large radii) throws at construction rather than silently clipping the shape.
:::
