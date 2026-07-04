---
title: RichText
description: A Text-like Node supporting a constrained markup subset for mixed styling.
category: api
library: scenery
tags: [scenery, RichText, markup, links]
status: complete
related:
  - /api/scenery/text
  - /api/scenery-phet/phet-font
prerequisites:
  - /api/scenery/node
  - /api/scenery/text
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RichText

`RichText` (from `scenerystack/scenery`) renders a string containing a constrained, security-conscious subset of HTML-like markup, splitting it internally into multiple [`Text`](/api/scenery/text) children. Use it when a single string needs mixed styling — bold/italic runs, sub/superscripts, links, line breaks — that plain `Text` can't express. Malformed markup is not accepted, and HTML entities in the content must be escaped.

```ts
import { RichText } from 'scenerystack/scenery';
import { PhetFont } from 'scenerystack/scenery-phet';

const description = new RichText(
  'RichText supports <b>bold</b>, <i>italic</i>, and H<sub>2</sub>O-style subscripts.',
  { font: new PhetFont( 16 ), fill: 'black' }
);

const withLink = new RichText(
  'See <a href="{{phetWebsite}}">our website</a> for more.',
  {
    links: {
      phetWebsite: 'https://phet.colorado.edu'
    }
  }
);
```

## Supported markup

`<b>`/`<strong>`, `<i>`/`<em>`, `<sub>`, `<sup>`, `<u>`, `<s>`, `<br>`, `<span style="color: ...; font-size: ...; font-family: ...;">`, `<span dir="ltr"/"rtl">`, `<a href="...">` links, and `<node id="...">` for embedding an arbitrary `Node` inline.

## Options

| Option | Effect |
| --- | --- |
| `string` / `stringProperty` | The markup string to render, same as `Text` |
| `font`, `fill`, `stroke`, `lineWidth` | Base styling applied to unmarked text (per-tag colors override `fill` locally) |
| `links` | Either `true` (embed `href`s directly from the markup) or a `Record<string, string \| (() => void)>` mapping placeholder names to real URLs/callbacks — the default (safer) way to allow links |
| `linkFill` | Fill color used specifically for link text |
| `linkEventsHandled` | Whether clicking a link calls `event.handle()`, stopping propagation |
| `nodes` | A `Record<string, Node>` of Nodes to splice in for `<node id="...">` tags |
| `tags` | A `Record<string, (node: Node) => Node>` for custom wrapping tags, e.g. `<blur>...</blur>` |
| `align` | `'left'`, `'center'`, or `'right'` alignment across wrapped lines |
| `lineWrap` | Maximum line width (in local coordinates) before wrapping; `null` disables wrapping |
| `leading` | Extra vertical spacing between wrapped lines |
| `subScale`, `subXSpacing`, `subYOffset`, `supScale`, `supXSpacing`, `supYOffset` | Fine-tune subscript/superscript sizing and placement |
| `underlineLineWidth`, `underlineHeightScale`, `strikethroughLineWidth`, `strikethroughHeightScale` | Fine-tune `<u>`/`<s>` rendering |

`RichText` also accepts the full set of [`Node` options](/api/scenery/node).

::: warning Links default to being ignored, not embedded
Passing a raw `<a href="https://example.com">` without a matching `links` map entry causes that link to be silently ignored — this is a deliberate XSS guard, since `RichText` content often comes from translated strings. To use literal `href`s straight from the markup, pass `links: true` explicitly; to remap placeholders to safe destinations, use the `links: { placeholder: url }` form shown above.
:::
