import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ELEMENT_STYLES: Record<string, { pill: string; filter: string; active: string }> = {
  Morte: {
    pill:   'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-700/50',
    filter: 'border-slate-300 text-slate-600/80 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700/50 dark:text-slate-400/70 dark:hover:bg-slate-900/50 dark:hover:text-slate-300',
    active: 'bg-slate-100 border-slate-400 text-slate-700 dark:bg-slate-900/80 dark:border-slate-600/60 dark:text-slate-200',
  },
  Medo: {
    pill:   'bg-zinc-100 text-zinc-600 border border-zinc-300 dark:bg-white/5 dark:text-white dark:border-white/20',
    filter: 'border-zinc-300 text-zinc-500/80 hover:bg-zinc-100 hover:text-zinc-700 dark:border-white/20 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/80',
    active: 'bg-zinc-100 border-zinc-400 text-zinc-700 dark:bg-white/10 dark:border-white/40 dark:text-white',
  },
  Sangue: {
    pill:   'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-400 dark:border-rose-900/50',
    filter: 'border-rose-200 text-rose-600/80 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400/70 dark:hover:bg-rose-950/40 dark:hover:text-rose-300',
    active: 'bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-950/70 dark:border-rose-700/60 dark:text-rose-300',
  },
  Conhecimento: {
    pill:   'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-950/70 dark:text-yellow-400 dark:border-yellow-900/50',
    filter: 'border-yellow-200 text-yellow-600/80 hover:bg-yellow-100 hover:text-yellow-700 dark:border-yellow-900/50 dark:text-yellow-400/70 dark:hover:bg-yellow-950/40 dark:hover:text-yellow-300',
    active: 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-950/70 dark:border-yellow-700/60 dark:text-yellow-300',
  },
  Energia: {
    pill:   'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-900/50',
    filter: 'border-purple-200 text-purple-600/80 hover:bg-purple-100 hover:text-purple-700 dark:border-purple-900/50 dark:text-purple-300/70 dark:hover:bg-purple-950/40 dark:hover:text-purple-200',
    active: 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-950/70 dark:border-purple-700/60 dark:text-purple-200',
  },
  'Morto-Vivo': {
    pill:   'bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-900/50',
    filter: 'border-violet-200 text-violet-600/80 hover:bg-violet-100 hover:text-violet-700 dark:border-violet-900/50 dark:text-violet-300/70 dark:hover:bg-violet-950/40 dark:hover:text-violet-200',
    active: 'bg-violet-100 border-violet-300 text-violet-700 dark:bg-violet-950/70 dark:border-violet-700/60 dark:text-violet-200',
  },
}

export function getElementStyle(element: string) {
  return (
    ELEMENT_STYLES[element] ?? {
      pill:   'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-900/70 dark:text-zinc-400 dark:border-zinc-800/50',
      filter: 'border-zinc-200 text-zinc-500/80 hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-700/50 dark:text-zinc-400/70 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-300',
      active: 'bg-zinc-100 border-zinc-300 text-zinc-600 dark:bg-zinc-900/70 dark:border-zinc-700/60 dark:text-zinc-300',
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
    pill:   'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-950/70 dark:text-orange-400 dark:border-orange-900/50',
    filter: 'border-orange-200 text-orange-600/80 hover:bg-orange-100 hover:text-orange-700 dark:border-orange-900/50 dark:text-orange-400/70 dark:hover:bg-orange-950/40 dark:hover:text-orange-300',
    active: 'bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-950/70 dark:border-orange-700/60 dark:text-orange-300',
  },
  Especialista: {
    pill:   'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/70 dark:text-blue-400 dark:border-blue-900/50',
    filter: 'border-blue-200 text-blue-600/80 hover:bg-blue-100 hover:text-blue-700 dark:border-blue-900/50 dark:text-blue-400/70 dark:hover:bg-blue-950/40 dark:hover:text-blue-300',
    active: 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-950/70 dark:border-blue-700/60 dark:text-blue-300',
  },
  Geral: {
    pill:   'bg-lime-100 text-lime-700 border border-lime-200 dark:bg-lime-950/70 dark:text-lime-400 dark:border-lime-900/50',
    filter: 'border-lime-200 text-lime-600/80 hover:bg-lime-100 hover:text-lime-700 dark:border-lime-900/50 dark:text-lime-400/70 dark:hover:bg-lime-950/40 dark:hover:text-lime-300',
    active: 'bg-lime-100 border-lime-300 text-lime-700 dark:bg-lime-950/70 dark:border-lime-700/60 dark:text-lime-300',
  },
  Ocultista: {
    pill:   'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 dark:border-fuchsia-900/50',
    filter: 'border-fuchsia-200 text-fuchsia-600/80 hover:bg-fuchsia-100 hover:text-fuchsia-700 dark:border-fuchsia-900/50 dark:text-fuchsia-300/70 dark:hover:bg-fuchsia-950/40 dark:hover:text-fuchsia-200',
    active: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700 dark:bg-fuchsia-950/70 dark:border-fuchsia-700/60 dark:text-fuchsia-200',
  },
  Paranormal: {
    pill:   'bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-900/50',
    filter: 'border-violet-200 text-violet-600/80 hover:bg-violet-100 hover:text-violet-700 dark:border-violet-900/50 dark:text-violet-300/70 dark:hover:bg-violet-950/40 dark:hover:text-violet-200',
    active: 'bg-violet-100 border-violet-300 text-violet-700 dark:bg-violet-950/70 dark:border-violet-700/60 dark:text-violet-200',
  },
}

export function getTipoStyle(tipo: string) {
  return (
    TIPO_STYLES[tipo] ?? {
      pill:   'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-900/70 dark:text-zinc-400 dark:border-zinc-800/50',
      filter: 'border-zinc-200 text-zinc-500/80 hover:bg-zinc-100 hover:text-zinc-600 dark:border-zinc-700/50 dark:text-zinc-400/70 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-300',
      active: 'bg-zinc-100 border-zinc-300 text-zinc-600 dark:bg-zinc-900/70 dark:border-zinc-700/60 dark:text-zinc-300',
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
