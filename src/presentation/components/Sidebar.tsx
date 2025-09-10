import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronRight,
  Menu
} from 'lucide-react'
import { cn } from '@/shared/utils/lib/utils'
import { Button } from '@/presentation/components/ui/button'

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('navigation.users'), href: '/dashboard/users', icon: Users },
    { name: t('navigation.settings'), href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <h1 className="text-xl font-bold text-primary-foreground">{t('common.adminPanel')}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="outline" size="sm" className="w-full">
          <Menu className="w-4 h-4 mr-2" />
          Réduire
        </Button>
      </div>
    </div>
  )
}
