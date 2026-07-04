---
title: FAQ
description: Answers to the questions a newcomer to this wiki or to SceneryStack itself would plausibly ask first.
category: meta
tags: [faq, conventions, contributing]
status: complete
related:
  - /meta/glossary
  - /meta/roadmap
  - /meta/authoring-guide
  - /getting-started/what-is-scenerystack
---

# FAQ

## Is this the same as PhET Simulations?

No, though they're closely related. [PhET Interactive Simulations](https://phet.colorado.edu) is the project that publishes the free interactive science/math sims at phet.colorado.edu. **SceneryStack** is the open-source TypeScript framework PhET built those sims on top of and later packaged for outside use — a scene graph, a reactive-state library, UI components, and an application shell (see [What is SceneryStack?](/getting-started/what-is-scenerystack)). **This wiki (Almanach)** documents SceneryStack, the framework, for anyone building their own interactive with it — not the PhET sims themselves, and not the PhET organization's internal engineering conventions beyond what's needed to use the published package.

## Do I need to know PhET's internal repo structure to use scenerystack?

No. The published `scenerystack` npm package re-exports the simulation-author-facing parts of PhET's many internal repositories as flat subpaths (`scenerystack/scenery`, `scenerystack/axon`, …) — you don't need to know that `Sim`/`ScreenView` originate in a repo called `joist`, or that the package bundles work from a dozen-plus separate source repositories at all. This wiki deliberately keeps to that same boundary: per [the Roadmap](/meta/roadmap), internal build/branding/rendering-primitive subpaths (`chipper`, `perennial`, `brand`, `splash`, `init`, `assert`, `adapted-from-phet`, `alpenglow`) are explicitly out of scope for documentation here, because they're not part of the simulation-author-facing surface.

## Which package version does this wiki document?

`scenerystack` **v3.0.0**, the version published to npm at the time this wiki's Phase 1/2 content was written (see [`npmjs.com/package/scenerystack`](https://www.npmjs.com/package/scenerystack)). Code samples throughout this wiki use real imports checked against that version's source. If you're using a materially newer or older major version, treat class/option names here as a strong starting point, not a guarantee — check the [official reference](https://scenerystack.org/reference/) for anything version-sensitive.

## How current is this documentation?

It varies page by page, by design. Every page carries a `status` of `stub`, `draft`, `complete`, or `verified` in its frontmatter — `stub` reserves a topic with placeholder content, `draft` is fully written but not yet checked against real source, `complete` is internally consistent and confident, and `verified` has had an independent pass cross-check its technical claims against real SceneryStack source or the official reference. See [the Authoring Guide](/meta/authoring-guide#the-status-lifecycle) for the full lifecycle, and [the Roadmap](/meta/roadmap) for how much of the wiki's planned ~231 pages currently exist and at what status.

## Is this an official SceneryStack or PhET resource?

Treat it as a community-maintained reference grounded in the real published package and the official [scenerystack.org/reference](https://scenerystack.org/reference/) site, rather than assuming it's the canonical source — when this wiki and the official reference disagree, the official reference wins. Every page's `sourceRefs` frontmatter field (where present) links to what its technical claims were checked against.

## Can I use SceneryStack outside of a PhET-style multi-screen sim?

Yes — `scenery` (the scene graph) and the reactive-state libraries (`axon`, `dot`) are usable as a standalone rendering/state library without `joist`'s `Sim`/`Screen` application shell at all. See [Scenery Application vs. Standalone Library](/getting-started/scenery-application-vs-standalone-library) for the two shapes and when to reach for each, and [Standalone Scenery App Example](/examples/standalone-scenery-app-example) for a worked example.

## Why do some libraries only have a page or two, while others (axon, scenery) have dozens?

Coverage is intentionally uneven and phased rather than uniform, per [the Roadmap](/meta/roadmap): the ten libraries most simulation authors touch daily (`axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon`) were prioritized first, at a "most commonly used classes" depth. Eight additional real-but-less-explored libraries (`tambo, bamboo, vegas, mobius, utterance-queue, phet-core, query-string-machine, nitroglycerin`) are first-pass Phase 2 coverage, and their candidate pages are explicitly lower-confidence until independently verified — check a given page's `status` before treating it as settled.

## Why does a page say `status: draft` or `status: stub` instead of finished content?

Both are intentional, visible markers, not an oversight — see [The `status` lifecycle](/meta/authoring-guide#the-status-lifecycle). A `stub` reserves a topic so parallel contributors don't duplicate it; a `draft` is complete prose that simply hasn't had its technical claims checked against real source yet. Neither means "ignore this page," but both mean "verify anything load-bearing yourself before relying on it," especially for a `sourceRefs` link pointing only at the npm package listing rather than a specific verified detail.

## How do I contribute a page, or fix something wrong on an existing one?

Read [the Authoring Guide](/meta/authoring-guide) for the frontmatter schema and folder taxonomy, then [the Roadmap](/meta/roadmap) for what's already claimed versus open. Every page's frontmatter and cross-links are validated by `npm run generate` (and by CI), so a page that doesn't follow the schema, or that links to a path that doesn't exist, fails the build loudly rather than silently shipping broken.

## Where do I report a bug in SceneryStack itself, as opposed to this wiki?

This wiki doesn't own SceneryStack's source — file framework bugs against the upstream project (see the `bugs`/`homepage` links on [the npm package page](https://www.npmjs.com/package/scenerystack)), and reserve issues in this wiki's own repository for problems with the documentation itself (a wrong claim, a broken cross-link, a missing page).

## My import or build isn't working — is that covered here?

Almanach documents the API surface, not project setup and tooling failures — for those, see [Troubleshooting Common Setup Errors](/getting-started/troubleshooting-common-setup-errors) (Node version mismatches, wrong import subpaths, `tsconfig.json` module resolution) and [Supported Browsers](/getting-started/supported-browsers) for platform-level compatibility questions.

## Is this wiki usable by an LLM agent, not just a human?

Yes, deliberately. `npm run generate` writes `/llms.txt` (per-page links and descriptions), `/llms-full.txt` (the full text of every page), and `/manifest.json` (all frontmatter plus computed metadata) into the site root, so an agent can fetch a single file for the whole wiki's content instead of crawling pages one at a time — see [Generated artifacts](/meta/authoring-guide#generated-artifacts).

::: tip Start at "What is SceneryStack?" if you're new to the framework itself
This FAQ assumes you already know roughly what SceneryStack is; if you don't, [What is SceneryStack?](/getting-started/what-is-scenerystack) is the actual starting point, with [the Glossary](/meta/glossary) as a reference for any unfamiliar term you hit along the way.
:::
