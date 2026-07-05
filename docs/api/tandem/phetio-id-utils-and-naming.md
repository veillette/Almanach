---
title: PhetioIDUtils and Tandem Naming Conventions
description: Static string utilities for building and inspecting phetioIDs, and the naming conventions a tree of Tandems produces.
category: api
library: tandem
tags: [tandem, phet-io, PhetioIDUtils, Tandem, phetioID]
status: complete
related:
  - /api/tandem/tandem
  - /api/tandem/phetio-object
prerequisites:
  - /api/tandem/tandem
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioIDUtils and Tandem Naming Conventions

`PhetioIDUtils` (from `scenerystack/tandem`) is a static-only utility class (its constructor asserts if called) providing string operations over `phetioID`s — the dotted addresses [`Tandem`](/api/tandem/tandem) builds as you call `createTandem()` down a tree. You reach for it when you need to manipulate a `phetioID` as a string directly — building one from parts, extracting the last segment, walking up to a parent — rather than through a live `Tandem` instance.

```ts
import { PhetioIDUtils } from 'scenerystack/tandem';
```

## Building and inspecting IDs

| Method | Example | Result |
| --- | --- | --- |
| `PhetioIDUtils.append( phetioID, ...names )` | `append( 'myScreen.myControlPanel', 'myComboBox' )` | `'myScreen.myControlPanel.myComboBox'` |
| `PhetioIDUtils.getComponentName( phetioID )` | `getComponentName( 'myScreen.myControlPanel.myComboBox' )` | `'myComboBox'` |
| `PhetioIDUtils.getParentID( phetioID )` | `getParentID( 'myScreen.myControlPanel.myComboBox' )` | `'myScreen.myControlPanel'` (or `null` at the root) |
| `PhetioIDUtils.getScreenID( phetioID )` | `getScreenID( 'sim.myScreen.model.property' )` | `'sim.myScreen'` (or `null` if no component name ends in `'Screen'`) |
| `PhetioIDUtils.isAncestor( ancestorID, descendantID )` | `isAncestor( 'sim.myScreen', 'sim.myScreen.model' )` | `true` (strictly an ancestor, not the same ID) |
| `PhetioIDUtils.getArchetypalPhetioID( phetioID )` | `getArchetypalPhetioID( 'sim.screen.group.particle_4.massProperty' )` | `'sim.screen.group.archetype.massProperty'` — replaces dynamic-element terms (containing `_`) with the literal `'archetype'` |
| `PhetioIDUtils.getGroupElementIndex( componentName )` | `getGroupElementIndex( 'particle_4' )` | `4` |

`PhetioIDUtils` never constructs or mutates a `Tandem` — it operates purely on the dotted string, which is why it's useful in PhET-iO client/wrapper code that only has the string address, not a live `Tandem` tree.

## Well-known static separators and component names

| Static member | Value | Used for |
| --- | --- | --- |
| `SEPARATOR` | `'.'` | Joins components into a `phetioID` |
| `GROUP_SEPARATOR` | `'_'` | Separates a dynamic element's group name from its index, e.g. `particle_4` |
| `INTER_TERM_SEPARATOR` | `'-'` | Joins terms within a single component when one `phetioID` references another, e.g. `sim-global-otherID` |
| `ARCHETYPE` | `'archetype'` | The placeholder component name `getArchetypalPhetioID` substitutes for dynamic-element terms |
| `CAPSULE_SUFFIX` | `'Capsule'` | Marks a component name as a `PhetioCapsule` container, so its next term maps to `ARCHETYPE` too |
| `GENERAL_COMPONENT_NAME` / `GLOBAL_COMPONENT_NAME` | `'general'` / `'global'` | The component names under which `Tandem.GENERAL_MODEL`/`GENERAL_VIEW`/etc. and `Tandem.GLOBAL_MODEL`/`GLOBAL_VIEW` nest |
| `MODEL_COMPONENT_NAME` / `VIEW_COMPONENT_NAME` / `CONTROLLER_COMPONENT_NAME` | `'model'` / `'view'` / `'controller'` | Conventional top-level component names within a screen's tandem subtree |

## Naming conventions built from a `Tandem` tree

A `phetioID` is just the dotted path of every `createTandem()` call made from `Tandem.ROOT` down to a specific element — `Tandem` builds these for you, but the shape follows fixed conventions `PhetioIDUtils` understands:

- **Screens** nest under a component name ending in `'Screen'` (`myScreen`, `secondScreen`) — this is what lets `getScreenID` find the screen boundary in an arbitrarily deep `phetioID`.
- **Model vs. view** code conventionally nests one level further under `model`/`view` (`MODEL_COMPONENT_NAME`/`VIEW_COMPONENT_NAME`), e.g. `sim.myScreen.model.temperatureProperty`.
- **Dynamic elements** (created at runtime by a `PhetioGroup`, indexed rather than named up front) get an underscore-joined index in their component name, e.g. `sim.myScreen.model.particles.particle_0` — `getGroupElementIndex` and `getArchetypalPhetioID` both key off that `_`.
- **Capsule contents** (a `PhetioCapsule`'s single dynamic element) follow the element name with the literal `'archetype'` when referring to the un-instantiated template instance, which is what `CAPSULE_SUFFIX` handling in `getArchetypalPhetioID` accounts for.

::: tip You almost never call `PhetioIDUtils` directly in sim code
Sim-author code builds `phetioID`s implicitly, by calling `tandem.createTandem( 'childName' )` — see [Tandem](/api/tandem/tandem) — not by concatenating strings with `PhetioIDUtils.append`. `PhetioIDUtils` matters most when you're writing PhET-iO wrapper/client code (Studio, the state engine, migration scripts) that only has a `phetioID` string to work with and needs to reason about its structure.
:::
