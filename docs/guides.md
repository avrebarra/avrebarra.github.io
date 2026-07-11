# Guides

## Creating a Post

### Scaffold

```bash
make new_post   # creates _posts/YYYY-MM-DD-untitled.md
```

Then move the file into the appropriate category subdirectory:
- `_posts/journals/` — personal journal
- `_posts/learning-notes/` — technical learning notes
- `_posts/technicals-go/` — Go-specific technical
- `_posts/thoughts/` — opinion pieces

### Frontmatter

```yaml
---
layout: post
title: Post Title Here
date: YYYY-MM-DD HH:MM:SS +0000
highlighted: false          # true = featured on index page
categories:
tags: []
series: Series Name         # groups related posts; leave blank if standalone
---
```

- `series` must be consistent across entries in the same group
- Drafts in `_drafts/` use identical frontmatter
- Always use `make new_post` — don't create files manually

## Rich Blocks

Rich blocks are authored as inline HTML with `data-rich-block` attributes. They are static-first (render without JS) and enhanced by Preact islands at runtime.

### Available blocks

| Block            | Attribute                          | Behavior                                   |
| ---------------- | ---------------------------------- | ------------------------------------------ |
| Quote            | `data-rich-block="quote"`          | Warm-accent styled callout                 |
| Headline image   | `data-rich-block="headline-image"` | Click-to-open full-size in new tab         |
| Inline gallery   | `data-rich-block="inline-gallery"` | Grid (1-2 images), carousel (3+)           |
| Download card    | `data-rich-block="download"`       | File download tile (row of cards)          |

### Adding a new rich block

1. Add the component to [DESIGN.md](../DESIGN.md) (Components section) with stable ID and usage notes
2. Create island module in `assets/js/components/`
3. Register its `run...Enhancements` call in `assets/js/runtime.js`
4. Author the HTML contract in post Markdown
5. Add visual contracts and spacing to `style.scss`

### Inline gallery specifics

- 1-2 images: standard grid
- 3+ images (or `data-layout="carousel"`): horizontal multi-visible strip with left/right controls
- Controls appear only when items overflow available width

## Code Highlighting

- **Renderer**: Shiki via CDN (post pages only, `#post` selector)
- **Theme**: `min-light`
- **Supported languages**: `go`, `javascript`, `typescript`, `bash`, `python`, `json`, `yaml`, `plaintext`
- **Fallback**: Server-rendered Rouge highlighting remains readable if CDN fails

Language normalization applies aliases and legacy rules before falling back to `plaintext`. See [DESIGN.md](../DESIGN.md) for the full normalization ruleset.

## Series

Group related posts with a consistent `series` value in frontmatter. The `_includes/preprocess_series.html` include handles series grouping on post pages. No special configuration needed — just keep the value identical.

## Devcontainer Workflow

### Starting

```bash
code .   # VS Code prompts "Reopen in Container"
```

### Daily use

| Action            | How                                    |
| ----------------- | -------------------------------------- |
| Write/edit posts  | Edit Markdown in `_posts/<category>/`  |
| Preview           | `make watch` → `http://localhost:4000` |
| Serve workspace   | `make serve-workspace` → port 7173     |
| Commit            | Standard git workflow inside container |
| Deploy            | Push to `main` → GitHub Pages auto-deploys |

### Never do locally

- `gem install`, `bundle install`, `rbenv` — container handles all deps
- `jekyll serve` outside container
- Any Node.js/npm toolchain for styles — Tailwind is CDN-only

## Common Gotchas

1. **`make new_post` creates at `_posts/` root.** Remember to move the file into a category subdirectory before publishing.

2. **`series` must match exactly.** "Go Patterns" and "go-patterns" are different series. Be consistent.

3. **Rich blocks need `style.scss` rules too.** The Preact island handles runtime behavior, but visual contracts (spacing, colors) live in `style.scss`. Both are needed.

4. **Drafts use same frontmatter as posts.** Don't strip fields when moving from `_drafts/` to `_posts/`.

5. **`highlighted: true` on too many posts** dilutes the index page. Reserve for genuine highlights.

6. **Shiki CDN only activates on `#post`.** Code blocks on listing pages, about, or garage use Rouge server-side highlighting only.

7. **DESIGN.md governs all visual changes.** New components, color changes, spacing adjustments must be registered there first. See Design Governance in [AGENTS.md](../AGENTS.md).

8. **Container ports:** Jekyll on 4000, workspace assets on 7173. Both are forwarded by devcontainer config.
