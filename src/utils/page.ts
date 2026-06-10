import { extractTextFromContent } from './content'
import type { Page } from '../types'

export function isPageEmpty(page: Page): boolean {
  const hasTitle = page.title.trim() && page.title !== 'Sem título'
  const hasContent = extractTextFromContent(page.content).trim().length > 0
  return !hasTitle && !hasContent
}
