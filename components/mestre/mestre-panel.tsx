'use client'

import { useState, useTransition, useRef, useMemo } from 'react'
import { cn, getElementStyle } from '@/lib/utils'
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react'
import {
  createFonte, updateFonte, deleteFonte,
  createRitual, updateRitual, deleteRitual,
  createPoder, updatePoder, deletePoder,
  createOrigem, updateOrigem, deleteOrigem,
  createUsuario, updateUsuario, deleteUsuario,
} from '@/app/mestre/actions'

// --- TYPES -------------------------------------------------------------------

interface Fonte { id: number; nome: string; abreviacao: string | null }

interface Modificacao {
  id?: number; tipo: string; custo_pe: number
  requisitos?: string[] | null; descricao: string
}

interface Ritual {
  id: number; slug: string; nome: string; circulo: number
  elementos: string[]; descricao: string; fonte: Fonte
  execucao?: string | null; alcance?: string | null; area?: string | null
  alvo?: string | null; efeito?: string | null; duracao?: string | null
  resistencia?: string | null; modificacoes?: Modificacao[]
}

interface ModForm { tipo: string; custo_pe: string; requisitos: string[]; descricao: string }
const BLANK_MOD: ModForm = { tipo: 'Discente', custo_pe: '', requisitos: [], descricao: '' }

interface Poder {
  id: number; slug: string; nome: string; tipo: string
  requisitos: string[] | null; descricao: string; fonte: Fonte
}

interface Origem {
  id: number; slug: string; nome: string; descricao: string
  periciasTreinadas: string[] | null; nomeDoPoder: string
  poderDeOrigem: string; fonte: Fonte
}

interface Usuario {
  id: number; name: string; surname: string | null; email: string
  roleId: number | null; roleName: string | null; createdAt: string
}

interface RoleOption { id: number; name: string; description: string | null }

interface Props {
  fontes: Fonte[]
  rituais: Ritual[]
  poderes: Poder[]
  origens: Origem[]
  usuarios: Usuario[]
  roles: RoleOption[]
  currentUserId: number
  canManageUsers: boolean
}

// --- HELPERS -----------------------------------------------------------------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full h-8 px-2.5 rounded border border-border bg-background/60 text-sm text-foreground',
        'placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50',
        props.className,
      )}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full px-2.5 py-2 rounded border border-border bg-background/60 text-sm text-foreground resize-none',
        'placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50',
        props.className,
      )}
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={cn(
        'w-full h-8 px-2.5 rounded border border-border bg-background/60 text-sm text-foreground',
        'focus:outline-none focus:ring-1 focus:ring-primary/50',
        props.className,
      )}
    />
  )
}

// --- TAG INPUT ---------------------------------------------------------------

