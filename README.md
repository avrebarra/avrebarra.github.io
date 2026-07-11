# avrebarra.github.io

Personal blog and website — Jekyll static site, hosted on GitHub Pages.

## Dependencies

| What you need | Purpose       | Install                                                   |
| ------------- | ------------- | --------------------------------------------------------- |
| Docker        | Container run | [docker.com](https://docker.com/)                         |

All runtime dependencies (Ruby, Jekyll, Bundler, gems) are bundled in the official `jekyll/jekyll` Docker image — no local toolchain needed.

## Quick Start

```bash
# 1. Clone
git clone git@github.com:avrebarra/avrebarra.github.io.git
cd avrebarra.github.io

# 2. Start Jekyll
make watch       # Site served at http://localhost:4000
```

## Structure

| Area                | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `_posts/`           | Published posts, organized by category subdirectory     |
| `_drafts/`          | Unpublished post drafts                                 |
| `_layouts/`         | Page/post HTML templates (default, post, page, landing) |
| `_includes/`        | Reusable HTML partials (header, footer, scripts, etc.)  |
| `_sass/`            | SCSS partials imported by `style.scss`                  |
| `pages/`            | Standalone pages (index, about, garage, posts, 404)     |
| `assets/js/`        | Preact runtime + island components for rich blocks      |
| `workspace/`        | Static workspace assets served on port 7173             |
| `openspec/`         | API spec files                                          |

### Post categories

| Directory                     | Content type              |
| ----------------------------- | ------------------------- |
| `_posts/journals/`            | Personal journal entries  |
| `_posts/learning-notes/`      | Technical learning notes  |
| `_posts/technicals-go/`       | Go-specific technical     |
| `_posts/thoughts/`            | Opinion pieces and essays |

## Workflow

| Task                  | Command                 | Notes                                                       |
| --------------------- | ----------------------- | ----------------------------------------------------------- |
| Start dev server      | `make watch`            | Jekyll serve via Docker (port 4000)                         |

**Creating a post:**
1. Create a file in the appropriate category subdirectory under `_posts/<category>/YYYY-MM-DD-slug.md`
2. Add frontmatter (title, date, tags, series, categories) and write content
3. Set `highlighted: true` to feature on index

See [docs/guides.md](docs/guides.md) for post conventions, rich blocks, and gotchas.

## No Test Suite

This is a static site with no backend logic — there is no test suite. Visual verification is done by running `make watch` and inspecting the rendered output.

## Future

Maintain the editorial design direction defined in [DESIGN.md](DESIGN.md). Expand rich block components as needed for post content.
