import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { PageView } from './components/PageView'
import { usePages } from './hooks/usePages'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const {
    pages,
    activePage,
    activePageId,
    setActivePage,
    createPage,
    updatePage,
    deletePage,
  } = usePages()

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
      />

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
