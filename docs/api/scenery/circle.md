---
title: Circle
description: A Path subclass for drawing circles by radius.
category: api
library: scenery
tags: [scenery, Circle, Path]
status: complete
related:
  - /api/scenery/path
  - /api/scenery/rectangle
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Circle

`Circle` (from `scenerystack/scenery`) is a [`Path`](/api/scenery/path) subclass that builds its own circular `Shape` from a single `radius` parameter, so you don't need to construct a kite `Shape` by hand for the common case of a plain circle.

```ts
import { Circle } from 'scenerystack/scenery';

// new Circle( radius, options ) ...
const ball = new Circle( 20, {
  fill: 'crimson',
  stroke: 'black',
  lineWidth: 2
} );

// ...or new Circle( { radius, ...options } )
const marker = new Circle( { radius: 5, fill: 'black' } );

ball.radius = 25; // radius is also a settable property
```

## Options

| Option | Effect |
| --- | --- |
| `radius` | The non-negative radius of the circle, in local coordinates |

`Circle` accepts every [`Path` option](/api/scenery/path) (`fill`, `stroke`, `lineWidth`, `boundsMethod`, …) except `shape`/`shapeProperty`, which `Circle` computes itself, plus the full set of [`Node` options](/api/scenery/node).

::: tip Constructor overloads
`Circle` supports both `new Circle( radius, options )` and `new Circle( { radius, ...options } )` — pick whichever reads more clearly at the call site; they're equivalent.
:::
