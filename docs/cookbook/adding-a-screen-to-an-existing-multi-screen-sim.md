---
title: Adding a Screen to an Existing Multi-Screen Sim
description: The concrete steps to add a new Screen to an existing Sim's screens array, without disturbing the existing screens.
category: cookbook
tags: [joist, Screen, Sim, ScreenIcon, Tandem]
status: complete
related:
  - /patterns/multi-screen-sim-structure
  - /api/joist/screen
  - /api/joist/sim
  - /cookbook/building-a-custom-screen-icon
prerequisites:
  - /patterns/multi-screen-sim-structure
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Adding a Screen to an Existing Multi-Screen Sim

**Task:** an existing multi-screen sim, already following [Multi-Screen Sim Structure](/patterns/multi-screen-sim-structure), needs one more `Screen` added — without touching the existing screens' own model/view code.

Because each screen is fully self-contained (its own model, view, and `Tandem` subtree), adding one is almost entirely additive: build the new screen's model/view/icon the same way the existing ones are built, then add exactly one entry to the array passed to `new Sim(...)`.

## The steps

**1. Create the new screen's model and view, in their own module(s) — never importing from another screen:**

```ts
// advanced2/AdvancedTwoModel.ts
class AdvancedTwoModel {
  public reset(): void { /* reset this screen's own Properties */ }
}
```

```ts
// advanced2/AdvancedTwoScreenView.ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Text } from 'scenerystack/scenery';
import AdvancedTwoModel from './AdvancedTwoModel.js';

export default class AdvancedTwoScreenView extends ScreenView {
  public constructor( model: AdvancedTwoModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );
    const label = new Text( 'Advanced Two', { font: '24px sans-serif' } );
    label.center = this.layoutBounds.center;
    this.addChild( label );
  }
}
```

**2. Build a `ScreenIcon` for it** (see [Building a Custom ScreenIcon](/cookbook/building-a-custom-screen-icon) for more than a placeholder):

```ts
import { ScreenIcon } from 'scenerystack/sim';
import { Rectangle } from 'scenerystack/scenery';

function createAdvancedTwoScreenIcon(): ScreenIcon {
  return new ScreenIcon( new Rectangle( 0, 0, 10, 10, { fill: 'purple' } ) );
}
```

**3. Give the screen its own `Tandem` subtree, created from `Tandem.ROOT` exactly like the existing screens:**

```ts
import { Screen } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';
import AdvancedTwoModel from './advanced2/AdvancedTwoModel.js';
import AdvancedTwoScreenView from './advanced2/AdvancedTwoScreenView.js';

const advancedTwoTandem = Tandem.ROOT.createTandem( 'advancedTwoScreen' );

const advancedTwoScreen = new Screen(
  () => new AdvancedTwoModel(),
  model => new AdvancedTwoScreenView( model, { tandem: advancedTwoTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Advanced Two' ),
    homeScreenIcon: createAdvancedTwoScreenIcon(),
    backgroundColorProperty: new Property( 'white' ),
    tandem: advancedTwoTandem
  }
);
```

**4. Add exactly one entry to the array passed to `Sim`, in the position you want it to appear in the navigation bar:**

```ts
import { Sim, onReadyToLaunch } from 'scenerystack/sim';

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Multi-Screen Sim' ), [
    introScreen,
    advancedScreen,
    advancedTwoScreen // the new screen, appended (or inserted wherever it belongs)
  ] );
  sim.start();
} );
```

Nothing about `introScreen`/`advancedScreen`'s own code changes — `createModel`/`createView` are still called lazily by `Sim`, only when each screen is actually selected, so adding a third screen doesn't add startup cost to the existing two.

## What to double-check afterward

| Check | Why |
| --- | --- |
| The new screen's tandem name is unique and doesn't collide with an existing one | `Tandem.createTandem` on an already-used name reuses the existing child rather than erroring loudly in every case — a typo'd duplicate name can silently misname the new screen's tree |
| `homeScreenIcon` (and, if built separately, `navigationBarIcon`) share the same aspect ratio | `Screen` asserts this at construction — see [Building a Custom ScreenIcon](/cookbook/building-a-custom-screen-icon) |
| The new screen's `name` is genuinely translatable (a real string `Property`, not a raw string) | Every other screen's name already goes through the sim's string/locale pipeline; a plain string here is the one screen that silently won't translate |
| Nothing in the new screen's model/view imports from `advanced/` or `intro/` directly | Anything two screens both need belongs in `common/`, not screen-to-screen imports — see [Multi-Screen Sim Structure](/patterns/multi-screen-sim-structure#what-goes-where) |

::: tip Screen order in the array is navigation-bar order
`allSimScreens` (the array passed to `Sim`) is rendered left-to-right in the navigation bar in exactly the order given — inserting the new screen in the middle of the array, rather than always appending, is a completely normal way to control where it appears without reordering any other screen's code.
:::

::: warning A sim with more than one screen actually needs `name` and icons
A single-screen sim can omit `name`/`homeScreenIcon` since there's no home screen or navigation bar to show them in — but the moment a second (or third) screen exists, every screen (including ones added earlier) needs a real `name` and `homeScreenIcon`, or the home screen and navigation bar degrade to blank names and placeholder rectangle icons. If the sim you're adding to was previously single-screen, double check the *existing* screen didn't skip these.
:::
