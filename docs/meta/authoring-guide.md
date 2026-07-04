---
title: Authoring Guide
description: Conventions for adding documents to this wiki - folder taxonomy, required frontmatter schema, and how the generated indexes work.
category: meta
tags: [conventions, frontmatter, contributing]
status: complete
---

# Authoring Guide

This wiki is designed to grow to hundreds of documents without any configuration edits. Everything — the sidebar, `llms.txt`, `llms-full.txt`, and `manifest.json` — is generated from the Markdown files and their frontmatter. Follow the conventions below and your page appears everywhere automatically.

## Adding a page

1. Create a `.md` file in the folder matching its category (see taxonomy below). Use kebab-case filenames: `model-view-transform.md`.
2. Fill in the required frontmatter (schema below).
3. Run `npm run generate` — it validates every page and regenerates the LLM artifacts, failing loudly on schema violations.
4. Preview with `npm run dev`.

## Folder taxonomy

| Folder | Contents |
| --- | --- |
| `getting-started/` | Orientation, installation, first steps |
| `api/` | Reference pages for specific classes and APIs |
| `patterns/` | Recommended software patterns and architectures |
| `styling/` | Colors, layout, visual design conventions |
| `accessibility/` | PDOM, keyboard input, screen reader support |
| `meta/` | Documentation about this wiki itself |

New top-level folders may be added as the wiki grows; they appear in the sidebar automatically (add an entry to the `SECTIONS` maps in `docs/.vitepress/sidebar.ts` and `scripts/generate-llm-artifacts.ts` only to control their label and ordering).

## Frontmatter schema

Every page **must** begin with this frontmatter:

```yaml
---
title: ModelViewTransform2                  # required — page title, used in sidebar and indexes
description: One-sentence summary.          # required — shown in llms.txt and manifest.json
category: api                               # required — MUST equal the containing folder name
tags: [dot, coordinates, transform]         # required — non-empty list of lowercase keywords
status: complete                            # required — "draft" or "complete"
related:                                    # optional — site-absolute paths to related pages
  - /patterns/model-view-separation
---
```

Validation rules (enforced by `npm run generate`, and by CI on every push):

- `title` and `description` are non-empty strings.
- `category` matches the top-level folder the file lives in.
- `tags` is a non-empty array of strings.
- `status` is `draft` or `complete`.
- Every `related` entry resolves to an existing document — broken cross-references fail the build.

VitePress additionally fails the build on dead Markdown links, so inline links like `[Drag Listeners](/patterns/drag-listeners)` are also checked.

## Writing style

- **One concept per page.** Small, focused pages retrieve better — for search engines, humans, and LLM context windows alike.
- **Lead with what and why**, then show a complete, runnable TypeScript snippet using real `scenerystack/*` imports.
- **Cross-link generously** with site-absolute paths (`/api/model-view-transform`), and mirror the most important links in `related`.
- Use tables for option/method summaries and `::: tip` / `::: warning` containers for the one thing readers must not miss.

## Generated artifacts

`npm run generate` (also run automatically as part of `npm run build`) writes three files into `docs/public/`, which are served at the site root:

| File | Contents |
| --- | --- |
| `/llms.txt` | Per-page links + descriptions, grouped by category ([llms.txt convention](https://llmstxt.org/)) |
| `/llms-full.txt` | Full text of every page with source-path headers |
| `/manifest.json` | All frontmatter metadata plus URLs and word counts |

These files are committed to the repository so agents browsing GitHub get them without a build step; regenerate them whenever content changes (CI verifies the build regardless).
