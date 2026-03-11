import { useCallback } from 'react'
import type { CollectionType, Article } from '@shared/types'
import { getFieldMetadata, validateFrontmatter, type FieldMeta } from '@shared/schemas'

interface PropertiesProps {
  article: Article | null
  collection: CollectionType | null
  onFrontmatterChange: (key: string, value: unknown) => void
}

export default function Properties({
  article,
  collection,
  onFrontmatterChange
}: PropertiesProps) {
  if (!article || !collection) {
    return (
      <aside className="properties properties--empty">
        <div className="properties-placeholder">
          <p>Select an article to edit properties</p>
        </div>
      </aside>
    )
  }

  const fields = getFieldMetadata(collection)
  const validation = validateFrontmatter(collection, article.frontmatter)
  const errors = validation.success ? {} : (validation.error.flatten().fieldErrors as Record<string, string[]>)

  return (
    <aside className="properties">
      <div className="properties-header">
        <h2 className="properties-title">Properties</h2>
        <span className="properties-collection">{collection}</span>
      </div>

      <div className="properties-form">
        {fields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={article.frontmatter[field.key]}
            error={errors[field.key]?.[0]}
            onChange={(value) => onFrontmatterChange(field.key, value)}
          />
        ))}
      </div>
    </aside>
  )
}

interface FormFieldProps {
  field: FieldMeta
  value: unknown
  error?: string
  onChange: (value: unknown) => void
}

function FormField({ field, value, error, onChange }: FormFieldProps) {
  const handleChange = useCallback((newValue: unknown) => {
    onChange(newValue)
  }, [onChange])

  const inputId = `field-${field.key}`

  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={inputId} className="form-label">
        {field.label}
        {field.required && <span className="required-marker">*</span>}
      </label>

      {field.type === 'text' && (
        <input
          id={inputId}
          type="text"
          className="form-input"
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {field.type === 'url' && (
        <input
          id={inputId}
          type="url"
          className="form-input"
          value={(value as string) ?? ''}
          placeholder={field.placeholder || 'https://...'}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          id={inputId}
          className="form-textarea"
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          rows={3}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {field.type === 'date' && (
        <input
          id={inputId}
          type="date"
          className="form-input"
          value={(value as string) ?? ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {field.type === 'number' && (
        <input
          id={inputId}
          type="number"
          className="form-input"
          value={(value as number) ?? ''}
          onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : undefined)}
        />
      )}

      {field.type === 'boolean' && (
        <label className="form-checkbox">
          <input
            id={inputId}
            type="checkbox"
            checked={(value as boolean) ?? false}
            onChange={(e) => handleChange(e.target.checked)}
          />
          <span className="checkbox-label">Enabled</span>
        </label>
      )}

      {field.type === 'select' && field.options && (
        <select
          id={inputId}
          className="form-select"
          value={(value as string) ?? ''}
          onChange={(e) => handleChange(e.target.value)}
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      )}

      {field.type === 'array' && (
        <ArrayField
          value={(value as string[]) ?? []}
          onChange={handleChange}
          placeholder={field.placeholder}
        />
      )}

      {field.type === 'screenshots' && (
        <ScreenshotsField
          value={(value as Array<{ image: string; caption?: string }>) ?? []}
          onChange={handleChange}
        />
      )}

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

interface ArrayFieldProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

function ArrayField({ value, onChange, placeholder }: ArrayFieldProps) {
  const handleAdd = () => {
    onChange([...value, ''])
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, newValue: string) => {
    const updated = [...value]
    updated[index] = newValue
    onChange(updated)
  }

  return (
    <div className="array-field">
      {value.map((item, index) => (
        <div key={index} className="array-item">
          <input
            type="text"
            className="form-input"
            value={item}
            placeholder={placeholder}
            onChange={(e) => handleItemChange(index, e.target.value)}
          />
          <button
            type="button"
            className="array-remove"
            onClick={() => handleRemove(index)}
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="array-add" onClick={handleAdd}>
        + Add item
      </button>
    </div>
  )
}

// Screenshots field for project galleries
interface Screenshot {
  image: string
  caption?: string
}

interface ScreenshotsFieldProps {
  value: Screenshot[]
  onChange: (value: Screenshot[]) => void
}

function ScreenshotsField({ value, onChange }: ScreenshotsFieldProps) {
  const handleAdd = () => {
    onChange([...value, { image: '', caption: '' }])
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof Screenshot, newValue: string) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [field]: newValue }
    onChange(updated)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...value]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    onChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return
    const updated = [...value]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    onChange(updated)
  }

  return (
    <div className="screenshots-field">
      {value.map((item, index) => (
        <div key={index} className="screenshot-item">
          <div className="screenshot-header">
            <span className="screenshot-number">#{index + 1}</span>
            <div className="screenshot-actions">
              <button
                type="button"
                className="screenshot-move"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="screenshot-move"
                onClick={() => handleMoveDown(index)}
                disabled={index === value.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="screenshot-remove"
                onClick={() => handleRemove(index)}
                title="Remove"
              >
                ×
              </button>
            </div>
          </div>
          <input
            type="text"
            className="form-input"
            value={item.image}
            placeholder="/images/projects/slug/screenshot-1.png"
            onChange={(e) => handleItemChange(index, 'image', e.target.value)}
          />
          <input
            type="text"
            className="form-input form-input--caption"
            value={item.caption ?? ''}
            placeholder="Caption (optional)"
            onChange={(e) => handleItemChange(index, 'caption', e.target.value)}
          />
        </div>
      ))}
      <button type="button" className="array-add" onClick={handleAdd}>
        + Add screenshot
      </button>
    </div>
  )
}
