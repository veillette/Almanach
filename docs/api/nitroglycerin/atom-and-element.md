---
title: Atom, Element, and AtomNode
description: The model layer for a single atom - immutable per-element physical constants (Element), a lightweight per-instance wrapper (Atom), and its shaded-sphere view (AtomNode).
category: api
library: nitroglycerin
tags: [nitroglycerin, Atom, Element, AtomNode, chemistry]
status: verified
prerequisites:
  - /getting-started/what-is-scenerystack
related:
  - /api/nitroglycerin/molecule-node
  - /api/nitroglycerin/chem-utils
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Atom, Element, and AtomNode

`Element`, `Atom`, and `AtomNode` (all from `scenerystack/nitroglycerin`) split the model/view concerns for a single atom in a chemistry sim. `Element` is a set of ~17 static, immutable instances holding real physical constants (covalent radius, electronegativity, atomic weight, display color) for specific elements (H, C, N, O, ...). `Atom` is a lightweight, constructible-many-times wrapper around one `Element` that adds per-instance identity (a unique `id`/`reference`) — you construct many `Atom`s referencing the same `Element.O` static. `AtomNode` is the `scenery` view: a shaded sphere sized and colored from the wrapped `Element`.

```ts
import { Atom, Element, AtomNode } from 'scenerystack/nitroglycerin';
```

## A minimal example

```ts
const oxygenAtom = new Atom( Element.O );
const oxygenNode = new AtomNode( Element.O );

// or, from a symbol string:
const hydrogenAtom = Atom.createAtomFromSymbol( 'H' );
```

## `Element`

`Element` is not meant to be constructed directly in client code — use one of its static instances or look one up by symbol.

| Member | Description |
| --- | --- |
| `Element.H`, `Element.C`, `Element.N`, `Element.O`, ... | Static instances for the ~17 elements nitroglycerin models (`Ar, B, Be, Br, C, Cl, F, H, I, N, Ne, O, P, S, Si, Sn, Xe`) |
| `Element.elements` | Array of all static instances |
| `symbol` | e.g. `'O'` |
| `covalentRadius` / `vanDerWaalsRadius` | In picometers |
| `electronegativity` | Pauling units, `null` for noble gasses |
| `atomicWeight` | Atomic mass units (u) |
| `color` | `Color \| string` used by `AtomNode` |
| `Element.getElementBySymbol( symbol )` | Static lookup; asserts if the symbol isn't one of the modeled elements |
| `isSameElement( element )` / `isHydrogen()` / `isCarbon()` / `isOxygen()` | Identity/convenience predicates |

## `Atom`

```ts
new Atom( element: Element )
```

| Member | Description |
| --- | --- |
| `element` | The wrapped `Element` |
| `symbol`, `covalentRadius`, `covalentDiameter`, `electronegativity`, `atomicWeight`, `color` | Unpacked from `element` for convenience (`covalentDiameter` is `2 * covalentRadius`, otherwise not present on `Element`) |
| `id` / `reference` | Per-instance unique identifiers (`reference` is a hex counter, `id` is `` `${symbol}_${reference}` ``) — distinguishes two `Atom`s wrapping the same `Element` |
| `Atom.createAtomFromSymbol( symbol )` | Static convenience combining `Element.getElementBySymbol` and `new Atom(...)` |
| `hasSameElement( atom )` / `isHydrogen()` / `isCarbon()` / `isOxygen()` | Delegate to the wrapped `Element` |

## `AtomNode`

```ts
new AtomNode( element: Element, providedOptions?: AtomNodeOptions )
```

`AtomNode extends ShadedSphereNode` (from `scenerystack/scenery-phet`) — it takes an `Element`, not an `Atom`, and computes a display diameter from `element.covalentRadius` (compressed nonlinearly so the largest and smallest modeled atoms don't differ as dramatically on screen as their real radii would suggest). `mainColor` defaults to `element.color`; any other `ShadedSphereNodeOptions` may be passed through and override it.

```ts
const bigOxygen = new AtomNode( Element.O );
const smallHydrogen = new AtomNode( Element.H, { mainColor: 'lightgray' } ); // override the default element color
```

::: tip `AtomNode` takes an `Element`, not an `Atom`
Since `AtomNode` only needs `covalentRadius` and `color` — both already on `Element` — it skips `Atom` entirely. Reach for `Atom` only when you need per-instance identity (e.g. tracking individual atoms in a reaction simulation); for pure rendering, construct `AtomNode` straight from the `Element` static you need.
:::
