import { useState, useEffect, useRef, useCallback } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import type { Article } from '@shared/types'

interface EditorProps {
  article: Article | null
  onContentChange: (content: string) => void
}

type ViewMode = 'edit' | 'preview' | 'split'

// Custom CodeMirror theme to match site aesthetic
const editorialTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '15px',
    fontFamily: "'IBM Plex Mono', 'SF Mono', 'Consolas', monospace",
  },
  '.cm-content': {
    fontFamily: "'IBM Plex Mono', 'SF Mono', 'Consolas', monospace",
    padding: '16px 0',
    caretColor: '#c41e3a',
  },
  '.cm-line': {
    padding: '0 16px',
  },
  '.cm-cursor': {
    borderLeftColor: '#c41e3a',
  },
  '.cm-activeLine': {
    backgroundColor: '#f0eeea',
  },
  '.cm-selectionBackground, ::selection': {
    backgroundColor: '#c41e3a33',
  },
  '.cm-gutters': {
    backgroundColor: '#faf9f7',
    borderRight: '1px solid #d4d0c8',
    color: '#6b6b6b',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f0eeea',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#c41e3a33',
  },
})

export default function Editor({ article, onContentChange }: EditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [preview, setPreview] = useState<string>('')
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  // Convert markdown to HTML for preview
  const renderPreview = useCallback(async (content: string) => {
    try {
      const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(content)
      setPreview(String(result))
    } catch (error) {
      console.error('Failed to render preview:', error)
      setPreview('<p>Error rendering preview</p>')
    }
  }, [])

  // Update preview when content changes or mode changes to preview
  useEffect(() => {
    if ((viewMode === 'preview' || viewMode === 'split') && article?.content) {
      renderPreview(article.content)
    }
  }, [article?.content, viewMode, renderPreview])

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewMode === 'preview') return

    // Clean up existing view
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onContentChange(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: article?.content ?? '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        editorialTheme,
        updateListener,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [article?.path, viewMode]) // Re-create editor when article changes

  // Update editor content when article changes (but editor exists)
  useEffect(() => {
    if (viewRef.current && article?.content !== undefined) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== article.content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: article.content,
          },
        })
      }
    }
  }, [article?.content])

  if (!article) {
    return (
      <div className="editor editor--empty">
        <div className="editor-placeholder">
          <h2>Select an article to edit</h2>
          <p>Choose an article from the navigator, or create a new one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <div className="editor-tabs">
          <button
            className={`editor-tab ${viewMode === 'edit' ? 'is-active' : ''}`}
            onClick={() => setViewMode('edit')}
          >
            Edit
          </button>
          <button
            className={`editor-tab ${viewMode === 'split' ? 'is-active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split
          </button>
          <button
            className={`editor-tab ${viewMode === 'preview' ? 'is-active' : ''}`}
            onClick={() => setViewMode('preview')}
          >
            Preview
          </button>
        </div>
        <div className="editor-info">
          <span className="editor-filename">
            {article.path.split('/').pop()}
          </span>
        </div>
      </div>

      <div className={`editor-content editor-content--${viewMode}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="editor-pane editor-pane--code" ref={editorRef} />
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="editor-pane editor-pane--preview">
            <article 
              className="prose"
              dangerouslySetInnerHTML={{ __html: preview }} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
