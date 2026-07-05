---
title: StopSignNode
description: An octagonal red stop-sign icon with a white inner border and black outer border.
category: api
library: scenery-phet
tags: [scenery-phet, StopSignNode, icon, stop]
status: complete
related:
  - /api/scenery-phet/banned-node
  - /api/tandem/tandem
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StopSignNode

`StopSignNode` (from `scenerystack/scenery-phet`) draws a classic octagonal stop-sign icon: a red octagon, a thin white border, and a thin black outer border, built from three concentric regular-octagon `Path`s. It's a static, non-interactive icon — for the circle-slash "not allowed" icon instead, see [`BannedNode`](/api/scenery-phet/banned-node).

```ts
import { StopSignNode } from 'scenerystack/scenery-phet';
import { Tandem } from 'scenerystack/tandem';
```

## A minimal example

```ts
const stopIcon = new StopSignNode( {
  fillRadius: 18,
  tandem: Tandem.REQUIRED.createTandem( 'stopIcon' )
} );
```

## Constructor

```ts
new StopSignNode( providedOptions?: StopSignNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `fillRadius` | `23` | Radius of the innermost (red) octagon |
| `innerStrokeWidth` | `2` | Width of the white border, added on top of `fillRadius` |
| `outerStrokeWidth` | `1` | Width of the black border, added on top of `fillRadius + innerStrokeWidth` |
| `fill` | `'red'` | Color of the innermost octagon |
| `innerStroke` | `'white'` | Color of the middle border ring |
| `outerStroke` | `'black'` | Color of the outermost border ring |

The three borders are built as three separate, fully-filled octagon `Path`s stacked in z-order (outer, then inner-stroke, then fill) rather than as actual `stroke`s on a single `Path` — that's why they're configured as `fillRadius`/`innerStrokeWidth`/`outerStrokeWidth` instead of ordinary `Path` `stroke`/`lineWidth` options.

::: warning `tandem` is required by default
`StopSignNode`'s options default `tandem: Tandem.REQUIRED` (with `tandemNameSuffix: 'StopSignNode'`) — omitting `tandem` will assert in an instrumented sim. Pass `Tandem.OPT_OUT` explicitly if this particular icon genuinely doesn't need PhET-iO instrumentation.
:::
