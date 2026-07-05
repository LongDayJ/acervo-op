export interface Fonte {
  id: number
  nome: string
  abreviacao: string | null
}

export interface Modificacao {
  tipo: 'discente' | 'verdadeiro'
  custo_pe: number
  requisitos?: string[] | null
  descricao: string
}

export interface Ritual {
  slug: string
  nome: string
  circulo: number
  elementos: string[]
  execucao?: string | null
  alcance?: string | null
  area?: string | null
  alvo?: string | null
  efeito?: string | null
  duracao?: string | null
  resistencia?: string | null
  descricao: string
  modificacoes?: Modificacao[]
  fonte: Fonte
}

export interface Origem {
  nome: string
  slug: string
  descricao: string
  periciasTreinadas: string[] | null
  nomeDoPoder: string
  poderDeOrigem: string
  fonte: Fonte
}

export type PoderTipo = 'Combatente' | 'Especialista' | 'Geral' | 'Ocultista'

export interface Poder {
  slug: string
  nome: string
  tipo: PoderTipo
  requisitos: string[] | null
  descricao: string
  fonte: Fonte
}
