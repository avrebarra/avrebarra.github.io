---
version: alpha
name: Avrebarra Blog Design System
description: White, clean, compact blog UI with Tailwind CDN utilities and tightly scoped prose exceptions.
colors:
  primary: "#1F2937"
  secondary: "#6B7280"
  tertiary: "#374151"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  surface-warm: "#FEF9F0"
  surface-warm-alt: "#FDFAF5"
  inline-code-bg: "#F5F0E8"
  border-soft: "#E0D8CC"
  border-quote: "#D0C8B8"
  selection: "#FCFC6F"
typography:
  headline-lg:
    fontFamily: Poppins
    fontSize: 2.25rem
    fontWeight: 800
    lineHeight: 1.2
  headline-md:
    fontFamily: Poppins
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
  headline-sm:
    fontFamily: Poppins
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Poppins
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.9
  body-prose:
    fontFamily: Poppins
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 2.1
  label-sm:
    fontFamily: Poppins
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.4
  code-inline:
    fontFamily: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: 0px
  sm: 3px
  md: 4px
  lg: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  page-gutter: 32px
  section-gap: 16px
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
    typography: "{typography.headline-md}"
  primary-nav-link:
    textColor: "{colors.tertiary}"
    typography: "{typography.body-md}"
  post-header:
    textColor: "{colors.primary}"
    typography: "{typography.headline-md}"
  post-meta:
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
  prose-content:
    textColor: "{colors.primary}"
    typography: "{typography.body-prose}"
  inline-code:
    backgroundColor: "{colors.inline-code-bg}"
    textColor: "{colors.primary}"
    typography: "{typography.code-inline}"
    rounded: "{rounded.sm}"
    padding: 2px
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
---

# Design System

## Overview

The blog should feel white, clean, and compact while staying readable for long-form technical writing.
The visual tone is calm and practical: minimal decorative UI, strong content hierarchy, and lightweight page chrome.
When a UI decision is not explicitly defined, prefer lower visual noise, higher legibility, and consistency with existing pages.

## Colors

The palette is primarily neutral with subtle warm surfaces for prose artifacts.

- Primary (#1F2937): Core text and high-emphasis UI labels.
- Secondary (#6B7280): Metadata, supporting text, and secondary UI states.
- Tertiary (#374151): Mid-emphasis text and utility accents.
- Neutral/Surface (#FFFFFF): Main page and content surfaces.
- Warm surfaces (#FEF9F0, #FDFAF5): Table and prose support surfaces.
- Selection (#FCFC6F): Text selection highlight.

Normative color values are the YAML tokens in front matter.

## Typography

Typography is systemized around Poppins for UI and prose, with monospace reserved for code semantics.

- Headlines: Poppins 600-800 with compact line-height.
- Body: Poppins regular with high readability line-height for long articles.
- Labels/meta: Smaller Poppins sizes for secondary information.
- Inline code: Monospace stack for technical precision.

Normative typography levels are defined in the YAML token map.

## Layout

The layout is single-column, centered, and compact:

- Main shell width is fixed to a readable max width.
- Horizontal page gutters are consistent.
- Spacing scale follows named tokens from xs to xl with consistent section gaps.
- Tailwind CDN utility classes are the default implementation mechanism for layout and spacing decisions.

## Elevation & Depth

Depth is intentionally minimal.

- No heavy shadows are required for core layout.
- Hierarchy is communicated through spacing, typography, and text contrast.
- Prose affordances (tables, blockquotes, code spans) use tonal contrast instead of elevated cards.

## Shapes

Shape language remains subtle and restrained.

- Most surfaces are square or minimally rounded.
- Inline code and image treatments use small radii.
- Full pill radii are reserved for specialized components if introduced and documented.

## Components

Approved components in active use are listed below. These components are controlled through the YAML tokens and the governance rules in this document.

| ID                       | Purpose                      | Primary Location                                                             | Notes                                       |
| ------------------------ | ---------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------- |
| cmp-site-shell           | Centered page frame          | \_layouts/default.html                                                       | Single-column readable shell                |
| cmp-site-header          | Brand and top nav            | \_includes/header.html                                                       | Title plus section links                    |
| cmp-primary-nav-link     | Header navigation item       | \_includes/header.html                                                       | Utility-first text links                    |
| cmp-site-footer          | Footer signature and socials | \_includes/footer.html                                                       | Compact metadata footer                     |
| cmp-social-icon-link     | Social icon anchor           | \_includes/footer.html                                                       | Uses shake animation behavior               |
| cmp-post-header          | Post title block             | \_layouts/post.html                                                          | Primary content entry point                 |
| cmp-post-meta            | Date, series, reading info   | \_layouts/post.html                                                          | Secondary text hierarchy                    |
| cmp-prose-content        | Rich content wrapper         | \_layouts/post.html, \_layouts/page.html, pages/index.html, pages/posts.html | Prose-oriented exception styles             |
| cmp-highlighted-post-row | Highlighted home list row    | pages/index.html                                                             | Lightweight arrow/list pattern              |
| cmp-series-filter-bar    | Series filter controls       | pages/posts.html                                                             | Script-backed view filter                   |
| cmp-post-list-row        | Filterable posts row         | pages/posts.html                                                             | Metadata plus one-line title                |
| cmp-project-entry        | Garage project row           | pages/garage.html                                                            | Repeated compact project blocks             |
| cmp-experience-entry     | About experience block       | pages/about.html                                                             | Custom element with scoped prose compaction |

## Do's and Don'ts

- Do use Tailwind CDN utilities first for layout, spacing, typography, and visibility.
- Do keep prose-specific CSS exceptions limited to content readability concerns.
- Do preserve the white, clean, compact baseline when modifying templates.
- Do keep code block token coloring under renderer defaults, not custom syntax overrides.
- Do add every new component to this file before implementation.
- Don't introduce a local Tailwind build pipeline for this blog.
- Don't add new visual variants that are not represented in the token map or approved component list.
- Don't reintroduce custom token-level syntax highlight palettes.

## Governance

This document is the canonical UI reference for the repository.

Before implementing a new component:

1. Add the component to the Components section with a stable ID and usage notes.
2. Add or reference required design tokens in YAML front matter.
3. Validate visual fit against the white, clean, compact direction.
4. Implement only after steps 1-3 are complete.

If implementation and this document conflict, update this document first.

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

- Layout and most presentation rules are utility-driven.
- Custom CSS is restricted to documented prose and interaction exceptions.
- Code syntax coloration is renderer-managed by default behavior.
