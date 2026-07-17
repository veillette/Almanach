---
title: AllLevelsCompletedNode
description: A pseudo-dialog Node shown when a player has completed every level in a game, with a smiley face and a Done button.
category: api
library: vegas
tags: [vegas, AllLevelsCompletedNode, game, dialog, Panel]
status: verified
related:
  - /api/vegas/level-selection-button
  - /api/vegas/game-audio-player
  - /api/sun/panel
  - /api/scenery-phet/face-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AllLevelsCompletedNode

`AllLevelsCompletedNode` (from `scenerystack/vegas`) is a pseudo-dialog `Node` — a `Panel` wrapping a smiley `FaceNode`, a "you completed all levels" message, and a "Done" button — shown when a player finishes every level of a game. It's a plain `Node` rather than a true `Dialog`, so the caller is responsible for showing/hiding/positioning it (typically inside a semi-transparent overlay).

**Why this page exists instead of `RewardNode`**: `RewardNode` is real source in the SceneryStack repository (`vegas/js/RewardNode.ts`), but it is **not** re-exported from `vegas.ts`, the barrel file that defines what's actually importable via `scenerystack/vegas` — so `import { RewardNode } from 'scenerystack/vegas'` does not work against the published package. `AllLevelsCompletedNode` is a real, exported, and conceptually adjacent class (both are shown at a game-completion moment), so it was substituted here.

```ts
import { AllLevelsCompletedNode } from 'scenerystack/vegas';
```

<SceneryDemo demo="all-levels-completed-node" />

## A minimal example

```ts
const allLevelsCompletedNode = new AllLevelsCompletedNode( () => {
  // 'Done' was pressed - dismiss the dialog and return to the level-selection screen
  this.showLevelSelectionScreen();
}, {
  center: this.layoutBounds.center
} );

this.addChild( allLevelsCompletedNode );
```

## Constructor

```ts
new AllLevelsCompletedNode( listener: PushButtonListener, providedOptions?: AllLevelsCompletedNodeOptions )
```

`listener` is called when the "Done" button is pressed; the class itself does not remove or hide the Node afterward.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `faceDiameter` | `160` | Diameter of the smiley `FaceNode` |
| `maxTextWidth` | `300` | Constrains both the message `RichText` and the "Done" button's `Text` |

`AllLevelsCompletedNodeOptions` otherwise extends the standard `NodeOptions` (position, visibility, pickability, etc. — the constructor calls `this.mutate(options)` at the end).

::: tip It's not a modal Dialog — you own the overlay
Unlike `sun`'s `Dialog`, `AllLevelsCompletedNode` doesn't dim the background, trap focus, or remove itself on close. Wrap it yourself (e.g. behind a semi-transparent `Rectangle` covering the screen) if you need modal behavior, and remove/hide it explicitly from the `listener` callback passed to the constructor.
:::
