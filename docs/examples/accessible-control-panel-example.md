---
title: Accessible Control Panel Example
description: A fully accessible control panel combining sun components with PDOM.
category: examples
tags: [example, accessibility, sun]
status: complete
related:
  - /accessibility/pdom
  - /patterns/reset-all-pattern
  - /patterns/model-view-separation
  - /api/sun/panel
  - /api/sun/hslider
  - /api/sun/checkbox
  - /api/sun/radio-button-group
  - /api/scenery-phet/reset-all-button
prerequisites:
  - /accessibility/pdom
  - /api/sun/checkbox
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Accessible Control Panel Example

`sun` components come with sensible PDOM structure built in, but a *panel* of several controls still needs its own labeling, grouping, and keyboard traversal order to be genuinely accessible — those are the reader's responsibility, not something `Panel` gives you for free. This page builds one worked control panel — a slider, a checkbox, a radio button group, and a reset button — with every accessibility seam filled in.

## The model

```ts
import { NumberProperty, BooleanProperty, StringProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

type Shape = 'circle' | 'square';

class PanelModel {
  public readonly speedProperty: NumberProperty;
  public readonly gravityEnabledProperty: BooleanProperty;
  public readonly shapeProperty: StringProperty;

  public constructor( tandem: Tandem ) {
    this.speedProperty = new NumberProperty( 1, {
      range: new Range( 0, 5 ),
      tandem: tandem.createTandem( 'speedProperty' )
    } );
    this.gravityEnabledProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'gravityEnabledProperty' )
    } );
    this.shapeProperty = new StringProperty( 'circle', {
      validValues: [ 'circle', 'square' ] as Shape[],
      tandem: tandem.createTandem( 'shapeProperty' )
    } );
  }

  public reset(): void {
    this.speedProperty.reset();
    this.gravityEnabledProperty.reset();
    this.shapeProperty.reset();
  }
}
```

## The panel content

Each control gets an `accessibleName` — the string a screen reader announces — and, where the visible label doesn't already say everything a keyboard/screen-reader user needs, a `helpText`:

```ts
import { VBox, Text } from 'scenerystack/scenery';
import { Panel } from 'scenerystack/sun';
import { HSlider, Checkbox, RectangularRadioButtonGroup, type RectangularRadioButtonGroupItem } from 'scenerystack/sun';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import { Range } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

function createPanelContent( model: PanelModel, tandem: Tandem ) {

  const speedSlider = new HSlider( model.speedProperty, new Range( 0, 5 ), {
    accessibleName: 'Speed',
    helpText: 'Adjust how fast objects move.',
    tandem: tandem.createTandem( 'speedSlider' )
  } );

  const gravityCheckbox = new Checkbox(
    model.gravityEnabledProperty,
    new Text( 'Gravity' ),
    {
      // accessibleName is inferred from the Text label here - see Checkbox's own docs -
      // but helpText still needs to be supplied explicitly.
      helpText: 'Toggle whether gravity pulls objects downward.',
      tandem: tandem.createTandem( 'gravityCheckbox' )
    }
  );

  const shapeItems: RectangularRadioButtonGroupItem<'circle' | 'square'>[] = [
    { value: 'circle', createNode: () => new Text( 'Circle' ) },
    { value: 'square', createNode: () => new Text( 'Square' ) }
  ];
  const shapeRadioButtonGroup = new RectangularRadioButtonGroup( model.shapeProperty, shapeItems, {
    orientation: 'horizontal',
    accessibleName: 'Object shape',
    tandem: tandem.createTandem( 'shapeRadioButtonGroup' )
  } );

  const resetAllButton = new ResetAllButton( {
    listener: () => model.reset(),
    tandem: tandem.createTandem( 'resetAllButton' )
  } );

  const content = new VBox( {
    spacing: 12,
    align: 'left',
    children: [
      new Text( 'Speed', { tagName: 'label' } ),
      speedSlider,
      gravityCheckbox,
      new Text( 'Shape', { tagName: 'label' } ),
      shapeRadioButtonGroup,
      resetAllButton
    ]
  } );

  return new Panel( content, {
    xMargin: 15,
    yMargin: 15,
    // A heading before the panel's content, so screen-reader users hear "Controls" before the individual settings.
    labelTagName: 'h3',
    labelContent: 'Controls'
  } );
}
```

## Explicit focus order

Scene-graph order determines *paint* order, which is not always the order a keyboard user should traverse controls in — set `pdomOrder` on the `ScreenView` (or any ancestor `Node`) to make the two independent, as described in [The Parallel DOM](/accessibility/pdom):

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';

class PanelScreenView extends ScreenView {
  public constructor( model: PanelModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const panel = createPanelContent( model, this.tandem.createTandem( 'panel' ) );
    panel.rightTop = this.layoutBounds.rightTop.plusXY( -20, 20 );
    this.addChild( panel );

    // speedSlider, gravityCheckbox, etc. would need to be exposed from createPanelContent
    // to be listed here explicitly; omitted controls simply follow in scene-graph order.
    this.pdomOrder = [ panel ];
  }
}
```

::: tip Every control needs BOTH a visible label and an `accessibleName`
`sun` components render a visible label (the `Text` you pass as `content`, or an adjacent `Text`) and expose an `accessibleName` to the PDOM — but these are two different things, set two different ways. `Checkbox` infers `accessibleName` from a `Text`/string-backed `content` automatically; `HSlider` and `RectangularRadioButtonGroup` do not derive their own name from anything visual and need `accessibleName` set explicitly, or a screen reader announces nothing useful when the control receives focus.
:::

::: warning `helpText` supplements `accessibleName`, it doesn't replace it
`helpText` is read *after* the accessible name, as supplementary guidance — a control with `helpText` but no `accessibleName` is still poorly labeled. Set both, even when the visible label seems self-explanatory to a sighted user.
:::

## Where to go next

- [The Parallel DOM](/accessibility/pdom) — the full set of PDOM options used here
- [Checkbox](/api/sun/checkbox) — how `accessibleName` inference from a label works
- [The Reset-All Pattern](/patterns/reset-all-pattern) — why `resetAllButton` calls exactly one method
- [Demo Simulation Walkthrough](/examples/demo-simulation-walkthrough) — this panel embedded in a complete running sim
