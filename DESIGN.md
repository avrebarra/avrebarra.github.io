---
version: beta
name: Avrebarra Blog Design System
description: Spacious editorial blog UI with fixed shell width, quiet hierarchy, and lintable design tokens for implementation.
colors:
  primary: "#171717"
  secondary: "#545454"
  tertiary: "#767676"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  surface-warm: "#FAF8F3"
  surface-warm-alt: "#F3F0EA"
  inline-code-bg: "#F3EFE8"
  border-soft: "#D7D0C6"
  border-quote: "#B9B0A3"
  selection: "#FCFC6F"
typography:
  display-xl:
    fontFamily: "Space Grotesk"
    fontSize: 2.4rem
    fontWeight: 700
    lineHeight: 1.05
  headline-lg:
    fontFamily: "Space Grotesk"
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.15
  headline-md:
    fontFamily: "IBM Plex Sans"
    fontSize: 1.2rem
    fontWeight: 600
    lineHeight: 1.35
  headline-sm:
    fontFamily: "IBM Plex Sans"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.45
  body-md:
    fontFamily: "IBM Plex Sans"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.95
  body-prose:
    fontFamily: "IBM Plex Sans"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 2
  label-sm:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.78rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0.08em
  brand-mark:
    fontFamily: Poppins
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.1
  code-inline:
    fontFamily: "IBM Plex Mono"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 3px
  md: 6px
  lg: 10px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 72px
  page-gutter: 32px
  section-gap: 32px
  section-gap-loose: 48px
  entry-gap: 40px
components:
  site-shell:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    width: 36rem
    padding: "{spacing.page-gutter}"
  page-surface:
    backgroundColor: "{colors.surface}"
  site-header:
    textColor: "{colors.primary}"
    typography: "{typography.headline-sm}"
  site-brand-mark:
    textColor: "{colors.primary}"
    typography: "{typography.brand-mark}"
  primary-nav-link:
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
  page-title-block:
    textColor: "{colors.primary}"
    typography: "{typography.display-xl}"
  section-label:
    textColor: "{colors.tertiary}"
    typography: "{typography.label-sm}"
  post-header:
    textColor: "{colors.primary}"
    typography: "{typography.headline-lg}"
  post-meta:
    textColor: "{colors.tertiary}"
    typography: "{typography.label-sm}"
  prose-content:
    textColor: "{colors.primary}"
    typography: "{typography.body-prose}"
  text-button:
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
  inline-code:
    backgroundColor: "{colors.inline-code-bg}"
    textColor: "{colors.primary}"
    typography: "{typography.code-inline}"
    rounded: "{rounded.sm}"
    padding: 2px
  paper-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
  blockquote:
    textColor: "{colors.secondary}"
  table-header:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.primary}"
  table-row-alt:
    backgroundColor: "{colors.surface-warm-alt}"
  social-icon-link:
    textColor: "{colors.primary}"
  prose-table-border:
    textColor: "{colors.border-soft}"
  prose-blockquote-accent:
    textColor: "{colors.border-quote}"
  prose-selection-highlight:
    backgroundColor: "{colors.selection}"
  form-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
---

# Design System

## Overview

The blog should retain its current centered shell width and responsiveness while shifting from a compact utility feel to a spacious editorial feel.
The target visual language is a white reading sheet with stronger headline authority, quieter metadata, and larger vertical rhythm between content groups.
The Avrebarra wordmark is a protected identity element and uses dedicated slightly bolder styling.
When a decision is not explicitly defined, prefer legibility, low visual noise, and consistent hierarchy over decorative variation.

## Colors

The palette remains neutral-first to protect long-form readability and maintain technical tone.