function TagInput({
  tags,
  onChange,
  suggestions,
  placeholder,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
  placeholder?: string
}) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(
    () => suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)).slice(0, 20),
    [suggestions, input, tags],
  )

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed])
    setInput('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function removeTag(i: number) { onChange(tags.filter((_, idx) => idx !== i)) }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); if (input.trim()) addTag(input) }
    else if (e.key === 'Backspace' && !input && tags.length > 0) onChange(tags.slice(0, -1))
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className="relative">
      <div
        className="min-h-8 px-2 py-1 rounded border border-border bg-background/60 flex flex-wrap gap-1 focus-within:ring-1 focus-within:ring-primary/50 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-0.5 h-5 px-1.5 rounded bg-primary/15 text-primary text-[11px] font-medium">
            {tag}
            <button type="button" onMouseDown={(e) => { e.preventDefault(); removeTag(i) }} className="ml-0.5 hover:text-rose-400 transition-colors">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] h-5 text-sm bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-y-auto rounded border border-border bg-card shadow-lg">
          {filtered.map((s) => (
            <button key={s} type="button" onMouseDown={() => addTag(s)} className="w-full px-2.5 py-1.5 text-left text-sm text-foreground hover:bg-primary/10 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// --- MODAL -------------------------------------------------------------------

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  )
}

// --- TABLE -------------------------------------------------------------------

function EntityTable<T extends { id: number }>({
  columns, rows, onEdit, onDelete, isPending,
}: {
  columns: { key: string; label: string; render: (row: T) => React.ReactNode }[]
  rows: T[]
  onEdit: (row: T) => void
  onDelete: (id: number) => void
  isPending: boolean
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</th>
            ))}
            <th className="px-3 py-2.5 w-[80px]" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="px-3 py-6 text-center text-sm text-muted-foreground">Nenhum item cadastrado</td></tr>
          ) : rows.map((row, i) => (
            <tr key={row.id} className={cn('border-b border-border/50 hover:bg-muted/10 transition-colors', i === rows.length - 1 && 'border-b-0')}>
              {columns.map((c) => <td key={c.key} className="px-3 py-2.5 text-foreground/80">{c.render(row)}</td>)}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1 justify-end">
                  <button onClick={() => onEdit(row)} disabled={isPending} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors disabled:opacity-40"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => onDelete(row.id)} disabled={isPending} className="p-1 rounded text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-40"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- TABS --------------------------------------------------------------------

type Tab = 'fontes' | 'rituais' | 'poderes' | 'origens' | 'usuarios'
const TABS: { id: Tab; label: string }[] = [
  { id: 'fontes',   label: 'Fontes'   },
  { id: 'rituais',  label: 'Rituais'  },
  { id: 'poderes',  label: 'Poderes'  },
  { id: 'origens',  label: 'Origens'  },
  { id: 'usuarios', label: 'Usuarios' },
]

// --- FONTES TAB --------------------------------------------------------------

function FontesTab({ fontes: initial }: { fontes: Fonte[] }) {
  const [fontes, setFontes] = useState(initial)
  const [modal, setModal] = useState<'create' | Fonte | null>(null)
  const [isPending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [abreviacao, setAbreviacao] = useState('')

  function openCreate() { setNome(''); setAbreviacao(''); setModal('create'); setErr(null) }
  function openEdit(f: Fonte) { setNome(f.nome); setAbreviacao(f.abreviacao ?? ''); setModal(f); setErr(null) }

  function handleSubmit() {
    setErr(null)
    const data = { nome: nome.trim(), abreviacao: abreviacao.trim() || undefined }
    if (!data.nome) { setErr('Nome obrigatorio'); return }
    start(async () => {
      try {
        if (typeof modal === 'string') {
          const created = await createFonte(data)
          setFontes((prev) => [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome)))
        } else if (modal) {
          const updated = await updateFonte(modal.id, data)
          setFontes((prev) => prev.map((f) => f.id === updated.id ? updated : f))
        }
        setModal(null)
      } catch (e: any) { setErr(e.message ?? 'Erro desconhecido') }
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Deletar esta fonte?')) return
    start(async () => {
      try { await deleteFonte(id); setFontes((prev) => prev.filter((f) => f.id !== id)) }
      catch (e: any) { alert(e.message ?? 'Erro ao deletar') }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{fontes.length} fonte(s) cadastrada(s)</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
      </div>
      <EntityTable
        columns={[
          { key: 'id', label: 'ID', render: (f) => <span className="text-muted-foreground text-xs">{f.id}</span> },
          { key: 'nome', label: 'Nome', render: (f) => f.nome },
          { key: 'abrev', label: 'Abreviacao', render: (f) => f.abreviacao ?? <span className="text-muted-foreground/40">-</span> },
        ]}
        rows={fontes} onEdit={openEdit} onDelete={handleDelete} isPending={isPending}
      />
      {modal !== null && (
        <Modal title={modal === 'create' ? 'Nova Fonte' : 'Editar Fonte'} onClose={() => setModal(null)}>
          <Field label="Nome"><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Livro Base" /></Field>
          <Field label="Abreviacao (opcional)"><Input value={abreviacao} onChange={(e) => setAbreviacao(e.target.value)} placeholder="Ex: OPRPG" /></Field>
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(null)} className="h-8 px-3 rounded text-xs text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// --- RITUAIS TAB -------------------------------------------------------------

function RituaisTab({ rituais: initial, fontes }: { rituais: Ritual[]; fontes: Fonte[] }) {
  const [rituais, setRituais] = useState(initial)
  const [modal, setModal] = useState<'create' | Ritual | null>(null)
  const [isPending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  const blank = { nome: '', circulo: '1', elementos: '', fonteId: '', descricao: '', execucao: 'padrão', alcance: 'curto', area: '', alvo: '', efeito: '', duracao: '', resistencia: '' }
  const [form, setForm] = useState(blank)
  const f = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))
  const [mods, setMods] = useState<ModForm[]>([])

  const modReqSuggestions = useMemo(
    () => [...new Set(initial.flatMap((r) => r.modificacoes?.flatMap((m) => m.requisitos ?? []) ?? []))].sort(),
    [initial],
  )

  const sortedRituais = useMemo(
    () => [...rituais].sort((a, b) => {
      const fa = a.fonte?.id ?? 0
      const fb = b.fonte?.id ?? 0
      if (fa !== fb) return fa - fb
      return a.nome.localeCompare(b.nome, 'pt-BR')
    }),
    [rituais],
  )

  function modTextField(idx: number, key: Exclude<keyof ModForm, 'requisitos'>) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setMods((prev) => prev.map((m, i) => i === idx ? { ...m, [key]: e.target.value } : m))
  }
  function setModReqs(idx: number, reqs: string[]) {
    setMods((prev) => prev.map((m, i) => i === idx ? { ...m, requisitos: reqs } : m))
  }
  function addMod() { setMods((prev) => [...prev, { ...BLANK_MOD }]) }
  function removeMod(idx: number) { setMods((prev) => prev.filter((_, i) => i !== idx)) }

  function openCreate() { setForm(blank); setMods([]); setModal('create'); setErr(null) }
  function openEdit(r: Ritual) {
    setForm({
      nome: r.nome, circulo: String(r.circulo), elementos: r.elementos.join(', '), fonteId: String(r.fonte.id),
      descricao: r.descricao, execucao: r.execucao ?? '', alcance: r.alcance ?? '', area: r.area ?? '',
      alvo: r.alvo ?? '', efeito: r.efeito ?? '', duracao: r.duracao ?? '', resistencia: r.resistencia ?? '',
    })
    setMods((r.modificacoes ?? []).map((m) => ({ tipo: m.tipo, custo_pe: String(m.custo_pe), requisitos: m.requisitos ?? [], descricao: m.descricao })))
    setModal(r); setErr(null)
  }

  function buildPayload() {
    return {
      nome: form.nome.trim(), circulo: Number(form.circulo),
      elementos: form.elementos.split(',').map((s) => s.trim()).filter(Boolean),
      fonteId: Number(form.fonteId), descricao: form.descricao.trim(),
      execucao: form.execucao.trim() || null, alcance: form.alcance.trim() || null,
      area: form.area.trim() || null, alvo: form.alvo.trim() || null,
      efeito: form.efeito.trim() || null, duracao: form.duracao.trim() || null,
      resistencia: form.resistencia.trim() || null,
      modificacoes: mods.map((m) => ({
        tipo: m.tipo, custo_pe: Number(m.custo_pe) || 0,
        requisitos: m.requisitos.length > 0 ? m.requisitos : null,
        descricao: m.descricao.trim(),
      })),
    }
  }

  function handleSubmit() {
    setErr(null)
    const data = buildPayload()
    if (!data.nome) { setErr('Nome obrigatorio'); return }
    if (!data.fonteId) { setErr('Fonte obrigatoria'); return }
    start(async () => {
      try {
        if (typeof modal === 'string') {
          const created = await createRitual(data)
          setRituais((prev) => [...prev, created])
        } else if (modal) {
          const updated = await updateRitual(modal.id, data)
          setRituais((prev) => prev.map((r) => r.id === updated.id ? updated : r))
        }
        setModal(null)
      } catch (e: any) { setErr(e.message ?? 'Erro desconhecido') }
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Deletar este ritual?')) return
    start(async () => {
      try { await deleteRitual(id); setRituais((prev) => prev.filter((r) => r.id !== id)) }
      catch (e: any) { alert(e.message ?? 'Erro ao deletar') }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rituais.length} ritual(ais) cadastrado(s)</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
      </div>
      <EntityTable
        columns={[
          { key: 'nome', label: 'Nome', render: (r) => r.nome },
          { key: 'circulo', label: 'Circ.', render: (r) => <span className="text-xs">{r.circulo}</span> },
          { key: 'elementos', label: 'Elementos', render: (r) => <span className="text-xs text-muted-foreground">{r.elementos.join(', ')}</span> },
          { key: 'fonte', label: 'Fonte', render: (r) => <span className="text-xs">{r.fonte.abreviacao ?? r.fonte.nome}</span> },
        ]}
        rows={sortedRituais} onEdit={openEdit} onDelete={handleDelete} isPending={isPending}
      />
      {modal !== null && (
        <Modal title={modal === 'create' ? 'Novo Ritual' : 'Editar Ritual'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome"><Input value={form.nome} onChange={f('nome')} placeholder="Ex: Chamas de Belial" className="col-span-2" /></Field>
            <Field label="Circulo">
              <Select value={form.circulo} onChange={f('circulo')}>
                {[1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </Field>
            <Field label="Fonte">
              <Select value={form.fonteId} onChange={f('fonteId')}>
                <option value="">Selecionar...</option>
                {fontes.map((fn) => <option key={fn.id} value={fn.id}>{fn.nome}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Elementos">
            <div className="flex flex-wrap gap-1.5">
              {['Morte', 'Medo', 'Sangue', 'Conhecimento', 'Energia'].map((el) => {
                const cur = form.elementos.split(',').map((s) => s.trim()).filter(Boolean)
                const selected = cur.includes(el)
                const style = getElementStyle(el)
                return (
                  <button
                    key={el} type="button"
                    onClick={() => {
                      const next = selected ? cur.filter((e) => e !== el) : [...cur, el]
                      setForm((prev) => ({ ...prev, elementos: next.join(', ') }))
                    }}
                    className={cn('h-7 px-3 rounded-full text-xs font-medium transition-colors', selected ? style.active : style.filter)}
                  >
                    {el}
                  </button>
                )
              })}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Execucao">
              <select value={form.execucao} onChange={f('execucao')} className="w-full h-9 px-3 rounded-md text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60">
                <option value="">—</option>
                {['padrão', 'reação', 'completa', 'livre'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Alcance">
              <select value={form.alcance} onChange={f('alcance')} className="w-full h-9 px-3 rounded-md text-sm bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60">
                <option value="">—</option>
                {['pessoal', 'toque', 'curto', 'médio', 'longo', 'extremo', 'ilimitado', '1,5m', 'médio ou toque'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Area"><Input value={form.area} onChange={f('area')} placeholder="Ex: 6m" /></Field>
            <Field label="Alvo"><Input value={form.alvo} onChange={f('alvo')} placeholder="Ex: 1 criatura" /></Field>
            <Field label="Efeito"><Input value={form.efeito} onChange={f('efeito')} placeholder="Ex: 2d6 de dano" /></Field>
            <Field label="Duracao"><Input value={form.duracao} onChange={f('duracao')} placeholder="Ex: Instantaneo" /></Field>
            <Field label="Resistencia"><Input value={form.resistencia} onChange={f('resistencia')} placeholder="Ex: Fortitude" /></Field>
          </div>
          <Field label="Descricao">
            <Textarea value={form.descricao} onChange={f('descricao')} placeholder="Descricao completa..." rows={4} />
          </Field>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Modificacoes</span>
              <button type="button" onClick={addMod} className="flex items-center gap-1 h-6 px-2 rounded text-[11px] text-primary border border-primary/30 hover:bg-primary/10 transition-colors">
                <Plus className="h-3 w-3" /> Adicionar
              </button>
            </div>
            {mods.length === 0 && <p className="text-[11px] text-muted-foreground/50 py-1">Nenhuma modificacao. Clique em Adicionar.</p>}
            {mods.map((mod, idx) => (
              <div key={idx} className="rounded-lg border border-border/60 bg-muted/10 p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">Modificacao {idx + 1}</span>
                  <button type="button" onClick={() => removeMod(idx)} className="text-muted-foreground hover:text-rose-400 transition-colors"><X className="h-3.5 w-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Tipo">
                    <Select value={mod.tipo} onChange={modTextField(idx, 'tipo')}>
                      <option value="Discente">Discente</option>
                      <option value="Verdadeiro">Verdadeiro</option>
                    </Select>
                  </Field>
                  <Field label="Custo em PE">
                    <Input type="number" min={0} value={mod.custo_pe} onChange={modTextField(idx, 'custo_pe')} placeholder="Ex: 5" />
                  </Field>
                </div>
                <Field label="Requisitos">
                  <TagInput tags={mod.requisitos} onChange={(reqs) => setModReqs(idx, reqs)} suggestions={modReqSuggestions} placeholder="Ex: Magia 3 — Enter para adicionar" />
                </Field>
                <Field label="Descricao">
                  <Textarea value={mod.descricao} onChange={modTextField(idx, 'descricao')} placeholder="Efeito da modificacao..." rows={2} />
                </Field>
              </div>
            ))}
          </div>
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(null)} className="h-8 px-3 rounded text-xs text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// --- PODERES TAB -------------------------------------------------------------

function PoderesTab({ poderes: initial, fontes }: { poderes: Poder[]; fontes: Fonte[] }) {
  const [poderes, setPoderes] = useState(initial)
  const [modal, setModal] = useState<'create' | Poder | null>(null)
  const [isPending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  const blank = { nome: '', tipo: '', descricao: '', fonteId: '' }
  const [form, setForm] = useState(blank)
  const [requisitos, setRequisitos] = useState<string[]>([])
  const f = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const reqSuggestions = useMemo(
    () => [...new Set(initial.flatMap((p) => p.requisitos ?? []))].sort(),
    [initial],
  )

  function openCreate() { setForm(blank); setRequisitos([]); setModal('create'); setErr(null) }
  function openEdit(p: Poder) {
    setForm({ nome: p.nome, tipo: p.tipo, descricao: p.descricao, fonteId: String(p.fonte.id) })
    setRequisitos(p.requisitos ?? [])
    setModal(p); setErr(null)
  }

  function handleSubmit() {
    setErr(null)
    const data = { nome: form.nome.trim(), tipo: form.tipo.trim(), requisitos: requisitos.length > 0 ? requisitos : null, descricao: form.descricao.trim(), fonteId: Number(form.fonteId) }
    if (!data.nome) { setErr('Nome obrigatorio'); return }
    if (!data.tipo) { setErr('Tipo obrigatorio'); return }
    if (!data.fonteId) { setErr('Fonte obrigatoria'); return }
    start(async () => {
      try {
        if (typeof modal === 'string') {
          const created = await createPoder(data)
          setPoderes((prev) => [...prev, created])
        } else if (modal) {
          const updated = await updatePoder(modal.id, data)
          setPoderes((prev) => prev.map((p) => p.id === updated.id ? updated : p))
        }
        setModal(null)
      } catch (e: any) { setErr(e.message ?? 'Erro desconhecido') }
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Deletar este poder?')) return
    start(async () => {
      try { await deletePoder(id); setPoderes((prev) => prev.filter((p) => p.id !== id)) }
      catch (e: any) { alert(e.message ?? 'Erro ao deletar') }
    })
  }

  const TIPOS = ['Combatente', 'Especialista', 'Geral', 'Ocultista']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{poderes.length} poder(es) cadastrado(s)</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
      </div>
      <EntityTable
        columns={[
          { key: 'nome', label: 'Nome', render: (p) => p.nome },
          { key: 'tipo', label: 'Tipo', render: (p) => <span className="text-xs text-muted-foreground">{p.tipo}</span> },
          { key: 'fonte', label: 'Fonte', render: (p) => <span className="text-xs">{p.fonte.abreviacao ?? p.fonte.nome}</span> },
        ]}
        rows={poderes} onEdit={openEdit} onDelete={handleDelete} isPending={isPending}
      />
      {modal !== null && (
        <Modal title={modal === 'create' ? 'Novo Poder' : 'Editar Poder'} onClose={() => setModal(null)}>
          <Field label="Nome"><Input value={form.nome} onChange={f('nome')} placeholder="Ex: Tiro Preciso" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select value={form.tipo} onChange={f('tipo')}>
                <option value="">Selecionar...</option>
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Fonte">
              <Select value={form.fonteId} onChange={f('fonteId')}>
                <option value="">Selecionar...</option>
                {fontes.map((fn) => <option key={fn.id} value={fn.id}>{fn.nome}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Requisitos">
            <TagInput tags={requisitos} onChange={setRequisitos} suggestions={reqSuggestions} placeholder="Ex: Agil, NEX 25% — Enter para adicionar" />
          </Field>
          <Field label="Descricao">
            <Textarea value={form.descricao} onChange={f('descricao')} placeholder="Descricao completa..." rows={4} />
          </Field>
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(null)} className="h-8 px-3 rounded text-xs text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// --- ORIGENS TAB -------------------------------------------------------------

function OrigensTab({ origens: initial, fontes }: { origens: Origem[]; fontes: Fonte[] }) {
  const [origens, setOrigens] = useState(initial)
  const [modal, setModal] = useState<'create' | Origem | null>(null)
  const [isPending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  const blank = { nome: '', descricao: '', nomeDoPoder: '', poderDeOrigem: '', fonteId: '' }
  const [form, setForm] = useState(blank)
  const [pericias, setPericias] = useState<string[]>([])
  const f = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const periciaSuggestions = useMemo(
    () => [...new Set(initial.flatMap((o) => o.periciasTreinadas ?? []))].sort(),
    [initial],
  )

  function openCreate() { setForm(blank); setPericias([]); setModal('create'); setErr(null) }
  function openEdit(o: Origem) {
    setForm({ nome: o.nome, descricao: o.descricao, nomeDoPoder: o.nomeDoPoder, poderDeOrigem: o.poderDeOrigem, fonteId: String(o.fonte.id) })
    setPericias(o.periciasTreinadas ?? [])
    setModal(o); setErr(null)
  }

  function handleSubmit() {
    setErr(null)
    const data = {
      nome: form.nome.trim(), descricao: form.descricao.trim(),
      periciasTreinadas: pericias.length > 0 ? pericias : null,
      nomeDoPoder: form.nomeDoPoder.trim(), poderDeOrigem: form.poderDeOrigem.trim(),
      fonteId: Number(form.fonteId),
    }
    if (!data.nome) { setErr('Nome obrigatorio'); return }
    if (!data.fonteId) { setErr('Fonte obrigatoria'); return }
    start(async () => {
      try {
        if (typeof modal === 'string') {
          const created = await createOrigem(data)
          setOrigens((prev) => [...prev, created])
        } else if (modal) {
          const updated = await updateOrigem(modal.id, data)
          setOrigens((prev) => prev.map((o) => o.id === updated.id ? updated : o))
        }
        setModal(null)
      } catch (e: any) { setErr(e.message ?? 'Erro desconhecido') }
    })
  }

  function handleDelete(id: number) {
    if (!confirm('Deletar esta origem?')) return
    start(async () => {
      try { await deleteOrigem(id); setOrigens((prev) => prev.filter((o) => o.id !== id)) }
      catch (e: any) { alert(e.message ?? 'Erro ao deletar') }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{origens.length} origem(ns) cadastrada(s)</p>
        <button onClick={openCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
      </div>
      <EntityTable
        columns={[
          { key: 'nome', label: 'Nome', render: (o) => o.nome },
          { key: 'poder', label: 'Poder de Origem', render: (o) => <span className="text-xs text-muted-foreground">{o.nomeDoPoder}</span> },
          { key: 'fonte', label: 'Fonte', render: (o) => <span className="text-xs">{o.fonte.abreviacao ?? o.fonte.nome}</span> },
        ]}
        rows={origens} onEdit={openEdit} onDelete={handleDelete} isPending={isPending}
      />
      {modal !== null && (
        <Modal title={modal === 'create' ? 'Nova Origem' : 'Editar Origem'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome"><Input value={form.nome} onChange={f('nome')} placeholder="Ex: Policial" /></Field>
            <Field label="Fonte">
              <Select value={form.fonteId} onChange={f('fonteId')}>
                <option value="">Selecionar...</option>
                {fontes.map((fn) => <option key={fn.id} value={fn.id}>{fn.nome}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Descricao da Origem">
            <Textarea value={form.descricao} onChange={f('descricao')} placeholder="Contexto e historia..." rows={3} />
          </Field>
          <Field label="Pericias Treinadas">
            <div className="grid grid-cols-4 gap-1">
              {['Acrobacia','Adestramento','Artes','Atletismo','Atualidades','Ciências','Crime','Diplomacia','Enganação','Fortitude','Furtividade','Iniciativa','Intimidação','Intuição','Investigação','Luta','Medicina','Ocultismo','Percepção','Pilotagem','Pontaria','Profissão','Reflexos','Religião','Sobrevivência','Tática','Tecnologia','Vontade'].map((p) => {
                const sel = pericias.includes(p)
                return (
                  <button
                    key={p} type="button"
                    onClick={() => setPericias((prev) => sel ? prev.filter((x) => x !== p) : [...prev, p])}
                    className={cn('h-7 px-2 rounded text-[11px] font-medium transition-colors truncate', sel ? 'bg-primary/20 border border-primary/50 text-primary' : 'bg-muted/20 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border')}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </Field>
          <Field label="Nome do Poder">
            <Input value={form.nomeDoPoder} onChange={f('nomeDoPoder')} placeholder="Ex: Investigacao Policial" />
          </Field>
          <Field label="Poder de Origem">
            <Textarea value={form.poderDeOrigem} onChange={f('poderDeOrigem')} placeholder="Descricao do poder..." rows={3} />
          </Field>
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(null)} className="h-8 px-3 rounded text-xs text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// --- USUARIOS TAB ------------------------------------------------------------

function UsuariosTab({ usuarios: initial, roles, currentUserId, canManageUsers }: { usuarios: Usuario[]; roles: RoleOption[]; currentUserId: number; canManageUsers: boolean }) {
  const [usuarios, setUsuarios] = useState(initial)
  const [modal, setModal] = useState<'create' | Usuario | null>(null)
  const [isPending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)

  const blank = { name: '', surname: '', email: '', password: '', roleId: '' }
  const [form, setForm] = useState(blank)
  const f = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  function openCreate() { setForm(blank); setModal('create'); setErr(null) }
  function openEdit(u: Usuario) {
    setForm({ name: u.name, surname: u.surname ?? '', email: u.email, password: '', roleId: u.roleId ? String(u.roleId) : '' })
    setModal(u); setErr(null)
  }

  function handleSubmit() {
    setErr(null)
    if (typeof modal === 'string') {
      if (!form.name.trim()) { setErr('Nome obrigatorio'); return }
      if (!form.email.trim()) { setErr('Email obrigatorio'); return }
      if (form.password.length < 6) { setErr('Senha minimo 6 caracteres'); return }
      const data = { name: form.name.trim(), surname: form.surname.trim() || undefined, email: form.email.trim(), password: form.password, roleId: form.roleId ? Number(form.roleId) : undefined }
      start(async () => {
        try {
          console.info('[mestre-panel] Chamando createUsuario com:', form)
          await createUsuario(data)
          console.info('[mestre-panel] Usuário criado com sucesso, atualizando estado')
          setUsuarios((prev) => [...prev, {
            id: Date.now(), name: data.name, surname: data.surname ?? null, email: data.email,
            roleId: data.roleId ?? null,
            roleName: roles.find((r) => r.id === data.roleId)?.name ?? null,
            createdAt: new Date().toISOString(),
          }])
          setModal(null)
        } catch (e: any) { setErr(e.message ?? 'Erro desconhecido') }
      })
    } else if (modal) {
      const data: { name?: string; surname?: string | null; email?: string; password?: string; roleId?: number | null } = {}
      if (form.name.trim() !== modal.name) data.name = form.name.trim()
      if (form.surname.trim() !== (modal.surname ?? '')) data.surname = form.surname.trim() || null
      if (form.email.trim() !== modal.email) data.email = form.email.trim()
      if (form.password) data.password = form.password
      if (form.roleId !== (modal.roleId ? String(modal.roleId) : ''))
        data.roleId = form.roleId ? Number(form.roleId) : null
      start(async () => {
        try {
          await updateUsuario(modal.id, data)
          setUsuarios((prev) => prev.map((u) => u.id === modal.id ? {
            ...u,
            name: form.name.trim() || u.name,
            surname: form.surname.trim() || null,
            email: form.email.trim() || u.email,
            roleId: form.roleId ? Number(form.roleId) : null,
            roleName: form.roleId ? (roles.find((r) => r.id === Number(form.roleId))?.name ?? null) : null,
          } : u))
          setModal(null)
        } catch (e: any) { setErr(e.message ?? 'Erro desconhecido') }
      })
    }
  }

  function handleDelete(id: number) {
    console.info(`[mestre-panel] Clique no delete do usuário ${id}`)
    if (id === currentUserId) { alert('Nao e possivel deletar o proprio usuario'); return }
    if (!confirm('Deletar este usuario?')) return
    start(async () => {
      try {
        console.info(`[mestre-panel] Chamando deleteUsuario(${id})`)
        await deleteUsuario(id)
        console.info(`[mestre-panel] Usuário ${id} removido com sucesso no estado local`)
        setUsuarios((prev) => prev.filter((u) => u.id !== id))
      }
      catch (e: any) {
        console.error(`[mestre-panel] Falha ao deletar usuário ${id}:`, e)
        alert(e.message ?? 'Erro ao deletar')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{usuarios.length} usuario(s) cadastrado(s)</p>
        {canManageUsers && (
          <button onClick={openCreate} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary/15 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"><Plus className="h-3.5 w-3.5" /> Adicionar</button>
        )}
      </div>
      <EntityTable
        columns={[
          { key: 'name', label: 'Nome', render: (u) => u.name },
          { key: 'email', label: 'Email', render: (u) => <span className="text-xs text-muted-foreground">{u.email}</span> },
          { key: 'role', label: 'Role', render: (u) => (
            <span className={cn('text-xs px-1.5 py-0.5 rounded', u.roleName === 'mestre' ? 'bg-primary/15 text-primary' : 'bg-muted/30 text-muted-foreground')}>
              {u.roleName ?? <span className="opacity-40">sem role</span>}
            </span>
          )},
          { key: 'self', label: '', render: (u) => u.id === currentUserId ? <span className="text-[10px] text-muted-foreground/50">voce</span> : null },
        ]}
        rows={usuarios} onEdit={openEdit} onDelete={handleDelete} isPending={isPending}
      />
      {modal !== null && (
        <Modal title={typeof modal === 'string' ? 'Novo Usuario' : 'Editar Usuario'} onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome"><Input value={form.name} onChange={f('name')} placeholder="Ex: Joao" /></Field>
            <Field label="Sobrenome"><Input value={form.surname} onChange={f('surname')} placeholder="Ex: Silva" /></Field>
          </div>
          <Field label="Email"><Input type="email" value={form.email} onChange={f('email')} placeholder="joao@op.com" /></Field>
          <Field label={typeof modal === 'string' ? 'Senha' : 'Nova Senha (vazio = sem alteracao)'}>
            <Input type="password" value={form.password} onChange={f('password')} placeholder={typeof modal === 'string' ? 'Minimo 6 caracteres' : 'Deixar vazio para nao alterar'} />
          </Field>
          <Field label="Role">
            <Select value={form.roleId} onChange={f('roleId')}>
              <option value="">Sem role</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}{r.description ? ` — ${r.description}` : ''}</option>)}
            </Select>
          </Field>
          {err && <p className="text-xs text-rose-400">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setModal(null)} className="h-8 px-3 rounded text-xs text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// --- MAIN --------------------------------------------------------------------

export function MestrePanel({ fontes, rituais, poderes, origens, usuarios, roles, currentUserId, canManageUsers }: Props) {
  const [tab, setTab] = useState<Tab>('rituais')

  const visibleTabs = TABS.filter((t) => t.id !== 'usuarios' || canManageUsers)

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-border">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tab === 'fontes'   && <FontesTab fontes={fontes} />}
        {tab === 'rituais'  && <RituaisTab rituais={rituais} fontes={fontes} />}
        {tab === 'poderes'  && <PoderesTab poderes={poderes} fontes={fontes} />}
        {tab === 'origens'  && <OrigensTab origens={origens} fontes={fontes} />}
        {tab === 'usuarios' && canManageUsers && <UsuariosTab usuarios={usuarios} roles={roles} currentUserId={currentUserId} canManageUsers={canManageUsers} />}
      </div>
    </div>
  )
}
