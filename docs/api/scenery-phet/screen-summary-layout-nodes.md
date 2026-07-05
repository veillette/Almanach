---
title: Screen Summary Layout Nodes
description: PlayAreaNode, ControlAreaNode, and ScreenSummaryNode — the standard PDOM structural sections ScreenView uses to organize a screen's accessible description tree.
category: api
library: scenery-phet
tags: [scenery-phet, PlayAreaNode, ControlAreaNode, ScreenSummaryNode, pdom, accessibility]
status: complete
related:
  - /accessibility/pdom
  - /api/joist/screen-view
  - /accessibility/describing-dynamic-state
prerequisites:
  - /accessibility/pdom
  - /api/joist/screen-view
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Screen Summary Layout Nodes

A screen reader user exploring a PhET sim's [PDOM](/accessibility/pdom) benefits from a consistent, predictable structure — rather than every sim inventing its own heading layout, `ScreenView` divides accessible content into three standard sections, each backed by one of these `Node` types from `scenerystack/scenery-phet`: `ScreenSummaryNode` (an overview of the screen, read first), `PlayAreaNode` (the primary, pedagogically important interactive content), and `ControlAreaNode` (secondary controls). Every `ScreenView` already constructs one instance of each internally — you don't construct these types yourself — but you do route your own content into two of them.

```ts
// Inside a ScreenView subclass constructor:

// Order the accessible content within the play area section.
this.pdomPlayAreaNode.pdomOrder = [ ballNode, trackNode ];

// And within the control area section.
this.pdomControlAreaNode.pdomOrder = [ resetAllButton ];
```

## The shared shape: PDOMSectionNode

`PlayAreaNode` and `ControlAreaNode` are both thin subclasses of a shared (internal) `PDOMSectionNode` base: each renders as an HTML `<section>` containing a `<div>`, with an `accessibleHeading` set from a translated label ("Play Area" / "Control Area") baked in by the constructor — you supply content, not the heading.

| Type | Section heading | Intended contents |
| --- | --- | --- |
| `PlayAreaNode` | "Play Area" | The main interactive, pedagogically central elements of the screen |
| `ControlAreaNode` | "Control Area" | Secondary controls — reset buttons, settings, anything supporting rather than central to the interaction |

`ScreenView` exposes its instances as the **protected**, read-only fields `pdomPlayAreaNode` and `pdomControlAreaNode`, accessible from a `ScreenView` subclass. Route your Nodes into one or the other with `pdomOrder`, as in the example above — `ScreenView.setPDOMOrder()` is overridden to throw, specifically to force all accessible content through these two sections rather than directly on the `ScreenView` itself, keeping the heading structure identical across every PhET sim.

## ScreenSummaryNode: the opening overview

`ScreenSummaryNode` is a plain `Node` (not a `PDOMSectionNode`) that renders as two paragraphs read at the very top of the PDOM: an opening summary sentence and a fixed "use keyboard shortcuts" hint, in that order, with room in between for your own content. `ScreenView` holds its instance privately and calls `setIntroString( simName, screenDisplayName, isMultiScreen )` on it internally — a `ScreenView` subclass never touches `ScreenSummaryNode` directly.

Instead, `ScreenView` exposes a `screenSummaryContent` constructor option (and matching `screenSummaryContent` getter/setter) that takes a `ScreenSummaryContent` — a separate, higher-level `Node` (from `scenerystack/sim`, alongside `ScreenView` itself) for structuring play-area/control-area/current-details/interaction-hint description text — which is added as a child of the internal `ScreenSummaryNode`:

```ts
import { ScreenView, ScreenSummaryContent } from 'scenerystack/sim';

class MyScreenView extends ScreenView {
  public constructor( model: MyModel, providedOptions: MyScreenViewOptions ) {
    super( {
      screenSummaryContent: new ScreenSummaryContent( {
        playAreaContent: 'A ball moves across a frictionless track.',
        controlAreaContent: 'Reset the sim, or change the track shape.'
      } ),
      ...providedOptions
    } );
  }
}
```

`ScreenSummaryNode` itself stays an implementation detail of `ScreenView` — treat it as the low-level container `ScreenSummaryContent` is composed into, not a type you construct or mutate from sim code.

::: tip These sections already exist on your ScreenView — route content into them, don't build new ones
Constructing extra `PlayAreaNode`/`ControlAreaNode`/`ScreenSummaryNode` instances yourself would create disconnected sections nothing points to. Use `this.pdomPlayAreaNode.pdomOrder`/`this.pdomControlAreaNode.pdomOrder` for interactive content, and the `screenSummaryContent` option/setter (with a `ScreenSummaryContent` from `scenerystack/sim`) for the opening description.
:::
