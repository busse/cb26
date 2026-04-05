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

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    image: z.string().optional(),
    ai: z.object({
      assisted: z.boolean(),
      tools: z.array(z.string()).default([]),
      role: z.enum(["research", "drafting", "editing", "pair-writing"]).optional(),
      process: z.string().optional(),
    }).default({ assisted: false, tools: [] }),
    paceLayers,
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    paceLayers,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date_start: z.coerce.date(),
    date_end: z.coerce.date().optional(),
    status: z.enum(["active", "archived", "concept", "wip"]).default("active"),
    url: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    paceLayers,
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photos" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    alt: z.string(),
    location: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    ai: z.object({
      assisted: z.boolean(),
      tools: z.array(z.string()).default([]),
      role: z.enum(["research", "drafting", "editing", "pair-writing"]).optional(),
      process: z.string().optional(),
    }).default({ assisted: false, tools: [] }),
    paceLayers,
  }),
});

export const collections = { posts, talks, projects, photos };
