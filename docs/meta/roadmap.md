---
title: Roadmap
description: The phased plan for growing Almanach from a handful of pages to a comprehensive SceneryStack wiki, and how to track and claim work against it.
category: meta
tags: [roadmap, planning, contributing, conventions]
status: complete
related:
  - /meta/authoring-guide
  - /meta/page-template
---

# Roadmap

This wiki started with 6 content pages. This document is the plan for growing it substantially — organized into phases, with a concrete way for whoever picks up the work next (human or agent, in this session or a future one) to see what's done and claim what isn't.

**This document does not itself write the content.** Phase 0 (below) — the taxonomy redesign, schema changes, and the tooling described here — was completed in one session. Phases 1 and 2 have both since been built out in full (see [Totals](#totals) and `npm run roadmap:status`); Phase 3 (maintenance) is the current open work.

## Why a roadmap instead of just writing more pages

The original ask was "about a hundred pages, modeled on scenerystack.org's structure." Two things changed that:

1. The original 6-page taxonomy (a flat `api/` folder for every class reference, across what turned out to be **17+** simulation-author-facing SceneryStack libraries, not the 10 first assumed) doesn't scale past roughly the 50-100 pages it already needed in Phase 1 alone. It needed fixing before more content landed on top of it — see [Taxonomy v2](#taxonomy-v2) below.
2. Writing ~200 accurate, non-generic technical pages in one sitting isn't reliable — cross-linking would break mid-flight, and API claims about libraries nobody in this session has verified against real source risk being confidently wrong. Splitting the work into phases with an explicit confidence/verification mechanism (see [The `status` lifecycle](/meta/authoring-guide#the-status-lifecycle)) is what makes ~200 pages a credible target instead of an aspiration.

## Taxonomy v2

`getting-started/`, `patterns/`, `styling/`, `accessibility/`, and `meta/` keep their original shape — flat folders, one file per concept. Two changes:

- **`api/` is now subfoldered by library**: `api/axon/`, `api/dot/`, `api/scenery/`, etc. — one directory per `scenerystack/*` subpath. This is the fix for the one real scaling problem in the original structure: a single flat `api/` folder holding 100+ pages across a dozen-plus libraries is not navigable. `docs/.vitepress/sidebar.ts` renders each subfolder as its own collapsible group automatically.
- **`guides/` and `examples/` are new top-level categories**, for content scenerystack.org treats as first-class nav sections (subsystem walkthroughs, tutorials, worked showcases) that didn't fit `patterns` (too narrow/prescriptive) or `getting-started` (onboarding-only).

Full rationale and the frontmatter schema (which gained `library`, `prerequisites`, `sourceRefs`, and a 4-stage `status` enum) live in [the Authoring Guide](/meta/authoring-guide) — read that before writing a page, this document is about *what* to write, not *how*.

**Confirmed real library subpaths** (from the published `scenerystack` package's exports map, not assumption): `axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon, tambo, bamboo, vegas, mobius, nitroglycerin, utterance-queue, phet-core, query-string-machine` are simulation-author-facing and in scope. `adapted-from-phet, alpenglow, assert, brand, chipper, init, perennial, sim, splash` are internal build/branding/rendering-primitive concerns and are **out of scope** — don't create `api/<one of these>/` folders.

## How to pick up work

1. Read [the Authoring Guide](/meta/authoring-guide) and [the Page Template](/meta/page-template).
2. Run `npm run roadmap:status` to see what's built, what's `stub`/`draft`/`complete`/`verified`, and what's still unclaimed in Phase 1 and Phase 2.
3. Pick an unclaimed entry from `docs/meta/roadmap.manifest.json` (Phase 1: a fixed file to create; Phase 2: a target count + candidate names for a category/library — pick one candidate, or a better one you find while researching, and write it).
4. Create the file with `status: stub` first if you're not finishing it in one pass — this reserves the topic for parallel sessions without claiming false completeness.
5. Write the page following the Authoring Guide's conventions (one concept, a real runnable snippet, cross-links). Move `status` to `draft`, then `complete` once you're confident, citing `sourceRefs` for anything you had to look up.
6. For any Phase 2 entry marked `confidence: medium` or `confidence: low` in the manifest: verify the class/API actually exists and matches the candidate description before writing — check https://scenerystack.org/reference/ or introspect the installed package. Do not invent plausible-sounding names. If you can't verify it, either skip it, replace it with something you can verify, or write it as `status: draft` with a `sourceRefs` link and leave upgrading it to `verified` for a later pass.
7. Run `npm run generate` (frontmatter + cross-link validation) and `npm run build` (adds dead-link checking) before considering a page done.
8. There is no separate checklist to tick — progress is read directly from frontmatter `status` values across the tree via `npm run roadmap:status`. Don't hand-maintain a duplicate progress list; it will drift.

## Phases

### Phase 0 — Infrastructure (complete)

Taxonomy v2, schema v2, the sidebar/validator code changes, migrating the 6 original pages into the new shape, and this roadmap + its manifest + the status script. No new content pages.

### Phase 1 — Core coverage (~102 pages total; 93 new, tracked as a fixed list)

Onboarding, the 10 high-confidence libraries (`axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon`) at a "most commonly used classes" depth, and rounding out `guides/patterns/styling/accessibility/examples`. Every entry is enumerated as a concrete `{path, title, description, tags}` in `docs/meta/roadmap.manifest.json`'s `phase1.pages` array — pick any unbuilt one and go. Breakdown: getting-started +6, guides +10, api +50 (axon 9, dot 6, kite 1, scenery 13, sun 9, scenery-phet 7, twixt 1, joist 3, tandem 1), patterns +9, styling +5, accessibility +6, examples +7.

### Phase 2 — Deep coverage (~129 pages, tracked as per-category/library targets + candidates)

Two kinds of work, both in `roadmap.manifest.json`'s `phase2.targets` array:

- **More classes in the 10 core libraries** (e.g. `dot/Vector4`, `scenery/KeyboardListener`, `scenery-phet/RulerNode`, `tandem/PhetioObject`) — `confidence: high`, same bar as Phase 1.
- **First-pass coverage of 8 additional real-but-less-explored libraries** (`tambo, bamboo, vegas, mobius, utterance-queue, phet-core, query-string-machine, nitroglycerin`) — `confidence: medium` or `low`. These subpaths are confirmed to exist; their candidate class names are not independently verified in this session and **must** be checked before a page is written (see step 6 above).
- Plus deeper `guides/patterns/styling/accessibility/examples`, and `meta/glossary.md` + `meta/faq.md`.

### Phase 3 — Maintenance (ongoing, no fixed page count)

Once Phases 1-2 are substantially built: a cross-link densification pass (add `related`/`prerequisites` now that more targets exist), upgrading `complete` → `verified` pages via an independent source-check pass, and pruning or merging pages that turn out to overlap. `npm run roadmap:status` reports live counts for all three (status breakdown across every page, plus how many pages still lack `prerequisites`/`related`/`sourceRefs`) — there's no separate manifest for Phase 3 since the targets are "drive the gaps to zero," not a fixed list.

A first full pass (against the real `scenerystack@3.0.0` package source) took every `api/` page and most narrative pages from `complete` to `verified`, fixing real inaccuracies along the way (wrong defaults, invented/renamed options, misattributed behavior — see the git history for specifics) and filling in most missing `prerequisites`/`related` links. Left for a future pass:

- **Known overlap candidates** (flagged during verification, not merged — each pair reads as intentionally layered rather than duplicated, but worth a second look): `api/sun/list-box.md` vs. `api/sun/combo-box.md` (the former is thin and almost entirely "see ComboBox instead"); `guides/phet-io-and-instrumentation.md` vs. `guides/phet-io-deep-dive.md` vs. `patterns/phet-io-instrumentation-pattern.md`; `patterns/state-persistence-and-save-restore-patterns.md` vs. `patterns/phet-io-instrumentation-pattern.md`/`patterns/reset-all-pattern.md`; `api/scenery/parallel-dom-deep-dive.md` vs. `accessibility/pdom.md`.
- **Stale filenames** (title/content already correct and self-documented in-page, but the filename predates a scope correction from Phase 2): `api/phetcommon/phetcommon-query-parameters.md` actually documents `StringUtils`; `api/scenery-phet/heat-cool-control.md` actually documents `HeaterCoolerNode`. Renaming either requires auditing every cross-link and the Phase 1/2 manifest entries that reference the old path.
- The 5 `meta/*` pages (`authoring-guide`, `faq`, `glossary`, `page-template`, this file) stay at `complete` rather than `verified` — that status is about checking claims against SceneryStack source, which doesn't apply to pages that are about the wiki itself.

## Totals

Phase 1 (~102, including the 9 pages that already exist) + Phase 2 (~129 planned) ≈ **231 pages** once both phases are built out — comfortably covering the "~200 or so" the wiki is being scaled toward, with room to trim low-confidence Phase 2 candidates that don't pan out during verification.
