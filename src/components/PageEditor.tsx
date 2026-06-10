import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { useEffect, useRef } from 'react'

function safeParseContent(content: string) {
  try {
    return JSON.parse(content)
  } catch {
    return undefined
  }
}

const TOOLBAR_ITEMS = [
  { id: 'bold', label: 'Negrito', shortcut: 'Ctrl+B', render: () => <strong>B</strong>, command: 'toggleBold' },
  { id: 'italic', label: 'Itálico', shortcut: 'Ctrl+I', render: () => <em>I</em>, command: 'toggleItalic' },
  { id: 'strike', label: 'Tachado', shortcut: '', render: () => <s>S</s>, command: 'toggleStrike' },
] as const

interface PageEditorProps {
  content: string
  onChange: (content: string) => void
}

export function PageEditor({ content, onChange }: PageEditorProps) {
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') return 'Título da seção'
          return 'Comece a escrever aqui...'
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: content ? safeParseContent(content) : undefined,
    onUpdate: ({ editor }) => {
      isExternalUpdate.current = true
      onChange(JSON.stringify(editor.getJSON()))
      requestAnimationFrame(() => {
        isExternalUpdate.current = false
      })
    },
    editorProps: {
      attributes: {
        class: 'editor-content',
        'aria-label': 'Conteúdo da página',
      },
    },
  })

  useEffect(() => {
    if (!editor || isExternalUpdate.current) return
    const current = JSON.stringify(editor.getJSON())
    if (content !== current) {
      editor.commands.setContent(safeParseContent(content) ?? '')
    }
  }, [content, editor])

  if (!editor) return null

  const runCommand = (command: string, attrs?: Record<string, unknown>) => {
    const chain = editor.chain().focus()
    if (command === 'toggleHeading' && attrs?.level) {
      chain.toggleHeading({ level: attrs.level as 1 | 2 | 3 }).run()
      return
    }
    // @ts-expect-error dynamic tiptap commands
    chain[command]().run()
  }

  return (
    <div className="page-editor">
      <div className="page-editor__toolbar" role="toolbar" aria-label="Formatação de texto">
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={editor.isActive(item.id) ? 'active' : ''}
            title={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}`}
            onClick={() => runCommand(item.command)}
          >
            {item.render()}
          </button>
        ))}
        <span className="page-editor__divider" />
        <button
          type="button"
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          title="Título grande (H1)"
          onClick={() => runCommand('toggleHeading', { level: 1 })}
        >
          H1
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          title="Título médio (H2)"
          onClick={() => runCommand('toggleHeading', { level: 2 })}
        >
          H2
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          title="Título pequeno (H3)"
          onClick={() => runCommand('toggleHeading', { level: 3 })}
        >
          H3
        </button>
        <span className="page-editor__divider" />
        <button
          type="button"
          className={editor.isActive('bulletList') ? 'active' : ''}
          title="Lista com marcadores"
          onClick={() => runCommand('toggleBulletList')}
        >
          • Lista
        </button>
        <button
          type="button"
          className={editor.isActive('orderedList') ? 'active' : ''}
          title="Lista numerada"
          onClick={() => runCommand('toggleOrderedList')}
        >
          1. Lista
        </button>
        <button
          type="button"
          className={editor.isActive('taskList') ? 'active' : ''}
          title="Lista de tarefas com checkbox"
          onClick={() => runCommand('toggleTaskList')}
        >
          ☑ Tarefas
        </button>
        <span className="page-editor__divider" />
        <button
          type="button"
          className={editor.isActive('blockquote') ? 'active' : ''}
          title="Citação"
          onClick={() => runCommand('toggleBlockquote')}
        >
          “ Citação
        </button>
        <button
          type="button"
          className={editor.isActive('codeBlock') ? 'active' : ''}
          title="Bloco de código"
          onClick={() => runCommand('toggleCodeBlock')}
        >
          {'</>'}
        </button>
      </div>

      {editor.isEmpty && (
        <p className="page-editor__hint">Use a barra acima para negrito, listas, tarefas e mais</p>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
