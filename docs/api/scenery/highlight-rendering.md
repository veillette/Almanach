---
title: "Highlight Rendering: HighlightPath and HighlightOverlay"
description: The Path subclass and per-Display overlay that actually draw focus, interactive, and reading-block highlights.
category: api
library: scenery
tags: [scenery, HighlightPath, HighlightOverlay, HighlightFromNode, accessibility, focus]
status: complete
related:
  - /accessibility/focus-highlights
  - /api/scenery/focus-manager
  - /api/scenery/interactive-highlighting
  - /api/scenery/voicing
  - /api/scenery/transform-tracker
  - /api/scenery/path
prerequisites:
  - /accessibility/focus-highlights
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Highlight Rendering: HighlightPath and HighlightOverlay

[Focus Highlights](/accessibility/focus-highlights) explains *how to customize* the highlight a focusable Node shows — swapping in a `HighlightFromNode`, a raw `Shape`, or a Node of your own. This page covers the machinery underneath that actually draws those highlights: `HighlightPath` (from `scenerystack/scenery`), the `Path` subclass with the double-stroke "glow" look, and `HighlightOverlay`, the per-`Display` overlay that decides which highlight is currently active and renders it in its own child `Display`.

## HighlightPath: the double-stroke look

A `HighlightPath` is a `Path` with a second, child `Path` (`innerHighlightPath`) drawn on top — an "outer" highlight (lighter, wider) and an "inner" highlight (darker, more opaque), giving the appearance of a highlight fading outward. `HighlightFromNode` (used throughout the [Focus Highlights guide](/accessibility/focus-highlights)) is a `HighlightPath` subclass that derives its shape from a Node's bounds and keeps it updated as those bounds change.

```ts
import { HighlightPath } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const highlight = new HighlightPath( Shape.roundRect( 0, 0, 40, 40, 4, 4 ), {
  dashed: true // e.g. to indicate the target is currently being manipulated
} );
```

| Option | Default | Effect |
| --- | --- | --- |
| `outerStroke` / `innerStroke` | `HighlightPath.OUTER_FOCUS_COLOR` / `INNER_FOCUS_COLOR` | Colors of the two strokes |
| `outerLineWidth` / `innerLineWidth` | `null` (computed from the local-to-global transform) | Fix the line widths instead of letting them scale automatically with the highlighted Node |
| `lineDashOverride` | `null` | Fixes the dash pattern instead of letting it scale with the transform |
| `dashed` | `false` | Whether the highlight uses a dashed stroke — PhET convention for "this is currently grabbed/being manipulated" |
| `transformSourceNode` | `null` | The Node whose transform this highlight should track (set automatically by `HighlightFromNode`) |

Static helpers worth knowing: `HighlightPath.getDilationCoefficient( matrix )` computes how far outside a Node's bounds the highlight should sit so there's visible whitespace between the Node and the inner edge of the highlight, and `HighlightPath.getDefaultHighlightLineWidth()` returns the untransformed default line width — useful if you need to reserve layout space for a highlight.

## HighlightOverlay: one per Display

Every [`Display`](/api/scenery/display) that supports focus gets a `HighlightOverlay`, which owns a completely separate child `Display` layered on top of the main scene graph (`pointer-events: none`, so it never intercepts input). It listens to the global PDOM focus Property, the [`FocusManager`](/api/scenery/focus-manager)'s pointer/reading-block focus Properties, and picks one of four modes per activation:

| Mode | When |
| --- | --- |
| `'bounds'` | Default — no custom `focusHighlight` was set; draws a `HighlightFromNode` around the focused Node's bounds |
| `'shape'` | The Node's `focusHighlight`/`interactiveHighlight` is a kite `Shape` |
| `'node'` | The Node's highlight is itself a `Node` (optionally `focusHighlightLayerable` to place it in the main scene graph instead of the overlay) |
| `'invisible'` | The literal string `'invisible'` — suppresses the highlight entirely (mainly for automated testing) |

`HighlightOverlay` also owns the group-focus-highlight and reading-block-highlight rendering, and exposes static setters for globally re-theming every highlight in an application:

```ts
import { HighlightOverlay } from 'scenerystack/scenery';
import { Color } from 'scenerystack/scenery';

// Re-theme every focus highlight application-wide, e.g. for a dark background.
HighlightOverlay.setInnerHighlightColor( new Color( 'yellow' ) );
```

| Static method | Effect |
| --- | --- |
| `setInnerHighlightColor( color )` / `getInnerHighlightColor()` | Inner stroke color used by all subsequently drawn focus highlights |
| `setOuterHilightColor( color )` / `getOuterHighlightColor()` | Outer stroke color (note the source's method name is `setOuterHilightColor`, missing a "g") |
| `setInnerGroupHighlightColor` / `setOuterGroupHighlightColor` | Same, for group focus highlights |

::: tip Line width and dash scale automatically with pan/zoom and Node scale
`HighlightOverlay` recomputes each highlight's line width and dash pattern every time its [`TransformTracker`](/api/scenery/transform-tracker) reports a transform change, combining the Node's own scale with the inverse of the current pan/zoom matrix (`HighlightPath.getCorrectiveScalingMatrix()`). This is why a focus highlight looks the same relative thickness whether the Node is scaled up, scaled down, or the user has zoomed in with [`AnimatedPanZoomListener`](/api/scenery/animated-pan-zoom-listener) — you don't need to correct for either case yourself.
:::
