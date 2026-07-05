---
title: A Tooltip-Style Hover Node
description: Showing and hiding a small info Node on pointer-over using scenery's enter/exit input events.
category: cookbook
tags: [scenery, Node, input, tooltip]
status: complete
related:
  - /guides/scenery-input
  - /api/scenery/node
  - /cookbook/detecting-touch-mouse-keyboard-input
prerequisites:
  - /guides/scenery-input
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Tooltip-Style Hover Node

**Task:** hovering the pointer over some Node (an icon, a data point on a graph) should reveal a small info Node nearby — a label, a value readout — that disappears again once the pointer leaves.

Scenery's `enter`/`exit` input events are the right tool here rather than `over`/`out`: `enter`/`exit` fire once per subtree (when the pointer crosses into or out of the Node's bounds at all), while `over`/`out` can fire repeatedly as the pointer crosses child boundaries within the same subtree — for a single tooltip, `enter`/`exit` avoids the flicker that `over`/`out` on a Node with children can cause.

## The solution

```ts
import { Node, Circle, Text } from 'scenerystack/scenery';

const dataPoint = new Circle( 6, { fill: 'royalblue', cursor: 'pointer' } );

const tooltip = new Text( 'Value: 42', {
  fill: 'black',
  visible: false // hidden until hovered
} );

dataPoint.addInputListener( {
  enter: () => {
    tooltip.visible = true;
    tooltip.leftBottom = dataPoint.rightTop.plusXY( 4, -4 );
  },
  exit: () => {
    tooltip.visible = false;
  }
} );

// tooltip must be added high enough in the scene graph that it isn't
// clipped by dataPoint's own parent, and drawn after (on top of) neighboring
// content that might otherwise overlap it.
const sceneRoot = new Node( { children: [ /* ...other content..., */ dataPoint, tooltip ] } );
```

Positioning `tooltip` relative to `dataPoint`'s bounds (`dataPoint.rightTop`) on `enter` — rather than fixing its position once at construction — keeps it correctly placed even if `dataPoint` itself later moves (e.g. it's also draggable).

## Following the pointer instead of anchoring to the Node

For a tooltip that should track the exact hover position rather than sit in a fixed spot relative to the hovered Node (useful when the hovered Node is large, like a chart background), read the position off the event in `move` instead:

```ts
chartBackground.addInputListener( {
  enter: () => { tooltip.visible = true; },
  exit: () => { tooltip.visible = false; },
  move: event => {
    // event.pointer.point is in the global (Display root) frame; convert to
    // whatever Node's parent frame the tooltip is positioned in.
    tooltip.leftTop = sceneRoot.globalToLocalPoint( event.pointer.point ).plusXY( 12, 12 );
  }
} );
```

## Updating tooltip content dynamically

If the tooltip's text depends on what's being hovered (different data per point), rebuild or re-link its content in `enter` rather than assuming one static string:

```ts
import { PatternStringProperty, TinyProperty, NumberProperty } from 'scenerystack/axon';

const pointValueProperty = new NumberProperty( 42 );

const tooltipTextProperty = new PatternStringProperty(
  new TinyProperty( 'Value: {{value}}' ),
  { value: pointValueProperty }
);
const tooltip = new Text( tooltipTextProperty );
```

See [Placeholder Values in a Translated String](/cookbook/placeholder-values-in-a-translated-string) if the tooltip's text needs to stay translatable.

## Options and events used here

| Event | Fires |
| --- | --- |
| `enter` | Once, when the pointer moves into this Node's subtree (not re-fired for motion between children) |
| `exit` | Once, when the pointer leaves this Node's subtree entirely |
| `move` | Repeatedly while the pointer is over this Node — use only if the tooltip needs to track the exact pointer position |

::: tip Tooltips are a pointer-only convention — don't rely on them for essential information
`enter`/`exit` never fire for keyboard-driven interaction (there is no "hovering" concept for a keyboard user) — a tooltip built this way is invisible to keyboard/AT users entirely. If the tooltip's content is more than a nice-to-have, also expose it through the [Parallel DOM](/accessibility/pdom) (e.g. as part of the hovered Node's `accessibleName`/`descriptionContent`) so the same information reaches keyboard and screen-reader users. See [Detecting Touch vs. Mouse vs. Keyboard Input](/cookbook/detecting-touch-mouse-keyboard-input) for checking input modality more generally.
:::

::: warning `pickable: false` the tooltip itself
Give the tooltip Node `pickable: false` if it's positioned so it could ever overlap the hovered Node or another interactive Node — otherwise the tooltip itself can intercept pointer events (e.g. triggering its own spurious `enter`/`exit` on neighboring listeners) once it appears directly under the pointer.
:::
