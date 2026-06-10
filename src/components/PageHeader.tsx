import { Check, PanelLeft } from 'lucide-react'

interface PageHeaderProps {
  pageTitle: string
  saved: boolean
  onToggleSidebar: () => void
}

export function PageHeader({ pageTitle, saved, onToggleSidebar }: PageHeaderProps) {
  return (
    <header className="page-header">
      <button
        type="button"
        className="page-header__menu-btn"
        onClick={onToggleSidebar}
        aria-label="Alternar barra lateral"
      >
        <PanelLeft size={18} />
      </button>

      <nav className="page-header__breadcrumb" aria-label="Navegação">
        <span className="page-header__workspace">My Notion</span>
        <span className="page-header__sep">/</span>
        <span className="page-header__page">{pageTitle || 'Sem título'}</span>
      </nav>

      <div className={`page-header__status ${saved ? 'page-header__status--saved' : ''}`}>
        <Check size={14} />
        <span>{saved ? 'Salvo' : 'Salvando...'}</span>
      </div>
    </header>
  )
}
