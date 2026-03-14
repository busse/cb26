// Collection types matching the Astro content config
export type CollectionType = 'talks' | 'updates' | 'projects' | 'photos'

// Talk types
export type TalkType = 'keynote' | 'talk' | 'panel' | 'podcast' | 'webinar' | 'workshop' | 'interview' | 'conference_attendance'
export type TalkStatus = 'past' | 'upcoming' | 'available'

// Base article structure
export interface Article {
  path: string
  collection: CollectionType
  frontmatter: Record<string, unknown>
  content: string
}

// Talk frontmatter
export interface TalkFrontmatter {
  title: string
  event: string
  date: Date | string
  location: string
  type: TalkType
  status?: TalkStatus
  company?: string
  description: string
  abstract?: string
  duration?: string
  links?: Array<{ name: string; url: string }>
  tags?: string[]
  featured?: boolean
  slides_embed?: string
  video_embed?: string
  panelists?: Array<{ name: string; title: string; role?: string }>
  co_presenters?: Array<{ name: string; title: string }>
  hosts?: string[]
}

// Updates frontmatter (unified blog-like feed)
export interface UpdatesFrontmatter {
  title: string
  date: Date | string
  description?: string
  tags?: string[]
  external_url?: string
  image?: string
  featured?: boolean
  draft?: boolean
}

// Project frontmatter
export interface ProjectFrontmatter {
  title: string
  description: string
  type: 'career' | 'github' | 'community' | 'consulting'
  category: string
  importance?: number
  url?: string
  github_repo?: string
  date_start: Date | string
  date_end?: Date | string
  highlights?: string[]
  image?: string
  featured?: boolean
  company?: string
  role?: string
}

// Photo frontmatter
export interface PhotoFrontmatter {
  title: string
  date: Date | string
  location?: string
  camera?: string
  description?: string
  image: string
  featured?: boolean
  tags?: string[]
  aspect?: 'landscape' | 'portrait' | 'square'
}

// Union type for all frontmatter types
export type Frontmatter = 
  | TalkFrontmatter 
  | UpdatesFrontmatter
  | ProjectFrontmatter 
  | PhotoFrontmatter

// Article list item (for navigator)
export interface ArticleListItem {
  path: string
  slug: string
  title: string
  date?: string
}

// IPC API types
export interface ElectronAPI {
  listArticles: (collection: CollectionType) => Promise<ArticleListItem[]>
  readArticle: (path: string) => Promise<Article>
  saveArticle: (path: string, content: string, frontmatter: Record<string, unknown>) => Promise<boolean>
  createArticle: (collection: CollectionType, slug: string) => Promise<string>
  deleteArticle: (path: string) => Promise<boolean>
  getContentPath: () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
