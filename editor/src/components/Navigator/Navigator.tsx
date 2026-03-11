import { useState, useEffect, useCallback } from 'react'
import type { CollectionType, ArticleListItem } from '@shared/types'

interface NavigatorProps {
  selectedCollection: CollectionType | null
  selectedPath: string | null
  onSelectArticle: (collection: CollectionType, path: string) => void
  onCreateArticle: (collection: CollectionType, slug: string) => void
}

const collections: { type: CollectionType; label: string; icon: string }[] = [
  { type: 'talks', label: 'Talks', icon: '🎤' },
  { type: 'updates', label: 'Updates', icon: '📝' },
  { type: 'projects', label: 'Projects', icon: '🚀' },
  { type: 'photos', label: 'Photos', icon: '📷' },
]

export default function Navigator({
  selectedCollection,
  selectedPath,
  onSelectArticle,
  onCreateArticle
}: NavigatorProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<CollectionType>>(
    new Set(['talks', 'updates', 'projects'])
  )
  const [articles, setArticles] = useState<Record<CollectionType, ArticleListItem[]>>({
    talks: [],
    updates: [],
    projects: [],
    photos: [],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState<CollectionType | null>(null)
  const [newSlug, setNewSlug] = useState('')

  // Load articles for each collection
  useEffect(() => {
    const loadArticles = async () => {
      const results = await Promise.all(
        collections.map(async ({ type }) => {
          const items = await window.electronAPI.listArticles(type)
          return { type, items }
        })
      )
      
      const newArticles = results.reduce((acc, { type, items }) => {
        acc[type] = items
        return acc
      }, {} as Record<CollectionType, ArticleListItem[]>)
      
      setArticles(newArticles)
    }
    
    loadArticles()
  }, [])

  const toggleCollection = (type: CollectionType) => {
    setExpandedCollections(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const handleCreateClick = (e: React.MouseEvent, type: CollectionType) => {
    e.stopPropagation()
    setShowNewModal(type)
    setNewSlug('')
  }

  const handleCreateSubmit = useCallback(() => {
    if (showNewModal && newSlug.trim()) {
      const slug = newSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      onCreateArticle(showNewModal, slug)
      setShowNewModal(null)
      setNewSlug('')
      
      // Refresh the articles list after creation
      window.electronAPI.listArticles(showNewModal).then(items => {
        setArticles(prev => ({ ...prev, [showNewModal]: items }))
      })
    }
  }, [showNewModal, newSlug, onCreateArticle])

  const filteredArticles = (type: CollectionType) => {
    if (!searchQuery) return articles[type]
    const query = searchQuery.toLowerCase()
    return articles[type].filter(
      a => a.title.toLowerCase().includes(query) || a.slug.toLowerCase().includes(query)
    )
  }

  // Get singular label for modal title
  const getSingularLabel = (label: string) => {
    if (label === 'Updates') return 'Update'
    return label.slice(0, -1)
  }

  return (
    <aside className="navigator">
      <div className="navigator-header">
        <h2 className="navigator-title">Content</h2>
      </div>
      
      <div className="navigator-search">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <nav className="navigator-tree">
        {collections.map(({ type, label, icon }) => (
          <div key={type} className="collection-group">
            <button
              className={`collection-header ${selectedCollection === type ? 'is-selected' : ''}`}
              onClick={() => toggleCollection(type)}
            >
              <span className="collection-icon">{icon}</span>
              <span className="collection-label">{label}</span>
              <span className="collection-count">{articles[type].length}</span>
              <span className={`collection-chevron ${expandedCollections.has(type) ? 'is-expanded' : ''}`}>
                ▶
              </span>
              <button
                className="collection-add"
                onClick={(e) => handleCreateClick(e, type)}
                title={`New ${getSingularLabel(label)}`}
              >
                +
              </button>
            </button>
            
            {expandedCollections.has(type) && (
              <ul className="article-list">
                {filteredArticles(type).map((article) => (
                  <li key={article.path}>
                    <button
                      className={`article-item ${selectedPath === article.path ? 'is-selected' : ''}`}
                      onClick={() => onSelectArticle(type, article.path)}
                    >
                      <span className="article-title">{article.title}</span>
                      {article.date && (
                        <span className="article-date">{article.date}</span>
                      )}
                    </button>
                  </li>
                ))}
                {filteredArticles(type).length === 0 && (
                  <li className="article-empty">
                    {searchQuery ? 'No matches' : 'No articles yet'}
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* New Article Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">
              New {getSingularLabel(collections.find(c => c.type === showNewModal)?.label || '')}
            </h3>
            <div className="modal-body">
              <label className="form-label">
                Slug (filename)
                <input
                  type="text"
                  className="form-input"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="my-new-article"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateSubmit()
                    if (e.key === 'Escape') setShowNewModal(null)
                  }}
                />
              </label>
              <p className="form-hint">
                Will create: {newSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'my-article'}.md
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowNewModal(null)}>
                Cancel
              </button>
              <button 
                className="btn btn--primary" 
                onClick={handleCreateSubmit}
                disabled={!newSlug.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
