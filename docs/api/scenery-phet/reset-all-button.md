---
title: ResetAllButton
description: The standard circular reset control wired to a model's reset() method.
category: api
library: scenery-phet
tags: [scenery-phet, ResetAllButton]
status: complete
related:
  - /api/joist/screen-view
  - /api/tandem/tandem
  - /patterns/reset-all-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ResetAllButton

`ResetAllButton` (from `scenerystack/scenery-phet`) is the standard orange circular button that appears in the bottom-right of every PhET-style [`ScreenView`](/api/joist/screen-view) and restores that screen's model and view to their initial state. It's a specialized `ResetButton` (itself a `RoundPushButton`) that additionally handles PhET-iO state restoration, interrupting in-progress input, and voicing/alert suppression while the reset is in progress.

```ts
import { ResetAllButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
class MyScreenView extends ScreenView {
  public constructor( model: MyModel, tandem: Tandem ) {
    super( { tandem } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - 25,
      bottom: this.layoutBounds.maxY - 25,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }
}
```

## Options

`ResetAllButtonOptions` is `SelfOptions & ResetButtonOptions` (minus `xMargin`/`yMargin`, which `ResetAllButton` fixes itself). The `listener` option is inherited all the way from `RoundPushButton` — call your model's (and view's) `reset()` from it.

| Option | Default | Effect |
| --- | --- | --- |
| `listener` | — | Callback fired when the button is pressed; this is where you call `model.reset()` |
| `radius` | `SceneryPhetConstants.DEFAULT_BUTTON_RADIUS` | Button radius |
| `phetioRestoreScreenStateOnReset` | `true` | In a PhET-iO build, also restores the screen to its last-saved PhET-iO state |
| `interruptScreenViewInput` | `true` | Interrupts any in-progress input (drags, etc.) on ancestor `ScreenView`s before resetting |
| `baseColor` | `PhetColorScheme.RESET_ALL_BUTTON_BASE_COLOR` | The standard PhET orange |
| `touchAreaDilation` | `5.2` | Tuned touch-area expansion — avoid overriding lightly |

## Built-in behavior

- Fires an `alt+R` global keyboard hotkey (`ResetAllButton.RESET_ALL_HOTKEY_DATA`) equivalent to pressing the button.
- Mutes voicing/description alerts while the reset is firing, then announces a single "everything was reset" alert afterward instead of a flood of per-Property alerts.

::: tip Requires a real tandem
Like most PhET-iO-instrumented components, `tandem` defaults to `Tandem.REQUIRED` with `tandemNameSuffix: 'ResetAllButton'`. Supply a real child tandem (e.g. `screenTandem.createTandem( 'resetAllButton' )`) — see [Tandem](/api/tandem/tandem) — rather than leaving the sentinel default in place.
:::
