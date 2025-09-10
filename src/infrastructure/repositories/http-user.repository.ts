import type { UserRepository, PaginationParams, UserFilters, PaginatedResult } from '../../domain/repositories/user.repository'
import type { User } from '../../domain/entities/user.entity'
import { UserRole, UserStatus, UserEntity } from '../../domain/entities/user.entity'
import { httpClient } from '../http/http-client'
import { API_ENDPOINTS } from '../config/api-endpoints'
import type { 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest
} from '../dtos/api.dto'
import { UserRole as ApiUserRole } from '../dtos/api.dto'

// Types pour la requête et réponse selon le vrai serveur
interface SearchUsersRequest {
  searchTerm?: string
  roles?: string[]
  isActive?: boolean
  createdAfter?: string
  createdBefore?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface SearchUsersResponse {
  users: UserResponse[]
  pagination: {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  appliedFilters?: {
    searchTerm?: string
    roles?: string[]
    isActive?: boolean
    createdAfter?: string
    createdBefore?: string
  }
}

export class HttpUserRepository implements UserRepository {
  async findAll(params: PaginationParams, filters?: UserFilters): Promise<PaginatedResult<User>> {
    try {
      // Construire la requête de recherche selon le format du serveur
      const searchRequest: SearchUsersRequest = {
        searchTerm: filters?.searchTerm,
        page: params.page,
        limit: params.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }

      // Ajouter les filtres supplémentaires si disponibles
      if (filters?.roles && filters.roles.length > 0) {
        searchRequest.roles = filters.roles.map(role => this.mapDomainRoleToApiRole(role as UserRole))
      }
      
      if (filters?.isActive !== undefined) {
        searchRequest.isActive = filters.isActive
      }

      if (filters?.createdAfter) {
        searchRequest.createdAfter = filters.createdAfter.toISOString()
      }

      if (filters?.createdBefore) {
        searchRequest.createdBefore = filters.createdBefore.toISOString()
      }

      const response = await httpClient.post<SearchUsersResponse>(
        API_ENDPOINTS.USERS.SEARCH, 
        searchRequest
      )
      
      const users = response.data.users.map((userDto: UserResponse) => this.mapUserResponseToUserEntity(userDto))
      
      return {
        data: users,
        meta: response.data.pagination
      }
    } catch (error) {
      console.error('Failed to search users:', error)
      throw new Error('Failed to search users')
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const response = await httpClient.get<UserResponse>(API_ENDPOINTS.USERS.GET_BY_ID(id))
      return this.mapUserResponseToUserEntity(response.data)
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error)
      return null
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await httpClient.get<UserResponse>(`/users/email/${email}`)
      return this.mapUserResponseToUserEntity(response.data)
    } catch (error) {
      console.error(`Failed to fetch user by email ${email}:`, error)
      return null
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const createData: CreateUserRequest = {
        email: userData.email,
        name: userData.name,
        role: this.mapDomainRoleToApiRole(userData.role)
      }

      const response = await httpClient.post<UserResponse>(API_ENDPOINTS.USERS.CREATE, createData)
      return this.mapUserResponseToUserEntity(response.data)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw new Error('Failed to create user')
    }
  }

  async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    try {
      const updateData: UpdateUserRequest = {
        email: userData.email,
        name: userData.name,
        ...(userData.role && { role: this.mapDomainRoleToApiRole(userData.role) }),
        ...(userData.status !== undefined && { isActive: userData.status === 'active' })
      }

      const response = await httpClient.put<UserResponse>(API_ENDPOINTS.USERS.UPDATE(id), updateData)
      return this.mapUserResponseToUserEntity(response.data)
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error)
      throw new Error('Failed to update user')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(API_ENDPOINTS.USERS.DELETE(id))
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error)
      throw new Error('Failed to delete user')
    }
  }

  async count(): Promise<number> {
    try {
      const response = await httpClient.get<{ count: number }>(API_ENDPOINTS.USERS.COUNT)
      return response.data.count
    } catch (error) {
      console.error('Failed to count users:', error)
      return 0
    }
  }

  async search(query: string, params: PaginationParams): Promise<PaginatedResult<User>> {
    return this.findAll(params, { searchTerm: query })
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await httpClient.post(`/users/${id}/change-password`, {
        currentPassword,
        newPassword
      })
      return true
    } catch (error) {
      console.error(`Failed to change password for user ${id}:`, error)
      return false
    }
  }

  private mapUserResponseToUserEntity(userDto: UserResponse): UserEntity {
    return new UserEntity(
      userDto.id,
      userDto.email,
      userDto.name,
      this.mapApiRoleToDomainRole(userDto.role),
      userDto.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      new Date(userDto.createdAt),
      new Date(userDto.updatedAt)
    )
  }

  private mapDomainRoleToApiRole(role: UserRole): ApiUserRole {
    // Mapping entre les rôles du domain et de l'API
    switch (role) {
      case UserRole.ADMIN:
        return 'SUPER_ADMIN' as ApiUserRole
      case UserRole.MODERATOR:
        return 'MANAGER' as ApiUserRole
      case UserRole.USER:
        return 'USER' as ApiUserRole
      default:
        return 'USER' as ApiUserRole
    }
  }

  private mapApiRoleToDomainRole(role: ApiUserRole): UserRole {
    // Mapping entre les rôles de l'API et du domain
    switch (role) {
      case 'SUPER_ADMIN':
        return UserRole.ADMIN
      case 'MANAGER':
        return UserRole.MODERATOR
      case 'USER':
        return UserRole.USER
      default:
        return UserRole.USER
    }
  }
}
