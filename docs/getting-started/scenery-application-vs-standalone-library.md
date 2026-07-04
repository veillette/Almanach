---
title: Scenery Application vs. Standalone Library
description: Choosing between a full joist-based Sim application and using scenery as a standalone rendering library.
category: getting-started
tags: [joist, scenery, standalone, architecture]
status: complete
related:
  - /getting-started/your-first-simulation
  - /guides/scenery-basics
  - /api/scenery/display
  - /api/scenery/node
  - /api/joist/sim
prerequisites:
  - /getting-started/installation-and-setup
sourceRefs:
  - https://scenerystack.org/learn/scenery-application/
  - https://scenerystack.org/learn/standalone-library/
---

# Scenery Application vs. Standalone Library

SceneryStack can be used two very different ways, and picking the right one up front saves you from unpicking a `Sim` later. The rule of thumb: **if you need multiple screens, a navigation bar, a home screen, PhET-iO instrumentation, or the Preferences dialog, use a `Sim` application. If you just need an interactive scene graph inside a page you already control, use `scenery` standalone.**

## Full application: `Sim` + `Screen` + `ScreenView`

This is the shape of every PhET simulation: a `Sim` owns one or more `Screen`s, each with a `ScreenView`, and `joist`/`sim` supplies the navigation bar, home screen, keyboard help, and Preferences dialog for free. See [Your First Simulation](/getting-started/your-first-simulation) for the full wiring — you don't manage a `Display` yourself, `Sim` does it internally via `SimDisplay`.

Reach for this when your project is a self-contained, full-window interactive experience — especially if you want the accessibility, internationalization, and PhET-iO scaffolding that come with `joist` "for free."

## Standalone: `scenery` without `joist`

If you only need a scene graph embedded in a larger page (a widget, a figure, an existing web app), skip `Sim`/`Screen` entirely and drive a `Display` yourself:

```html
<div id="app" style="width: 600px; height: 400px;"></div>
```

```ts
import { Display, Node, Rectangle, Text } from 'scenerystack/scenery';

const container = document.getElementById( 'app' )!;

const rootNode = new Node();
const display = new Display( rootNode, {
  width: container.clientWidth,
  height: container.clientHeight
} );
container.appendChild( display.domElement );

// Example content
const rotatingRectangle = new Rectangle( -150, -20, 300, 40, { fill: '#ccc' } );
const contentText = new Text( 'Content goes here', { font: '24px sans-serif' } );
rootNode.children = [ rotatingRectangle, contentText ];

contentText.center = display.bounds.center;
rotatingRectangle.translation = display.bounds.center;

display.initializeEvents(); // enable pointer/touch input
display.updateOnRequestAnimationFrame( dt => {
  rotatingRectangle.rotation += 2 * dt; // radians per second
} );
```

Key differences from a `Sim`:

| | Full application (`Sim`) | Standalone (`scenery` only) |
| --- | --- | --- |
| Owns the `Display` | Yes, internally (`SimDisplay`) | You create and size it |
| Multi-screen / navigation bar / home screen | Built in | Not applicable — build your own UI |
| Preferences dialog, PhET-iO | Built in | Opt in manually if needed |
| Sizing | Fills the browser window | You size the container and `Display` |
| Render/animation loop | Managed by `Sim` | You call `display.updateOnRequestAnimationFrame(...)` |
| Input events | Enabled automatically | You call `display.initializeEvents()` |

::: tip Both ways to get the npm package are the same
`npm create scenerystack@latest` scaffolds either shape — it asks what kind of project you want. For an existing project, `npm install scenerystack` and importing `scenerystack/scenery` directly works identically whether you build a `Sim` or go standalone; the two paths diverge in application code, not installation.
:::

## Where to go next

- [Scenery Basics](/guides/scenery-basics) — the Node tree, coordinate frames, and Display fundamentals used by both approaches
- [Your First Simulation](/getting-started/your-first-simulation) — the full-application path in detail
- [Scenery Layout](/guides/scenery-layout) — laying out content inside either a `ScreenView` or a standalone root `Node`
