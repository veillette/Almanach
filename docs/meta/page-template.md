---
title: Page Template
description: A copy-pasteable frontmatter and section skeleton for authors starting a new wiki page.
category: meta
tags: [template, contributing, conventions]
status: complete
related:
  - /meta/authoring-guide
  - /meta/roadmap
---

# Page Template

Copy the block below into a new file, fill it in, and delete anything that doesn't apply. See [the Authoring Guide](/meta/authoring-guide) for the full schema and folder taxonomy, and [the Roadmap](/meta/roadmap) if this page is claiming planned work.

## Frontmatter to copy

```yaml
---
title: ExactClassOrConceptName
description: One sentence: what this is and why it matters.
category: getting-started            # must equal the top-level folder this file lives in
# library: axon                      # required only when category is "api" — must equal the api/<library>/ subfolder
tags: [lowercase, keywords, PascalCaseClassNames]
status: stub                         # stub -> draft -> complete -> verified as the page matures
# related:
#   - /patterns/some-other-page
# prerequisites:
#   - /getting-started/what-is-scenerystack
# sourceRefs:
#   - https://www.npmjs.com/package/scenerystack
---
```

## Section skeleton

```md
# Title

One or two sentences: what this is, and why a reader should care. Lead with
the "what and why," not a history lesson.

## The core idea / a minimal example

A complete, runnable TypeScript snippet using real `scenerystack/*` subpath
imports — not pseudocode.

\`\`\`ts
import { Something } from 'scenerystack/some-library';
\`\`\`

## Options / methods (if applicable)

| Option | Effect |
| --- | --- |
| `exampleOption` | What it does |

::: tip One thing readers must not miss
Use a `::: tip` or `::: warning` container for the single most important
caveat — not a wall of bullet points.
:::
```

## Checklist before setting `status: complete`

- One concept per page — if you're covering two unrelated ideas, split the file.
- At least one complete, runnable code snippet using real imports.
- Cross-links added both as inline Markdown links and mirrored in `related`/`prerequisites`.
- `npm run generate` passes (frontmatter schema + no dead `related`/`prerequisites` links).
- If this is an `api/` page and you're not fully certain of the class's real shape, leave `status: draft` and add a `sourceRefs` entry so a later `verified` pass has something to check against.
