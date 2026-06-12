import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button variant="outline" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-warning" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
