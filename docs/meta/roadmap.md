---
title: Roadmap
description: What this wiki currently covers, the taxonomy behind that coverage, and the concrete work that remains open.
category: meta
tags: [roadmap, planning, contributing, conventions]
status: complete
related:
  - /meta/authoring-guide
  - /meta/page-template
  - /meta/scenerystack-version-compatibility
---

# Roadmap

Almanach covers 19 simulation-author-facing `scenerystack/*` libraries across 9 top-level categories (`getting-started`, `guides`, `api`, `patterns`, `styling`, `accessibility`, `examples`, `cookbook`, `meta`) — 420 pages as of this writing. Run `npm run coverage:status` at any time for a live count broken down by category/library and frontmatter `status`.

**This document does not itself write the content.** It explains the taxonomy so a new page lands in the right place, and lists the concrete work still open so a contributor (human or agent) can pick something up instead of guessing.

## Taxonomy

- `getting-started/`, `patterns/`, `styling/`, `accessibility/`, `guides/`, `examples/`, and `meta/` are flat folders, one file per concept.
- **`api/` is subfoldered by library**: `api/axon/`, `api/dot/`, `api/scenery/`, etc. — one directory per `scenerystack/*` subpath. `docs/.vitepress/sidebar.ts` renders each subfolder as its own collapsible group automatically.
- **`cookbook/`** holds short, task-oriented "how do I…" recipes, one recipe per page, that recombine APIs documented elsewhere rather than introducing new ones. Narrower than `examples` (a full worked scenario) and more concrete than `patterns` (an architectural convention).

Full rationale and the frontmatter schema (`library`, `prerequisites`, `sourceRefs`, and the 4-stage `status` enum) live in [the Authoring Guide](/meta/authoring-guide) — read that before writing a page, this document is about *what's covered and what's missing*, not *how to write a page*.

**In-scope libraries** (confirmed against the installed `scenerystack` package's `exports` map and source): `axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon, tambo, bamboo, vegas, mobius, nitroglycerin, utterance-queue, phet-core, query-string-machine, tappi`. `adapted-from-phet, alpenglow, assert, brand, chipper, init, perennial, sim, splash` are internal build/branding/rendering-primitive concerns and are **out of scope** — don't create `api/<one of these>/` folders for them.

Coverage depth is intentionally uneven: the libraries most simulation authors touch daily (`axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon`) go deepest; libraries like `mobius`, `nitroglycerin`, and `tappi` have only first-pass coverage of their most central classes. This wiki documents "the classes and patterns a simulation author actually reaches for," not every export — `scenery` and `scenery-phet` alone have several hundred exports each, most of them internal helpers, string modules, or image/audio assets that don't warrant their own page.

## How to contribute a page

1. Read [the Authoring Guide](/meta/authoring-guide) and [the Page Template](/meta/page-template).
2. Run `npm run coverage:status` to see per-category/library page counts and which pages are still `stub`/`draft`, and check [Open work](#open-work) below for known gaps.
3. If you're adding coverage for a class not yet documented, verify it actually exists and matches your description by checking https://scenerystack.org/reference/ or introspecting the installed `scenerystack` package — don't invent plausible-sounding names.
4. Create the file with `status: stub` first if you're not finishing it in one pass — this reserves the topic for parallel contributors without claiming false completeness.
5. Write the page following the Authoring Guide's conventions (one concept, a real runnable snippet, cross-links). Move `status` to `draft`, then `complete` once you're confident, citing `sourceRefs` for anything you had to look up.
6. Run `npm run generate` (frontmatter + cross-link validation) and `npm run build` (adds dead-link checking) before considering a page done.

There is no separate checklist to tick — progress is read directly from frontmatter `status` values across the tree via `npm run coverage:status`. Don't hand-maintain a duplicate progress list; it will drift.

## Open work

- **6 pages are still `status: draft`**, meaning they're fully written but haven't had their technical claims checked against real source yet: `patterns/singleton-and-namespace-conventions.md`, `accessibility/mobile-screen-reader-testing-notes.md`, `api/tappi/vibration-indicator-and-controller.md`, `api/tappi/vibration-manager-and-patterns.md`, `guides/haptics-and-alternative-feedback-channels.md`, `cookbook/fuzz-testing-a-simulation-locally.md`. Verifying one of these against the real `scenerystack` package and moving it to `complete`/`verified` is a good first contribution.
- **Independent verification pass**: 188 pages are `status: complete` but haven't yet had an independent pass cross-check their technical claims against real SceneryStack source (`status: verified`). This includes ~89 pages added in the most recent expansion pass, which focused on previously-undocumented `sun` and `scenery-phet` visual components (buttons/toggles, sliders, icons/decorative nodes, keyboard-help/a11y interaction patterns) plus a smaller set of `scenery`/`vegas`/`twixt`/`joist` gaps. `npm run coverage:status` prints the live count and, going forward, should trend toward 0.
- **Cross-link gaps**: some pages are missing `prerequisites`, `related`, or `sourceRefs` entries. `npm run coverage:status` reports live counts; run it and pick a page to tighten up.
- **Re-verification against newer `scenerystack` releases**: this wiki's content was checked against `scenerystack@3.0.0`; see [SceneryStack Version Compatibility Notes](/meta/scenerystack-version-compatibility) for what to do once a newer major version ships.
- **Known overlap candidates** (each pair reads as intentionally layered rather than duplicated, but worth a second look): `api/sun/list-box.md` vs. `api/sun/combo-box.md` (the former is thin and almost entirely "see ComboBox instead"); `guides/phet-io-and-instrumentation.md` vs. `guides/phet-io-deep-dive.md` vs. `patterns/phet-io-instrumentation-pattern.md`; `patterns/state-persistence-and-save-restore-patterns.md` vs. `patterns/phet-io-instrumentation-pattern.md`/`patterns/reset-all-pattern.md`; `api/scenery/parallel-dom-deep-dive.md` vs. `accessibility/pdom.md`.
- **Stale filenames** (title/content already correct and self-documented in-page, but the filename predates a scope correction): `api/phetcommon/phetcommon-query-parameters.md` actually documents `StringUtils`; `api/scenery-phet/heat-cool-control.md` actually documents `HeaterCoolerNode`. Renaming either requires auditing every cross-link that references the old path.
- **Deeper class-level coverage**: each in-scope library has more real, unverified-as-candidates exports than this wiki documents (internal helpers and asset modules aside). Rather than a fixed target list, find genuine gaps by introspecting the installed package (`node -e "console.log(Object.keys(require('scenerystack/<lib>')))"` against the built package, or read its `src/<lib>.ts` barrel file) and cross-checking against what's already documented before adding a page.
- The 5 `meta/*` pages (`authoring-guide`, `faq`, `glossary`, `page-template`, this file) stay at `complete` rather than `verified` — that status is about checking claims against SceneryStack source, which doesn't apply to pages that are about the wiki itself.
