---
title: Multilink
description: Reacting to several Properties at once without manually chaining links.
category: api
library: axon
tags: [axon, Multilink]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Multilink

`Multilink` (from `scenerystack/axon`) links a callback to multiple Properties at once, calling it whenever any of them change. It's the callback-only sibling of [`DerivedProperty`](/api/axon/derived-property): use it when you need a side effect (repositioning a Node, playing a sound, logging) rather than a new derived value.

```ts
import { Multilink, NumberProperty } from 'scenerystack/axon';

const xProperty = new NumberProperty( 0 );
const yProperty = new NumberProperty( 0 );

Multilink.multilink( [ xProperty, yProperty ], ( x, y ) => {
  console.log( `position: (${x}, ${y})` );
} ); // logs "position: (0, 0)" immediately

xProperty.value = 5; // logs "position: (5, 0)"
```

## Static convenience methods (preferred)

The static factories are preferred over `new Multilink(...)` directly, both because they read better and because a bare `new Multilink(...)` with no captured reference trips lint rules for side-effect-only construction:

| Method | Behavior |
| --- | --- |
| `Multilink.multilink( dependencies, callback )` | Links and calls `callback` immediately with current values |
| `Multilink.lazyMultilink( dependencies, callback )` | Links without an immediate callback |
| `Multilink.multilinkAny( dependencies, callback )` | Same as `multilink`, but for a dynamically-sized array of dependencies (callback takes no arguments) |
| `Multilink.lazyMultilinkAny( dependencies, callback )` | Lazy version of `multilinkAny` |
| `Multilink.unmultilink( multilink )` | Disposes a Multilink instance — equivalent to calling `.dispose()` on it |

```ts
const multilinkHandle = Multilink.multilink(
  [ xProperty, yProperty ],
  ( x, y ) => console.log( x, y )
);

// later
Multilink.unmultilink( multilinkHandle );
```

## Constructor

```ts
new Multilink( dependencies, callback, lazy? )
```

Up to 15 dependencies are supported via overloads (like [`DerivedProperty`](/api/axon/derived-property)), with `callback`'s parameter types inferred from the dependency array. Pass `lazy: true` as the third argument to suppress the initial callback.

## Members

| Member | Effect |
| --- | --- |
| `dispose()` | Unlinks the callback from every dependency. Calling `dispose()` twice throws an assertion error |

::: tip Multilink vs. DerivedProperty
Reach for [`DerivedProperty`](/api/axon/derived-property) when the combination of dependencies *is* a value other code should read and link to (e.g. an `areaProperty` other Nodes bind their size to). Reach for `Multilink` when you only need to *run something* when several Properties change together and there's no resulting value worth exposing as its own Property.
:::
