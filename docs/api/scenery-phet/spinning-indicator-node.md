---
title: SpinningIndicatorNode
description: A ring of elements whose fill colors cycle to simulate spinning, for indicating indeterminate progress.
category: api
library: scenery-phet
tags: [scenery-phet, SpinningIndicatorNode, spinner, loading, progress]
status: complete
related:
  - /api/axon/timer
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SpinningIndicatorNode

`SpinningIndicatorNode` (from `scenerystack/scenery-phet`) shows a ring of small shapes (rectangles by default) arranged in a circle, used to indicate that an operation is in progress with no known completion percentage — a "loading spinner." The individual elements never actually move; instead, `SpinningIndicatorNode` cycles each element's *fill color* from active to inactive around the ring on every call to `step( dt )`, which reads as clockwise rotation while avoiding the cost of re-laying-out geometry every frame.

Unlike most animated scenery-phet Nodes, `SpinningIndicatorNode` does **not** hook itself into any timer — you must call `step( dt )` yourself, typically from your `ScreenView`'s own `step( dt )` method.

```ts
import { SpinningIndicatorNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const spinner = new SpinningIndicatorNode( {
  diameter: 30,
  numberOfElements: 12,
  elementFactory: SpinningIndicatorNode.circleFactory
} );

// From your ScreenView's step( dt ) method:
spinner.step( dt );
```

## Constructor

```ts
new SpinningIndicatorNode( providedOptions?: SpinningIndicatorNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `diameter` | `15` | Overall diameter of the ring |
| `numberOfElements` | `16` | Number of elements arranged around the ring |
| `elementFactory` | `SpinningIndicatorNode.rectangleFactory` | `( diameter, numberOfElements ) => Path` used to build each element; also see the built-in `SpinningIndicatorNode.circleFactory` |
| `speed` | `1` | Multiplier on rotation speed |
| `activeColor` | `'rgba(0,0,0,1)'` | Color of the "leading" element in the cycle |
| `inactiveColor` | `'rgba(0,0,0,0.15)'` | Color of the "trailing" element in the cycle |

## Methods

| Method | Effect |
| --- | --- |
| `step( dt )` | Advances the color-cycle animation by `dt` seconds; call this every frame the spinner should appear to spin |

## Static factories

| Method | Effect |
| --- | --- |
| `SpinningIndicatorNode.rectangleFactory( diameter, numberOfElements )` | Default element factory — small rectangles |
| `SpinningIndicatorNode.circleFactory( diameter, numberOfElements )` | Alternative element factory — small circles ("dots") instead of rectangles |

::: tip Nothing spins on its own — wire `step` into your simulation's step loop
Because `SpinningIndicatorNode` has no built-in timer dependency, it stays inert (frozen on its initial coloring) until something calls `step( dt )`. This is deliberate: it keeps the Node usable in contexts with no running `Sim` (static demos, tests) and lets you pause the spin along with the rest of your screen simply by not calling `step` while paused, rather than needing a separate enable/disable flag.
:::
