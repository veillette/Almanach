---
title: InfoButton
description: The standard round grey button bearing an "i" info-circle icon, typically used to open an informational dialog.
category: api
library: scenery-phet
tags: [scenery-phet, InfoButton, button]
status: complete
related:
  - /api/scenery-phet/reset-all-button
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# InfoButton

`InfoButton` (from `scenerystack/scenery-phet`) is a `RoundPushButton` preloaded with the international "information" symbol (a solid circled "i") and a neutral grey base color. It's the standard way to expose a "more information" or "about this control" affordance that opens a dialog — [`ResetAllButton`](/api/scenery-phet/reset-all-button) is the other common round PhET-standard button, though built for a different, unrelated action.

```ts
import { InfoButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const infoButton = new InfoButton( {
  listener: () => {
    infoDialog.show();
  },
  tandem: tandem.createTandem( 'infoButton' )
} );
```

## Options

`InfoButtonOptions` adds one option on top of `RoundPushButtonOptions` (`listener`, `radius`, `touchAreaDilation`, `enabledProperty`, …) — `content` is fixed and not settable, since the icon defines this button.

| Option | Default | Effect |
| --- | --- | --- |
| `iconFill` | `'rgb( 41, 106, 163 )'` (PhET's standard info blue) | Fill color of the "i" icon |
| `baseColor` | `'rgb( 238, 238, 238 )'` (light grey) | Button background color |
| `xMargin` / `yMargin` | `10` / `10` | Margin between the icon and the button edge |
| `touchAreaDilation` | `10` | Touch-area expansion beyond the visual bounds |
| `soundPlayer` | a silent (`nullSoundPlayer`) player | No sound plays on press by default |

::: tip Info buttons default to silent
Unlike most PhET buttons, `InfoButton`'s default `soundPlayer` is a no-op. Since pressing it almost always opens a dialog, and the dialog itself plays a sound when it appears, giving the button its own sound too would produce an audible double-fire — leave the default alone unless your use case genuinely doesn't open a dialog.
:::
