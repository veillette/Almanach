---
title: Group Sort Interaction
description: The accessible keyboard pattern for selecting an item within a group and then sorting it by changing its value — GroupSelectModel/GroupSelectView for selection alone, GroupSortInteractionView adding sorting.
category: api
library: scenery-phet
tags: [scenery-phet, GroupSelectModel, GroupSelectView, GroupSortInteractionView, SortCueArrowNode, keyboard, accessibility]
status: complete
related:
  - /api/scenery-phet/grab-drag-interaction
  - /api/scenery-phet/movement-and-border-alerters
  - /accessibility/pdom
  - /accessibility/focus-highlights
prerequisites:
  - /accessibility/pdom
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Group Sort Interaction

Some sims have a *group* of interchangeable model items — bar-chart bars, number-line points, histogram entries — where keyboard users need to (1) move focus between items in the group, and (2) change an item's value once it's selected, all without those two things fighting over the same arrow keys. The "group sort interaction" is scenery-phet's standard pattern for this, split into three collaborating types under `scenerystack/scenery-phet`. **Read them in this order**, per the source's own documentation: `GroupSelectModel` first (it explains the interaction conceptually), then `GroupSelectView` (selection only), then `GroupSortInteractionView` (adds sorting on top).

The interaction has two states, deliberately named differently from focus to avoid overloading the term:

- **Selecting** — the group has focus; arrow keys move a "selection" cursor between items (visualized with a solid focus highlight around the selected item). This state doesn't change any values.
- **Sorting** — Space/Enter "grabs" the selected item (dashed focus highlight); arrow keys/WASD/Page Up/Page Down/Home/End now change *its* value; Space/Enter/Escape releases back to selecting.

```ts
import { GroupSelectModel, GroupSortInteractionView } from 'scenerystack/scenery-phet';
import { Range } from 'scenerystack/dot';

// One model per screen (not per scene) — see GroupSelectModel's own doc comment.
const groupSelectModel = new GroupSelectModel( {
  getGroupItemValue: ( item: BarModel ) => item.valueProperty.value,
  tandem: tandem.createTandem( 'groupSelectModel' )
} );

// One view per scene.
const groupSortInteractionView = new GroupSortInteractionView( groupSelectModel, groupNode, {
  getGroupItemToSelect: () => bars[ 0 ] ?? null,
  getNodeFromModelItem: ( item: BarModel ) => barNodeMap.get( item ) ?? null,
  sortingRangeProperty: new Property( new Range( 0, 10 ) ),
  sortGroupItem: ( item: BarModel, newValue: number ) => { item.valueProperty.value = newValue; }
} );
```

## GroupSelectModel\<ItemModel\>

Holds the interaction's state, independent of any view: which item is selected (`selectedGroupItemProperty`), whether it's currently grabbed for sorting (`isGroupItemKeyboardGrabbedProperty`), and a set of "has this ever happened" booleans (`hasKeyboardGrabbedGroupItemProperty`, `hasKeyboardSortedGroupItemProperty`, …) used to decide when hint cues should stop showing. It's generic over your item type — `null` is reserved to mean "nothing selected," so it must never be a valid `ItemModel` value.

| Constructor option | Effect |
| --- | --- |
| `getGroupItemValue: ( item ) => number \| null` | Required. Reads the sortable value out of an item; `null` means the item isn't part of the interaction right now |
| `initialMouseSortCueVisible` | Whether the mouse/touch sort cue starts visible |
| `tandem` | Required |

| Method | Effect |
| --- | --- |
| `resetInteractionState()` | Clears selection/grabbed/focus state, without resetting cueing history — call on scene changes |
| `reset()` | Full reset, including "has this happened" cue-visibility booleans |
| `registerUpdateSortCueNode( callback )` | Registers a callback to re-run whenever any Property relevant to mouse-cue visibility changes |
| `mouseSortCueShouldBeVisible()` | A partial answer for whether to show your own mouse/touch sort cue — combine with sim-specific logic |

## GroupSelectView\<ItemModel, ItemNode\>

Adds the keyboard controller for the **selecting** half of the interaction to a `primaryFocusedNode` (typically a `Node` representing the whole group, made focusable with `tagName: 'div'`/`ariaRole: 'application'` internally). It manages the group focus highlight, wires up a `KeyboardListener` for Space/Enter/Escape (toggling `isGroupItemKeyboardGrabbedProperty`), and owns a `GrabReleaseCueNode` (the same cue used by [`GrabDragInteraction`](/api/scenery-phet/grab-drag-interaction)) shown until the user has grabbed at least once.

| Constructor option | Effect |
| --- | --- |
| `getGroupItemToSelect: () => ItemModel \| null` | Required. The default/best-guess selection when the group first receives focus and nothing is selected yet |
| `getNodeFromModelItem: ( item ) => ItemNode \| null` | Required. Maps a model item to its view `Node`, so focus highlights and pan-to-view can find it |
| `isGroupItemEnabled` | Whether a given item can be grabbed/sorted right now; defaults to the corresponding Node's `enabled` |
| `onGrab` / `onRelease` | Callbacks fired on the selecting→sorting / sorting→selecting transition |
| `grabbedRoleDescription` / `releasedRoleDescription` | ARIA role descriptions announced in each state |

## GroupSortInteractionView\<ItemModel, ItemNode\>: adding sorting

`GroupSortInteractionView` extends `GroupSelectView`, adding a second `KeyboardListener` for the actual value-changing keys once an item is grabbed: arrow keys/WASD (`sortStep`), Shift+arrow/WASD (`shiftSortStep`), Page Up/Page Down (`pageSortStep`), and Home/End (jump to range min/max). The same keys, when *not* grabbed, instead move the selection between items via `getNextSelectedGroupItem`.

| Constructor option | Effect |
| --- | --- |
| `sortingRangeProperty: TReadOnlyProperty<Range>` | Required. The legal range for the sorted value |
| `sortGroupItem: ( item, newValue ) => void` | Required. Applies a computed value to the selected item |
| `getNextSelectedGroupItem: ( delta, current ) => ItemModel` | Required. Given a signed delta, returns which item should become selected next (used while *not* grabbed) |
| `sortStep` / `shiftSortStep` / `pageSortStep` | Step sizes for plain, Shift-modified, and Page Up/Down input (defaults `1`, `2`, `range.length / 5`) |
| `numberKeyMapper` | Optional `( keysPressed ) => number \| null` letting number keys 0-9 jump the grabbed item directly to a mapped value |
| `onSort` | Callback `( item, oldValue ) => void` fired after each sort |

`GroupSortInteractionView.createSortCueNode( visibleProperty, scale? )` is a static convenience that builds a `SortCueArrowNode` wired to the given visibility Property — the usual way to get the keyboard sort hint arrow without constructing `SortCueArrowNode` by hand.

## SortCueArrowNode

A small `HBox`-based `Node` drawing a dashed double- or single-headed arrow (`TriangleNode` heads plus a row of `Rectangle` dashes) — the visual "you can sort this with the arrow keys" hint shown near a freshly grabbed item.

```ts
import { SortCueArrowNode } from 'scenerystack/scenery-phet';

const sortCue = new SortCueArrowNode( {
  numberOfDashes: 3,
  doubleHead: true
} );
```

::: tip One model per screen, one view per scene
Per the source's own guidance: use a single `GroupSelectModel` per screen (so a successful sort in one scene "teaches" the interaction for the next scene too), but construct a fresh `GroupSelectView`/`GroupSortInteractionView` per scene, since each scene has a different set of item Nodes.
:::
