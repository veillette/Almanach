---
title: Translation and Localization
description: String management with StringProperty and the PhET translation pipeline.
category: guides
tags: [localization, i18n, strings]
status: draft
related:
  - /api/axon/string-property
  - /guides/preferences-and-feature-flags
  - /getting-started/project-structure-conventions
prerequisites:
  - /api/axon/string-property
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Translation and Localization

Every piece of user-visible text in a SceneryStack simulation is a [`StringProperty`](/api/axon/string-property) (or a `TReadOnlyProperty<string>` derived from one), never a plain string baked into a `Text` node. That single decision is what makes translation possible: swapping the *value* underneath an existing `Property` re-renders anywhere that string is displayed, with no manual re-rendering step.

## Strings live in Properties, not literals

```ts
import { Text } from 'scenerystack/scenery';
import { StringProperty } from 'scenerystack/axon';

const greetingProperty = new StringProperty( 'Hello!' );

const greetingText = new Text( greetingProperty, { font: '20px sans-serif' } );

// Changing the underlying value updates every Node displaying it automatically.
greetingProperty.value = 'Bonjour !';
```

`Text` and `RichText` both accept a `TReadOnlyProperty<string>` directly wherever they'd otherwise take a plain string, so passing a `StringProperty` (or a `DerivedProperty`/`PatternStringProperty` built from one) is idiomatic, not a special case.

## The PhET translation pipeline (conceptual)

In a full PhET-style project, you don't hand-construct every `StringProperty` yourself. The workflow is:

1. Author English strings once, in a JSON file at the project root (conventionally `<sim-name>-strings_en.json`) — see [Project Structure Conventions](/getting-started/project-structure-conventions).
2. A build-time step generates a strongly-typed strings module from that file, exposing one `StringProperty` per key.
3. Translators submit additional per-locale JSON files (`<sim-name>-strings_fr.json`, etc.) through PhET's translation tooling, without touching any TypeScript.
4. At runtime, the active locale determines which JSON file's values populate the generated `StringProperty` instances — the application code that consumes them (`Text`, `RichText`, any `TReadOnlyProperty<string>` consumer) never changes.

The exact generation step is part of the PhET build tooling and out of scope for simulation-author-facing code in this wiki, but the contract you write against is stable regardless: **every generated string is a `Property<string>`**, with the same `.value`/`.link()` API described in [`StringProperty`](/api/axon/string-property) and [`Property`](/api/axon/property).

## Interpolating values into translated strings

Never build a translated string with template literals or concatenation — word order and pluralization vary across languages, so a fixed English sentence shape breaks translation. Use `StringUtils.fillIn` (or the axon `PatternStringProperty`, which wraps the same mechanism as a reactive `Property`) with named placeholders instead:

```ts
import { StringUtils } from 'scenerystack/phetcommon';

// pattern (usually itself a translated StringProperty's value): '{{name}} scored {{points}} points'
const message = StringUtils.fillIn( messagePatternProperty.value, {
  name: 'Ada',
  points: 42
} );
```

```ts
import { PatternStringProperty } from 'scenerystack/axon';

// Reactive version: recomputes whenever the pattern or values change.
const scoreMessageProperty = new PatternStringProperty( messagePatternProperty, {
  name: playerNameProperty,
  points: pointsProperty
} );
```

## Runtime locale

`localeProperty` (from `scenerystack/joist`) reflects the simulation's active locale and is normally set once at startup from the `?locale=` query parameter, not changed mid-session by application code:

```ts
import { localeProperty } from 'scenerystack/joist';

console.log( 'current locale:', localeProperty.value ); // e.g. 'en', 'fr', 'es'
```

::: tip Don't hand-roll a second translation mechanism
It's tempting to reach for `Intl` or a homegrown lookup table for "just this one string." Keeping every displayed string on the `StringProperty` pipeline — even ones you're sure will never need translation — means the whole simulation's localization surface stays discoverable and translatable in one pass, rather than some strings quietly falling outside the pipeline.
:::

## Where to go next

- [`StringProperty`](/api/axon/string-property) — the Property type every translated string is built on
- [Preferences and Feature Flags](/guides/preferences-and-feature-flags) — where locale and other runtime settings are surfaced to users
- [Project Structure Conventions](/getting-started/project-structure-conventions) — where the source strings JSON file lives in a repo
