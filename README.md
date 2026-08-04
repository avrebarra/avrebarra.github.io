# avrebarra.github.io

Personal blog and website — Jekyll static site, hosted on GitHub Pages.

## Dependencies

| What you need | Purpose       | Install                           |
| ------------- | ------------- | --------------------------------- |
| Docker        | Container run | [docker.com](https://docker.com/) |
| Node 20+      | Prettier lint | [nodejs.org](https://nodejs.org/) |

All runtime dependencies (Ruby, Jekyll, Bundler, gems) are bundled in the official `jekyll/jekyll` Docker image — no local toolchain needed. Node is only required for the prettier formatting checks.

## Quick Start

```bash
# 1. Clone
git clone git@github.com:avrebarra/avrebarra.github.io.git
cd avrebarra.github.io

# 2. Install lint tooling
npm install

# 3. Start Jekyll
./runtask watch       # Site served at http://localhost:4000
```

## Structure

| Area         | Purpose                                                 |
| ------------ | ------------------------------------------------------- |
| `_posts/`    | Published posts, organized by category subdirectory     |
| `_drafts/`   | Unpublished post drafts                                 |
| `_layouts/`  | Page/post HTML templates (default, post, page, landing) |
| `_includes/` | Reusable HTML partials (header, footer, scripts, etc.)  |
| `_sass/`     | SCSS partials imported by `style.scss`                  |
| `pages/`     | Standalone pages (index, about, garage, posts, 404)     |
| `assets/js/` | Preact runtime + island components for rich blocks      |
| `workspace/` | Static workspace assets served on port 7173             |
| `openspec/`  | API spec files                                          |

### Post categories

| Directory            | Content type                    |
| -------------------- | ------------------------------- |
| `_posts/journals/`   | Personal journal entries        |
| `_posts/technicals/` | Technical how-to and deep dives |
| `_posts/thoughts/`   | Opinion pieces and essays       |

## Workflow

| Task             | Command            | Notes                                        |
| ---------------- | ------------------ | -------------------------------------------- |
| Start dev server | `./runtask watch`  | Jekyll serve via Docker (port 4000)          |
| Check formatting | `./runtask lint`   | Prettier `--check` — mandatory before any PR |
| Auto-fix format  | `./runtask format` | Prettier `--write`                           |

**Creating a post:**

1. Create a file in the appropriate category subdirectory under `_posts/<category>/YYYY-MM-DD-slug.md`
2. Add frontmatter (title, date, tags, series) and write content
3. Set `highlighted: true` to feature on index
4. For activity series, set `series: <activity>` + `series_order: <n>` (see [docs/guides.md](docs/guides.md#content-structure-tags-vs-categories-vs-series))

See [docs/guides.md](docs/guides.md) for post conventions, rich blocks, and gotchas.

## No Test Suite

This is a static site with no backend logic — there is no test suite. Visual verification is done by running `./runtask watch` and inspecting the rendered output.

## Future

Maintain the editorial design direction defined in [DESIGN.md](DESIGN.md). Expand rich block components as needed for post content.
