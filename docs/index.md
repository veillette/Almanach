---
layout: home

hero:
  name: Almanach
  text: SceneryStack Knowledge Base
  tagline: API guides, software patterns, and conventions for building interactive simulations — readable by humans and LLM agents alike.
  actions:
    - theme: brand
      text: What is SceneryStack?
      link: /getting-started/what-is-scenerystack
    - theme: alt
      text: Authoring Guide
      link: /meta/authoring-guide

features:
  - title: Plain files, no database
    details: Every page is a Markdown file with structured frontmatter, versioned in git. The whole wiki is greppable, diffable, and reviewable through pull requests.
  - title: Built for LLM agents
    details: A generator script emits llms.txt, llms-full.txt, and manifest.json so agents can discover, ingest, or query the entire wiki with a single fetch.
  - title: Scales to 1000 documents
    details: The sidebar and all indexes are generated from the filesystem and frontmatter. Adding a document is just adding a file — no configuration edits.
---

## For LLM agents

Three machine-readable views of this wiki are generated from the same Markdown sources and served at the site root:

| File | Purpose |
| --- | --- |
| [`/llms.txt`](/llms.txt) | Index of every page with a one-line description, following the [llms.txt convention](https://llmstxt.org/) |
| [`/llms-full.txt`](/llms-full.txt) | Full text of every page in a single file, for one-shot ingestion |
| [`/manifest.json`](/manifest.json) | Structured metadata (title, category, tags, related pages, word counts) for programmatic queries |

The raw Markdown sources live in [the GitHub repository](https://github.com/veillette/Almanach) under `docs/`.
