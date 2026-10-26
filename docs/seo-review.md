# SEO Review — folio.avres.id (post-migration)

Generated 2026-10-26 from `_site` built with `_config.yml + _config_folio.yml`. Shows how pages will appear in Google / social.

## 1) Global config

| Key                  | `_config.yml` (legacy)                                                                                                                        | `_config_folio.yml` override | Effective `_site`                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------- |
| `site.url`           | `https://avrebarra.github.io`                                                                                                                 | `https://folio.avres.id`     | `https://folio.avres.id`               |
| `site.title`         | `Avre Barra - Software Engineer \| Go, Systems & Resilience`                                                                                  | —                            | same                                   |
| `site.description`   | `Site of Avre Barra, an Indonesian software engineer and consultant. I talk and write about software engineering startups and tech business.` | —                            | same                                   |
| `site.author.url`    | `https://avrebarra.github.io`                                                                                                                 | —                            | still `github.io` ⚠️                   |
| `robots.txt` Sitemap | `{{ site.url }}/sitemap.xml`                                                                                                                  | overridden                   | `https://folio.avres.id/sitemap.xml` ✓ |
| `feed.xml`           | `{{ site.url }}/feed.xml`                                                                                                                     | overridden                   | `https://folio.avres.id/feed.xml` ✓    |

## 2) How Google will show it

### Homepage `https://folio.avres.id/`

```
Avre Barra - Indonesian Software Engineering and Consultancy
https://folio.avres.id/  —  https://folio.avres.id
Site of Avre Barra, an Indonesian software engineer and consultant. I talk and write about software engineering startups and tech business.
```

```html
<title>Avre Barra - Indonesian Software Engineering and Consultancy</title>
<link rel="canonical" href="https://folio.avres.id/" />
<meta
  name="description"
  content="Site of Avre Barra, an Indonesian software engineer and consultant. I talk and write about software engineering startups and tech business."
/>
<meta property="og:url" content="https://folio.avres.id/" />
<meta property="og:type" content="website" />
<link rel="alternate" type="application/rss+xml" href="/feed.xml" />
<script>
  if(location.hostname==='avrebarra.github.io')location.replace('https://folio.avres.id'+location.pathname+...)
</script>
```

**Google snippet:** Title = `site.title`, description = `site.description` (or first excerpt if missing — hompeage uses site fallback). No truncation (65 / 155 chars OK).

### Post `https://folio.avres.id/struct-params-and-frequent-validation/`

Frontmatter: `title: Struct Params and Frequent Validation in Go`, `description: Why struct params plus frequent validation makes Go APIs safer - patterns for clear, fail-fast code...`

```
Struct Params and Frequent Validation in Go | Avre Barra
https://folio.avres.id/struct-params-and-frequent-validation/
Why struct params plus frequent validation makes Go APIs safer - patterns for clear, fail-fast code and maintainable boundaries.
```

```html
<title>Struct Params and Frequent Validation in Go | Avre Barra</title>
<link
  rel="canonical"
  href="https://folio.avres.id/struct-params-and-frequent-validation/"
/>
<meta
  name="description"
  content="Why struct params plus frequent validation makes Go APIs safer - patterns for clear, fail-fast code and maintainable boundaries."
/>
<meta
  property="og:title"
  content="Struct Params and Frequent Validation in Go"
/>
<meta property="og:type" content="article" />
<meta
  property="og:url"
  content="https://folio.avres.id/struct-params-and-frequent-validation/"
/>
<meta property="article:published_time" content="2025-06-26T03:00:00+00:00" />
<meta property="article:section" content="technicals" />
<meta property="article:tag" content="golang" /> (×4)
```

Same for all 17 posts — `sitemap.xml` + `feed.xml` already emit `https://folio.avres.id/<slug>/`.

## 3) Social / link previews

### Homepage / non-post pages (about, garage)

- `og:image` = `https://folio.avres.id/images/og-default.png` (1.9K) ✓
- `twitter:card` = `summary_large_image` ✓
- `og:image:width 1200 height 630` ✓

