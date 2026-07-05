---
title: Derived-Enablement Pattern
description: Computing a control's enabledProperty from a DerivedProperty over other model state, instead of imperatively setting .enabled from scattered call sites.
category: patterns
tags: [axon, DerivedProperty, EnabledComponent, EnabledProperty, enablement]
status: complete
related:
  - /api/axon/derived-property
  - /api/axon/enabled-component
  - /patterns/multilink-pattern
  - /patterns/model-view-separation
prerequisites:
  - /patterns/model-view-separation
  - /api/axon/derived-property
---

# Derived-Enablement Pattern

Whenever a control's enabled/disabled state is a *function* of other model state — a "remove" button disabled when a list is empty, an "increase" button disabled once a value is already at its range maximum — compute that control's `enabledProperty` as a [`DerivedProperty`](/api/axon/derived-property) over the state it actually depends on, rather than imperatively setting `.enabled = true`/`false` from whatever code paths happen to change that state.

## The imperative anti-pattern

```ts
// Don't do this - every place valueProperty changes has to remember to also
// update the button, and it's easy for one call site to forget.
valueProperty.link( value => {
  incrementButton.enabled = value < valueProperty.range.max;
} );

// ...elsewhere, another listener on a *different* dependency has to remember too:
rangeProperty.link( range => {
  incrementButton.enabled = valueProperty.value < range.max;
} );
```

Two separate listeners computing the same boolean from overlapping inputs is exactly the shape that drifts out of sync the moment a third dependency (a "controls locked" flag, say) needs to factor in — every existing call site has to be found and updated, and it's easy to miss one.

## The pattern: derive it once

```ts
import { DerivedProperty, NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const valueProperty = new NumberProperty( 5, { range: new Range( 0, 10 ) } );

// One Property, computed from exactly the state it actually depends on.
const isAtMaxProperty = new DerivedProperty(
  [ valueProperty ],
  value => value >= valueProperty.range!.max
);

const canIncrementProperty = DerivedProperty.not( isAtMaxProperty );
```

```ts
import { RectangularPushButton } from 'scenerystack/sun';

const incrementButton = new RectangularPushButton( {
  content: /* ... */ null,
  enabledProperty: canIncrementProperty,
  listener: () => { valueProperty.value = Math.min( valueProperty.value + 1, valueProperty.range!.max ); }
} );
```

Every `sun` button accepts an `enabledProperty` option directly, so passing the derived Property in at construction is all that's needed — the button subscribes to it itself and updates its own visual/interactive enabled state, with no listener code of your own to write or keep in sync.

## Composing several conditions

`DerivedProperty`'s boolean-combinator static factories (see [DerivedProperty](/api/axon/derived-property#static-factories)) are the natural fit when a control's enablement depends on more than one independent condition — combine them instead of writing a multi-line derivation function by hand for what's really just "and"/"or" of simpler conditions:

```ts
const isUnlockedProperty = new BooleanProperty( true );

const canIncrementProperty = DerivedProperty.and( [
  DerivedProperty.not( isAtMaxProperty ),
  isUnlockedProperty
] );
```

Reading `DerivedProperty.and( [ ...conditions ] )` names *why* the button is disabled (which condition, or combination, is false) far more directly than a hand-written `( atMax, unlocked ) => !atMax && unlocked` buried inside a generic derivation callback.

## Relationship to EnabledComponent

[`EnabledComponent`](/api/axon/enabled-component) (and the base `enabledProperty` every `sun` component already has) is the *consumer* side of this pattern — it's what gives a component a settable `enabledProperty` in the first place, with PhET-iO instrumentation and disposal already handled. This pattern is about what you *supply* to that `enabledProperty`: rather than accepting the default auto-created one and setting `.enabled` imperatively, supply your own derived `TReadOnlyProperty<boolean>` via the `enabledProperty` option, and let it stay perpetually correct as its dependencies change. Recall from `EnabledComponent`'s own documentation that supplying your own `enabledProperty` opts you out of `EnabledComponent`'s automatic disposal of it — a `DerivedProperty` you construct yourself needs its own `.dispose()` call when it's no longer needed, per [Dispose and Memory Management](/patterns/dispose-and-memory-management).

::: tip Reach for Multilink instead if nothing needs the enabled *value* itself, only a side effect
This pattern assumes the enabled state is itself consumed as a `Property` (passed to a component's `enabledProperty` option, or read elsewhere). If instead you only need to run an imperative side effect when several Properties change together — with no `Property` value to hand anywhere — that's [The Multilink Pattern](/patterns/multilink-pattern), not this one; don't reach for a `DerivedProperty` you'll never actually pass anywhere as a value.
:::
