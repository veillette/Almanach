---
title: StringUtils
description: phetcommon's small collection of string-handling helpers for translated pattern strings and bidirectional (LTR/RTL) text safety.
category: api
library: phetcommon
tags: [phetcommon, StringUtils, i18n, strings]
status: verified
prerequisites:
  - /guides/internationalization-deep-dive
related:
  - /api/axon/pattern-string-property
  - /patterns/query-parameters-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StringUtils

::: warning About this page's title
This page was originally planned to cover `PhetcommonQueryParameters` — but no such export exists in the real `scenerystack` package. `phetcommon`'s barrel (`src/phetcommon.ts`) exports exactly five things: `AssertUtils`, [`Bucket`](/api/phetcommon/bucket), `Fraction`, `SphereBucket`, `StringUtils`, and [`ModelViewTransform2`](/api/phetcommon/model-view-transform); phetcommon defines no query parameters of its own (query parameters for a sim's screens/behavior are declared per-library, e.g. `sunQueryParameters`, and read via `scenerystack/query-string-machine` — see the [Query Parameters Pattern](/patterns/query-parameters-pattern)). This page documents `StringUtils` instead, a real, exported, and frequently-used phetcommon utility.
:::

`StringUtils` (from `scenerystack/phetcommon`) is a small collection of static string-handling functions, used throughout SceneryStack for filling in translated pattern strings and for keeping bidirectional (LTR/RTL) text safe when numbers or substrings get spliced into a larger, possibly differently-directioned, string. It's a plain object of functions, not a class — there's nothing to construct.

```ts
import { StringUtils } from 'scenerystack/phetcommon';

StringUtils.fillIn( '{{name}} is {{age}} years old', { name: 'Ada', age: 23 } );
// 'Ada is 23 years old'

StringUtils.capitalize( 'hello there' );
// 'Hello there'
```

## Methods

| Method | Effect |
| --- | --- |
| `fillIn( template, values )` | Replaces `{{key}}` placeholders in `template` with `values[key]` — `template` may be a plain string or anything with a `.get()` (like a Property); unused keys in `values` are ignored, and unmatched placeholders are left as-is |
| `format( pattern, ...args )` | **Deprecated** — the older positional `{0}`/`{1}` substitution; prefer `fillIn` for new code |
| `capitalize( str )` | Capitalizes the first letter, skipping any leading whitespace/control characters — English-oriented, not locale-aware |
| `wrapLTR( str )` / `wrapRTL( str )` | Wraps `str` in Unicode LTR/RTL embedding marks so it renders in a fixed direction regardless of surrounding text |
| `wrapDirection( str, direction )` | Calls `wrapLTR`/`wrapRTL` based on a `'ltr' \| 'rtl'` argument |
| `toFixedLTR( number, digits )` | `number.toFixed( digits )`, wrapped with `wrapLTR` so a negative sign always renders on the left even inside RTL text |
| `toFixedNumberLTR( number, digits )` | Like `toFixedLTR`, but drops trailing zeros (uses `toFixedNumber` instead of `toFixed`) |
| `embeddedSlice`, `embeddedSplit`, `embeddedDebugString`, `isEmbeddingMark` | Lower-level helpers for slicing/splitting strings that already contain LTR/RTL embedding marks without corrupting the marks |
| `localeToLocalizedName( locale )` | Looks up a locale code's own-language display name (e.g. `'es'` → `'Español'`), correctly directioned |

## When you'd reach for this directly

Most simulation code never calls `StringUtils.fillIn` by hand — [`PatternStringProperty`](/api/axon/pattern-string-property) wraps exactly this call (plus `toFixedLTR` for numeric decimal-place formatting) in a reactive, disposable `DerivedProperty`, and is the preferred way to build a *dynamic* pattern-filled string. Call `StringUtils` directly only for one-off, non-reactive string formatting — e.g. building a debug log line, or formatting a value at a point where wiring up a full derived Property would be overkill.
