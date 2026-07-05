---
title: DerivedStringProperty
description: A DerivedProperty specialized for building translated or formatted string values, with the right PhET-iO metadata baked in.
category: api
library: axon
tags: [axon, DerivedStringProperty, DerivedProperty, PatternStringProperty, i18n, strings]
status: complete
prerequisites:
  - /api/axon/derived-property
related:
  - /api/axon/derived-property
  - /api/axon/pattern-string-property
  - /api/axon/string-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# DerivedStringProperty

`DerivedStringProperty<T extends string, ...>` (from `scenerystack/axon`) is a thin subclass of [`DerivedProperty`](/api/axon/derived-property) whose derivation is constrained to return a `string`. It exists so that string-valued derived Properties — typically built from a translated `StringProperty` and other dependencies — carry the right PhET-iO metadata by default and are easy to spot in code as "this is a derived, translated-or-formatted string," rather than a generic `DerivedProperty<string, ...>`.

```ts
import { DerivedStringProperty, NumberProperty } from 'scenerystack/axon';

const countProperty = new NumberProperty( 3 );

const summaryStringProperty = new DerivedStringProperty(
  [ countProperty ],
  count => `${count} item${count === 1 ? '' : 's'} remaining`
);

summaryStringProperty.value; // '3 items remaining'
countProperty.value = 1;
summaryStringProperty.value; // '1 item remaining'
```

Structurally, `DerivedStringProperty` takes the exact same `dependencies` and `derivation` constructor arguments as `DerivedProperty` — it's `DerivedProperty` with `T` pinned to a string subtype, plus two default options applied for you:

| Default | Value | Why |
| --- | --- | --- |
| `phetioValueType` | `StringIO` | So you don't have to specify it yourself every time |
| `phetioFeatured` | `true` | Translated/derived strings are treated as PhET-iO-featured by default (override if this is an internal, non-featured string) |

## When to reach for this vs. `PatternStringProperty`

If your derivation is "substitute values into a translated pattern string with `{{placeholder}}` tokens," use [`PatternStringProperty`](/api/axon/pattern-string-property) instead — it's *itself* a `DerivedStringProperty` under the hood, and handles the placeholder-filling, `maps`, and `decimalPlaces` machinery for you. Reach for `DerivedStringProperty` directly when your string logic is closer to a one-off formatting function than a pattern substitution — for example, choosing between several already-translated strings based on a state Property, or building a plain (non-pattern) string from numeric data.

::: tip Constrain `T` to the string literals you actually produce
Because `DerivedStringProperty<T extends string, ...>` is generic in `T`, you can (and often should) narrow it to a union of literal strings your derivation actually returns, e.g. `DerivedStringProperty<'small' | 'medium' | 'large', ...>`, rather than letting it widen to the bare `string` type. This gives downstream code (and Storybook-style PhET-iO tooling) a much more useful type than "any string."
:::
