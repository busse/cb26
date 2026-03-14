import { defineCollection, z } from 'astro:content';

// =============================================================================
// TALKS COLLECTION
// Supports past, upcoming, and available (bookable) talks
// =============================================================================
const talksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    type: z.enum(['keynote', 'talk', 'panel', 'podcast', 'webinar', 'workshop', 'interview', 'conference_attendance']),
    status: z.enum(['past', 'upcoming', 'available']).default('past'),
    company: z.string().optional(),
    description: z.string(),
    abstract: z.string().optional(),
    duration: z.string().optional(),
    links: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
    })).optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    slides_embed: z.string().optional(),
    video_embed: z.string().optional(),
    panelists: z.array(z.object({
      name: z.string(),
      title: z.string(),
      role: z.string().optional(),
    })).optional(),
    co_presenters: z.array(z.object({
      name: z.string(),
      title: z.string(),
    })).optional(),
    hosts: z.array(z.string()).optional(),
  }),
});

// =============================================================================
// UPDATES COLLECTION
// Unified blog-like feed: articles, notes, announcements
// =============================================================================
const updatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    external_url: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// =============================================================================
// PROJECTS COLLECTION
// Career projects, GitHub repos, and community initiatives
// =============================================================================
const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['career', 'github', 'community', 'consulting']),
    category: z.string(),
    importance: z.number().default(5),
    url: z.string().url().optional(),
    github_repo: z.string().optional(),
    date_start: z.coerce.date(),
    date_end: z.coerce.date().optional(),
    highlights: z.array(z.string()).default([]),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    company: z.string().optional(),
    role: z.string().optional(),
    screenshots: z.array(z.object({
      image: z.string(),
      caption: z.string().optional(),
    })).default([]),
    tech_stack: z.array(z.string()).default([]),
    status: z.enum(['active', 'archived', 'concept', 'wip']).default('active'),
    lessons: z.string().optional(),
    demo_url: z.string().url().optional(),
  }),
});

// =============================================================================
// PHOTOS COLLECTION
// Photography gallery
// =============================================================================
const photosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    camera: z.string().optional(),
    description: z.string().optional(),
    image: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    aspect: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
  }),
});

// =============================================================================
// EXPORT COLLECTIONS
// =============================================================================
export const collections = {
  talks: talksCollection,
  updates: updatesCollection,
  projects: projectsCollection,
  photos: photosCollection,
};
