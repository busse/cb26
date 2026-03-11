import { useState, useCallback } from 'react'
import type { CollectionType, Article } from '@shared/types'

interface UseArticleReturn {
  article: Article | null
  isDirty: boolean
  updateContent: (content: string) => void
  updateFrontmatter: (key: string, value: unknown) => void
  save: (path: string) => Promise<boolean>
  load: (path: string) => Promise<void>
  create: (collection: CollectionType, slug: string) => Promise<string | null>
}

export function useArticle(): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const load = useCallback(async (path: string) => {
    try {
      const loadedArticle = await window.electronAPI.readArticle(path)
      setArticle(loadedArticle)
      setIsDirty(false)
    } catch (error) {
      console.error('Failed to load article:', error)
    }
  }, [])

  const save = useCallback(async (path: string): Promise<boolean> => {
    if (!article) return false
    
    try {
      const success = await window.electronAPI.saveArticle(
        path,
        article.content,
        article.frontmatter
      )
      if (success) {
        setIsDirty(false)
      }
      return success
    } catch (error) {
      console.error('Failed to save article:', error)
      return false
    }
  }, [article])

  const create = useCallback(async (collection: CollectionType, slug: string): Promise<string | null> => {
    try {
      const newPath = await window.electronAPI.createArticle(collection, slug)
      await load(newPath)
      return newPath
    } catch (error) {
      console.error('Failed to create article:', error)
      return null
    }
  }, [load])

  const updateContent = useCallback((content: string) => {
    setArticle(prev => {
      if (!prev) return null
      return { ...prev, content }
    })
    setIsDirty(true)
  }, [])

  const updateFrontmatter = useCallback((key: string, value: unknown) => {
    setArticle(prev => {
      if (!prev) return null
      return {
        ...prev,
        frontmatter: { ...prev.frontmatter, [key]: value }
      }
    })
    setIsDirty(true)
  }, [])

  return {
    article,
    isDirty,
    updateContent,
    updateFrontmatter,
    save,
    load,
    create
  }
}
