---
title: MenuItem
description: A single row in PhET's popup PhetMenu — a width-sizable, Voicing-enabled, optionally-checkable menu row.
category: api
library: sun
tags: [sun, MenuItem, FireListener, Voicing]
status: complete
related:
  - /api/scenery/fire-listener
  - /api/scenery/voicing
  - /api/scenery/sizable-mixins
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# MenuItem

`MenuItem` (from `scenerystack/sun`) is a single row used by PhET's built-in `PhetMenu` (the "hamburger" options menu every published sim has) — a label, a hover highlight, an optional checkmark, and a [`FireListener`](/api/scenery/fire-listener) that closes the menu and runs a callback. It's documented here because it's exported from `scenerystack/sun` and usable on its own if you're building a custom popup menu that should look and behave consistently with PhET's, not because most sim code constructs `PhetMenu` items directly.

```ts
import { MenuItem } from 'scenerystack/sun';
import { Property, StringProperty } from 'scenerystack/axon';

const closeMyMenu = () => { myMenuPopup.visible = false; };

const soundEnabledProperty = new Property<boolean>( true );
const labelStringProperty = new StringProperty( 'Enable Sound' );

const soundMenuItem = new MenuItem(
  event => closeMyMenu(),               // closeCallback
  labelStringProperty,                  // labelStringProperty
  event => {                            // callback, run after closeCallback
    soundEnabledProperty.value = !soundEnabledProperty.value;
  },
  true,                                  // present
  false,                                 // shouldBeHiddenWhenLinksAreNotAllowed
  {
    checkedProperty: soundEnabledProperty
  }
);
```

The constructor is positional and PhET-menu-specific: `closeCallback` runs first (typically hiding the menu popup), then `callback` runs the item's actual action. `present` lets a menu build a consistent, fixed set of `MenuItem`s across runtimes while hiding ones that don't apply in a given context (rather than conditionally omitting them, which would change PhET-iO's API shape). `shouldBeHiddenWhenLinksAreNotAllowed` ties the item's `visibleProperty` to `scenerystack/scenery`'s `allowLinksProperty`, for items whose action is a link that some embedding contexts must suppress.

## Options

| Option | Effect |
| --- | --- |
| `separatorBefore` | Draws a horizontal rule between this item and the previous one |
| `checkedProperty` | If provided, shows/hides a checkmark to the left of the label based on this `boolean` Property |
| `textFill` | Fill for the label `Text` (default `'black'`) |

`MenuItem` mixes in [`WidthSizable`](/api/scenery/sizable-mixins), so its highlight rectangle stretches to fill whatever `localPreferredWidth` a parent layout container assigns it — every item in a menu ends up the same width even though their labels differ.

::: tip Read as a `Voicing`-enabled `Node` for accessibility, not a bespoke widget
`MenuItem` extends `WidthSizable( Voicing( Node ) )`, using the exact same [Voicing](/api/scenery/voicing) mixin pattern as other interactive `sun`/`scenery` components — its `voicingNameResponse` is kept in sync with the label string automatically, so you don't need to set it by hand if you reuse `MenuItem` in your own popup.
:::
