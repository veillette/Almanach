---
title: ComboBoxListBox
description: The popup list-box Panel that ComboBox creates internally to display its items.
category: api
library: sun
tags: [sun, ComboBoxListBox, ComboBox, listbox]
status: verified
related:
  - /api/sun/combo-box
  - /api/sun/panel
prerequisites:
  - /api/sun/combo-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ComboBoxListBox

::: tip Scope: internal popup machinery for ComboBox
This page documents `ComboBoxListBox`, the popup `Panel` [`ComboBox`](/api/sun/combo-box) constructs internally — not a standalone widget. Start with [ComboBox](/api/sun/combo-box) unless you need to understand which options are forwarded into the list box.
:::

There's no standalone `ListBox` export in `scenerystack/sun` — the real class is `ComboBoxListBox<T>`, and it's the popup `Panel` subclass that [`ComboBox`](/api/sun/combo-box) constructs internally to hold its items when the dropdown is open. `ComboBox`'s constructor builds one `ComboBoxListBox` from the same `items`/`property` you pass it and stores it as a private field; you never construct a `ComboBoxListBox` yourself in application code — it's documented here because understanding what backs the dropdown clarifies which options actually belong to `ComboBox` versus the list box it delegates to.

```ts
import { ComboBox } from 'scenerystack/sun';

// You interact with ComboBox directly; ComboBoxListBox is what appears
// when the user presses the button, built internally from the same items.
const unitsComboBox = new ComboBox( unitsProperty, items, listParent, {
  tandem: Tandem.REQUIRED
} );
```

Structurally, `ComboBoxListBox` extends [`Panel`](/api/sun/panel) — the list of items is a `VBox` of `ComboBoxListItemNode`s, wrapped in the same rounded-rectangle background `Panel` provides elsewhere in `sun`. It handles its own keyboard navigation (arrow keys move focus between visible items, `Home`/`End` jump to the first/last, `Escape`/`Tab` close the list and return focus to the combo box's button) and its own opened/closed/selection sound generation.

## Options that flow through from ComboBox

`ComboBox` forwards several of its own options straight into the `ComboBoxListBox` it creates — these are documented as `ComboBox` options (see [ComboBox's Options](/api/sun/combo-box#options)) but are actually consumed here:

| Option (on `ComboBox`) | Effect on the list box |
| --- | --- |
| `listFill` / `listStroke` | The list box `Panel`'s background/border |
| `highlightFill` | Fill behind the item under the pointer or keyboard focus |
| `xMargin` / `yMargin` | Margin between items and the list box edge (`ComboBoxListBox` halves these to account for highlight overlap) |
| `cornerRadius` | Rounding applied to both the list box and the highlight behind each item |

## Why it isn't instrumented for PhET-iO

`ComboBoxListBox` is deliberately not given its own PhET-iO instrumentation — its position in the scene graph isn't meaningful until it's actually popped up, so instrumenting it would expose state that's only valid while the dropdown happens to be open. `ComboBox` itself, and the `Property` it controls, are the instrumented surface; the list box is treated as transient view machinery underneath them.

::: warning Not a general-purpose "list of items" widget
Because `ComboBoxListBox` is constructed by `ComboBox` with callbacks (`hideListBoxCallback`, `focusButtonCallback`) tightly coupled to a specific combo box instance, it isn't designed to be reused as a standalone scrollable list elsewhere. If you need a freestanding selectable list independent of a dropdown button, compose your own `VBox` of pressable items rather than trying to repurpose `ComboBoxListBox`.
:::
