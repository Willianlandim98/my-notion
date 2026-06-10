import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import type { Page } from '../types'

interface SidebarProps {
  pages: Page[]
  activePageId: string | null
  collapsed: boolean
  onToggleCollapse: () => void
  onSelectPage: (id: string) => void
  onCreatePage: () => void
  onDeletePage: (id: string) => void
  onOpenSearch: () => void
}

export function Sidebar({
  pages,
  activePageId,
  collapsed,
  onToggleCollapse,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  onOpenSearch,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {!collapsed && (
          <div className="sidebar__workspace">
            <span className="sidebar__workspace-icon">✦</span>
            <span className="sidebar__workspace-name">My Notion</span>
          </div>
        )}
        <button
          type="button"
          className="sidebar__collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {collapsed ? (
        <div className="sidebar__collapsed-actions">
          <button
            type="button"
            className="sidebar__icon-btn"
            onClick={onOpenSearch}
            title="Buscar (Ctrl+K)"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="sidebar__icon-btn"
            onClick={onCreatePage}
            title="Nova página"
            aria-label="Nova página"
          >
            <Plus size={18} />
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="sidebar__search"
            onClick={onOpenSearch}
            title="Buscar páginas (Ctrl+K)"
          >
            <Search size={14} />
            <span>Buscar</span>
            <kbd className="sidebar__shortcut">Ctrl K</kbd>
          </button>

          <button
            type="button"
            className="sidebar__new-page"
            onClick={onCreatePage}
            title="Criar uma nova página"
          >
            <Plus size={16} />
            <span>Nova página</span>
          </button>

          <nav className="sidebar__pages">
            <p className="sidebar__section-label">Páginas</p>
            {pages.length === 0 ? (
              <p className="sidebar__empty">Nenhuma página ainda</p>
            ) : (
              pages.map((page) => (
                <div
                  key={page.id}
                  className={`sidebar__page ${page.id === activePageId ? 'sidebar__page--active' : ''}`}
                >
                  <button
                    type="button"
                    className="sidebar__page-btn"
                    onClick={() => onSelectPage(page.id)}
                    title={page.title || 'Sem título'}
                  >
                    <span className="sidebar__page-icon">{page.icon || <FileText size={14} />}</span>
                    <span className="sidebar__page-title">{page.title || 'Sem título'}</span>
                  </button>
                  {pages.length > 1 && (
                    <button
                      type="button"
                      className="sidebar__page-delete"
                      onClick={() => onDeletePage(page.id)}
                      title="Excluir página"
                      aria-label="Excluir página"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))
            )}
          </nav>

          <p className="sidebar__footer-hint">Passe o mouse sobre uma página para excluir</p>
        </>
      )}
    </aside>
  )
}
