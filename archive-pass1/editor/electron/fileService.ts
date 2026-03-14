import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import type { CollectionType, Article, ArticleListItem } from '../shared/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Content path relative to the editor - points to the site's content directory
// In dev: editor/dist-electron -> editor -> cb26 -> site/src/content
// This resolves based on the compiled output location
const CONTENT_BASE = path.resolve(__dirname, '../../site/src/content')

export function getContentPath(): string {
  return CONTENT_BASE
}

function getCollectionPath(collection: CollectionType): string {
  return path.join(CONTENT_BASE, collection)
}

// Default frontmatter templates for each collection type
const defaultFrontmatter: Record<CollectionType, Record<string, unknown>> = {
  talks: {
    title: 'New Talk',
    event: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    type: 'talk',
    status: 'upcoming',
    description: '',
    tags: [],
    featured: false
  },
  updates: {
    title: 'New Update',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    featured: false,
    draft: true
  },
  projects: {
    title: 'New Project',
    description: '',
    type: 'github',
    category: '',
    importance: 5,
    date_start: new Date().toISOString().split('T')[0],
    highlights: [],
    featured: false
  },
  photos: {
    title: 'New Photo',
    date: new Date().toISOString().split('T')[0],
    image: '',
    featured: false,
    tags: [],
    aspect: 'landscape'
  }
}

export async function listArticles(collection: string): Promise<ArticleListItem[]> {
  const collectionPath = getCollectionPath(collection as CollectionType)
  
  try {
    const files = await fs.readdir(collectionPath)
    const mdFiles = files.filter(f => f.endsWith('.md'))
    
    const articles: ArticleListItem[] = await Promise.all(
      mdFiles.map(async (file) => {
        const filePath = path.join(collectionPath, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const { data } = matter(content)
        
        return {
          path: filePath,
          slug: file.replace('.md', ''),
          title: data.title || data.slug || file.replace('.md', ''),
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : undefined
        }
      })
    )
    
    // Sort by date descending (most recent first)
    return articles.sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.localeCompare(a.date)
    })
  } catch (error) {
    console.error(`Error listing articles for ${collection}:`, error)
    return []
  }
}

export async function readArticle(articlePath: string): Promise<Article> {
  const content = await fs.readFile(articlePath, 'utf-8')
  const { data, content: body } = matter(content)
  
  // Determine collection from path
  const relativePath = path.relative(CONTENT_BASE, articlePath)
  const collection = relativePath.split(path.sep)[0] as CollectionType
  
  return {
    path: articlePath,
    collection,
    frontmatter: data,
    content: body.trim()
  }
}

export async function saveArticle(
  articlePath: string, 
  content: string, 
  frontmatter: Record<string, unknown>
): Promise<boolean> {
  try {
    // Convert dates to ISO strings for YAML serialization
    const processedFrontmatter = { ...frontmatter }
    for (const [key, value] of Object.entries(processedFrontmatter)) {
      if (value instanceof Date) {
        processedFrontmatter[key] = value.toISOString().split('T')[0]
      }
    }
    
    const fileContent = matter.stringify(content, processedFrontmatter)
    await fs.writeFile(articlePath, fileContent, 'utf-8')
    return true
  } catch (error) {
    console.error(`Error saving article at ${articlePath}:`, error)
    return false
  }
}

export async function createArticle(collection: string, slug: string): Promise<string> {
  const collectionType = collection as CollectionType
  const collectionPath = getCollectionPath(collectionType)
  const filePath = path.join(collectionPath, `${slug}.md`)
  
  // Check if file already exists
  try {
    await fs.access(filePath)
    throw new Error(`Article already exists: ${slug}`)
  } catch (error) {
    // File doesn't exist, which is what we want
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
  
  const frontmatter = { ...defaultFrontmatter[collectionType] }
  const content = '\n\nStart writing here...\n'
  
  const fileContent = matter.stringify(content, frontmatter)
  await fs.writeFile(filePath, fileContent, 'utf-8')
  
  return filePath
}

export async function deleteArticle(articlePath: string): Promise<boolean> {
  try {
    // Verify the path is within the content directory for safety
    const normalizedPath = path.normalize(articlePath)
    const normalizedBase = path.normalize(CONTENT_BASE)
    
    if (!normalizedPath.startsWith(normalizedBase)) {
      throw new Error('Invalid path: outside content directory')
    }
    
    await fs.unlink(articlePath)
    return true
  } catch (error) {
    console.error(`Error deleting article at ${articlePath}:`, error)
    return false
  }
}