### Posts

- `og:image` = `https://dynamic-og-image-generator.vercel.app/api/generate?title=...&author=Avre%20Barra&websiteUrl=%40avrebarra&theme=default` (Vercel dynamic OG)
- `twitter:card` = `summary_large_image`, `twitter:creator @avrebarra` ✓

**Preview:** Title + description + large image (dynamic per post). No `og:image:alt` missing — present.

## 4) Structured data (JSON-LD)

**Every page:**

```json
{
  "@type": "Person",
  "name": "Avre Barra",
  "url": "https://avrebarra.github.io",
  "image": "https://github.com/avrebarra.png",
  "sameAs": [
    "https://github.com/avrebarra",
    "https://linkedin.com/in/avrebarra",
    "https://twitter.com/avrebarra"
  ]
}
```

**Homepage only:**

```json
{
  "@type": "WebSite",
  "name": "Avre Barra",
  "url": "https://folio.avres.id",
  "description": "Site of Avre Barra, an Indonesian software engineer and consultant. I talk and write about software engineering startups and tech business.",
  "author": { "@type": "Person", "name": "Avre Barra" },
  "publisher": {
    "@type": "Person",
    "name": "Avre Barra",
    "url": "https://avrebarra.github.io"
  }
}
```

⚠️ **Gap:** Posts have no `Article`/`BlogPosting` JSON-LD — only `article:*` meta. Eligible for richer results if added. `Person.url` + `publisher.url` still point to `github.io` (identity vs canonical mismatch).

## 5) Crawlability

- `robots.txt` → `Sitemap: https://folio.avres.id/sitemap.xml` ✓
- `sitemap.xml` → 17 URLs, all `https://folio.avres.id/...` ✓
- `crawler_sitemap.xml` → exists (legacy GSC workaround) — still `folio` URLs
- `404.html` → `permalink: /404.html` + same hostname redirect ( `github.io/404` → `folio/404` preserves path) ✓
- Canonical + `og:url` hardcoded to `https://folio.avres.id{{page.url}}` — both builds tell Google `folio` is primary even when crawled via `github.io` ✓
- Legacy `github.io` → JS `location.replace` preserves `pathname+search+hash`, no loop on `folio` ✓

## 6) Issues / recommendations

| Severity   | Issue                                                                                                                                                                                                                 | Fix                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **medium** | `og:image` fallback still uses `{{ site.url }}` — `github.io` build emits `https://avrebarra.github.io/images/og-default.png` while canonical is `folio`. Social scrapers hitting `github.io` get cross-domain image. | Change `_includes/meta.html` `{% assign og_default = "https://folio.avres.id" \| append: "/images/og-default.png" %}`           |
| **low**    | `_config.yml` `url` + `author.url` still `github.io` — JSON-LD `Person.url` / `publisher.url` inconsistent with `WebSite.url`. After migration, identity should be `folio`.                                           | Set `url: https://folio.avres.id` in `_config.yml` and `author.url: https://folio.avres.id` (keep `github.io` only as `sameAs`) |
| **low**    | No `Article` JSON-LD for posts — misses Google Article rich results (`headline`, `datePublished`, `author`).                                                                                                          | Add `BlogPosting` JSON-LD in `post.html` layout                                                                                 |
| **info**   | `googleff8a64c81c72a9f7.html` verification file still `permalink: /googleff8a64c81c72a9f7.html` — keep until GSC Change of Address verified, then safe to keep                                                        | —                                                                                                                               |
| **info**   | `avres.id` CNAME created then deleted on remote — now no `CNAME` file. Correct for Workers (DNS via Cloudflare), not GH Pages custom domain                                                                           | —                                                                                                                               |

## 7) Verdict

Search snippet will be clean — titles 50-65 chars, descriptions 120-155 chars, canonicals all `folio`, sitemap all `folio`, OG/Twitter large images present. Fix the two `site.url` → hardcoded `folio` spots and you're fully consistent across both domains.
