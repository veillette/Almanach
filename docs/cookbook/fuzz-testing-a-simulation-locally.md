---
title: Fuzz-Testing a Simulation Locally
description: Using the ?fuzz query parameter (and its variants) during local development to catch input-handling bugs before release.
category: cookbook
tags: [query-parameters, fuzz, testing, qa]
status: draft
related:
  - /patterns/query-parameters-pattern
  - /guides/testing-and-qa-strategy-overview
  - /guides/continuous-integration-for-scenerystack-projects
prerequisites:
  - /patterns/query-parameters-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Fuzz-Testing a Simulation Locally

**Task:** before shipping a change, you want automated confidence that no sequence of rapid, unexpected input (fast clicking, dragging mid-transition, hammering a keyboard shortcut) throws an uncaught exception — without writing a hand-crafted test for every such sequence.

SceneryStack simulations have a built-in fuzzer: appending `?fuzz` to the sim's URL drives a continuous stream of randomized pointer and keyboard events at the running sim, and reports the first uncaught exception it triggers. This is [layer 3 of the testing strategy](/guides/testing-and-qa-strategy-overview) — a crash-finder, not a correctness-checker — and complements headless model tests and manual QA rather than replacing either.

## Running a basic fuzz pass

```
http://localhost:5173/my-sim/my-sim_en.html?fuzz&ea
```

- `fuzz` turns on the randomized input stream.
- `ea` ("enable assertions") is normally paired with it, so an invalid internal state throws immediately at the point it first goes wrong, rather than silently corrupting further state and surfacing as a confusing, unrelated exception minutes later.

Let it run for a few minutes while watching the browser console; a clean run producing no console errors is the pass condition. A thrown exception's stack trace points at the code path the fuzzer happened to stumble into — that's the bug to fix, not the fuzzer's behavior to work around.

## Narrowing which input modality is exercised

If a fuzz run finds a crash, narrowing which kind of input is being generated helps isolate whether the bug is in pointer handling, keyboard handling, or both:

| Parameter | Effect |
| --- | --- |
| `fuzz` | Randomizes all input modalities together (pointer and keyboard) |
| `fuzzMouse` | Randomizes only simulated mouse input |
| `fuzzTouch` | Randomizes only simulated touch input |
| `fuzzBoard` | Randomizes only keyboard input, exercising focus movement and hotkeys instead of pointer events |
| `fuzzRate` | Controls how frequently fuzz events are generated (higher values fire events faster) |

Combine one of the modality-specific flags with `ea` the same way as the general case, e.g. `?fuzzBoard&ea` to stress-test keyboard-only interaction paths (useful right after adding a new `KeyboardListener`/`KeyboardDragListener`, to catch a hotkey that assumes some state that a rapid, out-of-order key sequence violates).

## Reproducing a fuzz-found failure

Fuzzing is randomized, so a crash found in one run may not reproduce with the same seed by default — if a failure needs to be isolated for debugging, note the exact console error and stack trace from the run that found it, and use it to write a targeted, deterministic unit test (see [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly)) covering that specific input sequence instead of relying on fuzzing to reproduce it again. Fuzzing is best treated as a discovery tool for the *existence* of a bug, not as the regression test that then guards against it recurring.

## Where this fits in a release checklist

| Layer | What it catches | This recipe |
| --- | --- | --- |
| Headless unit tests | Logic/physics bugs in model code | Not this — see [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly) |
| Manual QA | Visual/UX/accessibility issues | Not this — a human still needs to look at and navigate the sim |
| Fuzz-testing | Crashes from unexpected/rapid input sequences | This recipe, and running it in CI — see [Continuous Integration for SceneryStack Projects](/guides/continuous-integration-for-scenerystack-projects) |

::: tip Run it after any change to input handling, not just before a release
A few minutes of `?fuzz&ea` locally, right after adding or modifying a `DragListener`/`KeyboardListener`/custom input listener, catches the class of bug fuzzing is good at — an unexpected state transition mid-interaction — while the change is still fresh in mind, rather than waiting for a pre-release fuzz pass to surface it days or weeks later.
:::

::: warning This page's specific parameter names are a reasonable default, not independently verified against this wiki's other pages
`fuzz`, `fuzzMouse`, `fuzzTouch`, `fuzzBoard`, `fuzzRate`, and `ea` are widely-used, well-established query parameters across PhET simulations, but — unlike the [Query Parameters Pattern](/patterns/query-parameters-pattern) page's `QueryStringMachine.getAll` mechanics, which were checked directly against source — the exact set and spelling of fuzz-specific parameters were not independently cross-checked against a `scenerystack` source file as part of writing this page. Treat the general recipe (`?fuzz`, paired with `?ea`) as solid, and double-check the narrower modality flags (`fuzzMouse`/`fuzzTouch`/`fuzzBoard`/`fuzzRate`) against a running sim's actual behavior before depending on one in a CI script.
:::
