---
title: Advanced Layout Techniques
description: Nesting FlowBox/GridBox containers, escaping to ManualConstraint for one-off positioning, and using AlignGroup to size content consistently across containers.
category: guides
tags: [scenery, layout, manual-constraint, align-group]
status: verified
related:
  - /guides/scenery-layout
  - /guides/scenery-basics
  - /api/scenery/align-box
  - /api/scenery/flow-box
  - /api/scenery/grid-box
prerequisites:
  - /guides/scenery-layout
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/learn/scenery-layout/
---

# Advanced Layout Techniques

[Scenery Layout](/guides/scenery-layout) covers `FlowBox`, `GridBox`, and `AlignBox` as if each layout problem needs exactly one container. Real screens usually need containers nested inside each other, the occasional position that no container option quite expresses, and content in *separate* containers that still needs to agree on a common size. This page covers the three techniques that come up once you're past the basics: nesting `FlowBox`/`GridBox`, dropping to `ManualConstraint` for the cases layout containers don't model, and `AlignGroup` for cross-container sizing.

## Nesting FlowBox and GridBox

A `FlowBox` or `GridBox` doesn't care whether its children are leaf Nodes or other layout containers — nesting is just composition. This is how you build a two-axis layout out of two one-axis containers, or a toolbar-with-groups shape where each group has its own internal spacing:

```ts
import { HBox, VBox, Text, Rectangle } from 'scenerystack/scenery';

const colorSwatch = ( color: string ) => new Rectangle( 0, 0, 16, 16, { fill: color } );

// A row of "swatch + label" pairs, each pair itself laid out as a small HBox.
const legendRow = ( color: string, label: string ) => new HBox( {
  spacing: 6,
  children: [ colorSwatch( color ), new Text( label, { font: '14px sans-serif' } ) ]
} );

// The rows stack vertically as a VBox, each row internally an HBox.
const legend = new VBox( {
  spacing: 4,
  align: 'left',
  children: [
    legendRow( 'crimson', 'Reactant' ),
    legendRow( 'royalblue', 'Product' ),
    legendRow( 'gray', 'Catalyst' )
  ]
} );
```

Each inner `HBox` reports its own computed bounds up to the outer `VBox` exactly as any other child would — the outer container has no idea it's laying out other layout containers rather than leaf Nodes. This is the main tool for building anything more structured than "one row" or "one column": decompose the screen into the smallest one-axis pieces, then compose them.

The one thing to watch when nesting is that both levels are trying to manage size. If an inner `HBox` has `stretch: true` children but the outer `VBox` never gives it a `preferredWidth` to stretch into (because, say, the outer container's own `align` is `'left'` rather than `'stretch'`), the inner stretch option silently has nothing to do. Match `align`/`stretch` intentionally through the nesting rather than copying it reflexively at every level.

## ManualConstraint: escaping to imperative positioning without losing reactivity

`FlowBox`/`GridBox`/`AlignBox` cover flow and grid relationships, but not every layout is a flow or a grid — sometimes you need "this label's left edge is 5 pixels right of that icon's right edge, regardless of either one's size," expressed once and kept correct as either Node's bounds change. That's what `ManualConstraint` is for: it re-runs an arbitrary positioning callback you write, every time any of the Nodes it watches changes bounds, using `LayoutProxy` objects that behave like the positional getters/setters on `Node` (`left`, `right`, `centerY`, etc.) but work correctly even across a shared ancestor rather than requiring a direct parent-child relationship.

```ts
import { ManualConstraint, Node, Circle, Text } from 'scenerystack/scenery';

const root = new Node();
const icon = new Circle( 12, { fill: 'orange' } );
const label = new Text( 'Temperature', { font: '16px sans-serif' } );
root.children = [ icon, label ];

new ManualConstraint( root, [ icon, label ], ( iconProxy, labelProxy ) => {
  labelProxy.left = iconProxy.right + 5;
  labelProxy.centerY = iconProxy.centerY;
} );
```

The first argument is the common ancestor Node whose coordinate frame the constraint reasons in — it doesn't need to be the direct parent of either watched Node, only an ancestor of both. The constraint re-runs the callback automatically whenever `icon` or `label`'s bounds change (a translated string swapping in a longer label, an icon resizing), so `labelProxy.left`/`centerY` stay correct without you re-wiring a bounds listener by hand. It's tempting to solve this same problem with `node.boundsProperty.link(...)` and manual `x`/`y` math instead — `ManualConstraint` is that same idea, generalized and already handling the cross-coordinate-frame case correctly, so prefer it over a bespoke listener unless you have a reason its callback shape genuinely can't express.

## AlignGroup: matching sizes across independent containers

`AlignBox` (covered briefly in [Scenery Layout](/guides/scenery-layout)) wraps one child and reserves alignment space for it — but the interesting behavior shows up when several `AlignBox`es share one `AlignGroup`. Every box in the group reports the same size to whatever lays *it* out: the largest content among them, recomputed as any member's content changes. This is exactly the case where a set of sibling panels (say, one per element in a periodic-table-style grid, or one per row of a settings panel) need to occupy equal-sized cells even though their actual content — a short label versus a long one — doesn't.

```ts
import { AlignGroup, AlignBox, HBox, Text, Panel } from 'scenerystack/scenery';

const group = new AlignGroup( { matchHorizontal: true, matchVertical: true } );

const makePanel = ( labelText: string ) =>
  new Panel( group.createBox( new Text( labelText, { font: '16px sans-serif' } ), {
    xAlign: 'left',
    xMargin: 10
  } ) );

const panels = new HBox( {
  spacing: 8,
  children: [
    makePanel( 'On' ),
    makePanel( 'A much longer setting label' ),
    makePanel( 'Off' )
  ]
} );
```

`group.createBox(...)` is the same as constructing an `AlignBox` directly with `{ group }` passed in its options — it's a convenience for the common case of "make a box in this group." All three panels above end up exactly as wide and tall as the longest/tallest one needs, even though each is built independently and doesn't know about its siblings. `matchHorizontal`/`matchVertical` (both default `true`) control which axis participates in the shared sizing — set one to `false` if you only want, say, matching height with each box free to be its natural width.

Because `AlignGroup` recomputes its shared size whenever *any* member's content changes, order matters when content is populated dynamically: per the class's own guidance, if a group is populated incrementally and a UI component doesn't support resizing its own contents after the fact (some `sun` components), populate the group largest-content-first so the shared size is correct from the start rather than growing after initial layout.

::: warning AlignGroup sizing can lag one layout pass behind a bounds change
The class doc for `AlignGroup` calls out that resizes may not take effect immediately — they can be deferred until the next bounds computation for a member box's content, though anything already connected to a `Display` picks this up automatically on `Display.updateDisplay()`. If you need the recomputed size synchronously (rare — usually only relevant in tests or before the group's boxes are attached to a Display), call `group.updateLayout()` explicitly rather than assuming the size is current the instant you swap a member's content.
:::

## Where to go next

- [Scenery Layout](/guides/scenery-layout) — `FlowBox`/`GridBox`/`AlignBox` fundamentals this page builds on
- [Scenery Basics](/guides/scenery-basics) — the `bounds`/`localBounds` distinction that all of these layout mechanisms depend on
- [AlignBox](/api/scenery/align-box) — the per-child container `AlignGroup` coordinates across
