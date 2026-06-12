import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Tags,
  Store,
  BarChart3,
  Settings,
  X,
  Boxes,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/i18n'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: TranslationKey
  icon: LucideIcon
}

interface NavSection {
  title: TranslationKey
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    title: 'nav.main',
    items: [
      { to: '/', label: 'nav.dashboard', icon: LayoutDashboard },
      { to: '/pos', label: 'nav.pos', icon: ShoppingCart },
      { to: '/products', label: 'nav.products', icon: Package },
      { to: '/sales', label: 'nav.sales', icon: Receipt },
      { to: '/categories', label: 'nav.categories', icon: Tags },
    ],
  },
  {
    title: 'nav.management',
    items: [
      { to: '/branches', label: 'nav.branches', icon: Store },
      { to: '/reports', label: 'nav.reports', icon: BarChart3 },
      { to: '/settings', label: 'nav.settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">HardWeb</p>
              <p className="text-[11px] text-sidebar-foreground/60">POS System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {t(section.title)}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-white shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground'
                      )
                    }
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {t(item.label)}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-white/5 p-3 text-xs text-sidebar-foreground/60">
            <p className="font-semibold text-sidebar-foreground/80">Demo versiya</p>
            <p className="mt-0.5">Frontend · mock data</p>
          </div>
        </div>
      </aside>
    </>
  )
}
