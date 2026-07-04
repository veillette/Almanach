---
title: MathSymbolFont
description: The italic serif font PhET sims use for math symbols and variables, kept visually distinct from PhetFont.
category: api
library: scenery-phet
tags: [scenery-phet, MathSymbolFont, typography]
status: complete
related:
  - /api/scenery-phet/phet-font
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# MathSymbolFont

`MathSymbolFont` (from `scenerystack/scenery-phet`) is a `Font` subclass fixed to `"Times New Roman", Times, serif` and an italic style, used exclusively for rendering math symbols and variables (`x`, `y`, `θ`, …). It exists precisely so that math symbols look typographically different from ordinary sim UI text — which should always use [`PhetFont`](/api/scenery-phet/phet-font), a sans-serif family — matching the convention (borrowed from print textbooks) that variables are set in italic serif type.

```ts
import { MathSymbolFont } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
// Convenience form: just a size
const variableFont = new MathSymbolFont( 18 );

const xLabel = new Text( 'x', { font: variableFont } );
```

```ts
// Embedding a symbol inside a larger RichText string, without a separate Text node
const equationText = new RichText(
  `F = ${MathSymbolFont.getRichTextMarkup( 'm' )}${MathSymbolFont.getRichTextMarkup( 'a' )}`
);
```

## Constructor

```ts
new MathSymbolFont( providedOptions?: number | string | MathSymbolFontOptions )
```

A bare `number` or `string` is shorthand for `{ size: providedOptions }`, matching `PhetFont`'s convenience form. `MathSymbolFontOptions` is `FontOptions` minus `family` — `family` is fixed and cannot be overridden through the constructor.

## Static members

| Member | Description |
| --- | --- |
| `MathSymbolFont.FAMILY` | The fixed font family string, `'"Times New Roman", Times, serif'` |
| `MathSymbolFont.getRichTextMarkup( text, style? )` | Returns a `<span style="...">` markup fragment that renders `text` in the math-symbol family/style, for embedding inside a `RichText` string alongside other content |
| `MathSymbolFont.createDerivedProperty( symbolStringProperty, options? )` | Wraps a dynamic (i18n) string Property so its value is always the `RichText`-markup-wrapped form, for use directly as `RichText` content |

## `PhetFont` vs. `MathSymbolFont`

| | `PhetFont` | `MathSymbolFont` |
| --- | --- | --- |
| Family | Sans-serif (PhET's configured UI family) | Serif (`Times New Roman`) |
| Style | Upright (unless you set `style: 'italic'` yourself) | Italic by default |
| Use for | Labels, titles, readouts — all ordinary sim UI text | Math variables and symbols only (`x`, `t`, `θ`) |

::: tip Use `getRichTextMarkup`/`createDerivedProperty` when mixing symbols into a larger string
Constructing a whole separate `Text` node with `MathSymbolFont` only works for a standalone symbol. If a symbol appears inline within a larger translated string (e.g. "Velocity, *v*, is constant"), use `MathSymbolFont.getRichTextMarkup()` (or its Property-aware counterpart) inside a `RichText` instead, so the symbol's italic serif styling survives string interpolation and translation.
:::
