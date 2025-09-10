import { useState, useCallback } from 'react'
import type { User } from '../../domain/entities/user.entity'
import type { PaginationParams, UserFilters } from '../../domain/repositories/user.repository'
import { UserManagementService } from '../../application/services/user-management.service'
import { HttpUserRepository } from '../../infrastructure/repositories/http-user.repository'

// Instance globale du service
const userRepository = new HttpUserRepository()
const userManagementService = new UserManagementService(userRepository)

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = useCallback(async (pagination: PaginationParams, filters?: UserFilters) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await userManagementService.getUsers(pagination, filters)
      setUsers(result.data)
      setTotalCount(result.meta.totalItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs')
      setUsers([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    setError(null)
    try {
      const newUser = await userManagementService.createUser(userData)
      return newUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de l\'utilisateur'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateUser = async (id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
    setError(null)
    try {
      const updatedUser = await userManagementService.updateUser(id, userData)
      // Mettre à jour la liste locale
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? updatedUser : user)
      )
      return updatedUser
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la modification de l\'utilisateur'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    setError(null)
    try {
      await userManagementService.deleteUser(id)
      // Retirer l'utilisateur de la liste locale
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
      setTotalCount(prev => prev - 1)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getUserById = async (id: string): Promise<User | null> => {
    setError(null)
    try {
      return await userManagementService.getUserById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'utilisateur')
      return null
    }
  }

  const searchUsers = useCallback(async (query: string, pagination: PaginationParams) => {
    return loadUsers(pagination, { searchTerm: query })
  }, [loadUsers])

  const clearError = useCallback(() => setError(null), [])

  return {
    users,
    totalCount,
    isLoading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    searchUsers,
    clearError
  }
}
