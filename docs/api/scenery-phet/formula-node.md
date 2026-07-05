---
title: FormulaNode
description: Renders a LaTeX-style math formula via KaTeX, as a DOM Node embedded in the scene graph.
category: api
library: scenery-phet
tags: [scenery-phet, FormulaNode, katex, latex, math]
status: complete
related:
  - /api/scenery-phet/math-symbol-font
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# FormulaNode

`FormulaNode` (from `scenerystack/scenery-phet`) renders a LaTeX-style string as typeset math, using the [KaTeX](https://katex.org/) library, and wraps the result in a `DOM` Node so it can be placed in the scene graph like any other visual. Reach for it when a formula needs real mathematical typesetting (fraction bars, radicals, summations, matrices) that [`RichText`](/api/scenery/rich-text) markup and [`MathSymbolFont`](/api/scenery-phet/math-symbol-font) italics can't express — a single italic variable or a simple superscript is usually better served by plain `RichText`, reserving `FormulaNode` for genuinely formula-shaped content.

```ts
import { FormulaNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const formulaNode = new FormulaNode( 'y = mx + b' );
formulaNode.center = layoutBounds.center;
screenView.addChild( formulaNode );

// Update the formula later:
formulaNode.formula = '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}';
```

## Constructor

```ts
new FormulaNode( formula: string, options?: object )
```

`FormulaNode` extends `DOM` and predates SceneryStack's typed-options convention — it has no exported `FormulaNodeOptions` type. The two formula-specific settings, `formula` and `displayMode`, are ordinary mutator keys you can pass in the options object or set as properties after construction, alongside anything `DOM`/`Node` accepts.

## Options / properties

| Option | Default | Effect |
| --- | --- | --- |
| `formula` | (constructor argument) | The LaTeX-style string to render, assumed to already be in math mode |
| `displayMode` | `true` | `true` renders KaTeX's "display" style (larger, on its own line, as `$$...$$` would in LaTeX); `false` renders "inline" style (more vertically compact, as `$...$` would) |

```ts
const inlineFormula = new FormulaNode( 'E = mc^2', { displayMode: false } );
```

## Methods

| Method | Effect |
| --- | --- |
| `setFormula( formula )` / `formula` (setter) | Updates the displayed formula and recomputes bounds |
| `getFormula()` / `formula` (getter) | Returns the currently displayed formula string |
| `setDisplayMode( mode )` / `displayMode` (setter) | Switches between display and inline KaTeX rendering |
| `getDisplayMode()` / `displayMode` (getter) | Returns the current display mode |

::: warning Requires the KaTeX preloads to be included in the sim
`FormulaNode` calls the global `katex.render(...)` — it does not bundle or lazily load KaTeX itself. Using `FormulaNode` in a sim requires including the KaTeX CSS/font and JS preloads (e.g. `katex-<version>-css-all.js` and `katex-<version>.min.js`) at build time; without them, `katex` is undefined and construction throws. If you only need italic variable names or simple superscripts/subscripts, `RichText` with [`MathSymbolFont`](/api/scenery-phet/math-symbol-font) avoids this dependency entirely.
:::
