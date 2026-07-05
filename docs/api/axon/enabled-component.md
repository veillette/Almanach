---
title: EnabledComponent and EnabledProperty
description: The standard mixin-free pattern for giving any object a settable enabledProperty, with PhET-iO instrumentation baked in.
category: api
library: axon
tags: [axon, EnabledComponent, EnabledProperty, BooleanProperty, Disposable]
status: complete
prerequisites:
  - /api/axon/boolean-property
related:
  - /api/axon/boolean-property
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# EnabledComponent and EnabledProperty

`EnabledProperty` (from `scenerystack/axon`) is a thin `BooleanProperty` subclass that standardizes what an "enabled" Property looks like: it defaults `tandem` name-checking (it asserts, if instrumented, that its tandem is named `enabledProperty`), sets `phetioFeatured: true`, and supplies default `phetioDocumentation`. `EnabledComponent` is a small base class built on top of it — extend `EnabledComponent` (instead of hand-rolling `public readonly enabledProperty = new BooleanProperty( true )`) to get a consistent `enabledProperty`, `enabled` getter/setter, and disposal wired up automatically, with the same PhET-iO conventions every other `EnabledComponent` subclass follows.

```ts
import { EnabledComponent } from 'scenerystack/axon';

class Thruster extends EnabledComponent {
  public constructor() {
    super( { enabled: true } );
  }

  public fire(): void {
    if ( this.isEnabled() ) {
      // ... apply thrust
    }
  }
}

const thruster = new Thruster();
thruster.enabled = false;
thruster.isEnabled(); // false
```

## `EnabledComponent` options

| Option | Default | Effect |
| --- | --- | --- |
| `enabledProperty` | `null` | Supply your own `TReadOnlyProperty<boolean>` instead of letting `EnabledComponent` create one (useful to share/derive enabled-ness from elsewhere); if provided, `EnabledComponent` does not own or dispose it |
| `enabled` | `true` | Initial value of the auto-created `enabledProperty`; ignored if `enabledProperty` is supplied |
| `enabledPropertyOptions` | `null` | Options forwarded to the auto-created `EnabledProperty` (e.g. `phetioDocumentation`); ignored if `enabledProperty` is supplied |
| `phetioEnabledPropertyInstrumented` | `true` | Whether the auto-created `enabledProperty` gets a PhET-iO tandem (`options.tandem.createTandem( 'enabledProperty' )`) or `Tandem.OPT_OUT` |
| `tandem` | — | Standard PhET-iO tandem, used to namespace the auto-created `enabledProperty` |

## Public API

| Member | Effect |
| --- | --- |
| `enabledProperty` | The underlying `TProperty<boolean>` — either the one you supplied or an auto-created `EnabledProperty` |
| `enabled` (getter/setter) | Convenience accessor for `enabledProperty.value` |
| `isEnabled()` | Same as reading `.enabled` |
| `dispose()` | Disposes the auto-created `enabledProperty` (only if `EnabledComponent` created it — a caller-supplied `enabledProperty` is left alone) |

## `GatedEnabledProperty` and friends

If you need an `enabledProperty` whose value combines an internal ("self") flag with an external, PhET-iO-controllable gate, see `GatedEnabledProperty` (and the parallel `GatedBooleanProperty`/`GatedVisibleProperty`) — also exported from `scenerystack/axon`. Public fields exposing a gated result should be typed [`ReadOnlyProperty<boolean>`](/api/axon/read-only-property), matching the general rule that anything not meant to be set directly from outside advertises `ReadOnlyProperty`, not `Property`.

::: tip Passing your own `enabledProperty` opts you out of ownership
If you supply `enabledProperty` yourself (rather than letting `EnabledComponent` construct one), `EnabledComponent` will neither instrument nor dispose it — that Property's lifecycle is entirely your responsibility. This is the usual way to make several related objects share one `enabledProperty`, but forgetting to dispose the shared Property yourself is a common leak.
:::
