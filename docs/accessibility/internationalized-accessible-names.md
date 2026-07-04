---
title: Internationalized Accessible Names
description: Routing accessibleName and other PDOM strings through the same StringProperty translation pipeline as visible text, instead of hardcoding them in English.
category: accessibility
tags: [accessibility, pdom, accessibleName, localization, i18n, StringProperty]
status: verified
related:
  - /guides/translation-and-localization
  - /accessibility/pdom
  - /api/axon/string-property
prerequisites:
  - /accessibility/pdom
  - /guides/translation-and-localization
---

# Internationalized Accessible Names

[Translation and Localization](/guides/translation-and-localization) establishes the rule for visible text: every user-facing string is a `StringProperty`, never a literal, so translation is a matter of swapping the value underneath an existing Property. PDOM strings — `accessibleName`, `accessibleHelpText`, `descriptionContent`, `labelContent` — are just as user-facing as a `Text` node's content, and are exactly as easy to accidentally leave outside that pipeline, because they're set as string-shaped options rather than displayed inline where a translation review would notice them.

## The mechanism already supports it

Scenery's PDOM string options accept `PDOMValueType`, which is `string | TReadOnlyProperty<string> | null` — the identical shape `Text`/`RichText` accept for visible content. Passing a `StringProperty` (or a `DerivedProperty`/`PatternStringProperty` built from one) to `accessibleName` is not a workaround; it's the intended, idiomatic usage:

```ts
import { Rectangle } from 'scenerystack/scenery';
import MySimStrings from '../MySimStrings.js'; // generated StringProperty module, see Translation and Localization

// Correct: the same StringProperty that would be used for a visible label works
// here too, and updates automatically if the locale changes at runtime.
const resetButton = new Rectangle( 0, 0, 40, 40, {
  tagName: 'button',
  accessibleName: MySimStrings.resetMassesStringProperty,
  accessibleHelpText: MySimStrings.resetMassesHelpTextStringProperty
} );
```

## The anti-pattern: a hardcoded English literal

```ts
// Don't do this - accessibleName here will never be translated, even if every
// visible Text node on the same screen goes through the full string pipeline.
// A screen-reader user in any non-English locale hears English regardless of
// what locale the rest of the sim launched in.
const resetButton = new Rectangle( 0, 0, 40, 40, {
  tagName: 'button',
  accessibleName: 'Reset Masses'
} );
```

This is easy to miss in review because it doesn't look wrong — the visible parts of the screen are correctly localized, and a literal string passed to `accessibleName` compiles and works exactly like the correct version during development in the sim's default locale. The gap only becomes audible when a screen-reader user actually launches the sim in a translated locale.

## Where this applies

Every PDOM string option that accepts `PDOMValueType` is in scope, not just `accessibleName`:

| Option | Also needs a `StringProperty`, not a literal |
| --- | --- |
| `accessibleName` | Yes — same string pipeline as any visible label |
| `accessibleHelpText` | Yes — supplementary guidance is still user-facing text |
| `labelContent` / `descriptionContent` | Yes |
| [Voicing](/accessibility/voicing) response strings (`voicingNameResponse`, etc.) | Yes — these are spoken words, subject to the same localization requirement as PDOM strings, even though they're a separate system from the PDOM |

## Interpolated accessible names

An `accessibleName` that includes a dynamic value (an item's index, a current reading) has the same pluralization/word-order hazard as any other translated interpolated string — use `PatternStringProperty` rather than a template literal, exactly as [Translation and Localization](/guides/translation-and-localization#interpolating-values-into-translated-strings) prescribes for visible text:

```ts
import { PatternStringProperty } from 'scenerystack/axon';
import MySimStrings from '../MySimStrings.js';

// pattern (translated): '{{name}} slider, currently {{value}}'
const sliderAccessibleNameProperty = new PatternStringProperty(
  MySimStrings.namedSliderPatternStringProperty,
  { name: itemNameProperty, value: currentValueProperty }
);

slider.accessibleName = sliderAccessibleNameProperty;
```

::: tip Review PDOM strings the same way you'd review visible strings
When checking a PR (your own or someone else's) for stray hardcoded English, grep for `accessibleName:`, `helpText:`, `labelContent:`, `descriptionContent:`, and `voicing*Response:` followed by a quoted literal, the same way you'd look for a bare string passed to `new Text(...)`. Nothing about these options makes a literal *look* wrong at a glance — the only way to catch it is to specifically look.
:::
