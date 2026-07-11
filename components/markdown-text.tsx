'use client'

import { cn } from '@/lib/utils'

/**
 * Renderer Markdown minimalista — suporta **negrito**, *itálico*, e parágrafos.
 * Sem dependências externas.
 */
export function MarkdownText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.replace(/\\n/g, '\n').split(/\n\n+/)

  return (
    <div className={cn('space-y-2', className)}>
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
          <InlineMarkdown text={para.trim()} />
        </p>
      ))}
    </div>
  )
}

function InlineMarkdown({ text }: { text: string }) {
  // Processa **negrito** e *itálico* em ordem
  const parts: React.ReactNode[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-semibold text-foreground">{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(<em key={match.index} className="italic">{match[3]}</em>)
    }
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))

  return <>{parts}</>
}
