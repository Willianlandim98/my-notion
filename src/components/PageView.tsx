import { useState } from 'react'
import type { Page } from '../types'
import { PageEditor } from './PageEditor'

const EMOJI_OPTIONS = ['📝', '📌', '💡', '🎯', '📚', '🚀', '⭐', '🔥', '💼', '🎨', '📊', '🏠']

interface PageViewProps {
  page: Page
  onUpdate: (updates: Partial<Pick<Page, 'title' | 'icon' | 'content'>>) => void
}

export function PageView({ page, onUpdate }: PageViewProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  return (
    <main className="page-view">
      <div className="page-view__cover" />

      <div className="page-view__body">
        <div className="page-view__icon-row">
          <button
            type="button"
            className="page-view__icon-btn"
            onClick={() => setShowEmojiPicker((v) => !v)}
            aria-label="Alterar ícone"
          >
            {page.icon}
          </button>
          {showEmojiPicker && (
            <div className="page-view__emoji-picker">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="page-view__emoji-option"
                  onClick={() => {
                    onUpdate({ icon: emoji })
                    setShowEmojiPicker(false)
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          className="page-view__title"
          value={page.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Sem título"
        />

        <PageEditor
          key={page.id}
          content={page.content}
          onChange={(content) => onUpdate({ content })}
        />
      </div>
    </main>
  )
}
