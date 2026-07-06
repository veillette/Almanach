---
title: Keyboard Help Sections
description: KeyboardHelpSection and KeyboardHelpSectionRow lay out one labeled group of shortcuts; a family of ready-made sections covers sliders, spinners, time controls, combo boxes, and more.
category: api
library: scenery-phet
tags: [scenery-phet, KeyboardHelpSection, KeyboardHelpSectionRow, BasicActionsKeyboardHelpSection, MoveDraggableItemsKeyboardHelpSection, SliderControlsAndBasicActionsKeyboardHelpContent, SpinnerControlsKeyboardHelpSection, TimeControlsKeyboardHelpSection, ComboBoxKeyboardHelpSection, FaucetControlsKeyboardHelpSection, HeatCoolControlsKeyboardHelpSection, GrabReleaseKeyboardHelpSection, TwoColumnKeyboardHelpContent, WASDCueNode, keyboard, accessibility]
status: complete
related:
  - /api/scenery-phet/keyboard-help-node-basics
  - /api/scenery-phet/faucet-node
  - /api/scenery-phet/heater-cooler-node
  - /api/scenery-phet/time-control-node
  - /api/scenery-phet/reset-all-button
  - /accessibility/keyboard-input-and-hotkeys
prerequisites:
  - /api/scenery-phet/keyboard-help-node-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Keyboard Help Sections

A `KeyboardHelpSection` is one labeled group inside a Keyboard Help Dialog — a heading (e.g. "Move Draggable Items") plus a vertically aligned list of rows, each row pairing a text label with a key icon built from [`KeyboardHelpIconFactory`](/api/scenery-phet/keyboard-help-node-basics). `KeyboardHelpSectionRow` is the lower-level type that represents one such row (it aligns the label and icon with an `AlignGroup` so labels and icons form neat columns); most code never constructs a raw `KeyboardHelpSectionRow` directly, because scenery-phet ships ready-made `KeyboardHelpSection` subclasses for the interaction patterns that recur across PhET sims.

```ts
import {
  BasicActionsKeyboardHelpSection,
  SliderControlsAndBasicActionsKeyboardHelpContent
} from 'scenerystack/scenery-phet';

// A sim whose only interactions are a slider and standard tab/button navigation
// can use this ready-made two-column content wholesale in its KeyboardHelpDialog.
const helpContent = new SliderControlsAndBasicActionsKeyboardHelpContent();

// Or assemble a single section on its own, e.g. for a custom layout:
const basicActionsSection = new BasicActionsKeyboardHelpSection( {
  withCheckboxContent: true
} );
```

## KeyboardHelpSection and KeyboardHelpSectionRow

`KeyboardHelpSection`'s constructor takes a heading string and an array of `KeyboardHelpSectionRow`s; it lays out all the row labels in one `VBox` and all the row icons in a second `VBox`, side by side, so icons align into a column regardless of label length. It also doubles as a `ReadingBlock` — with Voicing enabled, activating the section reads its heading and every row's content aloud.

`KeyboardHelpSectionRow` provides the static helpers that actually build rows; you'll see these inside the ready-made sections below, and you can use them directly for a custom section:

| Static method | Produces |
| --- | --- |
| `labelWithIcon( labelString, icon, options? )` | The common case: one label, one icon, aligned in a row |
| `labelWithIconList( labelString, icons, options? )` | One label next to several icons stacked vertically, separated by "or" (e.g. "Move slower" listing both the Shift+arrows and Shift+WASD variants) |
| `fromHotkeyData( hotkeyData, options? )` | Builds both the label *and* the icon straight from a component's `HotkeyData` (e.g. `ResetAllButton.RESET_ALL_HOTKEY_DATA`), so the row can't drift out of sync with the actual shortcut |

```ts
import { KeyboardHelpSection, KeyboardHelpSectionRow, KeyboardHelpIconFactory, TextKeyNode } from 'scenerystack/scenery-phet';

const customSection = new KeyboardHelpSection( 'Custom Shortcuts', [
  KeyboardHelpSectionRow.labelWithIcon( 'Toggle play', KeyboardHelpIconFactory.spaceOrEnter() ),
  KeyboardHelpSectionRow.labelWithIcon( 'Exit', TextKeyNode.esc() )
] );
```

## The ready-made sections

Each of these is a `KeyboardHelpSection` (or, for the two "content" types, a layout wrapper around several sections) tuned for one recurring UI pattern. All accept an options object to override headings, strings, or which optional rows appear.

