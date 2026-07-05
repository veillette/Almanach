---
title: Fraction Display Nodes
description: A small family of Nodes for rendering fractions, mixed numbers, and hand-drawn plus/minus signs without relying on Text glyphs.
category: api
library: scenery-phet
tags: [scenery-phet, MixedFractionNode, PropertyFractionNode, MinusNode, PlusNode, fraction, math]
status: complete
related:
  - /api/phetcommon/fraction
  - /api/scenery-phet/phet-font
  - /api/axon/property
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Fraction Display Nodes

Four small `scenerystack/scenery-phet` Nodes share a common motivation: rendering mathematical marks (fractions, mixed numbers, plus/minus signs) as precisely-positioned shapes instead of relying on a font's glyphs for `-`, `+`, or a fraction bar. Font rendering of `-` and `+` varies across platforms and is hard to center reliably (particularly on Windows), so PhET builds these as `Rectangle`/`Path` primitives instead. `MixedFractionNode` and `PropertyFractionNode` build on the same idea for fractions — a numerator, a denominator, an optional whole-number part, and a hand-drawn horizontal line (a "vinculum") between them.

```ts
import { MixedFractionNode, PropertyFractionNode, MinusNode, PlusNode } from 'scenerystack/scenery-phet';
```

## MixedFractionNode

The base display: an `HBox` with an optional whole-number `Text`, followed by a numerator/vinculum/denominator stack, wherever you set them imperatively via setters. Passing `null` to any of `whole`/`numerator`/`denominator` leaves that slot blank (and removed from layout, for `whole`).

```ts
const fractionNode = new MixedFractionNode( {
  whole: 1,
  numerator: 3,
  denominator: 4,
  wholeNumberFont: new PhetFont( 40 ),
  fractionNumbersFont: new PhetFont( 24 )
} );

// Change a value later — MixedFractionNode rebuilds its own layout:
fractionNode.numerator = 1;
```

| Option | Default | Effect |
| --- | --- | --- |
| `whole` / `numerator` / `denominator` | `null` | Initial values; `null` hides that slot |
| `maxWhole` / `maxNumerator` / `maxDenominator` | `null` | If set, reserves layout space for every value from `0` up to this maximum, so changing the digit doesn't shift surrounding layout |
| `wholeFill` / `numeratorFill` / `denominatorFill` / `separatorFill` | `'black'` | Per-part colors, including the vinculum (`separatorFill`) |
| `wholeNumberFont` | `new PhetFont( 50 )` | Font for the whole-number part |
| `fractionNumbersFont` | `new PhetFont( 30 )` | Font for the numerator and denominator |
| `vinculumLineWidth` | `2` | Stroke width of the fraction bar |
| `vinculumExtension` | `0` | How far the fraction bar extends past the numerator/denominator bounds on both sides |
| `vinculumLineCap` | `'butt'` | Line cap style of the fraction bar |

## PropertyFractionNode

`PropertyFractionNode extends MixedFractionNode`, replacing the imperative setters with a live binding to a numerator `Property<number>` and a denominator `Property<number>` — the display updates itself whenever either Property changes.

```ts
const numeratorProperty = new NumberProperty( 5 );
const denominatorProperty = new NumberProperty( 3 );

const liveFraction = new PropertyFractionNode( numeratorProperty, denominatorProperty, {
  type: PropertyFractionNode.DisplayType.MIXED,
  simplify: true
} );
```

| Option | Default | Effect |
| --- | --- | --- |
| `type` | `PropertyFractionNode.DisplayType.IMPROPER` | `IMPROPER` shows e.g. `5/3`; `MIXED` shows e.g. `1 2/3`, splitting off the whole-number part |
| `simplify` | `false` | When `true` and the fraction is a whole number, hides the fraction part (governed by `showZeroImproperFraction`) |
| `showZeroImproperFraction` | `true` | With `simplify: true`, controls whether a numerator of `0` still shows an empty/zero fraction part or hides it entirely |

`PropertyFractionNode.DisplayType` is an `EnumerationDeprecated` with two values, `IMPROPER` and `MIXED`. Call `dispose()` when you're done with a `PropertyFractionNode` — it unlinks its own listeners from both Properties.

## MinusNode and PlusNode

Standalone sign glyphs, each built from a primitive shape rather than `Text`:

| Node | Base class | Shape |
| --- | --- | --- |
| `MinusNode` | `Rectangle` | A single filled rectangle |
| `PlusNode` | `Path` | A `PlusShape` (a "+"-shaped polygon) |

```ts
const minusSign = new MinusNode( { size: new Dimension2( 16, 3 ) } );
const plusSign = new PlusNode( { size: new Dimension2( 16, 3 ) } );
```

Both take a single `size: Dimension2` option (default `20×5`) — `width` is the overall length of the sign, `height` is its stroke thickness — plus whatever `Rectangle`/`Path` options apply (`fill` defaults to `'black'` for both). `MinusNode` asserts `size.width >= size.height`. Both have their origin at the upper-left of their bounding box, like any other `Node`.

::: tip These are marks, not editable text
None of these four Nodes accept a string or format pattern — they're geometric marks assembled from primitives. If you need a fraction embedded inside a larger internationalized sentence (e.g. "add 1/2 cup"), compose it with `RichText`/`StringProperty` patterns instead; reach for this family when you want a big, standalone, visually precise fraction or sign, independent of any specific font's glyph metrics.
:::
