interface TiptapNode {
  text?: string
  content?: TiptapNode[]
}

export function extractTextFromContent(content: string): string {
  if (!content) return ''

  try {
    const doc = JSON.parse(content) as TiptapNode
    const texts: string[] = []

    const walk = (node: TiptapNode) => {
      if (node.text) texts.push(node.text)
      node.content?.forEach(walk)
    }

    walk(doc)
    return texts.join(' ')
  } catch {
    return ''
  }
}
