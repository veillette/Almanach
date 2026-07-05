---
title: Vector2Property
description: A Property<Vector2> subclass with built-in NaN and optional-bounds validation, the standard type for model positions.
category: api
library: dot
tags: [dot, Vector2Property, Vector2, Property, position]
status: complete
prerequisites:
  - /api/axon/property
  - /api/dot/vector2
related:
  - /api/dot/vector2
  - /api/axon/property
  - /api/dot/bounds2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Vector2Property

`Vector2Property` (from `scenerystack/dot`) is a `Property<Vector2>` subclass — the standard type for a model's `positionProperty`, a drag target's location, or any other `Vector2`-valued piece of observable state. Beyond fixing `valueType: Vector2` and wiring up `Vector2.Vector2IO` for PhET-iO, it adds two validators of its own: it always rejects a vector with a `NaN` component, and it optionally confines every value to a [`Bounds2`](/api/dot/bounds2) region via the `validBounds` option.

```ts
import { Vector2Property } from 'scenerystack/dot';
import { Vector2, Bounds2 } from 'scenerystack/dot';

const positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
  validBounds: new Bounds2( -100, -100, 100, 100 )
} );

positionProperty.link( position => console.log( 'position:', position ) );
positionProperty.value = new Vector2( 50, 50 ); // fine, inside validBounds
// positionProperty.value = new Vector2( 500, 0 ); // assertion failure: outside validBounds
```

Aside from these extra validators, `Vector2Property` behaves exactly like a plain `Property<Vector2>`: `.value`, `.link()`, `.reset()`, and every other member documented on [`Property`](/api/axon/property) work the same way.

## Constructor

```ts
new Vector2Property( initialValue: Vector2, providedOptions?: Vector2PropertyOptions )
```

`Vector2PropertyOptions` is `PropertyOptions<Vector2>` (see [Property's options](/api/axon/property#options)) minus `valueType`/`phetioValueType` (which `Vector2Property` fixes for you), plus:

| Option | Effect |
| --- | --- |
| `validBounds` | If provided, every value set on the Property must satisfy `validBounds.containsPoint( value )`; enforced via an assertion-only validator, so it has no effect in production builds without assertions |

::: tip Mutating the stored `Vector2` in place bypasses validation and listeners
Because `Vector2Property`'s validators (including `validBounds`) only run inside `set()`/`value=`, calling a mutating method directly on the currently-stored vector — `positionProperty.value.add( delta )` instead of `positionProperty.value = positionProperty.value.plus( delta )` — skips both the bounds check and listener notification entirely. Always reassign `.value` with a new `Vector2` (via `plus`, `plusXY`, etc.) rather than mutating the existing one in place; see the same caveat on [Vector2](/api/dot/vector2#immutable-vs-mutable-methods).
:::
