import { Bell, Search, LogOut, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAuth } from '@/shared/hooks/use-auth'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSelector } from './common/LanguageSelector'
import { useUserRoleTranslation } from '@/i18n/hooks'

export function Header() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const { translateRole } = useUserRoleTranslation()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      // Rediriger vers la page de login après une déconnexion réussie
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Même en cas d'erreur, rediriger vers login
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
      setIsUserMenuOpen(false)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('common.search')}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 pl-3 pr-2"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || t('common.user')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role ? translateRole(user.role) : t('common.user')}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoggingOut ? t('common.loading') : t('auth.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
