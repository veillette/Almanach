---
title: JoistButton
description: The base class behind chrome buttons like HomeButton - custom black/white highlighting instead of the standard sun button look.
category: api
library: joist
tags: [joist, JoistButton, Sim, NavigationBar, button]
status: complete
related:
  - /api/joist/navigation-bar
  - /api/joist/home-screen
  - /api/tandem/tandem
prerequisites:
  - /api/joist/sim
  - /api/joist/navigation-bar
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# JoistButton

`JoistButton` (from `scenerystack/joist`) is the base class behind the chrome buttons that live directly in the [`NavigationBar`](/api/joist/navigation-bar) — `HomeButton`, the PhET-menu button, and similar — none of which use the ordinary `sun` button visuals. Instead of a fixed background rectangle, `JoistButton` draws two overlapping highlight shapes (one for a light background, one for a dark one) and shows whichever one is legible against the navigation bar's current fill, switching automatically as `sim.lookAndFeel`'s color changes (e.g. between the black home-screen background and a lighter in-sim navigation bar). You extend it directly only if you're building a custom navigation-bar-style button; ordinary in-sim UI should use `sun`'s regular button classes instead.

```ts
import { JoistButton } from 'scenerystack/joist';
import type { TReadOnlyProperty } from 'scenerystack/axon';
import type { Color, Node } from 'scenerystack/scenery';
```

## A minimal example

```ts
class MyChromeButton extends JoistButton {
  public constructor( content: Node, navigationBarFillProperty: TReadOnlyProperty<Color>, tandem: Tandem ) {
    super( content, navigationBarFillProperty, {
      tandem: tandem,
      listener: () => console.log( 'pressed' )
    } );
  }
}
```

## Constructor

```ts
new JoistButton(
  content: Node,
  navigationBarFillProperty: TReadOnlyProperty<Color>,
  providedOptions: JoistButtonOptions // tandem is required
)
```

`navigationBarFillProperty` is what drives the light/dark highlight swap — pass `sim.lookAndFeel.navigationBarFillProperty` (a `TReadOnlyProperty<Color>`) when building a real navigation-bar button.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `listener` | `null` | Callback invoked when the button fires |
| `highlightExtensionWidth` / `highlightExtensionHeight` | `0` | Grows the highlight shape beyond `content`'s bounds |
| `highlightCenterOffsetX` / `highlightCenterOffsetY` | `0` | Shifts the highlight's center relative to `content`'s center |
| `pointerAreaDilationX` / `pointerAreaDilationY` | `0` | Expands mouse/touch areas beyond `content`'s bounds, to close gaps between adjacent chrome buttons and their labels |
| `focusHighlightDilationX` / `focusHighlightDilationY` | `0` | Expands the keyboard focus highlight independently of the pointer areas |
| `enabledPropertyOptions` | `{ phetioFeatured: false }` | `JoistButton`s intentionally default to a non-featured `enabledProperty`, unlike most `sun` buttons |

## Protected members (for subclasses)

| Member | Description |
| --- | --- |
| `buttonModel` | The underlying `PushButtonModel` driving press/release behavior |
| `interactionStateProperty` | A `PushButtonInteractionStateProperty` tracking over/pressed/idle state, used to decide which highlight is visible |

## Method

| Method | Effect |
| --- | --- |
| `isPDOMClicking()` | Whether the button is currently firing due to keyboard/screen-reader (PDOM) activation rather than pointer input |

::: tip The two highlight `Node`s are both always in the scene graph
`JoistButton` builds a `brightenHighlight` (white, for dark backgrounds) and a `darkenHighlight` (black, for light backgrounds) as siblings of `content` in every instance, and toggles their `visible` flags based on `navigationBarFillProperty` and interaction state rather than swapping children in and out. If you're customizing appearance by inspecting a `JoistButton`'s children, expect exactly three: `content`, `brightenHighlight`, `darkenHighlight`, in that order.
:::
