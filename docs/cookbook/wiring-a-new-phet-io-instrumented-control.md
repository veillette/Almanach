---
title: Wiring Up a New PhET-iO Instrumented Control
description: Giving a new UI control a Tandem (and, if needed, an IOType) so it shows up correctly in PhET-iO state.
category: cookbook
tags: [tandem, phet-io, Tandem, IOType, Checkbox]
status: complete
related:
  - /api/tandem/tandem
  - /api/tandem/io-type
  - /patterns/phet-io-instrumentation-pattern
prerequisites:
  - /patterns/phet-io-instrumentation-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Wiring Up a New PhET-iO Instrumented Control

**Task:** a new UI control (a checkbox, a custom button, a new kind of control class) needs to be visible to PhET-iO — addressable by name, saved/restored in state, and controllable from a wrapper — instead of existing only as an opaque, uninstrumented view element.

For the overwhelming majority of controls, this is entirely about **plumbing a real `Tandem` down to the control and to the `Property` it operates on** — see [The PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern) for the underlying convention. You reach for a hand-written [`IOType`](/api/tandem/io-type) only in the much rarer case where the control's own state isn't already fully expressed by instrumented `Property`s it wraps.

## The common case: a `sun` control with a real `Tandem`

```ts
import { Checkbox } from 'scenerystack/sun';
import { BooleanProperty } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

class MyScreenModel {
  public readonly soundEnabledProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {
    this.soundEnabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'soundEnabledProperty' ),
      phetioDocumentation: 'Whether interaction sounds are enabled for this screen.'
    } );
  }
}

class MyScreenView /* extends ScreenView */ {
  public constructor( model: MyScreenModel, viewTandem: Tandem ) {
    const soundCheckbox = new Checkbox(
      model.soundEnabledProperty,
      new Text( 'Sound' ),
      {
        tandem: viewTandem.createTandem( 'soundCheckbox' )
      }
    );
    // this.addChild( soundCheckbox );
  }
}
```

`soundEnabledProperty`'s own `BooleanIO` (its built-in `IOType`) is what actually gets serialized into PhET-iO state — `soundCheckbox`'s `tandem` mainly makes the *view element itself* addressable (so a wrapper can, for example, simulate a click on it), while the `Property`'s tandem is what makes the underlying *state* saveable and restorable. Both matter, and both come from the same `tandem.createTandem(...)` calls threaded down from the screen, exactly as in [The PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern).

## Checklist for a new control

| Step | Why |
| --- | --- |
| Pass a real `tandem: someParentTandem.createTandem( 'meaningfulName' )`, not `Tandem.REQUIRED` left unfilled | `Tandem.REQUIRED` is a sentinel that asserts in a validated PhET-iO build if never overridden — see [Tandem](/api/tandem/tandem) |
| Give the `Property` the control operates on its own child tandem, named for what it represents | This is the actual state PhET-iO saves/restores/exposes to clients — the control's own tandem exposes the *element*, not the state |
| Add `phetioDocumentation` to the `Property` | Shown to PhET-iO clients in Studio; describe what the value means, not how it's implemented |
| Only reach for a custom `IOType` if the control holds state that isn't already an instrumented `Property` | See below — most controls never need this |

## When a custom control does need its own `IOType`

A hand-written [`IOType`](/api/tandem/io-type) is for classes that hold state PhET-iO needs to serialize but that isn't already expressed as instrumented child `Property`s — for example, a dynamic-element container. If your new control is a plain composition of already-instrumented `Property`s (as above), skip this section; you don't need it.

```ts
import { IOType, NumberIO } from 'scenerystack/tandem';

type DialSettingStateObject = { angleDegrees: number };

// Only needed if DialControl's meaningful state ISN'T already exposed via
// an instrumented child Property.
const DialControlIO = new IOType<DialControl, DialSettingStateObject>( 'DialControlIO', {
  valueType: DialControl,
  documentation: 'A rotary dial control, expressed as its angle in degrees.',
  stateSchema: {
    angleDegrees: NumberIO
  },
  toStateObject: dial => ( { angleDegrees: dial.angleDegrees } ),
  applyState: ( dial, state ) => {
    dial.angleDegrees = state.angleDegrees;
  }
} );
```

Pass this as the `phetioType` option on the control's constructor (a `PhetioObject` option, inherited by every `Node`) once it exists.

::: tip Uninstrumented is the safe default while a control is still being built
It's fine to leave a control's `tandem` at its default while iterating on behavior — instrument it once the control's shape has stabilized. Adding instrumentation later is cheap; removing instrumentation a PhET-iO wrapper has already come to depend on is a breaking change. See the tip in [The PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern#deciding-what-to-instrument).
:::

::: warning Renaming a tandem after release breaks existing wrappers
Once a control's tandem name has shipped, treat it as a stable public identifier — a wrapper or a saved PhET-iO state file addresses the element by its `phetioID`, so renaming `soundCheckbox` to `soundToggle` later is exactly as breaking as renaming a public API method.
:::
