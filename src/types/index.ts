export interface Page {
  id: string
  title: string
  icon: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface Workspace {
  pages: Page[]
  activePageId: string | null
}
