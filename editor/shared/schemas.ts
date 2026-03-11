import { z } from 'zod'
import type { CollectionType } from './types'

// =============================================================================
// TALKS SCHEMA
// =============================================================================
export const talkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  event: z.string().min(1, 'Event is required'),
  date: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? val : val.toISOString().split('T')[0]
  ),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['keynote', 'talk', 'panel', 'podcast', 'webinar', 'workshop', 'interview', 'conference_attendance']),
  status: z.enum(['past', 'upcoming', 'available']).default('past'),
  company: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
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
})

// =============================================================================
// UPDATES SCHEMA
// Unified blog-like feed: articles, notes, announcements
// =============================================================================
export const updatesSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? val : val.toISOString().split('T')[0]
  ),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  external_url: z.string().url().optional().or(z.literal('')),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
})

// =============================================================================
// PROJECTS SCHEMA
// =============================================================================
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['career', 'github', 'community', 'consulting']),
  category: z.string().min(1, 'Category is required'),
  importance: z.number().min(1).max(10).default(5),
  url: z.string().url().optional().or(z.literal('')),
  github_repo: z.string().optional(),
  date_start: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? val : val.toISOString().split('T')[0]
  ),
  date_end: z.string().or(z.date()).optional().transform(val => {
    if (!val) return undefined
    return typeof val === 'string' ? val : val.toISOString().split('T')[0]
  }),
  highlights: z.array(z.string()).default([]),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  company: z.string().optional(),
  role: z.string().optional(),
})

// =============================================================================
// PHOTOS SCHEMA
// =============================================================================
export const photoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? val : val.toISOString().split('T')[0]
  ),
  location: z.string().optional(),
  camera: z.string().optional(),
  description: z.string().optional(),
  image: z.string().min(1, 'Image path is required'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  aspect: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
})

// =============================================================================
// SCHEMA REGISTRY
// =============================================================================
export const schemas: Record<CollectionType, z.ZodObject<z.ZodRawShape>> = {
  talks: talkSchema,
  updates: updatesSchema,
  projects: projectSchema,
  photos: photoSchema,
}

export function getSchema(collection: CollectionType) {
  return schemas[collection]
}

export function validateFrontmatter(collection: CollectionType, data: unknown) {
  const schema = getSchema(collection)
  return schema.safeParse(data)
}

// =============================================================================
// FIELD METADATA - For generating form fields
// =============================================================================
export interface FieldMeta {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'boolean' | 'number' | 'array' | 'url'
  required: boolean
  options?: string[]
  placeholder?: string
}

export const fieldMetadata: Record<CollectionType, FieldMeta[]> = {
  talks: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'event', label: 'Event', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'location', label: 'Location', type: 'text', required: true },
    { key: 'type', label: 'Type', type: 'select', required: true, options: ['keynote', 'talk', 'panel', 'podcast', 'webinar', 'workshop', 'interview', 'conference_attendance'] },
    { key: 'status', label: 'Status', type: 'select', required: false, options: ['past', 'upcoming', 'available'] },
    { key: 'company', label: 'Company', type: 'text', required: false },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'abstract', label: 'Abstract', type: 'textarea', required: false },
    { key: 'duration', label: 'Duration', type: 'text', required: false, placeholder: 'e.g., 45 min' },
    { key: 'tags', label: 'Tags', type: 'array', required: false },
    { key: 'featured', label: 'Featured', type: 'boolean', required: false },
    { key: 'slides_embed', label: 'Slides Embed URL', type: 'url', required: false },
    { key: 'video_embed', label: 'Video Embed URL', type: 'url', required: false },
  ],
  updates: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: false },
    { key: 'tags', label: 'Tags', type: 'array', required: false },
    { key: 'external_url', label: 'External URL', type: 'url', required: false },
    { key: 'image', label: 'Image', type: 'text', required: false },
    { key: 'featured', label: 'Featured', type: 'boolean', required: false },
    { key: 'draft', label: 'Draft', type: 'boolean', required: false },
  ],
  projects: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: true },
    { key: 'type', label: 'Type', type: 'select', required: true, options: ['career', 'github', 'community', 'consulting'] },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'importance', label: 'Importance (1-10)', type: 'number', required: false },
    { key: 'url', label: 'URL', type: 'url', required: false },
    { key: 'github_repo', label: 'GitHub Repo', type: 'text', required: false, placeholder: 'owner/repo' },
    { key: 'date_start', label: 'Start Date', type: 'date', required: true },
    { key: 'date_end', label: 'End Date', type: 'date', required: false },
    { key: 'highlights', label: 'Highlights', type: 'array', required: false },
    { key: 'company', label: 'Company', type: 'text', required: false },
    { key: 'role', label: 'Role', type: 'text', required: false },
    { key: 'featured', label: 'Featured', type: 'boolean', required: false },
  ],
  photos: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'date', label: 'Date', type: 'date', required: true },
    { key: 'image', label: 'Image Path', type: 'text', required: true },
    { key: 'location', label: 'Location', type: 'text', required: false },
    { key: 'camera', label: 'Camera', type: 'text', required: false },
    { key: 'description', label: 'Description', type: 'textarea', required: false },
    { key: 'aspect', label: 'Aspect Ratio', type: 'select', required: false, options: ['landscape', 'portrait', 'square'] },
    { key: 'tags', label: 'Tags', type: 'array', required: false },
    { key: 'featured', label: 'Featured', type: 'boolean', required: false },
  ],
}

export function getFieldMetadata(collection: CollectionType): FieldMeta[] {
  return fieldMetadata[collection]
}
