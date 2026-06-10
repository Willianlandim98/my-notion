import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Page, Workspace } from '../types'

const STORAGE_KEY = 'my-notion-workspace'

const defaultPage = (): Page => ({
  id: uuidv4(),
  title: 'Sem título',
  icon: '📝',
  content: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
})

const loadWorkspace = (): Workspace => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Workspace
      if (parsed.pages?.length > 0) return parsed
    }
  } catch {
    /* ignore corrupt data */
  }

  const page = defaultPage()
  return { pages: [page], activePageId: page.id }
}

export function usePages() {
  const [workspace, setWorkspace] = useState<Workspace>(loadWorkspace)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
  }, [workspace])

  const activePage = workspace.pages.find((p) => p.id === workspace.activePageId) ?? null

  const setActivePage = useCallback((id: string) => {
    setWorkspace((w) => ({ ...w, activePageId: id }))
  }, [])

  const createPage = useCallback(() => {
    const page = defaultPage()
    setWorkspace((w) => ({
      pages: [page, ...w.pages],
      activePageId: page.id,
    }))
    return page.id
  }, [])

  const updatePage = useCallback((id: string, updates: Partial<Pick<Page, 'title' | 'icon' | 'content'>>) => {
    setWorkspace((w) => ({
      ...w,
      pages: w.pages.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p,
      ),
    }))
  }, [])

  const deletePage = useCallback((id: string) => {
    setWorkspace((w) => {
      const pages = w.pages.filter((p) => p.id !== id)
      if (pages.length === 0) {
        const page = defaultPage()
        return { pages: [page], activePageId: page.id }
      }
      const activePageId =
        w.activePageId === id ? pages[0].id : w.activePageId
      return { pages, activePageId }
    })
  }, [])

  return {
    pages: workspace.pages,
    activePage,
    activePageId: workspace.activePageId,
    setActivePage,
    createPage,
    updatePage,
    deletePage,
  }
}
