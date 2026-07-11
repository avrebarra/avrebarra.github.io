# avrebarra.github.io

Personal blog and website — Jekyll static site, hosted on GitHub Pages.

## Dependencies

| What you need       | Purpose                    | Install                                                                  |
| ------------------- | -------------------------- | ------------------------------------------------------------------------ |
| VS Code             | Editor + devcontainer host | [code.visualstudio.com](https://code.visualstudio.com/)                  |
| Docker              | Container runtime          | [docker.com](https://docker.com/)                                        |
| Dev Containers ext  | VS Code extension          | `ext install ms-vscode-remote.remote-containers`                         |

All runtime dependencies (Ruby, Jekyll, Bundler, gems) are handled by the devcontainer image — no local toolchain needed.

## Quick Start

```bash
# 1. Clone
git clone git@github.com:avrebarra/avrebarra.github.io.git
cd avrebarra.github.io

# 2. Open in devcontainer
code .                  # VS Code will prompt: "Reopen in Container"
                        # Or Cmd+Shift+P → "Dev Containers: Reopen in Container"

# 3. Start Jekyll (inside container terminal)
make watch              # Site served at http://localhost:4000
```

> **Never run `make watch` or Jekyll locally.** All development happens inside the devcontainer. Local Ruby/Jekyll/rbenv setup is unsupported.

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
| `.devcontainer/`    | Dev container configuration                             |

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
| Start dev server      | `make watch`            | Jekyll serve with live reload (port 4000)                   |
| Create new post stub  | `make new_post`         | Creates `_posts/YYYY-MM-DD-untitled.md`. Move to category.  |
| Serve workspace files | `make serve-workspace`  | Serves `workspace/` on port 7173                            |

**Creating a post:**
1. `make new_post` — creates stub in `_posts/` root
2. Move file into the appropriate category subdirectory
3. Edit frontmatter (title, tags, series, categories) and write content
4. Set `highlighted: true` to feature on index

See [docs/guides.md](docs/guides.md) for post conventions, rich blocks, and gotchas.

## No Test Suite

This is a static site with no backend logic — there is no test suite. Visual verification is done by running `make watch` and inspecting the rendered output.

## Future

Maintain the editorial design direction defined in [DESIGN.md](DESIGN.md). Expand rich block components as needed for post content.