- Primary (#171717): Main text, primary headings, and high-emphasis anchors.
- Secondary (#545454): Supporting body labels and low-priority links.
- Tertiary (#767676): Utility metadata such as dates, series labels, and UI helper text.
- Neutral/Surface (#FFFFFF): Main shell and content surfaces.
- Warm surfaces (#FAF8F3, #F3F0EA): Gentle contrast for tables and prose support surfaces.
- Inline code background (#F3EFE8): Subtle token contrast for inline code semantics.
- Soft/quote borders (#D7D0C6, #B9B0A3): Low-noise linework for tables and blockquote accents.
- Selection (#FCFC6F): Text selection highlight.

Normative color values are the YAML tokens in front matter.

## Typography

Typography uses distinct roles for display, body, and utility text to create stronger contrast without widening the layout.

- Display role (`display-xl`): page anchors and top-level titles.
- Headline roles (`headline-lg`, `headline-md`, `headline-sm`): section and entry headings.
- Body roles (`body-md`, `body-prose`): reading text with high line-height.
- Label role (`label-sm`): utility metadata with tighter visual footprint.
- Code role (`code-inline`): monospace semantic cues for inline technical terms.

Font direction:

- Display headlines: Space Grotesk.
- Body copy and section headings: IBM Plex Sans.
- Utility labels and code semantics: IBM Plex Mono.
- Brand wordmark: keep Poppins with a dedicated medium-bold weight (600) as an invariant.

Normative typography levels are defined in the YAML token map.

## Layout

The layout remains single-column and centered with the same shell geometry.

- Main shell width remains fixed to the current readable max width (`36rem`).
- Existing responsive behavior remains unchanged.
- Spaciousness comes from vertical rhythm (`section-gap`, `section-gap-loose`, `entry-gap`) and stronger hierarchy.
- Tailwind CDN utilities remain the default implementation layer for layout and spacing in templates.

Overall visual layout hierarchy:

```text
Canvas
└── Site shell (same width as current)
    ├── Header (brand + quiet utility nav)
    ├── Title block (strong display title + muted metadata)
    ├── Main content sections
    │   ├── Section label / eyebrow
    │   ├── Entry heading
    │   └── Body content
    └── Footer (minimal utility signature)
```

Spacing guidance:

- Header to page title: 32-48px.
- Title to metadata and lead text: 16-24px.
- Metadata to first content section: about 32px.
- Post title block to body start: about 32px.
- Section to section: 48px baseline.
- Standalone entry-to-entry rhythm for About/Garage: about 40px.

## Elevation & Depth

Depth is intentionally minimal.

- No heavy shadows for core page surfaces.
- Hierarchy is communicated by spacing, contrast, and type role differences.
- Cards are optional grouping tools, not primary visual structure.
- Prose affordances rely on tonal contrast instead of raised surfaces.

## Shapes

Shape language remains subtle and restrained.

- Most surfaces remain square to softly rounded.
- Inline code and media affordances use small radii.
- Large pill radii are reserved for explicit utility controls only.

## Components

Approved components include active surfaces and reserved utility patterns needed for consistent rollout.

| ID                      | Purpose                  | Primary Location                         | Notes                                            |
| ----------------------- | ------------------------ | ---------------------------------------- | ------------------------------------------------ |
| cmp-site-shell          | Centered page frame      | \_layouts/default.html                   | Keeps current max width and responsiveness       |
| cmp-site-header         | Brand and utility nav    | \_includes/header.html                   | Quiet utility navigation style                   |
| cmp-site-brand-mark     | Protected wordmark style | \_includes/header.html                   | Keeps existing logo family with fixed 600 weight |
| cmp-primary-nav-link    | Header nav item          | \_includes/header.html                   | Monospace utility tone                           |
| cmp-page-title-block    | Page title anchor        | \_layouts/post.html, \_layouts/page.html | Display-first title hierarchy                    |
| cmp-post-header         | Post title block         | \_layouts/post.html                      | Stronger title presence than compact baseline    |
| cmp-post-meta           | Post metadata row        | \_layouts/post.html                      | Muted metadata rhythm                            |
| cmp-prose-content       | Rich content wrapper     | \_layouts/post.html, \_layouts/page.html | Long-form readability with calmer rhythm         |
| cmp-series-filter-bar   | Series filter controls   | pages/posts.html                         | Understated utility controls                     |
| cmp-post-list-row       | Filterable posts row     | pages/posts.html                         | Fast scanning with cleaner spacing               |
| cmp-about-me-experience | About experience entry   | pages/about.html                         | Editorial grouping for biography and experience  |
| cmp-project-entry       | Garage project entry     | pages/garage.html                        | Curated project-entry grouping                   |
| cmp-paper-panel         | Optional grouped surface | standalone pages                         | Reserved for minimal grouping only               |
| cmp-text-button         | Utility action style     | filters and small actions                | Text-first, not CTA-heavy                        |
| cmp-form-field          | Input baseline           | future forms                             | Included for system completeness                 |

Page guidance:

- Posts: strengthen title and metadata separation, preserve long-form reading comfort, and keep post-header-to-body spacing near 32px.
- Posts listing: maintain scan speed, soften utility controls, avoid cardification.
- About: organize content as editorial entries with approximately 40px row gaps and short transcript lines that swap to full detail when expanded.
- Garage: separate title, summary, and links into consistently spaced entry blocks.

### Code Highlighting Profile

- Renderer path: Shiki via CDN on post pages (`#post`) is an approved quality-first highlighting path.
- Theme (initial rollout): `min-light`.
- Supported languages (initial rollout): `go`, `javascript`, `typescript`, `bash`, `python`, `json`, `yaml`, `plaintext`.

Language normalization ruleset format:

- **Aliases**: direct map from observed label to canonical language.
- **Legacy rules**: ordered list of conservative mappings with fields:
  - `id`: stable identifier
  - `from`: source canonical language after alias resolution
  - `to`: target canonical language
  - `pattern`: regex that matches characteristic code text

Normalization flow:

1. Extract raw language label from rendered block.
2. Resolve through alias map.
3. Apply first matching legacy rule.
4. If unsupported, fall back to `plaintext`.

## Do's and Don'ts

- Do use Tailwind CDN utilities first for layout, spacing, typography, and visibility.
- Do keep prose-specific CSS exceptions limited to content readability concerns.
- Do preserve the white, spacious editorial baseline when modifying templates.
- Do preserve current shell width and responsiveness while changing internal rhythm.
- Do keep metadata visually quieter than headlines and body content.
- Do keep the Avrebarra wordmark font family unchanged and weight fixed at 600.
- Do keep code block token coloring renderer-managed (Shiki CDN is allowed for post pages).
- Do keep fallback-safe behavior so server-rendered code remains readable if CDN loading fails.
- Do add every new component to this file before implementation.
- Don't introduce a local Tailwind build pipeline for this blog.
- Don't widen the shell to fake spaciousness.
- Don't reintroduce compact utility density on About and Garage.
- Don't retune the Avrebarra wordmark weight away from the fixed 600 baseline.
- Don't add new visual variants that are not represented in the token map or approved component list.
- Don't reintroduce custom token-level syntax highlight palettes.

## Governance

This document is the canonical UI reference for the repository and the canonical design contract for this project.

### Component Addition Workflow

Before implementing a new component:

1. Add the component to the Components section with a stable ID and usage notes.
2. Add or reference required design tokens in YAML front matter.
3. Validate visual fit against the white, spacious editorial direction.
4. Implement only after steps 1-3 are complete.

### Design Update Policy

- **Design-document authority**: If implementation and this document conflict, update this document first.
- **Confirmation required**: Any update to this document must be explicitly confirmed by the user in chat before edits are made.
- **Blocking validation**: Every edit to this document must pass the command `npx @google/design.md lint DESIGN.md` before the change is considered complete. Changes are blocked until lint validation passes.
- **Scope**: This governance policy applies to DESIGN.md only.

## Technical Roadmap

1. Rewrite and validate `DESIGN.md` using `npx @google/design.md lint DESIGN.md` as the mandatory contract gate before this change is complete.
2. Update shared typography imports and base style rules.
3. Apply shared shell and heading rhythm adjustments in layouts/includes.
4. Roll out post, listing, About, and Garage surface updates.
5. Verify responsive behavior remains unchanged while hierarchy improves.

## Pseudocode Structure

```html
<main class="site-shell same-geometry-as-current">
  <header class="site-header utility-nav">...</header>

  <section class="page-title-block">
    <p class="section-label">utility metadata</p>
    <h1 class="display-title">primary heading</h1>
    <p class="post-meta">date / series / reading info</p>
  </section>

  <article class="prose-content">
    <section class="entry-group spacious-rhythm">...</section>
  </article>

  <footer class="site-footer">...</footer>
</main>
```

## Audit Snapshot

Templates audited for this baseline:

- \_layouts/default.html
- \_layouts/post.html
- \_layouts/page.html
- \_includes/header.html
- \_includes/footer.html
- pages/index.html
- pages/posts.html
- pages/about.html
- pages/garage.html
- pages/404.html

Current baseline summary:

- Layout and most presentation rules remain utility-driven.
- Refresh work focuses on typography and spacing, not shell geometry.
- Code syntax coloration remains renderer-managed by default behavior.
