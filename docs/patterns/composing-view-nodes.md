---
title: Composing View Nodes
description: 'Building a screen''s view as small, composed Node subclasses instead of one giant ScreenView.'
category: patterns
tags:
  - scenery
  - Node
  - ScreenView
  - composition
  - architecture
status: verified
related:
  - /patterns/model-view-separation
  - /guides/building-your-first-screen
  - /patterns/dispose-and-memory-management
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - 'https://www.npmjs.com/package/scenerystack'
  - 'https://scenerystack.org/reference/'
---

# Composing View Nodes

A `ScreenView` is a `Node` like any other, which makes it tempting to build a screen by adding dozens of `Circle`/`Text`/`HBox` children directly to it in one long constructor. Instead, treat the `ScreenView` as an assembly point: each visually or behaviorally distinct piece of the screen — a control panel, a graph, a single draggable body — is its own `Node` subclass, constructed once and added as a child. The `ScreenView` wires them to the model and to each other; it doesn't contain their internals.

## The anti-pattern: one giant ScreenView

```ts
// Don't do this - every control lives inline, the constructor keeps growing,
// and nothing here is reusable or independently testable.
export default class ProjectileScreenView extends ScreenView {
  public constructor( model: ProjectileModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const angleSlider = new HSlider( model.angleProperty, new Range( 0, 90 ) );
    const angleLabel = new Text( 'Angle' );
    const speedSlider = new HSlider( model.speedProperty, new Range( 0, 20 ) );
    const speedLabel = new Text( 'Speed' );
    const controlPanel = new Panel( new VBox( {
      children: [ new HBox( { children: [ angleLabel, angleSlider ] } ),
                  new HBox( { children: [ speedLabel, speedSlider ] } ) ]
    } ) );
    // ...forty more lines of graph axes, a launch button, a trajectory path...

    this.children = [ controlPanel, /* ... */ ];
  }
}
```

Every new control adds to a single constructor that mixes layout, styling, and model-wiring concerns for the whole screen, and none of it can be unit-tested or reused without instantiating the entire `ScreenView`.

## The pattern: one Node subclass per concern

```ts
// view/ProjectileControlPanel.ts
import { Panel, type PanelOptions } from 'scenerystack/sun';
import { VBox } from 'scenerystack/scenery';
import { HSlider } from 'scenerystack/sun';
import type ProjectileModel from '../model/ProjectileModel.js';

export default class ProjectileControlPanel extends Panel {
  public constructor( model: ProjectileModel, providedOptions?: PanelOptions ) {
    const content = new VBox( {
      spacing: 8,
      children: [
        new HSlider( model.angleProperty, model.angleProperty.range ),
        new HSlider( model.speedProperty, model.speedProperty.range )
      ]
    } );

    super( content, providedOptions );
  }
}
```

```ts
// view/ProjectileScreenView.ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import ProjectileControlPanel from './ProjectileControlPanel.js';
import ProjectileBodyNode from './ProjectileBodyNode.js';
import type ProjectileModel from '../model/ProjectileModel.js';

export default class ProjectileScreenView extends ScreenView {
  public constructor( model: ProjectileModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const controlPanel = new ProjectileControlPanel( model, {
      right: this.layoutBounds.maxX - 20,
      top: this.layoutBounds.minY + 20
    } );

    const bodyNode = new ProjectileBodyNode( model );

    this.children = [ bodyNode, controlPanel ];
  }
}
```

The `ScreenView` now reads as a table of contents for the screen: what exists, and roughly where it sits. Each piece — `ProjectileControlPanel`, `ProjectileBodyNode` — can be constructed and inspected in isolation, and a change to how the control panel lays itself out never touches the `ScreenView` at all.

## How to decide where the seam goes

- **A visually distinct region** (a panel, a graph, a toolbar) is its own `Node` subclass, even if it's only used once — the goal isn't reuse, it's keeping each constructor's responsibility narrow.
- **A repeated element** (one item per array entry, one body per particle) is unconditionally its own class; see also [Composing View Nodes](#the-pattern-one-node-subclass-per-concern) applied per-item and [Avoiding Property Leaks](/patterns/avoiding-property-leaks) for cleanup when those items are created and destroyed dynamically.
- **Pure layout glue** with no independent identity (a one-off `HBox` grouping two Nodes that are otherwise unrelated) can stay inline in the parent — composing a `Node` subclass for every last spacer is its own anti-pattern.
- Each subclass still follows [Model-View Separation](/patterns/model-view-separation): it takes the model (or the one Property it needs) as a constructor argument and never reaches into sibling view classes directly.

::: tip A Node subclass's constructor argument list is its interface
Prefer passing exactly the model (or Properties) a view Node needs, not the whole screen's model plus a grab-bag of siblings. A `ProjectileBodyNode` that only takes `model.positionProperty` documents, by its signature, that it doesn't care about the control panel's state — and it's trivial to construct in a test or a Storybook-style harness later.
:::
