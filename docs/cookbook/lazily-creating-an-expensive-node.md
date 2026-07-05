---
title: Lazily Creating an Expensive Node
description: Deferring construction of a costly child Node until it's first needed, instead of building it eagerly at startup.
category: cookbook
tags: [scenery, Node, dispose, lazy-initialization]
status: complete
related:
  - /patterns/dispose-and-memory-management
  - /patterns/composing-view-nodes
  - /api/scenery/node
prerequisites:
  - /patterns/dispose-and-memory-management
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Lazily Creating an Expensive Node

**Task:** some piece of a screen is expensive to construct — a detailed graph with many plotted points, a large `Image`, a subtree with dozens of children — but is only shown conditionally (an `AccordionBox` section a user may never open, a dialog, a rarely-visited game state). Building it eagerly at startup pays that cost for every user, even ones who never see it.

The fix is to defer construction until the Node is actually needed — typically the first time some `visibleProperty` (or similar gate) becomes `true` — and keep a `null`-able reference until then, rather than constructing every child up front in the containing Node's constructor.

## The solution

```ts
import { Node, type NodeOptions } from 'scenerystack/scenery';
import { BooleanProperty } from 'scenerystack/axon';

class ExpensiveGraphNode extends Node {
  public constructor() {
    super();
    // ...expensive plots, gridlines, many child Nodes...
  }
}

class ScreenSection extends Node {

  private readonly isGraphSectionVisibleProperty = new BooleanProperty( false );

  // Undefined until first built; explicitly typed so callers can't forget the
  // not-yet-created case.
  private expensiveGraphNode: ExpensiveGraphNode | null = null;

  public constructor( providedOptions?: NodeOptions ) {
    super( providedOptions );

    this.isGraphSectionVisibleProperty.link( isVisible => {
      if ( isVisible && this.expensiveGraphNode === null ) {
        // Build it exactly once, on first actual need.
        this.expensiveGraphNode = new ExpensiveGraphNode();
        this.addChild( this.expensiveGraphNode );
      }

      // Once built, subsequent toggles just show/hide - no rebuilding.
      if ( this.expensiveGraphNode !== null ) {
        this.expensiveGraphNode.visible = isVisible;
      }
    } );
  }

  public override dispose(): void {
    this.expensiveGraphNode?.dispose();
    super.dispose();
  }
}
```

The constructor for `ScreenSection` now does none of `ExpensiveGraphNode`'s work — that cost is only paid the first time `isGraphSectionVisibleProperty` flips to `true`. Every toggle afterward is a cheap `visible` assignment, not a rebuild, since `expensiveGraphNode` is retained (not disposed and reconstructed) once created.

## When to dispose instead of hide

If the expensive Node's memory footprint matters more than the cost of rebuilding it (e.g. it holds many `Image` resources you don't want to keep around once collapsed again), dispose it on hide instead of just toggling `visible`, and let the same lazy-construction branch rebuild it on the next need:

```ts
this.isGraphSectionVisibleProperty.link( isVisible => {
  if ( isVisible ) {
    if ( this.expensiveGraphNode === null ) {
      this.expensiveGraphNode = new ExpensiveGraphNode();
      this.addChild( this.expensiveGraphNode );
    }
  }
  else if ( this.expensiveGraphNode !== null ) {
    // Trade rebuild cost for memory: fully tear down instead of just hiding.
    this.removeChild( this.expensiveGraphNode );
    this.expensiveGraphNode.dispose();
    this.expensiveGraphNode = null;
  }
} );
```

Pick the "hide, keep alive" version by default — it's simpler and avoids repeated construction cost — and only switch to "dispose on hide" once profiling shows the retained memory is actually a problem. See [Performance and Profiling](/guides/performance-and-profiling) for how to check.

## Dispose considerations

| Situation | What to do |
| --- | --- |
| The lazy Node is never disposed until the containing Node is | Dispose it conditionally in the container's own `dispose()` (`this.expensiveGraphNode?.dispose()`), since it may never have been created at all |
| The lazy Node links to Properties owned outside itself | Make sure `ExpensiveGraphNode.dispose()` unlinks those listeners — see [Dispose and Memory Management](/patterns/dispose-and-memory-management) — the same as any other dynamically-created Node |
| The gating condition can flip many times per session | Prefer "hide, keep alive" (first version above) so repeated toggles don't pay construction cost more than once |

::: tip The optional-chaining `dispose()` call is doing real work
`this.expensiveGraphNode?.dispose()` is not just defensive style here — it's the load-bearing check for "was this ever actually constructed." Skipping the `?.` and calling `.dispose()` unconditionally would throw whenever the section was collapsed for an entire session and `expensiveGraphNode` stayed `null`.
:::

::: warning Don't lazily construct Nodes PhET-iO needs to see unconditionally
If the expensive Node carries PhET-iO-instrumented state (its own `tandem`), lazily creating it means that state doesn't exist until the gating condition first fires — which can be a problem for PhET-iO state restoration (a saved state expecting the element to already exist). Reserve this pattern for purely visual, uninstrumented subtrees, and instrument the underlying model data unconditionally instead if a PhET-iO client needs to observe it before the view ever appears.
:::
