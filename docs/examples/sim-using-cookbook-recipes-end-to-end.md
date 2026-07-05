---
title: A Sim Using Cookbook Recipes End-to-End
description: A worked mini-scenario combining four cookbook recipes - a bounded draggable, grid snapping, a sound effect on interaction, and a hover tooltip - into one coherent grid-placement tool.
category: examples
tags: [example, cookbook, DragListener, mapPosition, SoundClip, tooltip]
status: complete
related:
  - /cookbook/draggable-node-bounded-to-an-area
  - /cookbook/snapping-a-draggable-node-to-a-grid
  - /cookbook/custom-sound-effect-on-interaction
  - /cookbook/tooltip-style-hover-node
  - /patterns/drag-listeners
  - /patterns/model-view-separation
prerequisites:
  - /patterns/drag-listeners
  - /cookbook/draggable-node-bounded-to-an-area
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Sim Using Cookbook Recipes End-to-End

Each `cookbook/` recipe solves one narrow task in isolation. This page combines four of them into a single coherent mini-scenario, to show what composing already-documented recipes actually looks like in practice, rather than each staying a standalone snippet: a token that can be dragged within a fixed area ([bounded dragging](/cookbook/draggable-node-bounded-to-an-area)), snaps to a grid while being dragged ([grid snapping](/cookbook/snapping-a-draggable-node-to-a-grid)), plays a short sound each time it snaps into a *new* cell ([a custom sound effect on interaction](/cookbook/custom-sound-effect-on-interaction)), and shows its current grid coordinates in a small tooltip on hover ([a tooltip-style hover Node](/cookbook/tooltip-style-hover-node)).

## The model: a bounded, grid-snapped position

The model owns the token's position and the bounds it's confined to, following [model-view separation](/patterns/model-view-separation) — the grid-cell math lives here too, since "which cell is this" is model-level information the tooltip and the sound effect both need, not something the view should recompute independently:

```ts
import { Vector2Property, Vector2, Bounds2 } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

class GridTokenModel {
  public static readonly GRID_CELL_SIZE = 20;
  public static readonly PLAY_AREA_BOUNDS = new Bounds2( -100, -100, 100, 100 );

  public readonly positionProperty: Vector2Property;

  public constructor( tandem: Tandem ) {
    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      validBounds: GridTokenModel.PLAY_AREA_BOUNDS,
      tandem: tandem.createTandem( 'positionProperty' )
    } );
  }

  // The cell coordinates the tooltip displays - derived from positionProperty,
  // not tracked as separate state, since it's fully determined by the position.
  public getGridCell(): Vector2 {
    const cellSize = GridTokenModel.GRID_CELL_SIZE;
    return new Vector2(
      Math.round( this.positionProperty.value.x / cellSize ),
      Math.round( this.positionProperty.value.y / cellSize )
    );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}
```

## The view: all four recipes on one Node

