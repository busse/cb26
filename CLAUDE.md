# Project Instructions

Standing instructions for all Claude sessions (Claude Code, Cowork Tasks, Cursor) operating in this repo.

## Project Identity

This is **Chris Busse's personal site** ([chrisbusse.com](https://www.chrisbusse.com)), built with:

- **Astro 6** with TypeScript (strict mode)
- **Cloudflare Workers** via `@astrojs/cloudflare`
- **Zod** content schemas in `src/content.config.ts`
- **Markdown** content collections: posts, talks, photos

Key commands:
- `npm run dev` -- local dev server at `localhost:4321`
- `npm run build` -- production build
- `npm run preview` -- build + local Wrangler preview
- `npm run deploy` -- build + deploy to Cloudflare (human-initiated only)

## GNOMES.md Maintenance

`GNOMES.md` is the canonical Workplace reference for Gnome agents. It must stay accurate. When any session makes structural changes to the repo, update `GNOMES.md` to match:

| Change | Update in GNOMES.md |
|--------|---------------------|
| Schema changes in `src/content.config.ts` | Update the embedded schema in **Content Collections** and the field tables |
| New or removed scripts in `scripts/` | Update the **Directory Map** tree |
| New directories added to the project | Update the **Directory Map** tree |
| New Gnome handle deployed | Add a row to the **Active Gnomes Registry** table |
| Content convention changes | Update the **Conventions** section |
| Boundary policy changes | Update the **Boundaries** section |

## Gnome Protocol

If this session is a Gnome (identified by the session name `GNOME_{HANDLE}`):

1. Read `GNOMES.md` at the repo root before doing anything else
2. Confirm your understanding of the Workplace before starting work
3. Obey the **Boundaries** section -- do not touch files outside your permitted scope
4. Prefix all commit messages with your handle: `GNOME_{HANDLE}: description`
5. Do not modify `GNOMES.md` or `CLAUDE.md` unless explicitly instructed to do so
6. Set `ai.assisted: true` and add your tool name to `ai.tools` on any content you modify
7. Leave `<!-- TODO GNOME_{HANDLE}: ... -->` markers for anything requiring human judgment

## Coding Conventions

- Follow existing Astro/TypeScript patterns in the codebase
- Do not add, remove, or upgrade npm dependencies without human approval
- Do not modify `astro.config.mjs`, `wrangler.jsonc`, or `tsconfig.json` without human approval
- Run `npm run build` to validate changes when making structural edits
- Content files use YAML frontmatter validated by Zod schemas -- always match the schema
- Tags are free-form strings; prefer reusing existing tags over inventing new ones
- Pace layer annotations always require a `rationale` string
