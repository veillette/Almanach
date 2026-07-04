---
title: MoleculeNode
description: The base class every pre-built molecule Node (H2ONode, CO2Node, and ~40 others) extends, composing a fixed arrangement of AtomNodes centered at the origin.
category: api
library: nitroglycerin
tags: [nitroglycerin, MoleculeNode, AtomNode, chemistry]
status: verified
prerequisites:
  - /api/nitroglycerin/atom-and-element
related:
  - /api/nitroglycerin/atom-and-element
  - /patterns/model-view-separation
  - /patterns/composing-view-nodes
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# MoleculeNode

`MoleculeNode` (from `scenerystack/nitroglycerin`) is the abstract base class every pre-built molecule `Node` extends — it takes a fixed array of already-positioned `AtomNode`s, wraps them in an inner `Node` re-centered on `Vector2.ZERO` (so the molecule's origin is its geometric center regardless of how lopsided the individual atoms' layout is), and exposes that as the molecule's contents. Its constructor is `protected`, so you never instantiate `MoleculeNode` directly — you use one of its ~40 concrete subclasses (`H2ONode`, `CO2Node`, `NH3Node`, and so on), each of which knows its own molecule's atom arrangement.

```ts
import { H2ONode, CO2Node, NH3Node } from 'scenerystack/nitroglycerin';
```

## A minimal example

```ts
const water = new H2ONode();
const carbonDioxide = new CO2Node( { atomNodeOptions: { opacity: 0.9 } } );
const ammonia = new NH3Node();

someLayerNode.children = [ water, carbonDioxide, ammonia ];
```

## Constructor (subclasses only)

```ts
protected constructor( atomNodes: AtomNode[], providedOptions?: MoleculeNodeOptions )
```

Each concrete subclass builds its own `AtomNode[]` (using real bond geometry — e.g. `H2ONode` places two hydrogens below-and-to-the-sides of a larger oxygen) and calls `super( atomNodes, providedOptions )`. `HorizontalMoleculeNode` is one such intermediate subclass that lays out a linear sequence of elements left-to-right for you (used by `CO2Node`, among others), which is why some molecule Node constructors take an `Element[]` instead of pre-built `AtomNode[]`.

## `MoleculeNodeOptions`

| Option | Default | Effect |
| --- | --- | --- |
| `atomNodeOptions` | `undefined` | Forwarded to every `AtomNode` the concrete subclass constructs — the one option point common to all molecule Nodes, useful for e.g. dimming every atom uniformly |
| ...rest of `NodeOptions` | — | Everything `scenery`'s `Node` accepts, except `children` (owned internally by `MoleculeNode`) |

## Pre-built molecule subclasses (examples)

`scenerystack/nitroglycerin` exports around 40 concrete `MoleculeNode` subclasses, one per commonly-used molecule — each is a small, dedicated class rather than something you configure generically:

| Class | Molecule |
| --- | --- |
| `H2ONode` | Water |
| `CO2Node` | Carbon dioxide |
| `NH3Node` | Ammonia |
| `CH4Node` | Methane |
| `N2ONode` | Nitrous oxide |

(and ~35 more — `C2H4Node`, `SO2Node`, `PCl5Node`, `HClNode`, etc. — one per molecule nitroglycerin models.) Each accepts the same `atomNodeOptions` plus standard `NodeOptions`; check the specific subclass's `*NodeOptions` type for any molecule-specific additions.

::: tip Reach for a named subclass, not `MoleculeNode` itself
`MoleculeNode`'s constructor is `protected` specifically to prevent constructing a generic, ad hoc molecule shape — every real molecule in nitroglycerin has its own class encoding correct bond angles and atom placement. If the molecule you need isn't among the ~40 pre-built subclasses, compose your own `AtomNode`s directly (as `H2ONode` does internally) rather than trying to instantiate `MoleculeNode`.
:::
