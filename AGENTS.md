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
