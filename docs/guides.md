# Guides

## Creating a Post

### Scaffold

Create a file under the appropriate category subdirectory:
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

## Common Gotchas

1. **`series` must match exactly.** "Go Patterns" and "go-patterns" are different series. Be consistent.

2. **Rich blocks need `style.scss` rules too.** The Preact island handles runtime behavior, but visual contracts (spacing, colors) live in `style.scss`. Both are needed.

3. **Drafts use same frontmatter as posts.** Don't strip fields when moving from `_drafts/` to `_posts/`.

4. **`highlighted: true` on too many posts** dilutes the index page. Reserve for genuine highlights.

5. **Shiki CDN only activates on `#post`.** Code blocks on listing pages, about, or garage use Rouge server-side highlighting only.

6. **DESIGN.md governs all visual changes.** New components, color changes, spacing adjustments must be registered there first. See Design Governance in [AGENTS.md](../AGENTS.md).
