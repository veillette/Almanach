---
title: A Full Accessible Multi-Screen Sim
description: Threading PDOM, keyboard, and Voicing support through every screen of a multi-screen sim from the first line of code, instead of retrofitting it later.
category: examples
tags: [example, accessibility, joist, pdom, voicing, multi-screen]
status: complete
related:
  - /examples/building-a-two-screen-simulation
  - /examples/accessible-control-panel-example
  - /accessibility/pdom
  - /accessibility/voicing
  - /accessibility/keyboard-input-and-hotkeys
  - /accessibility/focus-highlights
  - /accessibility/describing-dynamic-state
  - /patterns/multi-screen-sim-structure
  - /patterns/drag-listeners
  - /api/joist/screen-view
prerequisites:
  - /examples/building-a-two-screen-simulation
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Full Accessible Multi-Screen Sim

[Building a Two-Screen Simulation](/examples/building-a-two-screen-simulation) covers how to structure independent model/view code across screens; [Accessible Control Panel Example](/examples/accessible-control-panel-example) covers labeling and focus order for one panel of controls. This page doesn't repeat either — it's about the layer that has to run through *both screens of that structure at once*: making every screen keyboard-navigable and voiced from the moment its `ScreenView` is written, not as a pass applied after the visuals are "done."

The reason this has to be designed in, not bolted on, is structural: `ScreenView` itself reserves the accessibility shape for you (see below), and retrofitting a screen that was built pointer-only usually means restructuring its listeners anyway — see [Migrating a Legacy Sim to RichDragListener](/examples/migrating-to-rich-drag-listener) for exactly how much rework that retrofit costs.

## The structural hook: every ScreenView already has a PDOM shape

`ScreenView` (from `scenerystack/sim`) builds its own PDOM scaffold in its constructor: an `<h1>` title, a `ScreenSummaryNode`, and two protected organizing Nodes — `pdomPlayAreaNode` and `pdomControlAreaNode` — always in that order, on every screen of every sim. This is why `ScreenView` **throws** if you call `pdomOrder` on it directly: the real per-screen accessible order goes on those two Nodes instead, from inside your `ScreenView` subclass (they're `protected`, so only reachable there):

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';

class MotionScreenView extends ScreenView {
  public constructor( model: MotionModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    // ... build ballNode, controlPanel, resetAllButton (below) ...

    // Order content WITHIN the play area and control area, not on `this`.
    this.pdomPlayAreaNode.pdomOrder = [ ballNode ];
    this.pdomControlAreaNode.pdomOrder = [ controlPanel, resetAllButton ];
  }
}
```

Because every screen is forced through the same two buckets, a keyboard/screen-reader user gets the same top-level heading structure ("Play Area", then "Control Area") no matter which screen they're on — a consistency the sim author doesn't have to design, only populate correctly per screen.

## Screen 1: "Motion" — an accessible, voiced draggable

The model is an ordinary `positionProperty`; nothing about the model changes for accessibility — only the view:

```ts
// MotionModel.ts
import { Vector2Property, Vector2, Bounds2 } from 'scenerystack/dot';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

export default class MotionModel {
  public readonly positionProperty: Vector2Property;
  public readonly dragBoundsProperty: Property<Bounds2>;

  public constructor( tandem: Tandem ) {
    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      tandem: tandem.createTandem( 'positionProperty' )
    } );
    this.dragBoundsProperty = new Property( new Bounds2( -200, -150, 200, 150 ) );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}
```

The view wires `RichDragListener` (pointer + keyboard in one declaration — see [Drag Listeners](/patterns/drag-listeners)), the PDOM options that make the ball focusable and named, and `Voicing` so the same interaction is *spoken* when the user has that feature enabled (see [Voicing](/accessibility/voicing)):

```ts
// BallNode.ts
import { Circle, RichDragListener, Voicing } from 'scenerystack/scenery';
import type MotionModel from './MotionModel';

export default class BallNode extends Voicing( Circle ) {
  public constructor( model: MotionModel ) {
    super( 20, {
      fill: 'steelblue',
      cursor: 'pointer',

      // PDOM: focusable and named from the start, not added once dragging "works"
      tagName: 'div',
      focusable: true,
      accessibleName: 'Ball',
      helpText: 'Move with arrow keys, or drag with a mouse or touch.',

      // Voicing: spoken automatically on focus, once the user enables Voicing
      voicingNameResponse: 'Ball',
      voicingHintResponse: 'Move with arrow keys, or drag with a mouse or touch.'
    } );

    model.positionProperty.link( position => {
      this.translation = position;
    } );

    this.addInputListener( new RichDragListener( {
      positionProperty: model.positionProperty,
      dragBoundsProperty: model.dragBoundsProperty,
      end: () => {
        if ( !model.dragBoundsProperty.value.containsPoint( model.positionProperty.value ) ) {
          // Announced immediately, regardless of where focus currently is —
          // see /accessibility/describing-dynamic-state
          this.addAccessibleResponse( 'Boundary reached.' );
        }
      }
    } ) );
  }
}
```

`RichDragListener` is what makes both halves of this one declaration: without it, pointer dragging would work immediately but the ball would need a second, separately-maintained `KeyboardDragListener` to be reachable by keyboard at all — see [Alternative Input Overview](/accessibility/alternative-input-overview) for why that composition is possible.

The `ScreenView` also supplies a `screenSummaryContent`, which feeds *both* the PDOM's screen-summary paragraph and the Voicing toolbar's "Overview"/"Details"/"Hint" buttons from the same content:

```ts
import { ScreenSummaryContent } from 'scenerystack/sim';
import { DerivedProperty } from 'scenerystack/axon';
import { Property } from 'scenerystack/axon';

