import { contextBridge, ipcRenderer } from 'electron'
import type { CollectionType, ArticleListItem, Article, ElectronAPI } from '../shared/types'

// Expose a safe API to the renderer process
const electronAPI: ElectronAPI = {
  listArticles: (collection: CollectionType): Promise<ArticleListItem[]> => {
    return ipcRenderer.invoke('list-articles', collection)
  },

  readArticle: (path: string): Promise<Article> => {
    return ipcRenderer.invoke('read-article', path)
  },

  saveArticle: (path: string, content: string, frontmatter: Record<string, unknown>): Promise<boolean> => {
    return ipcRenderer.invoke('save-article', path, content, frontmatter)
  },

  createArticle: (collection: CollectionType, slug: string): Promise<string> => {
    return ipcRenderer.invoke('create-article', collection, slug)
  },

  deleteArticle: (path: string): Promise<boolean> => {
    return ipcRenderer.invoke('delete-article', path)
  },

  getContentPath: (): Promise<string> => {
    return ipcRenderer.invoke('get-content-path')
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
