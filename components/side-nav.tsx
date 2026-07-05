'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  exact?: boolean
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
    href: '/poderes',
    label: 'Poderes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
]

export function SideNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <nav
      className="w-[72px] shrink-0 bg-card border-r border-border flex flex-col py-2 gap-0.5"
      aria-label="Navegacao lateral"
    >
      {NAV_ITEMS.map(({ href, label, icon, exact }, i) => {
        const active = isActive(href, exact)
        return (
          <div key={href}>
            {i === 1 && <div className="h-px bg-border mx-2.5 my-1" />}
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2.5 mx-1.5 rounded-sm no-underline transition-colors duration-150',
                '[&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:shrink-0 [&_svg]:transition-opacity [&_svg]:duration-150',
                active
                  ? 'text-foreground bg-primary/10 [&_svg]:opacity-100'
                  : 'text-muted-foreground bg-transparent [&_svg]:opacity-45',
                'hover:bg-primary/10 hover:text-foreground [&:hover_svg]:opacity-80',
              )}
            >
              {icon}
              <span className="text-[9px] font-medium tracking-[0.03em] leading-none">{label}</span>
            </Link>
          </div>
        )
      })}
    </nav>
  )
}
