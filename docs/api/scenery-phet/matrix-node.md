---
title: MatrixNode
description: Renders an MxN matrix of numbers or strings between bracket glyphs, in row-major order.
category: api
library: scenery-phet
tags: [scenery-phet, MatrixNode, matrix, math]
status: complete
related:
  - /api/dot/matrix3
  - /api/scenery-phet/phet-font
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# MatrixNode

`MatrixNode` (from `scenerystack/scenery-phet`) displays a static MxN grid of values — numbers or strings — flanked by hand-drawn bracket shapes, the standard way to typeset a mathematical matrix. It was built for a specific demo (a Google Group question about rendering matrices in HTML5) rather than as a general linear-algebra display widget, so treat it as a solid starting point rather than a fully general math-typesetting tool.

```ts
import { MatrixNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const matrixNode = new MatrixNode( [
  [ 2, 3, -2 ],
  [ 1, 0, -4 ],
  [ 2, -1, -6 ]
], {
  decimalPlaces: 0,
  cellXSpacing: 20
} );
```

Values may be numbers or strings, mixed freely within the same matrix — a string is rendered verbatim (handy for a variable name or an ellipsis), while a number is formatted according to `decimalPlaces` and `stripTrailingZeros`. Every row must have the same number of columns; `MatrixNode` asserts this at construction.

## Constructor

```ts
new MatrixNode( matrix: ( number | string )[][], options?: object )
```

`matrix` is in row-major order: `matrix[ row ][ column ]`.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `font` | `new PhetFont( 20 )` | Font used for every cell value |
| `decimalPlaces` | `0` | Decimal places shown for numeric cell values |
| `stripTrailingZeros` | `true` | Whether `1.20` collapses to `1.2`; set `false` to keep a fixed number of decimals |
| `cellXSpacing` | `25` | Horizontal spacing between columns |
| `cellYSpacing` | `5` | Vertical spacing between rows |
| `leftBracketXSpacing` / `rightBracketXSpacing` | `10` / `10` | Horizontal gap between each bracket and the grid of values |
| `bracketWidth` | `8` | Width (horizontal extent) of each bracket's "foot" |
| `bracketHeightPadding` | `5` | Extra height added above/below the grid when sizing the brackets |
| `bracketNodeOptions` | `{ stroke: 'black', lineWidth: 2 }` | `Path` options forwarded to both bracket shapes |

::: tip Cells are right-aligned and sized via a shared `AlignGroup`
Every cell is wrapped in an `AlignBox` sharing one `AlignGroup`, so all cells in the matrix occupy the same width and align consistently on their right edge — a matrix mixing `-6` and `100` won't have its columns drift out of alignment. There's no built-in support for per-column alignment or column headers; build a wrapper `Node` around `MatrixNode` if you need those.
:::
