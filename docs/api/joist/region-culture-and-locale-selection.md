---
title: Region, Culture, and Locale Selection UI
description: The runtime language/locale Property, the region-and-culture Property and its localized-image helper, and the Preferences UI built on top of both.
category: api
library: joist
tags: [joist, LocalizedImageProperty, RegionAndCultureComboBox, LanguageSelectionNode, LocalePanel, localeProperty, regionAndCultureProperty, i18n]
status: complete
related:
  - /guides/translation-and-localization
  - /api/joist/preferences-model-and-dialog
  - /api/axon/derived-property
prerequisites:
  - /guides/translation-and-localization
  - /api/joist/preferences-model-and-dialog
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Region, Culture, and Locale Selection UI

SceneryStack draws a line between two independent runtime i18n concerns, each with its own global singleton `Property` (both exported from `scenerystack/joist`): **`localeProperty`** controls which *language* strings are displayed in, and **`regionAndCultureProperty`** controls how *images/illustrations* are styled — the region-and-culture of the people and objects depicted — independent of language. A sim can support one without the other. Both are surfaced to end users through the "Localization" tab of the Preferences dialog (see [PreferencesModel and PreferencesDialog](/api/joist/preferences-model-and-dialog)), built from the UI classes documented below.

```ts
import {
  localeProperty,
  regionAndCultureProperty,
  LocalizedImageProperty,
  RegionAndCultureComboBox,
  LanguageSelectionNode,
  LocalePanel
} from 'scenerystack/joist';
```

## `localeProperty` — which language is displayed

`localeProperty` is a module-level singleton `LocaleProperty` (a `Property<Locale>` subclass), initialized from `phet.chipper.locale` and instrumented at `Tandem.GENERAL_MODEL.createTandem('localeProperty')`. Setting its value re-renders every `StringProperty`-backed string in the sim — see [Translation and Localization](/guides/translation-and-localization) for how strings react to it.

```ts
localeProperty.value; // e.g. 'es' — the current Locale
localeProperty.availableRuntimeLocales; // Locale[] actually built into this sim
localeProperty.supportsDynamicLocale; // false if only one locale was built — switching is pointless
```

| Member | Description |
| --- | --- |
| `availableRuntimeLocales` | `Locale[]`, sorted by each locale's localized display name — the full set this build supports |
| `supportsDynamicLocale` | `true` only when `availableRuntimeLocales.length > 1` |
| `isLocaleChanging` | `true` while a locale switch is in progress, so listeners can opt out of redundant work mid-switch |

## `regionAndCultureProperty` — how images are styled

`regionAndCultureProperty` is a separate singleton `Property<RegionAndCulture>`, where `RegionAndCulture` is one of `'usa' | 'africa' | 'africaModest' | 'asia' | 'latinAmerica' | 'oceania' | 'random'`. Its runtime choices are narrowed to `supportedRegionAndCultureValues` — derived from `"supportedRegionsAndCultures"` in the sim's `package.json`, always including `'usa'` (`DEFAULT_REGION_AND_CULTURE`) as the guaranteed fallback. It's only instrumented (given a real tandem instead of `Tandem.OPT_OUT`) when more than one value is actually supported.

```ts
import type { RegionAndCulture } from 'scenerystack/joist';

regionAndCultureProperty.value; // e.g. 'africa'
```

### `LocalizedImageProperty` — region-varying images

`LocalizedImageProperty` is a `DerivedProperty1<ImageableImage, ConcreteRegionAndCulture>` that picks an image out of a map keyed by region-and-culture, re-deriving whenever `regionAndCultureProperty`'s *concrete* value (the resolved value, with `'random'` already picked) changes. You build one per region-varying illustration:

```ts
import handSoap_usa_png from '../../images/handSoap_usa_png.js';
import handSoap_africa_png from '../../images/handSoap_africa_png.js';

const handSoapImageProperty = new LocalizedImageProperty( 'handSoap', {
  usa: handSoap_usa_png,     // required — the guaranteed fallback
  africa: handSoap_africa_png
  // any concrete RegionAndCulture you omit falls back to asserting at construction time
} );
```

`usa` is required in the image map (it's the fallback), and every other *concrete* region-and-culture value the sim declares support for must also have an entry, or construction asserts.

## The Preferences "Localization" UI

Three joist classes build the panels a sim's Preferences dialog shows for these two Properties — you rarely construct them directly (they're wired up automatically when `PreferencesModel`'s `localizationOptions` are configured), but you'll encounter them reading Preferences internals:

| Class | Role |
| --- | --- |
| `RegionAndCultureComboBox` | A `ComboBox<RegionAndCulture>` bound to `regionAndCultureProperty`, listing `supportedRegionAndCultureValues` sorted and localized; shown in Preferences > Localization when more than one value is supported |
| `LanguageSelectionNode` | A single clickable `Rectangle` showing one locale's localized name; clicking it sets `localeProperty.value` to that locale and highlights the currently-selected one |
| `LocalePanel` | A `Panel` laying out one `LanguageSelectionNode` per entry in `localeProperty.availableRuntimeLocales`, in a `GridBox` — the full language picker shown in Preferences > Localization |

```ts
// Roughly what PreferencesModel builds internally when includeLocalePanel is true:
const localePanel = new LocalePanel( localeProperty );
```

::: tip Preferences UI components are not PhET-iO instrumented
`RegionAndCultureComboBox` and `LanguageSelectionNode`'s internal listeners deliberately use `Tandem.OPT_OUT` — Preferences controls are considered part of the platform chrome, not part of a sim's own instrumented API surface (see the `joist#744` discussion referenced in source comments). Don't expect to find these under a sim's PhET-iO tree; `localeProperty` and `regionAndCultureProperty` themselves *are* instrumented (under `Tandem.GENERAL_MODEL`), but the buttons that drive them are not.
:::