const positionDescriptionProperty = new DerivedProperty(
  [ model.positionProperty ],
  position => `The ball is at ${position.x.toFixed( 0 )}, ${position.y.toFixed( 0 )}.`
);

const screenSummaryContent = new ScreenSummaryContent( {
  playAreaContent: new Property( 'A ball you can move around an empty play area.' ),
  currentDetailsContent: [ positionDescriptionProperty ],
  interactionHintContent: new Property( 'Move the ball with arrow keys, or drag it with a mouse or touch.' )
} );
```

Passed as `providedOptions.screenSummaryContent` up to `super()`, this content is what a screen-reader user hears first on arriving at the screen, and what a Voicing user hears on demand — written once, for both systems.

## Screen 2: "Forces" — an accessible control panel

[Accessible Control Panel Example](/examples/accessible-control-panel-example) already builds a fully-labeled panel (slider, checkbox, radio group, reset button) with `accessibleName`/`helpText` on every control — reuse that pattern verbatim for this screen's panel rather than duplicating it here. The only two things specific to *this* screen's accessibility layer are:

1. Ordering the panel under `pdomControlAreaNode`, alongside whatever's in the play area:

```ts
class ForcesScreenView extends ScreenView {
  public constructor( model: ForcesModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const ballNode = new BallNode( model.ballModel );
    const controlPanel = createPanelContent( model, this.tandem.createTandem( 'panel' ) ); // from the panel example

    this.pdomPlayAreaNode.pdomOrder = [ ballNode ];
    this.pdomControlAreaNode.pdomOrder = [ controlPanel ];
  }
}
```

2. Giving *this* screen's `ScreenSummaryContent` a `controlAreaContent` describing the panel, since "Forces" has controls "Motion" doesn't:

```ts
const screenSummaryContent = new ScreenSummaryContent( {
  playAreaContent: new Property( 'A ball affected by the forces you configure.' ),
  controlAreaContent: new Property( 'Controls for adjusting speed, enabling gravity, and choosing the ball\'s shape.' )
} );
```

## What's threaded through every screen, and what's per-screen

| Concern | Every screen (same shape) | Per-screen (different content) |
| --- | --- | --- |
| PDOM structure | `pdomPlayAreaNode` before `pdomControlAreaNode`, forced by `ScreenView` itself | Which Nodes go in each, via that screen's own `pdomOrder` assignment |
| Focus on screen entry | The screen's `<h1>` title is focused automatically when the screen becomes visible | The title text itself, supplied via the sim's screen `name` |
| Screen summary / Voicing toolbar | Same `ScreenSummaryContent` mechanism, feeding both PDOM and Voicing | `playAreaContent`/`controlAreaContent`/`currentDetailsContent`/`interactionHintContent` strings, written per screen |
| Draggable objects | `RichDragListener` + PDOM + `Voicing` composed the same way | Which object, and what `accessibleName`/`voicingHintResponse` describes it |
| Reset | One `ResetAllButton` per screen, under that screen's own `pdomControlAreaNode` order | Which model Properties `reset()` touches |

## Testing across all screens

The checklist from [Accessible Interaction Tutorial](/guides/accessible-interaction-tutorial) and [Accessible Control Panel Example](/examples/accessible-control-panel-example) still applies *per screen*, plus two things that only show up with more than one screen:

1. **Tab from the Home screen into each screen separately.** Each screen's own PDOM tree only exists while that screen is selected — verify the tab order restarts sensibly (title, then play area, then control area) every time you switch screens, not just on the first one you happen to test.
2. **Voicing toolbar content differs per screen.** Press the Voicing toolbar's "Overview"/"Details"/"Hint" buttons on *every* screen, not just one — since `screenSummaryContent` is set per `ScreenView`, it's easy to wire it up thoroughly on the first screen built and forget it on the second.

::: warning `pdomOrder` cannot be set on `ScreenView` itself
`ScreenView.setPDOMOrder()` throws — the real per-screen order goes on the protected `pdomPlayAreaNode`/`pdomControlAreaNode` members instead, set from within your `ScreenView` subclass's own constructor. This is what guarantees every screen in every sim gets the same top-level heading structure for screen readers.
:::

## Where to go next

- [Building a Two-Screen Simulation](/examples/building-a-two-screen-simulation) — the model/view structure this page's accessibility layer runs through
- [Accessible Control Panel Example](/examples/accessible-control-panel-example) — the full panel-labeling pattern reused by the "Forces" screen
- [Migrating a Legacy Sim to RichDragListener](/examples/migrating-to-rich-drag-listener) — what it costs to retrofit a pointer-only screen instead of building it accessible from the start
- [The Parallel DOM (PDOM)](/accessibility/pdom) — the option reference behind `accessibleName`/`helpText`/`descriptionContent`
- [Voicing](/accessibility/voicing) — the four response categories used on `BallNode` above
- [Describing Dynamic State](/accessibility/describing-dynamic-state) — the derived-Property pattern behind `positionDescriptionProperty` and `addAccessibleResponse`
