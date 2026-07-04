# Almanach

A file-based knowledge wiki for [SceneryStack](https://scenerystack.org) — API guides, software patterns, styling, and accessibility conventions for building interactive simulations. Designed to be equally consumable by humans (a browsable [VitePress](https://vitepress.dev) site) and LLM agents (generated `llms.txt`, `llms-full.txt`, and `manifest.json`).

**No database.** Every page is a Markdown file with structured frontmatter, versioned in this repository under [`docs/`](docs/).

## Quick start

```bash
npm install
npm run dev        # local dev server with live reload
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the VitePress dev server |
| `npm run generate` | Validate all frontmatter and regenerate the LLM artifacts in `docs/public/` |
| `npm run build` | `generate` + full static site build (fails on schema violations or dead links) |
| `npm run preview` | Serve the built site locally |

## For LLM agents

Three machine-readable views of the wiki are generated from the Markdown sources and served at the site root (and committed in [`docs/public/`](docs/public/)):

- **`llms.txt`** — index of every page with one-line descriptions ([llms.txt convention](https://llmstxt.org/))
- **`llms-full.txt`** — full text of every page in a single file
- **`manifest.json`** — structured metadata: titles, categories, tags, related pages, word counts

## Adding content

See the [Authoring Guide](docs/meta/authoring-guide.md): drop a Markdown file with the required frontmatter into the folder matching its category, and the sidebar, search index, and all LLM artifacts pick it up automatically. `npm run generate` enforces the schema; CI enforces it on every push.

## Deployment

Pushes to `main` build and deploy the site to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) (requires the repository's **Settings → Pages → Source** set to *GitHub Actions*). All other pushes and pull requests run the validation/build check in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
