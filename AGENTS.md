# Agent Instructions — avrebarra.github.io

Personal blog and website built with Jekyll, hosted on GitHub Pages.

## Quick Start

Run the dev server via Docker — no local Ruby/Jekyll install needed.

```bash
./runtask watch    # Start Jekyll at http://localhost:4000
```

All Jekyll dependencies are bundled in the official `jekyll/jekyll` image.

## Key Commands

| Purpose             | Command            |
| ------------------- | ------------------ |
| Local dev server    | `./runtask watch`  |
| Check formatting    | `./runtask lint`   |
| Auto-fix formatting | `./runtask format` |

## Project Layout

```text
_posts/<category>/YYYY-MM-DD-slug.md   # published posts
_drafts/YYYY-MM-DD-slug.md             # unpublished drafts
_layouts/                              # page/post HTML templates
_includes/                             # reusable HTML partials
_sass/                                 # SCSS partials
pages/                                 # standalone pages (about, index, etc.)
workspace/                             # static workspace assets
openspec/                              # API spec files
```

Post categories (subdirectories under `_posts/`):

- `journals/` — personal journal entries
- `technicals/` — technical how-to posts and deep dives (Go, tooling, infra)
- `thoughts/` — opinion pieces and essays (non-technical or sub-technical)

## Content Structure: Tags vs Categories vs Series

Posts have three distinct axes that never overlap:

- **Categories** = the folder a post lives in (exactly one, via `_posts/<category>/`).
- **Tags** = topics a post is about (many, via `tags:` frontmatter).
- **Series** = the activity a post belongs to (at most one, via `series:` frontmatter).

Series are **activities, not category mirrors**. `Golang`, `Thoughts`, `Journals` are categories — never use them as series values. A series groups posts across categories (e.g. `War Stories`, `Unnoticed Fundamentals`). Full contract in [docs/guides.md](docs/guides.md#content-structure-tags-vs-categories-vs-series).

## Post Frontmatter

Every post requires this frontmatter:

```yaml
---
layout: post
title: Post Title Here
date: YYYY-MM-DD HH:MM:SS +0000
highlighted: false # true = featured on index
tags: []
series: Series Name # activity; leave blank if standalone
series_order: 1 # narrative position; only when series is set
---
```

- `series` groups posts by activity — keep it consistent across related entries.
- `series_order` gives narrative order independent of publish dates; the post layout renders part badge + prev/next nav from it.
- Drafts in `_drafts/` use the same frontmatter format.

## Linting (mandatory)

Every change must pass `./runtask lint` (prettier `--check`) before it is considered complete.

- Run `./runtask format` to auto-fix formatting violations.
- If a pre-existing file fails lint, fix it as part of your work — never widen the lint gate or skip the check.
- Prettier scope is enforced by `.prettierignore` — do not add files to the ignore list to dodge formatting; add them only when prettier cannot safely parse them (e.g. Liquid HTML templates).
- HTML templates with Liquid (`_layouts/`, `_includes/`, `pages/`) are intentionally excluded — core prettier cannot parse Liquid safely.

## Site Config

[`_config.yml`](_config.yml) — site name, URL, footer links, Giscus comments config.  
Comments are powered by [Giscus](https://giscus.app/) (GitHub Discussions).

## Rich Block Architecture

- Rich post blocks are authored directly in post Markdown using inline HTML contracts (for example `data-rich-block="quote"`, `data-rich-block="download"`, `data-rich-block="headline-image"`, and `data-rich-block="inline-gallery"`).
- Visual contracts and spacing for these blocks live in [`style.scss`](style.scss).
- Runtime enhancement for interactive/structured blocks is mounted via Preact from [`assets/js/runtime.js`](assets/js/runtime.js) and component modules in [`assets/js/components/`](assets/js/components/).
- When adding a new rich block, add its island module in [`assets/js/components/`](assets/js/components/) and register its `run...Enhancements` call in [`assets/js/runtime.js`](assets/js/runtime.js).
- `inline-gallery` keeps grid rendering for small sets and upgrades to a horizontal multi-visible strip when 3 or more images are present (or when `data-layout="carousel"` is set). Left/right controls appear only when items overflow the available width.
- `headline-image` and `inline-gallery` support click-to-open full-size images in a new browser tab via the shared runtime utility in [`assets/js/components/rich-image-preview.js`](assets/js/components/rich-image-preview.js).
- Treat rich blocks as static-first, JS-optional components. Do not assume they are Jekyll include partials unless explicitly introduced as such.

## Design Governance

**DESIGN.md is the canonical design authority** for this repository.

### Rules for System Design Changes

1. **Always adhere to DESIGN.md** — Agent instructions and design-affecting decisions must align with DESIGN.md as the binding contract.
2. **Require explicit chat confirmation before updates** — Any change affecting system design documentation (DESIGN.md only) must first be confirmed explicitly by the user in chat before proceeding.
3. **System design scope is DESIGN.md only** — For this governance policy, "system design" refers exclusively to DESIGN.md. Other documentation may be updated without triggering these governance rules.
4. **Mandatory blocking lint validation** — Every DESIGN.md edit must pass the validation command `npx @google/design.md lint DESIGN.md` before the change is considered complete. Lint failures block further changes until resolved.

## Doc Index

| Need                          | Look in                                      | Hint                                       |
| ----------------------------- | -------------------------------------------- | ------------------------------------------ |
| Project identity, quick start | [README.md](README.md)                       | Docker-based setup, key commands           |
| Agent conventions (this file) | [AGENTS.md](AGENTS.md)                       | Commands, layout, frontmatter, rich blocks |
| Architecture and data flow    | [docs/architecture.md](docs/architecture.md) | Jekyll + Preact + Shiki pipeline           |
| Writing guides and gotchas    | [docs/guides.md](docs/guides.md)             | Post creation, rich blocks, series         |
| Design system                 | [DESIGN.md](DESIGN.md)                       | Canonical UI contract, tokens, components  |
| Site configuration            | [_config.yml](_config.yml)                   | Giscus, analytics, author, permalink       |
| Build and serve commands      | [runtask](runtask)                           | `./runtask watch`                          |

### AGENTS.md Attachment

AGENTS.md must be available as context on every AI agent invocation so agents understand repository structure, key commands, project layout, and governance rules when exploring, brainstorming, creating specs, or implementing tasks.
