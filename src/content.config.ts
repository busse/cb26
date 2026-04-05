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
