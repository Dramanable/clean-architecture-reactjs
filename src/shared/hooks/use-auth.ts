import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth.context'
import type { AuthContextType } from '../context/auth.context'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook pour la protection des routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Rediriger vers la page de login
      window.location.href = '/login'
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}
