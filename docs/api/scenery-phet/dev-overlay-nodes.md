---
title: Developer Overlay Nodes
description: CanvasWarningNode and PointerCoordinatesNode — two debug/developer-only overlay Nodes for surfacing a WebGL fallback warning and live pointer coordinates.
category: api
library: scenery-phet
tags: [scenery-phet, CanvasWarningNode, PointerCoordinatesNode, debug, developer]
status: complete
related:
  - /api/phetcommon/model-view-transform
  - /api/scenery-phet/phet-font
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Developer Overlay Nodes

`CanvasWarningNode` and `PointerCoordinatesNode` (both from `scenerystack/scenery-phet`) are two unrelated, small `Node`s that share a common theme: neither is meant to appear in a finished sim for end users. One is a fallback warning shown when a sim can't get WebGL and had to degrade to Canvas rendering; the other is a debug overlay for developers who need to see live pointer coordinates in both view and model space while working on layout or a model-view transform. They're grouped on this page because each is small enough that a dedicated page would mostly restate this same "developer/debug-only" framing twice.

```ts
import { CanvasWarningNode, PointerCoordinatesNode } from 'scenerystack/scenery-phet';
import { ModelViewTransform2 } from 'scenerystack/phetcommon';
```

## CanvasWarningNode

An `HBox` combining a warning-triangle icon with a two-line message ("your browser doesn't support WebGL" style copy, pulled from translated string Properties), used by sims that render some content in WebGL and need a graceful, clickable fallback notice when the runtime has to use Canvas instead. It takes no constructor arguments — there's nothing to configure.

```ts
const warningNode = new CanvasWarningNode();
```

Clicking (or tapping) the node opens `https://phet.colorado.edu/webgl-disabled-page` in a new tab/popup, with the current locale appended, via `openPopup` — it's cursor-styled as a link (`cursor: 'pointer'`) and its mouse/touch areas are dilated to its full local bounds so it's easy to tap on a phone.

::: tip Not meant to be conditionally sized or restyled
`CanvasWarningNode` has no options at all — if you need different copy or layout for a WebGL-fallback message, compose your own `Node` from the same pieces (`HBox`/`VBox`/`Text`/`Path`) rather than trying to configure this one; it's a fixed, PhET-house-style notice, not a general-purpose warning banner.
:::

## PointerCoordinatesNode

A tiny `Node` (a background `Rectangle` behind a `RichText`, styled with [`PhetFont`](/api/scenery-phet/phet-font) by default) that follows the pointer and displays both its view-space and model-space coordinates, updated on every `move` event, using a [`ModelViewTransform2`](/api/phetcommon/model-view-transform) to convert between the two. It's explicitly a debugging tool — the doc comment on the source calls out that it was "originally implemented for use in gas-properties... exclusively for debugging" — not something to ship visible in a released sim.

```ts
const modelViewTransform = ModelViewTransform2.createIdentity();

const pointerCoordinatesNode = new PointerCoordinatesNode( modelViewTransform, {
  modelDecimalPlaces: 2,
  viewDecimalPlaces: 0
} );

// Typically added directly to a ScreenView, on top of everything else:
// screenView.addChild( pointerCoordinatesNode );
```

### Constructor

```ts
new PointerCoordinatesNode(
  modelViewTransform: ModelViewTransform2,
  providedOptions?: PointerCoordinatesNodeOptions   // NOT propagated to the Node superclass
)
```

### Options

| Option | Default | Effect |
| --- | --- | --- |
| `display` | `phet.joist.display` (read off a global) | The `Display` to attach the pointer-move listener to |
| `pickable` | `false` | Forwarded to the Node's own `pickable`, kept `false` so the overlay never itself intercepts input |
| `font` | `PhetFont(14)` | Font for the coordinate text |
| `textColor` | `'black'` | Text fill |
| `align` | `'center'` | `RichText` horizontal alignment |
| `modelDecimalPlaces` | `1` | Decimal places shown for the model-space `(x, y)` pair |
| `viewDecimalPlaces` | `0` | Decimal places shown for the view-space `(x, y)` pair |
| `backgroundColor` | `'rgba(255,255,255,0.5)'` | Fill of the background rectangle behind the text |

::: warning Adds a listener directly to the Display, not to itself
`PointerCoordinatesNode` attaches its `move` listener to the `Display` (`options.display.addInputListener(...)`), not to the node instance — this is called out explicitly in the source comment because Scenery doesn't support routing the same pointer event through two different trails, so a Display-level listener is the only way to see every pointer move regardless of what else on screen is consuming events. One consequence: it keeps receiving and reacting to pointer-move events **even when its current screen is inactive**, since Display-level listeners aren't scoped to the active screen.
:::
