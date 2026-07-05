---
title: Singleton and Namespace Conventions
description: When a library exposes a ready-made shared-instance singleton (like dotRandom or animationFrameTimer) versus when you construct and own your own instance.
category: patterns
tags: [singleton, conventions, dotRandom, animationFrameTimer, Namespace, architecture]
status: draft
related:
  - /api/dot/random
  - /api/axon/timer
  - /guides/working-with-sound
  - /patterns/dispose-and-memory-management
prerequisites:
  - /patterns/model-view-separation
---

# Singleton and Namespace Conventions

SceneryStack code reaches for two distinct shapes when a library needs to expose reusable, shared state: a **ready-made singleton instance** the library constructs and exports for you, versus a **class you construct your own instance of**, scoped to whatever owns it. Neither shape is "more correct" in general — the right one depends entirely on whether the thing in question has exactly one meaningful instance for the whole running sim, or many independent instances that would conflict if shared.

## Ready-made singletons: shared by construction

Some things are correct to share across an entire sim, and the library exports a single pre-built instance rather than a class you'd construct yourself:

```ts
import { dotRandom } from 'scenerystack/dot';
import { stepTimer, animationFrameTimer } from 'scenerystack/axon';
import { soundManager } from 'scenerystack/tambo';

dotRandom.nextDouble();                 // the one shared random source
stepTimer.setTimeout( () => {}, 500 );  // the one shared model-time scheduler
soundManager.addSoundGenerator( myClip ); // the one shared audio mixer
```

[`dotRandom`](/api/dot/random), [`stepTimer`/`animationFrameTimer`](/api/axon/timer), and `soundManager` (see [Working with Sound](/guides/working-with-sound)) all follow this shape, and for the same underlying reason in each case: there is exactly one meaningful instance for the whole sim, and constructing a second one would be actively wrong, not just redundant.

- **`dotRandom`** — a sim's randomness needs to funnel through one seed so PhET-iO's seeded/reproducible playback works; a `new Random()` constructed independently in one file has no relationship to the seed everything else uses.
- **`stepTimer`/`animationFrameTimer`** — there is one running sim loop; a second, independently-constructed `Timer` instance wouldn't be driven by anything and would simply never fire.
- **`soundManager`** — there is one audio output and one set of user sound preferences; two independent mixers would both try to own the same audio graph.

You don't construct these, and you never dispose them — they live for the sim's entire lifetime by definition, the "always constructed, never disposed" case from [Dispose and Memory Management](/patterns/dispose-and-memory-management)'s table applied to a library-level object instead of a sim-authored one.

## Constructing your own instance: scoped ownership

Everything else — a class exported *without* a matching pre-built singleton — is meant to be constructed per use, with the instance's lifetime and identity owned by whatever created it. `Random` itself is the clearest illustration of the contrast: `scenerystack/dot` exports both the class and the singleton, and choosing between them is exactly this decision. Reach for `new Random( { seed } )` instead of `dotRandom` only when you deliberately want an *isolated*, independently-seeded sequence — a self-contained test that must be reproducible regardless of what else in the sim also consumes randomness, for instance — precisely the case where sharing the sim-wide singleton would be wrong instead of merely unnecessary.

The same question — "is there conceptually one of these for the whole sim, or does each owner need its own independent instance?" — is what should decide the shape of a class you design yourself, not just which SceneryStack classes to reach for. A per-screen cache, a per-model helper object, or a per-Node piece of state should be constructed and owned by its containing class, the ordinary way; exporting it as a module-level singleton only makes sense if a second instance would genuinely be a bug, not just unnecessary object allocation.

## Namespace registration: a separate concern from singleton-vs-instance

A related but distinct convention in SceneryStack/PhET code is registering an exported class (not an instance) with that library's `Namespace` object — e.g. a library's top-level module calling `myLibrary.register( 'MyClass', MyClass )` once, at the bottom of the file that defines `MyClass`. This is orthogonal to the singleton-vs-constructed-instance question above: a `Namespace`-registered class is still ordinarily constructed per use (`new MyClass()` wherever it's needed) exactly like any other class — registration exists so tooling and debugging utilities can look a class up by name/namespace path at runtime, not to make the class itself shared or singleton-like. Don't conflate "this class is registered on its library's namespace" with "this class is a singleton" — the two conventions solve different problems and most registered classes are constructed freely, many times, throughout a sim's lifetime.

::: warning Namespace registration is a real PhET convention, not independently verified against this wiki's other pages
The general shape described above (`libraryNamespace.register( 'ClassName', ClassName )`, called once per class definition) reflects the real, long-standing PhET-repo convention, but no other page in this wiki currently documents `Namespace` itself in depth — treat the specifics here as a reasonable description pending a dedicated `api/phet-core/namespace` page, not a fully cross-checked reference.
:::

## Deciding which shape a *new* class of your own should take

| Question | If yes | If no |
| --- | --- | --- |
| Would a second instance conflict with (rather than merely duplicate) the first? | Ready-made singleton, exported once from a module | Constructed per owner |
| Does "the sim" as a whole (rather than one screen, one model, one Node) own this concept? | Likely a singleton | Likely constructed and scoped by whatever needs it |
| Does anything about it need per-owner configuration (a seed, a tandem, a specific range)? | Still may be a singleton if configuration is genuinely global | Constructed, so each owner can supply its own configuration |

A namespaced, individually-constructed class (a `Random`, a model class, a view `Node` subclass) is the default; treat exporting a shared singleton instance as the deliberate exception you reach for only when a second instance would be semantically wrong, not merely one more object in memory.

::: tip A shared singleton is still just a regular exported value
There's no special "singleton" keyword or base class involved — `dotRandom` is simply `export const dotRandom = new Random();` in the library's own module, and importing it twice from two different files gives you the same object both times because ES module instances are already singletons per module graph. The pattern is a naming/API-design convention (construct once, export the instance, document "use this instead of constructing your own") rather than a language feature to learn.
:::
