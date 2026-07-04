---
title: The Options Pattern
description: The options-object convention for configuring Nodes and components.
category: patterns
tags: [options, typescript, conventions]
status: verified
related:
  - /patterns/model-view-separation
  - /patterns/dispose-and-memory-management
  - /api/scenery-phet/arrow-node
prerequisites:
  - /getting-started/what-is-scenerystack
---

# The Options Pattern

Every configurable class in SceneryStack takes one trailing `providedOptions` object rather than a long positional-parameter list, and merges it with defaults using `optionize` — a typed layer over `merge` that verifies at compile time that every optional field of your class's own options has a default, while options belonging to the superclass simply pass through untouched. Following this convention (instead of ad hoc destructuring or your own defaulting logic) is what lets a caller override exactly one option three subclasses deep without your class knowing about it.

## The core idea

```ts
import { optionize } from 'scenerystack/phet-core';
import { Path, PathOptions } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

// 1. Options this class introduces itself.
type SelfOptions = {
  headHeight?: number;
  headWidth?: number;
  doubleHead?: boolean;
};

// 2. The public options type: self options plus everything the superclass accepts.
export type ArrowNodeOptions = SelfOptions & PathOptions;

export default class ArrowNode extends Path {

  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: ArrowNodeOptions ) {

    // 3. optionize<PublicOptions, SelfOptions, ParentOptions>()( defaults, providedOptions )
    //    - every optional key of SelfOptions MUST get a default here (checked at compile time)
    //    - PathOptions defaults are supplied too, since this class chooses its own (fill/stroke)
    const options = optionize<ArrowNodeOptions, SelfOptions, PathOptions>()( {
      headHeight: 10,
      headWidth: 10,
      doubleHead: false,

      // Path (superclass) options get defaults here too, when this class wants its own
      fill: 'black',
      stroke: 'black'
    }, providedOptions );

    super( new Shape() ); // build the actual arrow shape from tailX/tailY/tipX/tipY + options...

    this.mutate( options ); // hand remaining PathOptions (fill, stroke, ...) up to Path
  }
}
```

A caller only ever supplies what differs from the defaults, at any level of the hierarchy:

```ts
const arrow = new ArrowNode( 0, 0, 100, 0, {
  headHeight: 20,   // ArrowNode's own option
  stroke: 'red'      // inherited from PathOptions, passed straight through
} );
```

## Why not plain destructuring with defaults?

| | Manual `{ headHeight = 10 } = providedOptions ?? {}` | `optionize` |
| --- | --- | --- |
| Superclass options | Must be manually re-declared and forwarded | Flow through `ParentOptions` automatically |
| Missing a default | Silent `undefined` at runtime | Compile-time error — `optionize` requires a default for every optional `SelfOptions` key |
| Deep option overrides (option-of-an-option) | Easy to accidentally clobber a nested object | `combineOptions`/`optionize` merge one level, matching how PhET's option types are designed |

::: tip Name the type `<ClassName>Options`, export it
Every configurable class exports its options type (`ArrowNodeOptions`, `ScreenOptions`, `ResetAllButtonOptions`, ...) so that a *caller* building its own options object — or a subclass narrowing the type — can reference it. Keep `SelfOptions` un-exported (it's an internal implementation detail); export only the combined public type.
:::