```ts
import { DragListener, Circle, Node, Text } from 'scenerystack/scenery';
import { roundToInterval, Vector2 } from 'scenerystack/dot';
import { Property } from 'scenerystack/axon';
import { SoundClip, soundManager } from 'scenerystack/tambo';
import { Tandem } from 'scenerystack/tandem';
import gridSnap_mp3 from './gridSnap_mp3.js';

const model = new GridTokenModel( Tandem.REQUIRED );
const cellSize = GridTokenModel.GRID_CELL_SIZE;

// --- recipe 3: a custom sound effect on interaction ---
// Registered once, up front - see Adding a Custom Sound Effect on Interaction.
const gridSnapSound = new SoundClip( gridSnap_mp3, { initialOutputLevel: 0.5 } );
soundManager.addSoundGenerator( gridSnapSound, { categoryName: 'user-interface' } );

const tokenNode = new Circle( 10, {
  fill: 'mediumseagreen',
  cursor: 'pointer'
} );

// --- recipe 4: a tooltip-style hover Node ---
// Hidden until hover; repositioned and re-worded every time it's shown.
const tooltip = new Text( '', {
  fill: 'black',
  visible: false,
  pickable: false // never lets the tooltip itself intercept pointer events
} );

function updateTooltipText(): void {
  const cell = model.getGridCell();
  tooltip.string = `Cell (${cell.x}, ${cell.y})`;
}

tokenNode.addInputListener( {
  enter: () => {
    updateTooltipText();
    tooltip.visible = true;
    tooltip.leftBottom = tokenNode.rightTop.plusXY( 4, -4 );
  },
  exit: () => {
    tooltip.visible = false;
  }
} );

model.positionProperty.link( position => {
  tokenNode.translation = position;
  if ( tooltip.visible ) {
    updateTooltipText(); // keep the tooltip's cell readout in sync while hovering AND dragging
    tooltip.leftBottom = tokenNode.rightTop.plusXY( 4, -4 );
  }
} );

// --- recipes 1 and 2: bounded dragging + grid snapping, composed on one DragListener ---
let previousCell = model.getGridCell();

tokenNode.addInputListener( new DragListener( {
  positionProperty: model.positionProperty,

  // Recipe 1: confine the token to the play area.
  dragBoundsProperty: new Property( GridTokenModel.PLAY_AREA_BOUNDS ),

  // Recipe 2: snap every candidate position to the nearest grid intersection
  // BEFORE the dragBoundsProperty clamp runs - see Snapping a Draggable Node
  // to a Grid for why mapPosition and dragBoundsProperty compose in this order.
  mapPosition: ( point: Vector2 ) => new Vector2(
    roundToInterval( point.x, cellSize ),
    roundToInterval( point.y, cellSize )
  ),

  drag: () => {
    // Recipe 3, composed with recipe 2's snapping: only play the sound on the
    // transition into a NEW cell, not on every drag event within the same cell.
    const currentCell = model.getGridCell();
    if ( !currentCell.equals( previousCell ) ) {
      gridSnapSound.play();
      previousCell = currentCell;
    }
  },

  tandem: Tandem.REQUIRED
} ) );

const sceneRoot = new Node( { children: [ tokenNode, tooltip ] } );
```

## How the four recipes actually compose

| Recipe | What it contributes here | The seam with its neighbors |
| --- | --- | --- |
| [Bounded dragging](/cookbook/draggable-node-bounded-to-an-area) | `dragBoundsProperty` keeps the token inside `PLAY_AREA_BOUNDS` | Runs *after* `mapPosition` clamps to the grid, so a snapped position just outside the play area is still pulled back in — the same ordering [Snapping a Draggable Node to a Grid](/cookbook/snapping-a-draggable-node-to-a-grid#combining-with-drag-bounds) documents |
| [Grid snapping](/cookbook/snapping-a-draggable-node-to-a-grid) | `mapPosition` rounds every candidate position to a cell | Feeds `model.getGridCell()`, which both the sound-transition check and the tooltip text depend on — grid snapping isn't just cosmetic here, it's the source of truth for "which cell is this" |
| [Sound on interaction](/cookbook/custom-sound-effect-on-interaction) | `gridSnapSound.play()`, guarded by `previousCell` | Needs the *transition* into a new cell, not every `drag` event — without grid snapping upstream, there'd be no discrete "cell" to detect a transition between |
| [Hover tooltip](/cookbook/tooltip-style-hover-node) | Shows the current cell coordinates near the token | Reads `model.getGridCell()` on both `enter` and on every `positionProperty` change while already visible, so the readout stays correct whether the pointer just arrived or the token is being dragged under an already-hovering pointer |

Notice that none of the four recipes needed to be modified to combine — each already exposed exactly the hook the others needed (`mapPosition`'s output feeding both the sound guard and the tooltip; `positionProperty` as the one shared source every consumer reads).

::: tip Composing recipes is about shared state, not shared code
The interesting part of this example isn't any single recipe — each is unchanged from its own page — it's that `model.getGridCell()` gives the sound-effect guard and the tooltip text the *same* answer to "which cell is the token in right now," computed once. Composing recipes usually means finding the one piece of derived state (here, the current cell) that several independent behaviors all need, and computing it in exactly one place.
:::

## Where to go next

- [Making Any Node Draggable and Bounded to an Area](/cookbook/draggable-node-bounded-to-an-area) — recipe 1 on its own
- [Snapping a Draggable Node to a Grid](/cookbook/snapping-a-draggable-node-to-a-grid) — recipe 2 on its own
- [Adding a Custom Sound Effect on Interaction](/cookbook/custom-sound-effect-on-interaction) — recipe 3 on its own
- [A Tooltip-Style Hover Node](/cookbook/tooltip-style-hover-node) — recipe 4 on its own
- [Drag Listeners](/patterns/drag-listeners) — the broader pattern all the dragging-related recipes specialize
