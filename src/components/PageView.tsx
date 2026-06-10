import { useEffect, useRef, useState } from 'react'
import type { Page } from '../types'
import { useClickOutside } from '../hooks/useClickOutside'
import { isPageEmpty } from '../utils/page'
import { PageEditor } from './PageEditor'
import { PageHeader } from './PageHeader'
import { WelcomeHints } from './WelcomeHints'

const EMOJI_OPTIONS = ['📝', '📌', '💡', '🎯', '📚', '🚀', '⭐', '🔥', '💼', '🎨', '📊', '🏠']

interface PageViewProps {
  page: Page
  focusTitle?: boolean
  onTitleFocused?: () => void
  onUpdate: (updates: Partial<Pick<Page, 'title' | 'icon' | 'content'>>) => void
  onCreatePage: () => void
  onOpenSearch: () => void
  onToggleSidebar: () => void
}

export function PageView({
  page,
  focusTitle,
  onTitleFocused,
  onUpdate,
  onCreatePage,
  onOpenSearch,
  onToggleSidebar,
}: PageViewProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [saved, setSaved] = useState(true)
  const titleRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  useClickOutside(emojiRef, () => setShowEmojiPicker(false), showEmojiPicker)

  useEffect(() => {
    setSaved(false)
    const timer = window.setTimeout(() => setSaved(true), 400)
    return () => window.clearTimeout(timer)
  }, [page.title, page.icon, page.content])

  useEffect(() => {
    if (focusTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
      onTitleFocused?.()
    }
  }, [focusTitle, onTitleFocused])

  const showWelcome = isPageEmpty(page)

  return (
    <div className="page-view__wrapper">
      <PageHeader
        pageTitle={page.title}
        saved={saved}
        onToggleSidebar={onToggleSidebar}
      />

      <main className="page-view">
        <div className="page-view__cover" />

        <div className="page-view__body">
          <div className="page-view__icon-row" ref={emojiRef}>
            <button
              type="button"
              className="page-view__icon-btn"
              onClick={() => setShowEmojiPicker((v) => !v)}
              title="Clique para alterar o ícone"
              aria-label="Alterar ícone"
            >
              {page.icon}
            </button>
            {!showEmojiPicker && (
              <span className="page-view__icon-hint">Clique para alterar o ícone</span>
            )}
            {showEmojiPicker && (
              <div className="page-view__emoji-picker">
                <p className="page-view__emoji-label">Escolha um ícone</p>
                <div className="page-view__emoji-grid">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`page-view__emoji-option ${emoji === page.icon ? 'page-view__emoji-option--active' : ''}`}
                      onClick={() => {
                        onUpdate({ icon: emoji })
                        setShowEmojiPicker(false)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            ref={titleRef}
            className="page-view__title"
            value={page.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Sem título"
            aria-label="Título da página"
          />

          <PageEditor
            key={page.id}
            content={page.content}
            onChange={(content) => onUpdate({ content })}
          />

          {showWelcome && (
            <WelcomeHints onCreatePage={onCreatePage} onOpenSearch={onOpenSearch} />
          )}
        </div>
      </main>
    </div>
  )
}
