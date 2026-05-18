# Agent Instructions — avrebarra.github.io

Personal blog and website built with Jekyll, hosted on GitHub Pages.

## Key Commands

| Purpose                | Command                            |
| ---------------------- | ---------------------------------- |
| Local dev server       | `make watch`                       |
| Create new post stub   | `make new_post`                    |
| Serve workspace assets | `make serve-workspace` (port 7173) |

Ruby/Jekyll env managed via rbenv. See [README.md](README.md) for initial setup.

## Project Layout

```
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
- `learning-notes/` — technical learning notes
- `technicals-go/` — Go-specific technical posts
- `thoughts/` — opinion pieces and essays

## Post Frontmatter

Every post requires this frontmatter:

```yaml
---
layout: post
title: Post Title Here
date: YYYY-MM-DD HH:MM:SS +0000
highlighted: false # true = featured on index
categories:
tags: []
series: Series Name # groups related posts; leave blank if standalone
---
```

- `series` is used to group related posts — keep it consistent across related entries.
- Drafts in `_drafts/` use the same frontmatter format.
- Prefer `make new_post` to scaffold the stub rather than creating files manually.

## Site Config

[`_config.yml`](_config.yml) — site name, URL, footer links, Giscus comments config.  
Comments are powered by [Giscus](https://giscus.app/) (GitHub Discussions).

## Design Governance

**DESIGN.md is the canonical design authority** for this repository.

### Rules for System Design Changes

1. **Always adhere to DESIGN.md** — Agent instructions and design-affecting decisions must align with DESIGN.md as the binding contract.
2. **Require explicit chat confirmation before updates** — Any change affecting system design documentation (DESIGN.md only) must first be confirmed explicitly by the user in chat before proceeding.
3. **System design scope is DESIGN.md only** — For this governance policy, "system design" refers exclusively to DESIGN.md. Other documentation may be updated without triggering these governance rules.
4. **Mandatory blocking lint validation** — Every DESIGN.md edit must pass the validation command `npx @google/design.md lint DESIGN.md` before the change is considered complete. Lint failures block further changes until resolved.

### AGENTS.md Attachment

AGENTS.md must be available as context on every AI agent invocation so agents understand repository structure, key commands, project layout, and governance rules when exploring, brainstorming, creating specs, or implementing tasks.
