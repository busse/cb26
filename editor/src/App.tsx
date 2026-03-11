import { useState, useCallback } from 'react'
import Navigator from './components/Navigator/Navigator'
import Editor from './components/Editor/Editor'
import Properties from './components/Properties/Properties'
import { useArticle } from './hooks/useArticle'
import type { CollectionType } from '@shared/types'

export default function App() {
  const [selectedCollection, setSelectedCollection] = useState<CollectionType | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  
  const {
    article,
    isDirty,
    updateContent,
    updateFrontmatter,
    save,
    load,
    create
  } = useArticle()

  const handleSelectArticle = useCallback(async (collection: CollectionType, path: string) => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Discard them?')
      if (!confirmed) return
    }
    setSelectedCollection(collection)
    setSelectedPath(path)
    await load(path)
  }, [isDirty, load])

  const handleCreateArticle = useCallback(async (collection: CollectionType, slug: string) => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Discard them?')
      if (!confirmed) return
    }
    const newPath = await create(collection, slug)
    if (newPath) {
      setSelectedCollection(collection)
      setSelectedPath(newPath)
    }
  }, [isDirty, create])

  const handleSave = useCallback(async () => {
    if (selectedPath) {
      await save(selectedPath)
    }
  }, [selectedPath, save])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">CB26 Editor</div>
        <div className="app-toolbar">
          {isDirty && <span className="dirty-indicator">Unsaved changes</span>}
          <button 
            className="btn btn--primary" 
            onClick={handleSave}
            disabled={!isDirty || !selectedPath}
          >
            Save
          </button>
        </div>
      </header>
      <main className="app-layout">
        <Navigator
          selectedCollection={selectedCollection}
          selectedPath={selectedPath}
          onSelectArticle={handleSelectArticle}
          onCreateArticle={handleCreateArticle}
        />
        <Editor
          article={article}
          onContentChange={updateContent}
        />
        <Properties
          article={article}
          collection={selectedCollection}
          onFrontmatterChange={updateFrontmatter}
        />
      </main>
    </div>
  )
}
