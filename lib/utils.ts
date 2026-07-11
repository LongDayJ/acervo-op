import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ELEMENT_STYLES: Record<string, { pill: string; filter: string; active: string }> = {
  Morte: {
    pill: 'bg-slate-900/80 text-slate-300 border border-slate-700/50',
    filter: 'border-slate-700/50 text-slate-400/70 hover:bg-slate-900/50 hover:text-slate-300',
    active: 'bg-slate-900/80 border-slate-600/60 text-slate-200',
  },
  Medo: {
    pill: 'bg-white/5 text-white border border-white/20',
    filter: 'border-white/20 text-white/50 hover:bg-white/10 hover:text-white/80',
    active: 'bg-white/10 border-white/40 text-white',
  },
  Sangue: {
    pill: 'bg-rose-950/70 text-rose-400 border border-rose-900/50',
    filter: 'border-rose-900/50 text-rose-400/70 hover:bg-rose-950/40 hover:text-rose-300',
    active: 'bg-rose-950/70 border-rose-700/60 text-rose-300',
  },
  Conhecimento: {
    pill: 'bg-yellow-950/70 text-yellow-400 border border-yellow-900/50',
    filter: 'border-yellow-900/50 text-yellow-400/70 hover:bg-yellow-950/40 hover:text-yellow-300',
    active: 'bg-yellow-950/70 border-yellow-700/60 text-yellow-300',
  },
  Energia: {
    pill: 'bg-purple-950/70 text-purple-300 border border-purple-900/50',
    filter: 'border-purple-900/50 text-purple-300/70 hover:bg-purple-950/40 hover:text-purple-200',
    active: 'bg-purple-950/70 border-purple-700/60 text-purple-200',
  },
  'Morto-Vivo': {
    pill: 'bg-violet-950/70 text-violet-300 border border-violet-900/50',
    filter: 'border-violet-900/50 text-violet-300/70 hover:bg-violet-950/40 hover:text-violet-200',
    active: 'bg-violet-950/70 border-violet-700/60 text-violet-200',
  },
}

export function getElementStyle(element: string) {
  return (
    ELEMENT_STYLES[element] ?? {
      pill: 'bg-zinc-900/70 text-zinc-400 border border-zinc-800/50',
      filter: 'border-zinc-700/50 text-zinc-400/70 hover:bg-zinc-900/40 hover:text-zinc-300',
      active: 'bg-zinc-900/70 border-zinc-700/60 text-zinc-300',
    }
  )
}

/** Converte hex #rrggbb → "r, g, b" */
function hexToRgb(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}` : '113, 113, 122'
}

/**
 * Gera estilos inline para um elemento dinâmico (vindo do banco).
 * Usar como `style={getElementoInlineStyle(elemento.cor).pill}` nos componentes.
 */
export function getElementoInlineStyle(cor: string) {
  const rgb = hexToRgb(cor)
  return {
    pill:   { backgroundColor: `rgba(${rgb}, 0.15)`, color: cor, border: `1px solid rgba(${rgb}, 0.4)` } as React.CSSProperties,
    filter: { borderColor: `rgba(${rgb}, 0.3)`,       color: `rgba(${rgb}, 0.7)`, border: `1px solid rgba(${rgb}, 0.3)` } as React.CSSProperties,
    active: { backgroundColor: `rgba(${rgb}, 0.2)`,   color: cor,                 border: `1px solid rgba(${rgb}, 0.6)` } as React.CSSProperties,
  }
}

export const TIPO_STYLES: Record<string, { pill: string; filter: string; active: string }> = {
  Combatente: {
    pill: 'bg-orange-950/70 text-orange-400 border border-orange-900/50',
    filter: 'border-orange-900/50 text-orange-400/70 hover:bg-orange-950/40 hover:text-orange-300',
    active: 'bg-orange-950/70 border-orange-700/60 text-orange-300',
  },
  Especialista: {
    pill: 'bg-blue-950/70 text-blue-400 border border-blue-900/50',
    filter: 'border-blue-900/50 text-blue-400/70 hover:bg-blue-950/40 hover:text-blue-300',
    active: 'bg-blue-950/70 border-blue-700/60 text-blue-300',
  },
  Geral: {
    pill: 'bg-lime-950/70 text-lime-400 border border-lime-900/50',
    filter: 'border-lime-900/50 text-lime-400/70 hover:bg-lime-950/40 hover:text-lime-300',
    active: 'bg-lime-950/70 border-lime-700/60 text-lime-300',
  },
  Ocultista: {
    pill: 'bg-fuchsia-950/70 text-fuchsia-300 border border-fuchsia-900/50',
    filter: 'border-fuchsia-900/50 text-fuchsia-300/70 hover:bg-fuchsia-950/40 hover:text-fuchsia-200',
    active: 'bg-fuchsia-950/70 border-fuchsia-700/60 text-fuchsia-200',
  },
}

export function getTipoStyle(tipo: string) {
  return (
    TIPO_STYLES[tipo] ?? {
      pill: 'bg-zinc-900/70 text-zinc-400 border border-zinc-800/50',
      filter: 'border-zinc-700/50 text-zinc-400/70 hover:bg-zinc-900/40 hover:text-zinc-300',
      active: 'bg-zinc-900/70 border-zinc-700/60 text-zinc-300',
    }
  )
}

export const CIRCLE_ROMAN: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
}

export const CIRCLE_COLOR: Record<number, string> = {
  1: 'text-indigo-400',
  2: 'text-violet-400',
  3: 'text-purple-300',
  4: 'text-fuchsia-400',
  5: 'text-rose-400',
}
