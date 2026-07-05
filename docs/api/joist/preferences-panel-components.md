---
title: PreferencesPanel, PreferencesPanelSection, PreferencesControl, PreferencesTabs, and PreferencesTab
description: The building blocks the Preferences Dialog is assembled from, and the two of them (PreferencesPanelSection, PreferencesControl) sim authors use to build custom Preferences content.
category: api
library: joist
tags: [joist, PreferencesPanel, PreferencesPanelSection, PreferencesControl, PreferencesTabs, PreferencesTab, PreferencesModel, PreferencesDialog]
status: complete
related:
  - /api/joist/preferences-model-and-dialog
  - /api/joist/look-and-feel
prerequisites:
  - /api/joist/preferences-model-and-dialog
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PreferencesPanel, PreferencesPanelSection, PreferencesControl, PreferencesTabs, and PreferencesTab

[`PreferencesModel` and `PreferencesDialog`](/api/joist/preferences-model-and-dialog) documents the dialog as a whole; this page covers the five smaller pieces (all from `scenerystack/joist`) it's assembled from. Two of them — **`PreferencesPanelSection`** and **`PreferencesControl`** — are the ones sim authors actually construct, via a `PreferencesModel` option's `customPreferences: [{ createContent: ( parentTandem ) => Node }]`. The other three — **`PreferencesPanel`**, **`PreferencesTabs`**, and **`PreferencesTab`** — are the scaffolding `PreferencesDialog` uses internally to build each tab and its panel; documented here for completeness, but you won't normally construct them yourself.

```ts
import { PreferencesModel, Sim, onReadyToLaunch } from 'scenerystack/sim';
import { PreferencesPanelSection, PreferencesControl } from 'scenerystack/joist';
import { Text } from 'scenerystack/scenery';
import { ToggleSwitch } from 'scenerystack/sun';
import { BooleanProperty, Property } from 'scenerystack/axon';

const showGridProperty = new BooleanProperty( false );

const preferencesModel = new PreferencesModel( {
  simulationOptions: {
    customPreferences: [ {
      createContent: parentTandem => {
        const label = new Text( 'Show grid' );
        const toggle = new ToggleSwitch( showGridProperty, false, true, {
          tandem: parentTandem.createTandem( 'showGridSwitch' )
        } );

        // PreferencesControl handles the label/control/description layout for you.
        const control = new PreferencesControl( {
          labelNode: label,
          controlNode: toggle
        } );

        // PreferencesPanelSection adds the standard section spacing/indentation.
        return new PreferencesPanelSection( { contentNode: control } );
      }
    } ]
  }
} );

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Simulation' ), [ /* screens */ ], { preferencesModel } );
  sim.start();
} );
```

## `PreferencesControl`

A `GridBox` that lays out an optional `labelNode`, an optional `controlNode`, and an optional `descriptionNode` in the standard Preferences arrangement — label and control on one row, a full-width description below — and wires up sensible accessibility defaults between them.

| Option | Default | Effect |
| --- | --- | --- |
| `labelNode` | — | Node placed at the left of the control's row |
| `controlNode` | — | The actual UI control (a switch, radio buttons, combo box, …); right-aligned |
| `descriptionNode` | — | Node placed below the label/control row, spanning both columns |
| `labelSpacing` | `10` | Horizontal gap between `labelNode` and `controlNode` when there's no `descriptionNode` |
| `ySpacing` | `5` | Vertical gap between the label/control row and `descriptionNode` |
| `allowDescriptionStretch` | `true` | If `true`, the description cell stretches to a minimum content width (`480`) so the control aligns with other controls in the panel |
| `headingControl` | `false` | Set `true` for a control acting as a section heading — it won't stretch to fill the row like an ordinary control does |

If `controlNode` has no `accessibleName`/`accessibleHelpText` already set, `PreferencesControl` derives them from `labelNode`/`descriptionNode`'s text automatically. `PreferencesControl` also manages `disabledOpacity` on itself, so nesting it inside another disableable container doesn't compound dimming.

## `PreferencesPanelSection`

A `VBox` providing the standard vertical spacing and title/content indentation for one logical group of preferences within a tab.

| Option | Default | Effect |
| --- | --- | --- |
| `titleNode` | `null` | If provided, a heading for this section |
| `contentNode` | `null` | If provided, the section's body — indented under `titleNode` by `contentLeftMargin` |
| `contentLeftMargin` | `30` | Indentation applied to `contentNode` when a `titleNode` is also present |
| `contentNodeOptions` | `{}` | Extra `NodeOptions` applied to the wrapper around `contentNode` |

For a `customPreferences` entry with just one control and no separate heading (as in the example above), passing only `contentNode` (no `titleNode`) is the common case.

## `PreferencesPanel`

The `Node` base class each of joist's built-in tab panels (Simulation, Visual, Audio, Input, Localization) extends. Its entire job is visibility: it shows itself only when `selectedTabProperty` matches its own `PreferencesType` **and** `tabVisibleProperty` is `true`.

```ts
new PreferencesPanel(
  preferencesType: PreferencesType,
  selectedTabProperty: TReadOnlyProperty<PreferencesType>,
  tabVisibleProperty: TReadOnlyProperty<boolean>,
  providedOptions?: PreferencesPanelOptions
)
```

You would only construct one directly if building an entirely custom Preferences tab structure outside of `PreferencesModel`'s supported tabs — ordinary `customPreferences` content does not need to touch `PreferencesPanel` at all, since it's nested inside whichever built-in panel (Simulation/Visual/Audio/Input/Localization) you attached it to.

## `PreferencesTabs` and `PreferencesTab`

`PreferencesTabs` is the `HBox` of tab buttons across the top of the dialog (implemented as `role="tablist"`/`role="tab"` for accessibility, with arrow-key navigation between tabs built in); `PreferencesTab` is a single tab button within it, associated with one `PreferencesType` value.

```ts
new PreferencesTabs(
  supportedTabs: PreferencesType[],
  selectedPanelProperty: TProperty<PreferencesType>,
  providedOptions: PreferencesTabsOptions // tandem is required
)

new PreferencesTab(
  labelProperty: TReadOnlyProperty<string>,
  property: TProperty<PreferencesType>,
  value: PreferencesType,
  providedOptions: PreferencesTabOptions // tandem is required
)
```

`PreferencesTabs` builds one `PreferencesTab` per entry in `supportedTabs` that matches a known `PreferencesType` (`OVERVIEW`, `SIMULATION`, `VISUAL`, `AUDIO`, `INPUT`, `LOCALIZATION` — the `LOCALIZATION` tab additionally gets a globe icon). `PreferencesTabs.focusSelectedTab()` (surfaced on `PreferencesDialog` too, see [PreferencesModel and PreferencesDialog](/api/joist/preferences-model-and-dialog)) moves keyboard focus to whichever tab is currently selected.

::: tip For ordinary custom preferences, you only need `PreferencesPanelSection` and `PreferencesControl`
`PreferencesModel`'s `customPreferences.createContent` callback is expected to return a single `Node` — nesting your control(s) in `PreferencesControl` (for label/control/description layout) inside `PreferencesPanelSection` (for standard section spacing) is enough to match the built-in tabs' look. `PreferencesPanel`/`PreferencesTabs`/`PreferencesTab` are the dialog's own scaffolding, not something a `customPreferences` entry needs to construct.
:::
