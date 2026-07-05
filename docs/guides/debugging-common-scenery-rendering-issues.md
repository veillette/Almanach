---
title: Debugging Common Scenery Rendering Issues
description: A walkthrough of the most common visual bugs in a scenery scene graph - Nodes that won't show, layout that won't update, and z-order surprises - and the debug tools that narrow each one down.
category: guides
tags: [scenery, debugging, rendering, layout, troubleshooting]
status: complete
related:
  - /api/scenery/display
  - /guides/scenery-basics
  - /guides/scenery-layout
  - /guides/performance-and-profiling
  - /api/scenery/node
  - /api/scenery/hit-testing-and-picking
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Debugging Common Scenery Rendering Issues

Most "why isn't this showing up" or "why is this in the wrong place" bugs in a scenery scene graph fall into a small number of recurring shapes. This page walks through the three most common ones and the specific thing to check for each, before reaching for a debugger or filing a bug against scenery itself — the overwhelming majority of these turn out to be one property on one Node.

## "My Node isn't visible"

Work through these in order — each is more specific than the last, and any one of them alone is enough to make otherwise-correct content invisible:

| Check | Why it hides content |
| --- | --- |
| `node.visible` / `node.visibleProperty.value` | `false` removes the Node from painting (and, by default, from input) while leaving it in the tree — this is the most common cause, especially when visibility is driven by a `DerivedProperty` that isn't computing what you expect |
| `node.opacity` | `0` paints nothing even though the Node is technically `visible`; easy to leave at `0` after a fade-out animation that never reset it |
| `node.bounds` / `node.localBounds` | A Node with empty or `NaN` bounds (e.g. a `Path` built from an empty `Shape`, or geometry computed from a not-yet-loaded value) often silently draws nothing rather than throwing — check `bounds` in the console for `NaN` or a zero-size rectangle |
| Ancestor visibility | `visible`/`opacity` on this Node don't matter if an **ancestor** in the tree is invisible or fully transparent — walk up the parent chain, not just the Node itself, when a whole region is missing |
| Being added at all | A Node constructed but never `addChild`-ed anywhere in the displayed tree is, correctly, never painted — confirm the Node is actually reachable from the `Display`'s root, not just that it exists |
| `pickable` (a distinct but related symptom) | `pickable = false` doesn't hide anything visually, but if the *symptom* you're chasing is actually "clicks pass through" rather than "nothing draws," this — not `visible` — is the property to check; see [Hit-Testing and Picking](/api/scenery/hit-testing-and-picking) |

## "My layout isn't updating"

Layout bugs are usually a mismatch between what you changed and what the layout container actually watches:

- **Check `preferredWidth`/`preferredHeight` are actually being set on the container that should resize.** Scenery's [`Sizable`](/guides/scenery-layout) trait-based Nodes (`FlowBox`, `GridBox`, and anything opting into `WidthSizable`/`HeightSizable`) resize their content in response to their own `preferredWidth`/`preferredHeight` being set by *something* — usually a parent layout container, or the `ScreenView`'s `visibleBoundsProperty` for top-level content. If nothing ever sets a preferred dimension on a Sizable Node, it stays at its content's natural size no matter how much surrounding space is available.
- **Check you're not fighting the container by setting `x`/`y`/`translation` directly.** As [Scenery Layout](/guides/scenery-layout#margins-shared-across-containers) points out, once a Node is a child of a `FlowBox`/`GridBox`, the container sets its position every layout pass — any `translation` you set afterward is silently overwritten on the next pass, which reads exactly like "layout isn't updating" when the actual cause is "layout keeps winning."
- **Check `layoutOptions` are on the child, not the container**, for per-child overrides (`grow`, per-child margins). A `layoutOptions` object set on the wrong Node — the container instead of the child, or vice versa — is silently ignored rather than erroring.
- **Confirm the thing that changed size is actually observed.** If a child's own content changed (a `Text` Node's string got longer after a translated-string update), its `bounds` change automatically and its parent `FlowBox`/`GridBox` re-lays-out on the next frame — but a manually-managed layout (Nodes positioned by hand, not inside a layout container) has no such mechanism and needs its position recomputed explicitly wherever the content change is handled.

## "Things are drawn in the wrong stacking order"

Scenery has no z-index — stacking order is purely the order of entries in each Node's `children` array, drawn first-to-last (see [Scenery Basics](/guides/scenery-basics#the-node-tree)). A Node "behind" something it should be in front of (or vice versa) is a `children` ordering bug, not a separate property to set:

- `node.addChild( child )` always appends to the *end* — the topmost stacking position — regardless of the child's position in space. If a new Node needs to render underneath existing siblings, use `insertChild( 0, child )` (or the appropriate index) instead of `addChild`.
- Reordering existing children (moving one to the front without removing/re-adding it) is `node.moveChildToFront( child )` / `moveChildToBack( child )`, not a style property.
- Remember this is a **per-parent** ordering: two Nodes with no common parent don't have a meaningful relative stacking order to reason about — if two subtrees visually overlap and need a deterministic order, they need a common ancestor whose `children` array you control.

## Tools beyond eyeballing the tree

Once the checks above don't turn up the cause, [Performance and Profiling](/guides/performance-and-profiling#finding-the-bottleneck-built-in-profiling-query-parameters) documents several built-in debug query parameters that also help narrow down rendering (not just performance) problems — `?showPointerAreas` and `?showHitAreas` for input-region mismatches, `?showCanvasNodeBounds` for a `CanvasNode` drawing outside its declared bounds, and `?dev` for a broader bundle of developer-facing overlays. For content painted through the non-standard renderer escape hatches, see [`WebGLNode`, `CanvasNode`, and `DOM`](/api/scenery/rendering-backends) — bugs in a `CanvasNode`'s `paintCanvas` or a `WebGLNode`'s painter are ordinary drawing-code bugs in your own callback, not scenery issues, and are usually easiest to isolate by temporarily swapping the custom Node for a plain `Rectangle` at the same bounds to confirm the surrounding layout/visibility is correct first.

::: tip Bisect with a plain Rectangle
When it's unclear whether a missing/misplaced Node is a visibility, layout, or stacking-order bug, temporarily replace the suspect Node's content with a brightly-colored plain `Rectangle` sized to its expected `bounds`. If the rectangle shows up correctly, the problem is specific to the original Node's own content/geometry; if the rectangle is also missing or misplaced, the problem is upstream — visibility, layout, or an ancestor — and you've eliminated an entire category without reading more code.
:::

## Where to go next

- [Scenery Basics](/guides/scenery-basics) — the Node tree, coordinate frames, and children-order stacking model this page assumes
- [Scenery Layout](/guides/scenery-layout) — the layout containers and options referenced above
- [Performance and Profiling](/guides/performance-and-profiling) — the built-in debug query parameters, applied to slowness rather than incorrectness
- [Display](/api/scenery/display) — the object that actually paints the tree these bugs live in
- [Hit-Testing and Picking](/api/scenery/hit-testing-and-picking) — the full `pickable`/`mouseArea`/`touchArea` model referenced above
