import Link from 'next/link'
import { BookOpen, Users, Zap, Route, ArrowRight } from 'lucide-react'

const sections = [
  {
    href: '/rituais',
    icon: BookOpen,
    label: 'Rituais',
    description: 'Consulte e filtre todos os rituais por circulo e elemento.',
    accent: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60',
    border: 'border-indigo-200 hover:border-indigo-300 dark:border-indigo-900/40 dark:hover:border-indigo-700/50',
  },
  {
    href: '/poderes',
    icon: Zap,
    label: 'Poderes',
    description: 'Poderes de Combatente, Especialista, Ocultista e gerais do sistema.',
    accent: 'text-purple-600 dark:text-purple-300',
    bg: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/60',
    border: 'border-purple-200 hover:border-purple-300 dark:border-purple-900/40 dark:hover:border-purple-700/50',
  },
  {
    href: '/trilhas',
    icon: Route,
    label: 'Trilhas',
    description: 'Especializações de classe com habilidades por NEX ou nivel.',
    accent: 'text-violet-600 dark:text-violet-300',
    bg: 'bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/35 dark:hover:bg-violet-950/55',
    border: 'border-violet-200 hover:border-violet-300 dark:border-violet-900/35 dark:hover:border-violet-700/45',
  },
  {
    href: '/origens',
    icon: Users,
    label: 'Origens',
    description: 'Todas as origens disponíveis com habilidades e pericias.',
    accent: 'text-fuchsia-600 dark:text-fuchsia-300',
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100 dark:bg-fuchsia-950/35 dark:hover:bg-fuchsia-950/55',
    border: 'border-fuchsia-200 hover:border-fuchsia-300 dark:border-fuchsia-900/35 dark:hover:border-fuchsia-700/45',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-52px)] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Compendio
          </h1>
          <p className="text-sm text-muted-foreground">
            Referencia rapida para Ordem Paranormal RPG
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sections.map(({ href, icon: Icon, label, description, accent, bg, border }) => (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col gap-3 p-4 rounded border transition-colors ${bg} ${border}`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${accent}`} />
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
              <div>
                <div className={`text-sm font-semibold ${accent}`}>{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
