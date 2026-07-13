'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { GlobalSearch } from '@/components/global-search'

interface NavItem {
  href: string
  label: string
  exact?: boolean
  adminOnly?: boolean
  icon: React.ReactElement
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Inicio',
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/rituais',
    label: 'Rituais',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    href: '/poderes',
    label: 'Poderes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    href: '/trilhas',
    label: 'Trilhas',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h7v7H3z" /><path d="M14 3h7v7h-7z" /><path d="M14 14h7v7h-7z" /><path d="M3 14h7v7H3z" />
      </svg>
    ),
  },
  {
    href: '/origens',
    label: 'Origens',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/mestre',
    label: 'Mestre',
    adminOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
]

interface SubNavProps {
  user?: { isAdmin: boolean } | null
}

export function SubNav({ user }: SubNavProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || user?.isAdmin)

  return (
    <nav
      className="h-10 flex items-center px-4 bg-card border-b border-border gap-0.5 overflow-visible"
      aria-label="Navegacao de secoes"
    >
      <div className="flex items-stretch h-full flex-1 gap-0.5">
        {visibleItems.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 px-3 text-xs no-underline whitespace-nowrap border-b-2 transition-colors duration-150',
                '[&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:shrink-0 [&_svg]:transition-opacity [&_svg]:duration-150',
                active
                  ? 'font-bold text-foreground border-primary [&_svg]:opacity-100'
                  : 'font-medium text-muted-foreground border-transparent [&_svg]:opacity-40',
                'hover:text-foreground hover:border-border [&:hover_svg]:opacity-70',
              )}
            >
              {icon}
              {label}
            </Link>
          )
        })}
      </div>
      <GlobalSearch />
    </nav>
  )
}
