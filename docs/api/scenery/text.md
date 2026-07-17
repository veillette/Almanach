---
title: Text
description: A Node that renders a single string of plain text.
category: api
library: scenery
tags: [scenery, Text, PhetFont, font]
status: verified
related:
  - /api/scenery-phet/phet-font
  - /api/scenery/rich-text
  - /api/axon/string-property
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Text

`Text` (from `scenerystack/scenery`) is a [`Node`](/api/scenery/node) that displays a single string with a chosen `font`, `fill`, and (optionally) `stroke`. Use it for plain, single-style strings; reach for [`RichText`](/api/scenery/rich-text) instead when a string needs mixed styling (bold, sub/superscript, links) within itself.

```ts
import { Text, Font } from 'scenerystack/scenery';
import { PhetFont } from 'scenerystack/scenery-phet';

const label = new Text( 'Hello, world!', {
  font: new PhetFont( 24 ),
  fill: 'black'
} );

// Shorthand font properties instead of a Font instance:
const caption = new Text( 'caption text', {
  fontSize: 14,
  fontWeight: 'bold'
} );
```

Simulations conventionally use [`PhetFont`](/api/scenery-phet/phet-font) (from `scenerystack/scenery-phet`) rather than the browser default or a raw `Font` so that text renders consistently across platforms; `Font` (from `scenerystack/scenery`) is the lower-level class `PhetFont` builds on.

<SceneryDemo demo="text" />

## Options

| Option | Effect |
| --- | --- |
| `string` | The text to display (also accepts a `number`, which is stringified) |
| `stringProperty` | Sets forwarding of the string from a `TReadOnlyProperty<string>` — the standard way to make displayed text respond to changing/translated content |
| `font` | A `Font` (or `PhetFont`) instance, or a CSS font shorthand string |
| `fontWeight`, `fontFamily`, `fontStretch`, `fontStyle`, `fontSize` | Shorthand setters that construct/replace the underlying `Font` for you |
| `boundsMethod` | How bounds are computed: `'fast'`, `'fastCanvas'`, `'accurate'`, or `'hybrid'` (default) |

`Text` also mixes in `Paintable` (`fill`, `stroke`, `lineWidth`, …) and accepts the full set of [`Node` options](/api/scenery/node). The default `fill` is `'#000000'` (black), unlike a plain `Node`.

## Reacting to changing text

```ts
import { Text } from 'scenerystack/scenery';
import { StringProperty } from 'scenerystack/axon';

const messageProperty = new StringProperty( 'Score: 0' );
const scoreText = new Text( messageProperty, { fontSize: 18 } );

messageProperty.value = 'Score: 10'; // scoreText updates automatically
```

::: tip Pass a Property directly as the first constructor argument
`new Text( stringProperty, options )` is equivalent to `new Text( '', { stringProperty, ...options } )` — either form links the displayed string to a `TReadOnlyProperty<string>` (see [`StringProperty`](/api/axon/string-property)) so translated or dynamically-generated strings update the display without manual re-rendering.
:::
