import { Keyboard, MousePointerClick, Plus, Search } from 'lucide-react'

interface WelcomeHintsProps {
  onCreatePage: () => void
  onOpenSearch: () => void
}

export function WelcomeHints({ onCreatePage, onOpenSearch }: WelcomeHintsProps) {
  return (
    <div className="welcome-hints">
      <p className="welcome-hints__title">Bem-vindo ao My Notion</p>
      <p className="welcome-hints__subtitle">
        Comece dando um título à página, depois escreva no editor abaixo.
      </p>

      <div className="welcome-hints__grid">
        <div className="welcome-hints__card">
          <Plus size={18} />
          <div>
            <strong>Nova página</strong>
            <span>Clique em &quot;Nova página&quot; na barra lateral</span>
          </div>
        </div>
        <div className="welcome-hints__card">
          <Search size={18} />
          <div>
            <strong>Buscar</strong>
            <span>
              Use o botão Buscar ou{' '}
              <kbd>Ctrl</kbd>+<kbd>K</kbd>
            </span>
          </div>
        </div>
        <div className="welcome-hints__card">
          <MousePointerClick size={18} />
          <div>
            <strong>Formatar texto</strong>
            <span>Use a barra de ferramentas acima do editor</span>
          </div>
        </div>
        <div className="welcome-hints__card">
          <Keyboard size={18} />
          <div>
            <strong>Atalhos úteis</strong>
            <span>
              <kbd>Ctrl</kbd>+<kbd>B</kbd> negrito · <kbd>Ctrl</kbd>+<kbd>I</kbd> itálico
            </span>
          </div>
        </div>
      </div>

      <div className="welcome-hints__actions">
        <button type="button" className="welcome-hints__btn" onClick={onCreatePage}>
          <Plus size={16} />
          Criar nova página
        </button>
        <button type="button" className="welcome-hints__btn welcome-hints__btn--ghost" onClick={onOpenSearch}>
          <Search size={16} />
          Buscar páginas
        </button>
      </div>
    </div>
  )
}
