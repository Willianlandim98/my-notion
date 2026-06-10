import { FileText, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Page } from '../types'
import { extractTextFromContent } from '../utils/content'

interface SearchModalProps {
  pages: Page[]
  onSelectPage: (id: string) => void
  onClose: () => void
}

export function SearchModal({ pages, onSelectPage, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return pages

    return pages.filter((page) => {
      const title = (page.title || 'Sem título').toLowerCase()
      const body = extractTextFromContent(page.content).toLowerCase()
      return title.includes(term) || body.includes(term)
    })
  }, [pages, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
        return
      }

      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        onSelectPage(results[selectedIndex].id)
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [results, selectedIndex, onSelectPage, onClose])

  const handleSelect = (id: string) => {
    onSelectPage(id)
    onClose()
  }

  return (
    <div className="search-modal__backdrop" onClick={onClose}>
      <div
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Buscar páginas"
      >
        <div className="search-modal__input-row">
          <Search size={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-modal__input"
            placeholder="Buscar páginas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="search-modal__close"
            onClick={onClose}
            aria-label="Fechar busca"
          >
            <X size={16} />
          </button>
        </div>

        <div className="search-modal__results">
          {results.length === 0 ? (
            <p className="search-modal__empty">Nenhuma página encontrada</p>
          ) : (
            results.map((page, index) => (
              <button
                key={page.id}
                type="button"
                className={`search-modal__result ${index === selectedIndex ? 'search-modal__result--active' : ''}`}
                onClick={() => handleSelect(page.id)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="search-modal__result-icon">
                  {page.icon || <FileText size={16} />}
                </span>
                <span className="search-modal__result-text">
                  <span className="search-modal__result-title">
                    {page.title || 'Sem título'}
                  </span>
                  {query.trim() && (
                    <span className="search-modal__result-preview">
                      {extractTextFromContent(page.content).slice(0, 80) || 'Página vazia'}
                    </span>
                  )}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="search-modal__hint">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span>esc fechar</span>
        </div>
      </div>
    </div>
  )
}
