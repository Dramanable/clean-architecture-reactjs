import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuth } from '@/shared/hooks/use-auth'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface LogoutButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  showText?: boolean
  className?: string
  onLogoutSuccess?: () => void
  onLogoutError?: (error: Error) => void
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  showIcon = true,
  showText = true,
  className,
  onLogoutSuccess,
  onLogoutError
}: LogoutButtonProps) {
  const { logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      onLogoutSuccess?.()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      const logoutError = error instanceof Error ? error : new Error('Logout failed')
      onLogoutError?.(logoutError)
      // Même en cas d'erreur, rediriger vers login car le token local est nettoyé
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {showText && (
        <span className={showIcon ? 'ml-2' : ''}>
          {isLoggingOut ? t('common.loading') : t('auth.logout')}
        </span>
      )}
    </Button>
  )
}
