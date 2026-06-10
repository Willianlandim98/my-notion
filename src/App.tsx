import { useEffect, useState } from 'react'
import { SearchModal } from './components/SearchModal'
import { Sidebar } from './components/Sidebar'
import { PageView } from './components/PageView'
import { usePages } from './hooks/usePages'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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

  return (
    <div className="app">
      <Sidebar
        pages={pages}
        activePageId={activePageId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        onSelectPage={setActivePage}
        onCreatePage={createPage}
        onDeletePage={deletePage}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {searchOpen && (
        <SearchModal
          pages={pages}
          onSelectPage={setActivePage}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {activePage ? (
        <PageView
          page={activePage}
          onUpdate={(updates) => updatePage(activePage.id, updates)}
        />
      ) : (
        <main className="page-view page-view--empty">
          <p>Selecione ou crie uma página</p>
        </main>
      )}
    </div>
  )
}

export default App
