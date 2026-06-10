import { useEffect, useState } from 'react'
import { ConfirmDialog } from './components/ConfirmDialog'
import { SearchModal } from './components/SearchModal'
import { Sidebar } from './components/Sidebar'
import { PageView } from './components/PageView'
import { usePages } from './hooks/usePages'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)
  const [focusTitlePageId, setFocusTitlePageId] = useState<string | null>(null)
  const {
    pages,
    activePage,
    activePageId,
    setActivePage,
    createPage,
    updatePage,
    deletePage,
  } = usePages()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCreatePage = () => {
    const id = createPage()
    setFocusTitlePageId(id)
    setSidebarCollapsed(false)
  }

  const handleConfirmDelete = () => {
    if (pageToDelete) {
      deletePage(pageToDelete)
      setPageToDelete(null)
    }
  }

  const pageToDeleteData = pages.find((p) => p.id === pageToDelete)

  return (
    <div className="app">
      <Sidebar
        pages={pages}
        activePageId={activePageId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onSelectPage={setActivePage}
        onCreatePage={handleCreatePage}
        onDeletePage={setPageToDelete}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {searchOpen && (
        <SearchModal
          pages={pages}
          onSelectPage={setActivePage}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {pageToDelete && (
        <ConfirmDialog
          title="Excluir página?"
          message={`"${pageToDeleteData?.title || 'Sem título'}" será removida permanentemente.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPageToDelete(null)}
        />
      )}

      {activePage ? (
        <PageView
          page={activePage}
          focusTitle={focusTitlePageId === activePage.id}
          onTitleFocused={() => setFocusTitlePageId(null)}
          onUpdate={(updates) => updatePage(activePage.id, updates)}
          onCreatePage={handleCreatePage}
          onOpenSearch={() => setSearchOpen(true)}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        />
      ) : (
        <main className="page-view page-view--empty">
          <div className="page-view__empty-state">
            <p className="page-view__empty-title">Nenhuma página selecionada</p>
            <p className="page-view__empty-text">Escolha uma página na barra lateral ou crie uma nova.</p>
            <button type="button" className="page-view__empty-btn" onClick={handleCreatePage}>
              Criar primeira página
            </button>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
