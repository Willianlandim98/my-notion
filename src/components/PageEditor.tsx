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
          if (node.type.name === 'heading') {
            return 'Título'
          }
          return "Digite '/' para comandos ou comece a escrever..."
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

  return (
    <div className="page-editor">
      <div className="page-editor__toolbar">
        <button
          type="button"
          className={editor.isActive('bold') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={editor.isActive('strike') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </button>
        <span className="page-editor__divider" />
        <button
          type="button"
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <span className="page-editor__divider" />
        <button
          type="button"
          className={editor.isActive('bulletList') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Lista
        </button>
        <button
          type="button"
          className={editor.isActive('orderedList') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Lista
        </button>
        <button
          type="button"
          className={editor.isActive('taskList') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          ☑ Tarefas
        </button>
        <span className="page-editor__divider" />
        <button
          type="button"
          className={editor.isActive('blockquote') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “ Citação
        </button>
        <button
          type="button"
          className={editor.isActive('codeBlock') ? 'active' : ''}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {'</>'}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
