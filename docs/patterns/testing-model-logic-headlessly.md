---
title: Testing Model Logic Headlessly
description: Unit-testing model classes without instantiating scenery Nodes or a Display, so tests run fast and in plain Node.js.
category: patterns
tags: [testing, axon, Property, model, node.js]
status: verified
related:
  - /patterns/model-view-separation
  - /patterns/dispose-and-memory-management
prerequisites:
  - /patterns/model-view-separation
---

# Testing Model Logic Headlessly

Because [Model-View Separation](/patterns/model-view-separation) keeps every model class free of `scenery`/`sun` imports, a model can be constructed, stepped, and asserted against in plain Node.js — no `Display`, no DOM, no browser. Writing tests against the model directly (rather than driving the whole `Sim` or querying rendered Nodes) is what makes a test suite fast enough to run on every commit and precise enough to pinpoint a physics bug instead of a rendering symptom.

## What a headless model test looks like

```ts
// ProjectileModelTests.ts
import ProjectileModel from './ProjectileModel.js';

QUnit.module( 'ProjectileModel' );

QUnit.test( 'step advances position based on velocity', assert => {
  const model = new ProjectileModel();

  model.angleProperty.value = 0;   // launch horizontally
  model.speedProperty.value = 10;  // m/s
  model.launch();

  const initialX = model.positionProperty.value.x;
  model.step( 1 ); // 1 second

  assert.ok( model.positionProperty.value.x > initialX, 'projectile should move forward after stepping' );
} );

QUnit.test( 'reset restores every Property to its initial value', assert => {
  const model = new ProjectileModel();

  model.angleProperty.value = 45;
  model.speedProperty.value = 15;
  model.step( 2 );

  model.reset();

  assert.equal( model.angleProperty.value, model.angleProperty.initialValue );
  assert.equal( model.speedProperty.value, model.speedProperty.initialValue );
} );
```

Nothing here touches `scenerystack/scenery`. `ProjectileModel` is constructed the same way a real screen would construct it, `step` is called directly with an explicit `dt` instead of waiting on `requestAnimationFrame`, and assertions read `Property.value` — the same public surface the view observes.

::: tip Any test runner works — `QUnit` isn't part of the `scenerystack` package
`QUnit` is shown above because it's the convention in PhET's own repos, not because `scenerystack` bundles or requires it — it's not one of `scenerystack`'s own dependencies. A model built this way is equally testable from Jest, Vitest, `node:test`, or anything else that can call a constructor and read a `.value` — the headless-testability property comes from the model having no `scenery`/DOM imports, not from which test runner you point at it.
:::

## Why not test through the rendered view

| Testing the model directly | Testing by querying rendered Nodes/DOM |
| --- | --- |
| Runs in Node.js — no browser, no `Display`, fast enough for every commit | Needs a browser or headless-DOM environment; slower, flakier |
| A failure points at the model logic itself | A failure could be the model, the view's rendering of it, or layout — hard to tell which |
| Independent of any particular pixel/Node structure, so refactoring the view never breaks these tests | Brittle to view refactors that don't change behavior (renaming a Node, restructuring a panel) |

This isn't an argument against ever exercising the view — some things (does this Node actually appear, is this button reachable by keyboard) can only be verified with a `Display`. It's an argument for putting the *bulk* of behavioral coverage on the model, where it's cheap, and reserving view-level checks for things that are genuinely about rendering or interaction.

## Structuring a model to stay testable

- Give the model a `step( dt: number )` method that a test calls directly with a fixed `dt`, rather than relying on the sim's real animation frame timing.
- Expose enough state as `public readonly` Properties (per [Model-View Separation](/patterns/model-view-separation)) that a test can both drive the model (`model.speedProperty.value = 10`) and assert on the outcome without reaching into private fields.
- Keep randomness injectable (a seeded `Random` instance passed in, not `Math.random()` called inline) so tests can be deterministic.
- If a model class takes a `Tandem` (see [PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern)), pass `Tandem.OPT_OUT` in tests that don't care about instrumentation, so the test isn't coupled to a particular tandem tree.

::: tip A model constructor with no scenery import is a testability signal, not just a layering rule
If writing a test for a model class turns out to require importing `scenerystack/scenery` or constructing a `Display`, that's usually a sign the class has taken on view responsibility it shouldn't have — see [Model-View Separation](/patterns/model-view-separation) — rather than a sign the test needs more setup.
:::