| Type | Covers | Notable options |
| --- | --- | --- |
| `BasicActionsKeyboardHelpSection` | Tab/Shift+Tab navigation, arrow-key group navigation, Space/Enter to press buttons, Reset All (via `ResetAllButton.RESET_ALL_HOTKEY_DATA`), Escape to exit a dialog | `withCheckboxContent`, `withKeypadContent` add optional rows |
| `MoveDraggableItemsKeyboardHelpSection` | Arrow/WASD movement and Shift+arrow/WASD for finer movement, for any draggable item | `headingStringProperty` |
| `SliderControlsAndBasicActionsKeyboardHelpContent` | A ready-to-use `TwoColumnKeyboardHelpContent` pairing a slider-controls section with `BasicActionsKeyboardHelpSection` — the whole dialog body for slider-only sims | `sliderSectionOptions`, `generalSectionOptions` |
| `SpinnerControlsKeyboardHelpSection` | A `SliderControlsKeyboardHelpSection` variant tuned for spinners (defaults `includeLargerStepsRow` to `false`, since spinners rarely support Page Up/Down) | Inherits slider-section options |
| `HeatCoolControlsKeyboardHelpSection` | A `SliderControlsKeyboardHelpSection` variant for `HeaterCoolerNode`-style heat/cool sliders — up/down arrows, an added "off" (`0` key) row, and heat/cool-specific min/max labels | Inherits slider-section options |
| `TimeControlsKeyboardHelpSection` | Play/pause toggle, built from `PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA` (labeled per-platform, since the modifier differs on macOS) | `headingString` |
| `ComboBoxKeyboardHelpSection` | The four-step combo-box interaction: Space/Enter to open, arrows to move through options, Enter to choose, Escape to close without changing — rendered as a numbered list | `thingAsLowerCaseSingular`/`Plural` fill in "option(s)" with your own noun |
| `FaucetControlsKeyboardHelpSection` | Left/right arrows to adjust flow, Shift+arrows for smaller steps, Page Up/Down for larger steps, Home/End to close/open fully, matching `FaucetNode`'s [own hotkeys](/api/scenery-phet/faucet-node) | `tapToDispenseEnabled`, `reverseAlternativeInput` (for a faucet facing left) |
| `GrabReleaseKeyboardHelpSection` | The single-row "Press Space or Enter to grab or release {thing}" explanation for the [grab/drag interaction](/api/scenery-phet/grab-drag-interaction) | Constructor takes `thingAsTitle`/`thingAsLowerCase` strings, not options |

```ts
import { GrabReleaseKeyboardHelpSection } from 'scenerystack/scenery-phet';
import { StringProperty } from 'scenerystack/axon';

const ballGrabHelp = new GrabReleaseKeyboardHelpSection(
  new StringProperty( 'Grab or Release Ball' ),
  new StringProperty( 'ball' )
);
```

## Layout: TwoColumnKeyboardHelpContent

`TwoColumnKeyboardHelpContent` is not itself a `KeyboardHelpSection` — it's a plain layout `Node` that arranges two arrays of `KeyboardHelpSection`s into left/right columns (`columnSpacing`, `sectionSpacing` control the gaps). It's what `SliderControlsAndBasicActionsKeyboardHelpContent` uses internally, and it's the type to reach for when you have several ready-made sections and need to assemble a full dialog body yourself:

```ts
import {
  TwoColumnKeyboardHelpContent,
  MoveDraggableItemsKeyboardHelpSection,
  BasicActionsKeyboardHelpSection
} from 'scenerystack/scenery-phet';

const dialogContent = new TwoColumnKeyboardHelpContent(
  [ new MoveDraggableItemsKeyboardHelpSection() ],  // left column
  [ new BasicActionsKeyboardHelpSection() ]         // right column
);
```

## WASDCueNode: an on-screen cue, not a help-dialog row

`WASDCueNode` is unrelated to the Keyboard Help Dialog's content — it's a small `Node` of arrow-plus-letter-key icons (built from the same `LetterKeyNode`/`ArrowKeyNode` building blocks) meant to sit directly next to a draggable object in the play area itself, as a one-time on-screen hint that WASD/arrow keys move it. Give it the object's `boundsProperty` and it repositions its four key icons around the object automatically:

```ts
import { WASDCueNode } from 'scenerystack/scenery-phet';

const dragCue = new WASDCueNode( ballNode.boundsProperty );
```

::: tip Most sims should reach for the ready-made "content" types first
`SliderControlsAndBasicActionsKeyboardHelpContent` covers the majority of simple sims outright. For anything more custom, compose the individual sections above (they're designed to be mixed) inside your own `TwoColumnKeyboardHelpContent` rather than building `KeyboardHelpSection`/`KeyboardHelpSectionRow` from scratch — you'll get correct translations, PDOM structure, and Voicing support for free.
:::
