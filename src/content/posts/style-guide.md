---
title: "Post Style Guide"
date: 2026-03-11
description: "A reference post demonstrating every element and typographic style available in the site's post layout."
tags: ["design", "writing"]
featured: true
draft: false
category: "reference"
---

This post exists to preview every element available in a post. It is a living reference — update it as the design system evolves.

## Headings

Headings use the display typeface (Rokkitt) and are set in a descending scale. The `h1` is reserved for the post title in the header. Body content uses `h2` through `h4`.

### Third-Level Heading

Use `h3` for subsections within a major section. These have slightly less top margin than `h2`.

#### Fourth-Level Heading

Use `h4` sparingly, for fine-grained breakdowns within a subsection.

## Paragraphs and Inline Elements

Body text is set in Spectral at 20px with a 1.7 line height. Paragraphs are capped at 65ch for comfortable reading. Here is a second sentence to show how a paragraph of moderate length flows across the column.

You can use **bold text** for strong emphasis and *italic text* for softer emphasis. Combine them for ***bold italic*** when needed. Use `inline code` to reference variable names, file paths like `src/content/posts/style-guide.md`, or short terminal commands like `npm run dev`.

Links look like [this example link](#) and get a thicker underline on hover. Visited links shift to purple.

## Lists

### Unordered List

- First item in an unordered list
- Second item, which is a bit longer to show how wrapping behaves when the text extends beyond a single line in the layout
- Third item
  - Nested item under the third
  - Another nested item

### Ordered List

1. First step in a process
2. Second step, with enough text to demonstrate wrapping behavior across the column width
3. Third step
   1. Sub-step A
   2. Sub-step B

## Blockquote

> Word clouds are great for presentations, but they don't tell you what to *do*. Real insight comes from understanding patterns, timing, and sentiment.

Blockquotes use a left border rule and a slightly larger font size. They work well for callouts, pull quotes, or citing external sources.

> This is a longer blockquote to show how multiple lines render. The left border extends the full height of the content, and the text remains indented from the main body flow.

## Code

Inline code was shown above. For blocks of code, use fenced code blocks:

```json
{
  "title": "Post Style Guide",
  "date": "2026-03-11",
  "tags": ["design", "writing"],
  "featured": true
}
```

```javascript
const posts = (await getCollection("posts"))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
```

Code blocks get a border, horizontal scroll on overflow, and use the monospace typeface (Roboto Mono).

## Tables

| Element | Typeface | Size |
| --- | --- | --- |
| Body text | Spectral | `--step-0` (1rem) |
| Headings | Rokkitt | `--step-2` to `--step-4` |
| UI / meta | Roboto Mono | `--step--1` (0.875rem) |
| Inline code | Roboto Mono | inherited |

Tables are full-width with collapsed borders and use the UI typeface at a smaller size.

## Horizontal Rule

A horizontal rule creates a visual break between sections:

---

The rule above uses a single-pixel top border in the muted rule color.

## Images and Figures

Images can be placed inline or wrapped in a `<figure>` for captioned content:

<figure>
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='200' fill='%23eee'%3E%3Crect width='600' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='monospace'%3E600 × 200 placeholder%3C/text%3E%3C/svg%3E" alt="Placeholder image" />
  <figcaption>Figure 1 — A placeholder image with a caption. Captions use the UI typeface at a smaller size in the muted color.</figcaption>
</figure>

## Combined Example

Here is a realistic passage that mixes several elements to show how they compose together in practice.

The API Craft RVA meetup ran **13 events** between 2014 and 2020, covering topics from [contract-first design](#) to developer experience. A typical agenda looked like this:

1. Networking and introductions (15 min)
2. Main presentation (30–40 min)
3. Open discussion and Q&A (20 min)

> The best API documentation is the one your developers actually read.

Key takeaways were tracked in a simple format:

| Year | Events | Avg. Attendance |
| --- | --- | --- |
| 2014 | 3 | 12 |
| 2016 | 4 | 22 |
| 2018 | 3 | 28 |
| 2020 | 1 | 35 (virtual) |

For more on the meetup, see the [API Craft RVA speaking entry](/speaking/2014-api-craft-rva).
