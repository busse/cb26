# Gnome Workplace

This document is the canonical reference for **Gnomes** -- autonomous AI agent sessions that operate on this repository. If you are a Gnome, read this entire document before starting your Job.

## Workplace Overview

This repo (`cb26`) is the source for **Chris Busse's personal site** at [chrisbusse.com](https://www.chrisbusse.com). It is a content-heavy professional writing site with long-form posts, a photo gallery, and a speaking archive.

**Tech stack:** Astro 6, TypeScript, Cloudflare Workers (via `@astrojs/cloudflare`), Zod content schemas, `@astrojs/sitemap`, `@astrojs/rss`.

**Who reads this document:** Gnomes (Claude Cowork Task sessions), Cursor agent sessions, and Claude Code sessions operating in this repo. Human collaborators may also reference it but are not bound by its Boundaries.

---

## Directory Map

```
cb26/
├── src/
│   ├── content/             # PRIMARY WORK SURFACE for content Gnomes
│   │   ├── posts/           # Long-form articles (*.md)
│   │   ├── photos/          # Photo gallery entries (*.md)
│   │   └── talks/           # Speaking engagements (*.md)
│   ├── content.config.ts    # Zod schema source of truth (see Content Collections below)
│   ├── pages/               # File-based routes (off-limits to content Gnomes)
│   ├── layouts/             # Page layouts (off-limits to content Gnomes)
│   ├── components/          # UI components (off-limits to content Gnomes)
│   ├── data/
│   │   ├── site.ts          # Site config: title, author, tagline, nav, social links
│   │   └── blogroll.ts      # Blogroll data
│   └── styles/              # CSS (off-limits to content Gnomes)
├── public/
│   └── photos/              # Full-size photo assets (*.jpg)
│       └── thumbs/          # Thumbnail versions (800px)
├── scripts/
│   └── process-photo.sh     # macOS photo ingestion pipeline (sips/mdls)
├── inbox/                   # Staging area for incoming files (not committed)
├── archive-pass0/           # Historical snapshot #1 (Jekyll/al-folio) -- READ ONLY
├── archive-pass1/           # Historical snapshot #2 (Jekyll + prior Astro) -- READ ONLY
├── GNOMES.md                # This file
├── CLAUDE.md                # Standing instructions for all Claude sessions
├── README.md                # Human-facing project README
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies and scripts
├── wrangler.jsonc            # Cloudflare Workers config
└── tsconfig.json            # TypeScript config
```

---

## Content Collections

All content lives in `src/content/` as Markdown files with YAML frontmatter. Schemas are defined in `src/content.config.ts` using Zod. The full schema is reproduced below so you have it without needing to read that file.

### Schema Source (from `src/content.config.ts`)

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const paceLayerEnum = z.enum([
  "fashion",
  "commerce",
  "infrastructure",
  "governance",
  "culture",
  "nature",
]);

const paceLayerAnnotation = z.object({
  layer: paceLayerEnum,
  rationale: z.string(),
});

const paceLayers = z.array(paceLayerAnnotation).default([]);

const categoryEnum = z.enum([
  "analysis",
  "essay",
  "observation",
  "reference",
]);

const aiMetadata = z.object({
  assisted: z.boolean(),
  tools: z.array(z.string()).default([]),
  role: z.enum(["research", "drafting", "editing", "pair-writing"]).optional(),
  process: z.string().optional(),
}).default({ assisted: false, tools: [] });

const baseMeta = {
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  category: categoryEnum.optional(),
  ai: aiMetadata,
  paceLayers,
};

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    ...baseMeta,
    featured: z.boolean().default(false),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    ...baseMeta,
    event: z.string(),
    location: z.string(),
  }),
});

const photoImage = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const photos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photos" }),
  schema: z.object({
    ...baseMeta,
    featured: z.boolean().default(false),
    image: z.string(),
    alt: z.string(),
    images: z.array(photoImage).default([]),
    location: z.string().optional(),
  }),
});

