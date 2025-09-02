import React, { createContext, useEffect, useState } from 'react'
import type { AuthUser, LoginCredentials, AuthResponse } from '../../domain/entities/auth.entity'
import { AuthService } from '../../application/services/auth.service'
import { HttpAuthRepository } from '../../infrastructure/repositories/http-auth.repository'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

export type { AuthContextType }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

// Instance du service d'authentification
const authRepository = new HttpAuthRepository()
const authService = new AuthService(authRepository)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true)
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      return response
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasRole = (role: string): boolean => {
    return user?.hasRole(role) ?? false
  }

  const hasPermission = (permission: string): boolean => {
    return user?.hasPermission(permission) ?? false
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
