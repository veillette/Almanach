---
title: A Custom Focus Highlight Shape
description: Overriding a Node's default rectangular focus highlight with a custom kite Shape via HighlightPath.
category: cookbook
tags: [scenery, HighlightPath, HighlightFromNode, focus, accessibility, kite, Shape]
status: complete
related:
  - /accessibility/focus-highlights
  - /api/scenery/highlight-rendering
  - /api/kite/shape
prerequisites:
  - /accessibility/focus-highlights
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Custom Focus Highlight Shape

**Task:** a focusable Node isn't rectangular (a circular token, an irregular icon), and the default bounds-based focus highlight — a rectangle sized to the Node's bounding box — looks visually wrong sitting around it.

Set the Node's `focusHighlight` option to a `HighlightPath` built from any `kite` `Shape` (or from another Node's bounds, via `HighlightFromNode`). This is the same mechanism documented in depth on [Focus Highlights](/accessibility/focus-highlights) and [Highlight Rendering](/api/scenery/highlight-rendering) — this recipe is the narrow "I just need a circular/custom-shaped highlight" version of that.

## The solution

```ts
import { Circle, HighlightPath } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const tokenNode = new Circle( 20, {
  fill: 'goldenrod',
  tagName: 'div',
  focusable: true,
  accessibleName: 'Token'
} );

// A circular highlight matching tokenNode's actual shape, instead of the
// default rectangle sized to its bounding box.
tokenNode.focusHighlight = new HighlightPath( Shape.circle( 0, 0, 26 ) );
```

`HighlightPath` draws the same two-tone outer/inner "glow" stroke as the default highlight — only the underlying `Shape` differs — so a custom highlight built this way still visually reads as "a focus highlight" and stays consistent with the rest of the application.

## Matching the highlight to a different Node than the focusable one

A common variant: the focusable Node has a larger hit area than its visible icon (for easier touch/pointer targeting), and the highlight should trace the *visible* icon, not the larger hit target. `HighlightFromNode` handles this and keeps the highlight updated automatically if that Node's bounds ever change:

```ts
import { Node, Path, HighlightFromNode } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const starShape = new Shape().moveTo( 0, -14 ).lineTo( 4, -4 ).lineTo( 14, -4 )
  .lineTo( 6, 3 ).lineTo( 9, 14 ).lineTo( 0, 7 ).lineTo( -9, 14 )
  .lineTo( -6, 3 ).lineTo( -14, -4 ).lineTo( -4, -4 ).close();

const iconNode = new Path( starShape, { fill: 'orange' } );

const draggableIcon = new Node( {
  children: [ iconNode ],
  // A larger, invisible hit target than the icon itself:
  mouseArea: iconNode.localBounds.dilated( 10 ),
  touchArea: iconNode.localBounds.dilated( 20 ),
  tagName: 'div',
  focusable: true,
  accessibleName: 'Star'
} );

draggableIcon.focusHighlight = new HighlightFromNode( iconNode );
```

## Options used here

| Option | Effect |
| --- | --- |
| `focusHighlight` | `Shape \| Node \| 'invisible' \| null` on any focusable Node; `null`/omitted uses the automatic bounds-based rectangle |
| `HighlightPath`'s `dashed` | Set `true` for PhET's convention of "this is currently being manipulated" (see [Highlight Rendering](/api/scenery/highlight-rendering)) |
| `HighlightPath`'s `outerStroke` / `innerStroke` | Override the highlight's two stroke colors, if the default theme doesn't read well against a particular background |

::: tip Reach for `HighlightFromNode` before building a raw `Shape` by hand
Most "the highlight doesn't match this Node's visual shape" cases are really "the highlight should trace a *different, already-existing* Node's bounds" (an icon smaller than its hit target) rather than a genuinely custom outline — `HighlightFromNode` covers that case with no `Shape` math at all, and keeps itself updated if that Node's bounds change later. Reach for a hand-built `Shape` (as in the circular example above) only when no existing Node's bounds already describe the outline you want.
:::

::: warning A non-rectangular highlight is a visual fix only — it doesn't change hit-testing
Setting `focusHighlight` changes what's *drawn* on focus; it has no effect on `mouseArea`/`touchArea`/pickability. If the goal is also making the effective clickable region match a custom shape (not just its highlight), that's a separate change to `mouseArea`/`touchArea` or `hitTestShape`-style Node options, not something `focusHighlight` provides.
:::
