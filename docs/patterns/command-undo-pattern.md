---
title: Command/Undo Pattern for Interactive Sims
description: Structuring a reversible user action as a command object with do/undo so a simulation can support undo, if it needs to - built on the same Property-based state that reset() and dispose() already rely on.
category: patterns
tags: [architecture, undo, Property, state, command-pattern]
status: complete
related:
  - /patterns/reset-all-pattern
  - /patterns/dispose-and-memory-management
  - /patterns/state-persistence-and-save-restore-patterns
  - /patterns/model-view-separation
prerequisites:
  - /patterns/model-view-separation
  - /patterns/state-persistence-and-save-restore-patterns
---

# Command/Undo Pattern for Interactive Sims

Most PhET-style simulations don't implement undo — [Reset All](/patterns/reset-all-pattern) covers the overwhelming majority of "let the user get back to a known state" needs, and continuous interactions (dragging, a slider) are their own undo in practice: dragging something back is usually as easy as the original drag. This page is for the minority of cases where a simulation genuinely needs step-by-step undo of discrete user actions (placing an object, applying an operation to build up a construction) — a structure to reach for *if* you need it, not something to build preemptively into every sim.

## Why undo needs more structure than reset

`reset()` is the degenerate, simplest case of restoring state: everything goes back to one fixed, known configuration (see [Reset All](/patterns/reset-all-pattern) and [State Persistence and Save/Restore Patterns](/patterns/state-persistence-and-save-restore-patterns)). Undo is harder because it needs to restore to any of several *previous* states, one step at a time, in response to discrete user actions rather than a single reset button — which means something has to record, for every undoable action, both what changed and how to reverse it.

## The command object shape

Structure each undoable user action as a small object (or plain function pair) with a `do`/`execute` step and a matching `undo` step, and push it onto a stack as the user performs actions:

```ts
import type { Property } from 'scenerystack/axon';

interface Command {
  execute(): void;
  undo(): void;
}

class SetValueCommand<T> implements Command {
  private readonly previousValue: T;

  public constructor(
    private readonly property: Property<T>,
    private readonly newValue: T
  ) {
    this.previousValue = property.value;
  }

  public execute(): void {
    this.property.value = this.newValue;
  }

  public undo(): void {
    this.property.value = this.previousValue;
  }
}
```

```ts
class CommandStack {
  private readonly undoStack: Command[] = [];
  private readonly redoStack: Command[] = [];

  public do( command: Command ): void {
    command.execute();
    this.undoStack.push( command );
    this.redoStack.length = 0; // a fresh action invalidates any previously-undone redo history
  }

  public undo(): void {
    const command = this.undoStack.pop();
    if ( command ) {
      command.undo();
      this.redoStack.push( command );
    }
  }

  public redo(): void {
    const command = this.redoStack.pop();
    if ( command ) {
      command.execute();
      this.undoStack.push( command );
    }
  }
}
```

Every user action that should be undoable goes through `commandStack.do( new SomeCommand( ... ) )` instead of mutating model Properties directly — the same discipline as never bypassing `model.reset()` from [Reset All](/patterns/reset-all-pattern), applied per-action instead of only at reset time.

## Why this depends on Property-based state

This structure only works cleanly because of the same precondition [State Persistence and Save/Restore Patterns](/patterns/state-persistence-and-save-restore-patterns) already establishes: model state lives in enumerable `Property` values, not scattered plain fields or closures. A `SetValueCommand` capturing "the previous value of this Property" and restoring it later is exactly the "capture now, restore later" operation that page describes — undo is just that same mechanism triggered per discrete action instead of by one save/restore button. A model with state hidden outside `Property`s has nothing for a command object to capture in the first place.

## What belongs in a command, and what doesn't

| Belongs in a command | Doesn't belong in a command |
| --- | --- |
| A discrete, user-initiated change to model state (placing an object, setting a value, applying an operation) | Continuous interaction in progress (an active drag) — undo the *result* of the drag as one command on release, not every intermediate frame |
| Enough captured state to fully reverse the change (`previousValue` above) | View-only state with no model consequence — nothing to undo if nothing in the model changed |
| Composite actions, as a single command wrapping several Property changes that should undo together atomically | Anything already covered by [Reset All](/patterns/reset-all-pattern) — don't build a parallel "undo everything" when a reset button already exists for that |

::: tip Most sims should not build this speculatively
Undo/redo is real architectural surface area — every discrete action needs a command object, the stack needs disposal discipline of its own (see [Dispose and Memory Management](/patterns/dispose-and-memory-management) if commands hold references to disposable Properties or Nodes), and testing has to cover do/undo/redo sequences, not just the forward path. Build this structure when a simulation's design genuinely calls for step-by-step undo — a construction/building tool is the common case — not by default. For everything else, [Reset All](/patterns/reset-all-pattern) is sufficient and dramatically simpler.
:::
