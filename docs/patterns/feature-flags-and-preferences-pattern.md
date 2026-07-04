---
title: Feature Flags and Preferences Pattern
description: The narrow convention of gating an in-development or optional feature behind a single, consistently-named boolean Property.
category: patterns
tags: [query-parameters, Property, feature-flag, preferences]
status: verified
related:
  - /guides/preferences-and-feature-flags
  - /patterns/model-view-separation
  - /patterns/query-parameters-pattern
prerequisites:
  - /guides/preferences-and-feature-flags
---

# Feature Flags and Preferences Pattern

[Preferences and Feature Flags](/guides/preferences-and-feature-flags) explains the two broad mechanisms SceneryStack gives you — the Preferences dialog and query parameters — and when to reach for each. This page is narrower: it's the one specific convention to follow *within* either mechanism so a codebase doesn't accumulate a dozen inconsistent ad hoc flags. The convention: **gate a feature behind exactly one boolean `Property`, named `<feature>FeatureEnabledProperty`, initialized once from a query parameter (or a `PreferencesModel` entry) and read everywhere the feature branches.**

## The convention

```ts
// MySimQueryParameters.ts
import { QueryStringMachine } from 'scenerystack/query-string-machine';

const MySimQueryParameters = QueryStringMachine.getAll( {
  // ?showVelocityVectors=true
  showVelocityVectors: {
    type: 'flag'
  }
} );

export default MySimQueryParameters;
```

```ts
// MySimFeatures.ts
import { BooleanProperty } from 'scenerystack/axon';
import MySimQueryParameters from './MySimQueryParameters.js';

const MySimFeatures = {
  // One boolean Property per feature, named consistently, initialized once at module load.
  velocityVectorsFeatureEnabledProperty: new BooleanProperty( MySimQueryParameters.showVelocityVectors )
};

export default MySimFeatures;
```

```ts
// Anywhere the feature branches - model or view - read the Property, never the raw query parameter.
import MySimFeatures from './MySimFeatures.js';

if ( MySimFeatures.velocityVectorsFeatureEnabledProperty.value ) {
  this.children.push( new VelocityVectorNode( model ) );
}
```

## Why a Property, and why one specific name shape

- **Consistency lets you grep for every feature flag in a codebase** with one pattern (`FeatureEnabledProperty`) instead of some code checking `MySimQueryParameters.showX` directly, other code checking a locally-scoped boolean, and a third piece checking a `PreferencesModel` field — three different shapes for the same kind of decision.
- **A `Property`, not a plain `boolean` constant**, means the same flag can later be promoted to a real user-facing Preferences toggle (see [Preferences and Feature Flags](/guides/preferences-and-feature-flags)) by changing only where the `Property`'s initial value comes from — every read site (`if ( ...FeatureEnabledProperty.value )` or `...FeatureEnabledProperty.link(...)`) is unaffected.
- **Reading the `Property` instead of the raw query parameter at every branch point** means a feature that later needs to be toggled at runtime (from Preferences, or from a debug menu) doesn't require hunting down every `MySimQueryParameters.showX` reference and swapping it for something reactive.

## Anti-pattern: branching on the raw query parameter everywhere

```ts
// Don't do this - MySimQueryParameters.showVelocityVectors is read directly in three
// unrelated files, with no single Property to promote to a real preference later,
// and no way to .link() a view update if the flag ever needs to change at runtime.
if ( MySimQueryParameters.showVelocityVectors ) {
  this.children.push( new VelocityVectorNode( model ) );
}
```

::: tip One flag, one Property, one name shape
Resist the temptation to special-case a flag's name ("just this one is `showFoo` instead of `fooFeatureEnabledProperty`") because it seemed temporary. Flags marked temporary are the ones most likely to still be in the codebase a year later — pay the small consistency cost up front so every feature flag in the project is discoverable the same way.
:::
