import { Store, ChevronDown, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

export function BranchSwitcher() {
  const { branches, currentBranch, setCurrentBranch } = useData()
  const { t } = useTranslation()

  const activeName =
    currentBranch === 'all'
      ? t('common.allBranches')
      : branches.find((b) => b.id === currentBranch)?.name ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 max-w-[220px]">
          <Store className="h-4 w-4 text-primary shrink-0" />
          <span className="truncate font-medium">{activeName}</span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>{t('nav.branches')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setCurrentBranch('all')}
          className={cn('justify-between', currentBranch === 'all' && 'bg-accent')}
        >
          <span className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            {t('common.allBranches')}
          </span>
          {currentBranch === 'all' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {branches.map((b) => (
          <DropdownMenuItem
            key={b.id}
            onClick={() => setCurrentBranch(b.id)}
            className={cn('justify-between', currentBranch === b.id && 'bg-accent')}
          >
            <span className="flex flex-col">
              <span className="font-medium">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.manager}</span>
            </span>
            {currentBranch === b.id && <Check className="h-4 w-4 text-primary shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
