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
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!collapsed && (
        <>
          <button type="button" className="sidebar__search" onClick={onOpenSearch}>
            <Search size={14} />
            <span>Buscar</span>
          </button>

          <button type="button" className="sidebar__new-page" onClick={onCreatePage}>
            <Plus size={16} />
            <span>Nova página</span>
          </button>

          <nav className="sidebar__pages">
            <p className="sidebar__section-label">Páginas</p>
            {pages.map((page) => (
              <div
                key={page.id}
                className={`sidebar__page ${page.id === activePageId ? 'sidebar__page--active' : ''}`}
              >
                <button
                  type="button"
                  className="sidebar__page-btn"
                  onClick={() => onSelectPage(page.id)}
                >
                  <span className="sidebar__page-icon">{page.icon || <FileText size={14} />}</span>
                  <span className="sidebar__page-title">{page.title || 'Sem título'}</span>
                </button>
                {pages.length > 1 && (
                  <button
                    type="button"
                    className="sidebar__page-delete"
                    onClick={() => onDeletePage(page.id)}
                    aria-label="Excluir página"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </nav>
        </>
      )}
    </aside>
  )
}