export const collections = { posts, talks, photos };
```

### Shared Fields (`baseMeta`)

These fields appear on all three collections:

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `title` | `string` | yes | -- | |
| `date` | `Date` (coerced) | yes | -- | Accepts date strings like `2026-04-05` |
| `description` | `string` | yes | -- | Used for cards and meta tags |
| `tags` | `string[]` | no | `[]` | Free-form; normalized to lowercase at render |
| `draft` | `boolean` | no | `false` | Drafts excluded from production builds |
| `category` | `enum` | no | -- | `analysis` \| `essay` \| `observation` \| `reference` |
| `ai` | `object` | no | `{ assisted: false, tools: [] }` | See AI Metadata below |
| `paceLayers` | `array` | no | `[]` | See Pace Layers below |

### AI Metadata (`ai`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `assisted` | `boolean` | yes | Whether AI assisted in creating this content |
| `tools` | `string[]` | no | Names of AI tools used (e.g., `["Claude"]`) |
| `role` | `enum` | no | `research` \| `drafting` \| `editing` \| `pair-writing` |
| `process` | `string` | no | Free-text description of how AI was used |

### Pace Layers

Based on Stewart Brand's pace layer framework. Each annotation is an object with:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `layer` | `enum` | yes | `fashion` \| `commerce` \| `infrastructure` \| `governance` \| `culture` \| `nature` |
| `rationale` | `string` | yes | Why this layer applies to the content |

### Collection: `posts`

Additional fields beyond `baseMeta`:

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `featured` | `boolean` | no | `false` |

Files: `src/content/posts/*.md`

### Collection: `talks`

Additional fields beyond `baseMeta`:

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `event` | `string` | yes | -- |
| `location` | `string` | yes | -- |

Files: `src/content/talks/*.md`

### Collection: `photos`

Additional fields beyond `baseMeta`:

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `featured` | `boolean` | no | `false` | |
| `image` | `string` | yes | -- | URL path to primary image (e.g., `/photos/slug.jpg`) |
| `alt` | `string` | yes | -- | Alt text for accessibility |
| `images` | `array` | no | `[]` | Additional images for comparison/series pages |
| `location` | `string` | no | -- | Where the photo was taken |

Each entry in `images[]`:

| Field | Type | Required |
|-------|------|----------|
| `src` | `string` | yes |
| `alt` | `string` | yes |
| `caption` | `string` | no |

Files: `src/content/photos/*.md`

---

## Conventions

### Filenames

- **Photos** use `YYMM-location-descriptor.md` when a date/location is known (e.g., `2411-savannah-alley-1.md`, `1806-philly-navy-yard.md`). Descriptive slugs are also used (e.g., `stacks-comparison.md`).
- **Posts** use descriptive slugs (e.g., `rad-is-back.md`, `iran-war-playbook.md`).
- **Talks** use `YYYY-event-name.md` (e.g., `2026-rvatech-data-summit.md`).

### Draft Workflow

- Photos scaffolded by `scripts/process-photo.sh` arrive as `draft: true`. Gnomes should **not** flip draft status unless their Job explicitly requires it.
- Posts and talks may also be in draft. Respect the existing `draft` value unless your Job says otherwise.

### Tags

Free-form strings. Rendered as lowercase on the site. Use existing tags when applicable rather than inventing new ones.

### Pace Layers

Every pace layer annotation requires a `rationale` string explaining *why* that layer applies to the content. Do not assign a layer without a rationale.

### AI Metadata

When a Gnome modifies content, it should set `ai.assisted: true` and include its tool name in `ai.tools` (e.g., `["Claude"]`). Set `ai.role` to the most appropriate value for the work performed. Optionally describe the process in `ai.process`.

### Commit Messages

Gnomes use the format: `GNOME_{HANDLE}: description of change`

Examples:
- `GNOME_PACER: add pace layer annotations to 3 posts`
- `GNOME_IMGSEE: update alt text for savannah-alley-1 photo`

### Code Comments

When a Gnome needs to leave a note in a file, use: `<!-- GNOME_{HANDLE}: note -->` (in Markdown) or `// GNOME_{HANDLE}: note` (in code files).

### TODO Markers

When a Gnome encounters ambiguity or needs human input, leave a TODO: `<!-- TODO GNOME_{HANDLE}: description of what needs human decision -->`

---

## Boundaries

### Gnomes MAY

- Edit content frontmatter in `src/content/posts/`, `src/content/photos/`, `src/content/talks/`
- Add or update Markdown body text in content files
- Create new content files in `src/content/` following existing patterns
- Add scripts to `scripts/` if their Job requires automation
- Read any file in the repo for context

### Gnomes MAY NOT

- Modify `src/content.config.ts` (schema changes require human approval)
- Modify layouts, components, or pages in `src/layouts/`, `src/components/`, `src/pages/`
- Modify `astro.config.mjs`, `package.json`, `tsconfig.json`, or `wrangler.jsonc`
- Run `npm run deploy` or otherwise deploy the site
- Delete any files
- Modify `GNOMES.md` or `CLAUDE.md` directly
- Install or remove npm dependencies
- Modify files in `archive-pass0/` or `archive-pass1/`

---

## Active Gnomes Registry

| Handle | Job Summary | Status |
|--------|-------------|--------|
| *(none registered yet)* | | |

When a new Gnome is deployed, a human or CLAUDE.md-governed session adds it here. Example entries:

- `GNOME_PACER` -- Assigns pace layer annotations with rationale to content items
- `GNOME_IMGSEE` -- Performs visual analysis on photo assets and updates descriptions/alt text

---

## Reporting

Gnomes communicate their work through:

1. **Commit messages** prefixed with their handle (see Conventions above)
2. **TODO markers** in content files when human input is needed
3. **A final summary** at the end of their session describing what was accomplished

Gnomes should not modify files outside their stated Job scope. If a Gnome discovers an issue outside its scope, it may leave a TODO marker but should not attempt a fix.

---

## Appendix: Gnome Launch Prompt

Use this prompt when starting a Claude Cowork Task session as a Gnome. Replace `{HANDLE}` with the Gnome's handle and `{JOB_DESCRIPTION}` with the specific job.

```
You are GNOME_{HANDLE}, an autonomous AI agent with a Workplace and a Job.

Your Workplace is this repository. Read GNOMES.md at the repo root to understand
your Workplace -- its structure, content schemas, conventions, and boundaries.

After you have read and confirmed your understanding of the Workplace, here is
your Job:

{JOB_DESCRIPTION}

Rules:
- You are GNOME_{HANDLE}. Use this handle in all commit messages and code comments.
- Read GNOMES.md before doing anything else. Confirm your understanding.
- Stay within the Boundaries defined in GNOMES.md.
- Commit your work incrementally with clear messages prefixed "GNOME_{HANDLE}: ..."
- If you encounter ambiguity, leave a TODO comment with your handle rather than guessing.
- Do not modify GNOMES.md, CLAUDE.md, or structural files (schemas, layouts, configs).
- When your Job is complete, make a final commit and summarize what you did.
```
