---
title: Lazy Initialization Pattern
description: Deferring an expensive object's construction until it's actually needed, instead of paying its cost unconditionally at startup.
category: patterns
tags: [performance, architecture, lazy-initialization]
status: complete
related:
  - /cookbook/lazily-creating-an-expensive-node
  - /api/joist/screen
  - /guides/performance-and-profiling
prerequisites:
  - /patterns/model-view-separation
---

# Lazy Initialization Pattern

Some objects in a simulation are expensive enough to construct — a large procedurally-generated `Shape`, a chart pre-populated with a big dataset, a rarely-used dialog's entire Node subtree — that building every one of them unconditionally at startup measurably slows down the time before a user sees anything. Lazy initialization defers that cost until the object is *actually* needed, rather than eagerly during construction of whatever owns it.

## The general shape

The pattern is always the same regardless of what's being deferred: replace an eagerly-constructed field with a function that constructs (and caches) the value on first access, rather than a value already sitting there:

```ts
class SomeContainer {

  // Eager: pays the cost unconditionally, even if never used.
  // public readonly expensiveThing = buildExpensiveThing();

  // Lazy: cost is deferred until first access, and paid at most once.
  private _expensiveThing: ExpensiveThing | null = null;

  public getExpensiveThing(): ExpensiveThing {
    if ( this._expensiveThing === null ) {
      this._expensiveThing = buildExpensiveThing();
    }
    return this._expensiveThing;
  }
}
```

The essential property this preserves is that callers still get a single, consistent instance — `getExpensiveThing()` called twice returns the same object both times, exactly as if it had been constructed eagerly — the only thing that changed is *when* that construction happens.

## Where SceneryStack already relies on this

This isn't a novel technique layered on top of SceneryStack — it's the same shape [`Screen`](/api/joist/screen) itself is built around: a `Screen`'s `createModel`/`createView` factory functions are only invoked once `Sim` actually needs that screen, not eagerly when the `Screen` is constructed. A multi-screen sim's second and third screens don't pay their model/view construction cost until (or unless) the user navigates to them, which is exactly why a sim with many screens can still start up quickly — the *sum* of every screen's construction cost is never paid all at once.

## When to reach for it yourself

| Reach for lazy initialization | Skip it |
| --- | --- |
| The object is expensive to construct (measurable time or memory) *and* isn't guaranteed to be needed every session — a rarely-opened dialog, an alternate visualization mode, a large precomputed dataset | Construction is cheap — the overhead of the lazy-init machinery itself can exceed the cost it's supposedly saving |
| The cost shows up in a profile as part of startup, specifically (see [Performance and Profiling](/guides/performance-and-profiling)) | You're guessing an object "seems expensive" without having profiled — see the same page's warning against optimizing before measuring |
| The object's identity/singleton-ness matters (the same instance every time it's requested) | Every access legitimately needs a fresh instance — that's not memoization, it's just calling a constructor, and doesn't need the cached-field machinery at all |

For the single most common concrete case — deferring construction of an expensive `Node` until it first becomes visible — see [Lazily Creating an Expensive Node](/cookbook/lazily-creating-an-expensive-node) for the worked recipe; this page is the general principle behind that specific technique, which also applies to non-`Node` expensive objects (a precomputed dataset, a large `Shape`) the same way.

::: tip Don't lazily initialize something you'll need immediately anyway
If profiling shows an object is expensive *and* every session ends up needing it within the first few seconds regardless, deferring its construction doesn't reduce total work done — it just moves the same cost to a slightly later, potentially more visible moment (e.g. the first time a user opens the panel that needs it, instead of during an initial loading screen where the delay is expected). Lazy initialization pays off specifically when the object is *conditionally* needed — many sessions never touch it at all — not merely when it's expensive.
:::
