---
title: ChemUtils
description: Plain-object chemistry helpers for molecular formulas, Hill-system sorting, and HTML subscript formatting in nitroglycerin sims.
category: api
library: nitroglycerin
tags: [nitroglycerin, ChemUtils, Element, chemistry, formula]
status: verified
prerequisites:
  - /api/nitroglycerin/atom-and-element
related:
  - /api/nitroglycerin/atom-and-element
  - /api/nitroglycerin/molecule-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# ChemUtils

`ChemUtils` (from `scenerystack/nitroglycerin`) is a plain object of static chemistry helpers — not a class you construct. Simulation code reaches for it when building molecular formula strings from [`Element`](/api/nitroglycerin/atom-and-element) lists, sorting atoms for Hill-system display order, or turning plain-text formulas like `C2H4` into HTML subscripts for `RichText`.

```ts
import { ChemUtils, Element } from 'scenerystack/nitroglycerin';

const elements = [ Element.C, Element.C, Element.H, Element.H, Element.H, Element.H ];

ChemUtils.createSymbolWithoutSubscripts( elements ); // "C2H4"
ChemUtils.createSymbol( elements );                  // "C<sub>2</sub>H<sub>4</sub>"
ChemUtils.toSubscript( 'C2H4' );                     // same HTML subscript form
```

## Formula helpers

| Method | Description |
| --- | --- |
| `createSymbolWithoutSubscripts( elements )` | Builds a plain-text formula from an ordered `Element[]`, collapsing consecutive identical elements into counts (e.g. `[C,C,H,H,H,H]` → `"C2H4"`) |
| `createSymbol( elements )` | Same as above, then runs `toSubscript()` for HTML display |
| `toSubscript( inputString )` | Wraps every digit run in `<sub>` tags — `'C2H4'` → `'C<sub>2</sub>H<sub>4</sub>'` |

The input `elements` array must list atoms **in the order they should appear in the symbol** — `ChemUtils` does not infer ordering from connectivity; use the Hill-system sorters below when you need standard ordering first.

## Hill-system sorting

| Method | Description |
| --- | --- |
| `carbonHillSortValue( element )` | Sort key when the molecule contains carbon — carbon first, then hydrogen, then other elements alphabetically |
| `nonCarbonHillSortValue( element )` | Sort key for molecules without carbon — alphabetical by element symbol, with two-letter symbols after one-letter symbols sharing the same first character |

These return integers suitable for `Array.sort()` — lower values sort earlier. See the [Hill system](https://en.wikipedia.org/wiki/Hill_system) for the convention they implement.

::: tip Prefer prebuilt molecule Nodes for common formulas
Nitroglycerin also exports dozens of ready-made `*Node` classes (`H2ONode`, `CO2Node`, …) and [`MoleculeNode`](/api/nitroglycerin/molecule-node) for drawing. Reach for `ChemUtils` when your sim builds formulas dynamically from a model's atom list rather than from a fixed chemical identity.
:::