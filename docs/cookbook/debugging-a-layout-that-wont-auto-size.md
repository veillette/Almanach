---
title: Debugging a Layout That Won't Auto-Size
description: A troubleshooting checklist for FlowBox/GridBox children that refuse to stretch or shrink as expected.
category: cookbook
tags: [scenery, FlowBox, GridBox, Sizable, layout, layoutOptions, debugging]
status: complete
related:
  - /api/scenery/flow-box
  - /api/scenery/grid-box
  - /api/scenery/sizable-mixins
  - /guides/scenery-layout
  - /guides/advanced-layout-techniques
prerequisites:
  - /guides/scenery-layout
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Debugging a Layout That Won't Auto-Size

**Task:** a child inside a `FlowBox`/`GridBox` is supposed to grow or shrink to fill available space (`stretch: true`, `grow: 1`), but stays stuck at its natural content size — or the container itself doesn't shrink/grow the way a resizable parent's `preferredWidth` implies it should.

This is a checklist, not a single fix — auto-sizing failures almost always come down to one of four causes, roughly in order of how often each one is the actual culprit.

## 1. The per-child option is set in the wrong place

`stretch`, `grow`, `align`, and margins are read from each child's **`layoutOptions`**, not from options passed to the child's own constructor:

```ts
// Wrong - align/grow here do nothing; FlowBox never looks at the child's own options.
const badChild = new Rectangle( 0, 0, 20, 20, { fill: 'teal', grow: 1 } as any );

// Right - set on layoutOptions, which the parent FlowBox/GridBox actually reads.
const goodChild = new Rectangle( 0, 0, 20, 20, { fill: 'teal' } );
goodChild.layoutOptions = { grow: 1, stretch: true };
```

This is the single most common cause — see the warning on [FlowBox](/api/scenery/flow-box#options): "Setting `someChild.align = 'center'` does nothing."

## 2. The child isn't actually resizable, only positionable

`stretch`/`grow` tell the *container* to try to give a child more space — but a plain `Node`/`Path`/`Rectangle` has no concept of "be this size," only "here is my content's natural size." Only a Node that mixes in `WidthSizable`/`HeightSizable`/`Sizable` (see [Sizable, WidthSizable, and HeightSizable](/api/scenery/sizable-mixins)) can actually grow or shrink in response to a `preferredWidth`/`preferredHeight` the layout container sets:

```ts
import { Node, Rectangle, Sizable } from 'scenerystack/scenery';

// A plain Rectangle can never really "stretch" - its rectWidth is whatever
// you set it to, and nothing reacts to a parent's preferredWidth.
class PlainBar extends Node { /* ... */ }

// A Sizable Node CAN stretch - it reacts to preferredWidthProperty.
class StretchyBar extends Sizable( Node ) {
  private readonly background = new Rectangle( 0, 0, 0, 20, { fill: 'teal' } );

  public constructor() {
    super();
    this.addChild( this.background );
    this.mutate( { minimumWidth: 20 } ); // set AFTER super(), not in super()'s options
    this.preferredWidthProperty.link( preferredWidth => {
      this.background.rectWidth = preferredWidth ?? this.minimumWidth ?? 0;
    } );
  }
}
```

If the child in question is a `sun`/`scenery-phet` component, check whether that specific class documents itself as sizable at all before assuming `stretch: true` should do anything to it — many fixed-content components (an icon, a `Text`) are deliberately not resizable, and `stretch`/`grow` on them is a no-op by design, not a bug.

## 3. Nothing upstream ever gave the container a `preferredWidth` to distribute

`stretch`/`grow` only have leftover space to distribute if the *container itself* has been given a `preferredWidth`/`preferredHeight` from somewhere — usually its own parent, or an explicit `layoutBounds`-derived size on a top-level container. A `FlowBox` whose own bounds are purely content-driven (nobody set `preferredWidth` on it) has no "extra space" for a `grow: 1` child to claim, so the child sits at its minimum size even though it's genuinely resizable:

```ts
import { HBox } from 'scenerystack/scenery';

const row = new HBox( { children: [ stretchyBar ], stretch: true } );
row.layoutOptions = { grow: 1 }; // still does nothing unless row's OWN parent gives it a preferredWidth

// Something has to be the source of a fixed size for the chain to have
// anything to distribute - e.g. explicitly setting a container width:
row.preferredWidth = 400; // now stretchyBar has 400 px (minus siblings) to grow into
```

See [Advanced Layout Techniques](/guides/advanced-layout-techniques#nesting-flowbox-and-gridbox) for the same issue showing up when nesting: an inner container's `stretch: true` children have nothing to do if the outer container's own `align` never gives the inner container a `preferredWidth` in the first place.

## 4. A GridBox child's `row`/`column` is missing or wrong

For `GridBox` specifically, a child that appears in the wrong cell (or seems to not participate in the grid at all) is usually a `layoutOptions.row`/`layoutOptions.column` that's missing, duplicated with another child, or set on the wrong Node (e.g. on a wrapper `Node` instead of the actual visible child):

```ts
// Two children accidentally targeting the same cell - the second overwrites the first visually.
labelText.layoutOptions = { row: 0, column: 0 };
checkbox.layoutOptions = { row: 0, column: 0 }; // bug: should be column: 1
```

## The checklist

| Symptom | Likely cause | Where to look |
| --- | --- | --- |
| `stretch`/`grow`/`align` set but nothing changes | Option set on the child's own constructor, not `layoutOptions` | [FlowBox options](/api/scenery/flow-box#options) |
| Child has `layoutOptions.stretch: true` but never actually grows | Child isn't `WidthSizable`/`HeightSizable`/`Sizable` | [Sizable, WidthSizable, and HeightSizable](/api/scenery/sizable-mixins) |
| A `Sizable` child still doesn't grow, even inside a container with `stretch: true` | The container itself was never given a `preferredWidth`/`preferredHeight` to distribute | [Advanced Layout Techniques](/guides/advanced-layout-techniques) |
| A `GridBox` child is missing or in the wrong cell | Missing, duplicated, or misassigned `layoutOptions.row`/`column` | [GridBox](/api/scenery/grid-box) |
| A `Sizable` Node's `minimumWidth`/`preferredWidth` mutation throws an assertion | Sizable options passed directly to `super()` instead of a later `mutate()` call | The warning on [Sizable, WidthSizable, and HeightSizable](/api/scenery/sizable-mixins) |

::: tip Work from the leaf outward, not the container inward
When a deeply nested layout doesn't resize as expected, start by confirming the actual leaf child is `Sizable` and has `layoutOptions` set correctly, then check one container level up at a time for a missing `preferredWidth` — rather than guessing at the top-level container's options first. The break is almost always at exactly one level of the chain, and working outward from the leaf finds it faster than auditing every container at once.
:::

::: warning `resize: false` looks like a sizing bug but is an intentional freeze
If a `FlowBox`/`GridBox` was deliberately constructed with `resize: false` (to reserve a fixed footprint), it stops re-running layout on its own bounds after the first pass — a child added or resized afterward won't reflow until something calls `updateLayout()` explicitly. Check for `resize: false` before assuming a genuine `Sizable`/`layoutOptions` bug when a container that *should* be dynamic seems frozen.
:::
