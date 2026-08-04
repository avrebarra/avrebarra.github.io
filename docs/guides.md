# Guides

## Creating a Post

### Scaffold

Create a file under the appropriate category subdirectory:

- `_posts/journals/` — personal journal
- `_posts/technicals/` — technical how-to and deep dives
- `_posts/thoughts/` — opinion pieces and essays

## Content Structure: Tags vs Categories vs Series

Three distinct axes describe a post. They never overlap — each answers a different question.

| Axis           | Answers                             | Example                                 | Lives in                  |
| -------------- | ----------------------------------- | --------------------------------------- | ------------------------- |
| **Tags**       | What is this post _about_? (topics) | `golang`, `concurrency`, `debugging`    | `tags:` frontmatter       |
| **Categories** | Which _bucket_ does it live in?     | `journals/`, `technicals/`, `thoughts/` | Directory under `_posts/` |
| **Series**     | Which _activity_ does it belong to? | `War Stories`, `Unnoticed Fundamentals` | `series:` frontmatter     |

Rules:

- A post has exactly one category (its folder). Categories are buckets, not topics.
- A post can have many tags. Tags describe content, never structure.
- A series is an **activity**, not a category mirror. `Golang`, `Thoughts`, `Journals` are categories — never use them as series values.
- A series groups posts across categories. A project journey is a series; a category echo is not.
- A post belongs to at most one series. If a post is not part of an activity, leave `series` blank.

### Series contract

When a post belongs to an activity series, use both fields:

```yaml
series: War Stories # activity name, consistent across parts
series_order: 2 # narrative position (1 = first part)
```

- `series` must be identical across all parts (case-sensitive).
- `series_order` gives narrative order independent of publish dates — you may publish part 4 before part 2 is finished.
- The post layout renders the part badge (`Series · Part N of M`) and prev/next navigation automatically when `series` is set.

### Frontmatter

```yaml
---
layout: post
title: Post Title Here
date: YYYY-MM-DD HH:MM:SS +0000
highlighted: false # true = featured on index page
tags: []
series: Series Name # activity; leave blank if standalone
series_order: 1 # narrative position; only when series is set
---
```

## Rich Blocks

Rich blocks are authored as inline HTML with `data-rich-block` attributes. They are static-first (render without JS) and enhanced by Preact islands at runtime.

### Available blocks

| Block          | Attribute                          | Behavior                           |
| -------------- | ---------------------------------- | ---------------------------------- |
| Quote          | `data-rich-block="quote"`          | Warm-accent styled callout         |
| Headline image | `data-rich-block="headline-image"` | Click-to-open full-size in new tab |
| Inline gallery | `data-rich-block="inline-gallery"` | Grid (1-2 images), carousel (3+)   |
| Download card  | `data-rich-block="download"`       | File download tile (row of cards)  |

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

## Common Gotchas

1. **`series` must match exactly.** "Go Patterns" and "go-patterns" are different series. Be consistent.

2. **`series` is an activity, not a category.** Don't set `series: Thoughts` or `series: Golang` — those are categories. Use real activity names (`War Stories`, `Unnoticed Fundamentals`).

3. **Rich blocks need `style.scss` rules too.** The Preact island handles runtime behavior, but visual contracts (spacing, colors) live in `style.scss`. Both are needed.

4. **Drafts use same frontmatter as posts.** Don't strip fields when moving from `_drafts/` to `_posts/`.

5. **`highlighted: true` on too many posts** dilutes the index page. Reserve for genuine highlights.

6. **Shiki CDN only activates on `#post`.** Code blocks on listing pages, about, or garage use Rouge server-side highlighting only.

7. **DESIGN.md governs all visual changes.** New components, color changes, spacing adjustments must be registered there first. See Design Governance in [AGENTS.md](../AGENTS.md).
