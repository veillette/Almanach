---
title: LockNode
description: A padlock icon that swaps between locked and unlocked graphics based on a boolean Property.
category: api
library: scenery-phet
tags: [scenery-phet, LockNode, icon, toggle, padlock]
status: complete
related:
  - /api/axon/boolean-property
  - /api/sun/checkbox
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LockNode

`LockNode` (from `scenerystack/scenery-phet`) shows a padlock that visually flips between a closed-lock image and an open-lock image, driven entirely by a boolean `Property`. It's built on top of `sun`'s `BooleanToggleNode`, so it inherits that class's simple "one Property, two Nodes" swapping behavior rather than defining any of its own. It's typically wrapped in a button (an `EyeToggleButton`-style toggle or a plain `RectangularPushButton`) so clicking it flips `isLockedProperty` — `LockNode` itself is just the icon, not a clickable control.

```ts
import { LockNode } from 'scenerystack/scenery-phet';
import { BooleanProperty } from 'scenerystack/axon';
```

<SceneryDemo demo="lock-node" />

## A minimal example

```ts
const isLockedProperty = new BooleanProperty( true );

const lockIcon = new LockNode( isLockedProperty );

// Elsewhere, e.g. inside a button's listener:
isLockedProperty.toggle();
```

Both the open and closed lock images are wrapped in `AlignBox`es that share a single `AlignGroup`, and the open-lock image gets an extra `HStrut` on its left — this keeps the lock body horizontally centered and the overall icon the same effective width in both states, so surrounding layout (e.g. inside an `HBox`) doesn't shift when the state toggles.

## Constructor

```ts
new LockNode( isLockedProperty: TProperty<boolean>, providedOptions?: LockNodeOptions )
```

| Parameter | Description |
| --- | --- |
| `isLockedProperty` | `true` shows the closed-lock image, `false` shows the open-lock image |
| `providedOptions` | `LockNodeOptions` — `BooleanToggleNodeOptions` (from `sun`) with no additional self options; accepts things like `alignChildren`, plus any `NodeOptions` |

::: tip `LockNode` has no self options of its own
Every option it accepts comes from `BooleanToggleNode` (which in turn extends `ToggleNode<boolean>`). If you need to change how the closed/open icons are wrapped or spaced beyond what `BooleanToggleNode`'s options expose, build your own `ToggleNode` from the raw `lockClosed_png` / `lockOpened_png` images instead.
:::
