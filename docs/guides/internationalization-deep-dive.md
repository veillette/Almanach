---
title: Internationalization Deep Dive
description: Runtime locale switching, right-to-left layout, and PatternStringProperty for pluralization and placeholders, building on the translation pipeline basics.
category: guides
tags: [localization, i18n, rtl, strings]
status: complete
related:
  - /guides/translation-and-localization
  - /api/axon/pattern-string-property
  - /api/axon/string-property
prerequisites:
  - /guides/translation-and-localization
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Internationalization Deep Dive

[Translation and Localization](/guides/translation-and-localization) covers the core idea — every displayed string is a `Property<string>`, never a literal — and the pipeline that turns per-locale JSON files into those Properties at build/runtime. This page goes one level deeper into three things that pipeline alone doesn't handle: how the *active* locale is actually determined and switched, what changes about layout once a right-to-left language is involved, and how to build translated strings that need pluralization or multiple placeholders correctly, rather than by string concatenation.

## Runtime locale: where it comes from, and whether it can change

`localeProperty` (from `scenerystack/joist`) is the single source of truth for the sim's active locale — every generated `StringProperty` reflects the string data for whatever locale this Property currently holds:

```ts
import { localeProperty } from 'scenerystack/joist';

console.log( localeProperty.value ); // e.g. 'en', 'fr', 'es', 'zh_CN'
```

It's initialized once at startup from the `?locale=` query parameter (falling back to the browser's own locale, then to `'en'`), which is why [Translation and Localization](/guides/translation-and-localization) describes it as "normally set once at startup" rather than something application code changes mid-session. `localeProperty` is a real, settable `Property<Locale>` — nothing in the type system stops you from writing to it after startup — but production PhET simulations don't do this as a live "language switcher" feature; a full reload with a different `?locale=` value is the supported path for changing languages, since a substantial amount of layout (see below) is easiest to get right when it's computed fresh rather than live-relaid mid-session.

If you do need to read the list of locales a specific build actually has string data for (rather than assuming every locale is available), that's exposed alongside `localeProperty` rather than hardcoded — check the actual runtime value rather than assuming a fixed list, since which locales are available for a given build is a locale-file/build-time concern (see [Project Structure Conventions](/getting-started/project-structure-conventions)), not something this API layer fixes at compile time.

## Right-to-left languages

Some locales (Arabic, Hebrew, and others) lay out text right-to-left rather than left-to-right, and a simulation whose layout was only ever built and tested against English can end up with UI that's technically translated but reads backwards. `isLeftToRightProperty` (also from `scenerystack/joist`) is a derived boolean tracking the current locale's writing direction, recomputed automatically whenever `localeProperty` changes:

```ts
import { isLeftToRightProperty } from 'scenerystack/joist';

isLeftToRightProperty.link( isLTR => {
  // true for locales like 'en', 'fr'; false for RTL locales like 'ar', 'he'
} );
```

`RichText` and the rest of scenery's text-rendering Nodes already handle bidirectional *text* rendering correctly (Arabic/Hebrew characters shape and flow right-to-left within a `Text`/`RichText` Node on their own). What `isLeftToRightProperty` is for is *layout structure* that your own code built assuming left-to-right — a row of icon-then-label pairs, a "Play" button placed at the visual left of a control strip, a `FlowBox` whose `justify` was chosen assuming reading order flows left to right. For content where left/right placement carries meaning (not just text shaping), branch on this Property rather than assuming your layout is direction-agnostic by default:

```ts
import { HBox } from 'scenerystack/scenery';

const controlBox = new HBox( {
  spacing: 8,
  // FlowBox's own layout math doesn't auto-mirror; reverse the children order for RTL locales
  children: isLeftToRightProperty.value ? [ icon, label ] : [ label, icon ]
} );
```

::: warning Test with a real RTL locale, not just a mirrored screenshot
It's tempting to "check RTL support" by visually flipping a screenshot. Actually running with `?locale=ar` (or whichever RTL locale the sim ships strings for) surfaces the cases a mirrored screenshot can't: text truncation from different average string lengths, numerals that stay left-to-right even inside RTL text, and layout containers that were never told to reverse their child order.
:::

## Pluralization and multiple placeholders: PatternStringProperty

[Translation and Localization](/guides/translation-and-localization) shows `StringUtils.fillIn` for one-off placeholder substitution. For a *reactive* translated string — one that needs to update automatically as the values feeding it change, without you re-calling `fillIn` by hand on every change — [`PatternStringProperty`](/api/axon/pattern-string-property) is the idiomatic tool, and it's also where pluralization-style patterns are handled correctly across languages:

```ts
import { PatternStringProperty, NumberProperty } from 'scenerystack/axon';

const countProperty = new NumberProperty( 1 );

// patternProperty is itself a translated StringProperty, e.g. '{{count}} particles remaining'
const remainingMessageProperty = new PatternStringProperty( patternProperty, {
  count: countProperty
} );
```

The reason this matters beyond convenience: word order and pluralization rules vary across languages in ways that a single hardcoded English sentence shape can't represent. A translator working from `'{{count}} particles remaining'` can reorder or restructure the pattern entirely for a language with different pluralization/word-order rules — the *placeholder* is what's fixed, not the surrounding sentence structure — whereas code that concatenates `count + ' particles remaining'` gives translators nothing to restructure. `PatternStringProperty` also supports `decimalPlaces` (rounding numeric values consistently at substitution time) and a `maps` option (transforming a value before substitution, e.g. converting grams to kilograms) — see [`PatternStringProperty`](/api/axon/pattern-string-property) for the full option set.

Because `PatternStringProperty` is a `DerivedProperty` under the hood, treat it the same way: it can't be set directly, it lazily links to every dependency Property you pass in, and any instance you create dynamically (per list item, per dynamically-created model element) needs `dispose()` — see [Dispose and Memory Management](/patterns/dispose-and-memory-management).

## Where to go next

- [Translation and Localization](/guides/translation-and-localization) — the `StringProperty` foundation and the translation pipeline this page assumes
- [`PatternStringProperty`](/api/axon/pattern-string-property) — full constructor/options reference for pattern substitution
- [`StringProperty`](/api/axon/string-property) — the base Property type every translated string, plural or not, is built on
