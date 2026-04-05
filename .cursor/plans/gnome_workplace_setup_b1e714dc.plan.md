---
name: Gnome Workplace Setup
overview: Create GNOMES.md as the canonical Workplace reference for AI agents (Gnomes), a CLAUDE.md to keep it current, and a reusable prompt template for launching Gnome Cowork sessions.
todos:
  - id: gnomes-md
    content: "Create GNOMES.md at repo root with all sections: Workplace Overview, Directory Map, Content Collections (with full Zod schema), Conventions, Boundaries, Active Gnomes Registry, Reporting, and Launch Prompt appendix"
    status: completed
  - id: claude-md
    content: Create CLAUDE.md at repo root with project identity, GNOMES.md maintenance rules, Gnome protocol, and general coding conventions
    status: completed
  - id: validate
    content: Review both files for accuracy against the actual repo state, ensure schema embed matches src/content.config.ts exactly
    status: completed
isProject: false
---

# Gnome Workplace Setup

## Context

This repo (`cb26`) is an Astro 6 personal site for Chris Busse deployed to Cloudflare Workers. It has three content collections (posts, talks, photos) with shared Zod schemas including pace layers, AI metadata, tags, and categories. There are currently no AI guidance files (no CLAUDE.md, no AGENTS.md, no `.cursor/rules`).

Gnomes are autonomous AI agent sessions (Claude Cowork Tasks) that operate on this repo with a specific job. Each Gnome has a handle (e.g., `GNOME_PACER`), works from a `GNOMES.md` Workplace document, and commits under its own name.

---

## File 1: `GNOMES.md` (new, repo root)

The canonical Workplace reference. Gnomes read this first to understand where they are and what they can touch. Structured in these sections:

### Section: Workplace Overview

- Site identity: Chris Busse's personal site at `chrisbusse.com`
- Tech: Astro 6, Cloudflare Workers, Zod content schemas
- Purpose of this document and who reads it

### Section: Directory Map

Annotated tree of the repo with Gnome-relevant notes:

- `src/content/` -- the primary work surface for most Gnomes
- `src/content.config.ts` -- the schema source of truth (paste the full Zod schema inline so Gnomes don't need to read the file separately)
- `src/pages/`, `src/layouts/`, `src/components/` -- template layer (usually off-limits to content Gnomes)
- `src/data/site.ts` -- site config constants
- `public/photos/` and `public/photos/thumbs/` -- static image assets
- `scripts/` -- automation (currently `process-photo.sh`)
- `inbox/` -- staging area for incoming files, not committed
- `archive-pass0/`, `archive-pass1/` -- historical snapshots, read-only

### Section: Content Collections

For each of posts, talks, photos:

- Schema fields with types, defaults, and which are required vs optional
- The `baseMeta` shared shape (title, date, description, tags, draft, category, ai, paceLayers)
- Collection-specific fields (e.g., photos: `image`, `alt`, `location`, `images[]`)
- Enum values: categories (`analysis | essay | observation | reference`), pace layers (`fashion | commerce | infrastructure | governance | culture | nature`), AI roles (`research | drafting | editing | pair-writing`)

### Section: Conventions

- Filename patterns: photos use `YYMM-location-descriptor.md` (e.g., `2411-savannah-alley-1.md`)
- All photos scaffolded as `draft: true` -- Gnomes should not flip draft status
- Tags are free-form strings, normalized to lowercase at render time
- Pace layers require a `rationale` string explaining why that layer applies
- AI metadata: `assisted: true/false`, list tools used, optionally describe role and process
- Commit messages: Gnomes use `GNOME_{HANDLE}: description` format
- Code comments from Gnomes: use `// GNOME_{HANDLE}: note` format

### Section: Boundaries

What Gnomes may and may not do:

- MAY: Edit content frontmatter, add/update markdown body text, create new content files following existing patterns
- MAY: Add scripts to `scripts/` if their job requires automation
- MAY NOT: Modify `src/content.config.ts` (schema changes require human approval)
- MAY NOT: Modify layouts, components, pages, or `astro.config.mjs`
- MAY NOT: Change `package.json` dependencies
- MAY NOT: Deploy (no `npm run deploy`)
- MAY NOT: Delete files
- MAY NOT: Modify `GNOMES.md` directly (only CLAUDE.md-governed sessions may)

### Section: Active Gnomes Registry

A table tracking known Gnome handles, their jobs, and status. Initially empty with the format documented:

```
| Handle | Job Summary | Status |
|--------|-------------|--------|
| (none registered yet) | | |
```

Example entries to show the pattern:

- `GNOME_PACER` -- Assigns pace layer annotations with rationale to content items
- `GNOME_IMGSEE` -- Performs visual analysis on photo assets and updates descriptions/alt text

### Section: Reporting

How Gnomes communicate their work:

- Commit messages prefixed with handle
- If a Gnome encounters ambiguity or needs human input, it should leave a `TODO:` in the content with `GNOME_{HANDLE}:` prefix
- Gnomes should not modify files outside their stated job scope

---

## File 2: `CLAUDE.md` (new, repo root)

This is the [Claude Code / Cowork project instructions file](https://docs.anthropic.com/en/docs/claude-code/overview). It serves as standing instructions for any Claude session operating in this repo, including Gnome sessions.

### Contents:

**Project identity**: Astro 6 site, Cloudflare Workers, content-focused.

**GNOMES.md maintenance rule**: When any session (Cursor, Claude Code, or Gnome) makes structural changes to the repo -- adding/removing content collections, changing schemas, adding scripts, modifying directory layout -- the session MUST update `GNOMES.md` to reflect the change. Specifically:

- Schema changes in `src/content.config.ts` -> update the Content Collections section
- New scripts in `scripts/` -> update the Directory Map
- New Gnome handles deployed -> update the Active Gnomes Registry table
- Convention changes -> update the Conventions section

**Gnome protocol**: If this session is a Gnome (identified by the session name `GNOME_{HANDLE}`):

1. Read `GNOMES.md` first
2. Confirm understanding of the Workplace before starting work
3. Stay within the Boundaries section
4. Commit with the handle prefix
5. Do not modify `GNOMES.md` unless specifically instructed

**General coding rules**: Astro/TypeScript conventions, no adding deps without approval, build with `npm run build` to validate.

---

## File 3: Gnome Launch Prompt (documented in GNOMES.md appendix)

A ready-to-paste prompt for starting a Claude Cowork Task session as a Gnome. Included as an appendix in `GNOMES.md` so it lives with the Workplace definition.

### Prompt template:

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

---

## Implementation Notes

- `GNOMES.md` embeds the full Zod schema inline so Gnomes get schema context without needing to read `src/content.config.ts` (which is off-limits to them). This means the CLAUDE.md maintenance rule is important -- when the schema changes, the embedded copy must be updated.
- The Active Gnomes Registry in `GNOMES.md` is intentionally a simple markdown table rather than a separate file, keeping everything in one place for Gnomes to read.
- The prompt template is stored inside `GNOMES.md` as an appendix rather than a separate file, keeping it co-located with the Workplace definition it references.

