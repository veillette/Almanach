---
title: What is SceneryStack?
description: Overview of the SceneryStack framework, its constituent libraries, and how to install and import it.
category: getting-started
tags: [overview, installation, scenery, axon, dot, sun, joist]
status: complete
related:
  - /patterns/model-view-separation
  - /api/phetcommon/model-view-transform
---

# What is SceneryStack?

SceneryStack is the open-source TypeScript framework behind [PhET Interactive Simulations](https://phet.colorado.edu). It provides everything needed to build accessible, multi-modal, interactive HTML5 applications: a scene graph renderer, a reactive state system, math utilities, UI components, and an application shell.

It is published as a single npm package, [`scenerystack`](https://www.npmjs.com/package/scenerystack), with each library exposed as a subpath export.

## The libraries

| Library | Import path | Purpose |
| --- | --- | --- |
| **axon** | `scenerystack/axon` | Reactive state: `Property`, `DerivedProperty`, `Emitter`, `Multilink` |
| **dot** | `scenerystack/dot` | Math: `Vector2`, `Bounds2`, `Matrix3`, `Range`, `Utils` |
| **kite** | `scenerystack/kite` | Geometric shapes and boolean operations: `Shape`, `LineStyles` |
| **scenery** | `scenerystack/scenery` | Scene graph: `Node`, `Path`, `Text`, input listeners, accessibility (PDOM) |
| **sun** | `scenerystack/sun` | UI components: buttons, sliders, checkboxes, combo boxes |
| **scenery-phet** | `scenerystack/scenery-phet` | Simulation-specific reusable components: arrows, thermometers, `PhetFont` |
| **twixt** | `scenerystack/twixt` | Animation and easing |
| **joist** | `scenerystack/joist` | Application shell: `Sim`, `Screen`, `ScreenView`, navigation bar |
| **tandem** | `scenerystack/tandem` | PhET-iO instrumentation and serialization |
| **phetcommon** | `scenerystack/phetcommon` | Shared utilities, notably `ModelViewTransform2` |

## Installation

```bash
npm install scenerystack
```

## A minimal example

```ts
import { Property } from 'scenerystack/axon';
import { Circle, Node } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';

// Model: reactive state, no view knowledge
const positionProperty = new Property( new Vector2( 0, 0 ) );

// View: a scenery Node that observes the model
const ball = new Circle( 20, { fill: 'crimson' } );
positionProperty.link( position => {
  ball.translation = position;
} );
```

This model/view split is the foundational pattern of every SceneryStack application — see [Model-View Separation](/patterns/model-view-separation).

## Where to go next

- [Model-View Separation](/patterns/model-view-separation) — the architecture every page in this wiki assumes
- [ModelViewTransform2](/api/phetcommon/model-view-transform) — mapping between model and view coordinates
- [Drag Listeners](/patterns/drag-listeners) — making nodes interactive
- [The Parallel DOM (PDOM)](/accessibility/pdom) — building accessible simulations
