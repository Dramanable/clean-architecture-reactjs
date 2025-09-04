import type { UserRepository, PaginationParams, UserFilters, PaginatedResult } from '../../domain/repositories/user.repository'
import type { User } from '../../domain/entities/user.entity'
import { UserRole, UserStatus, UserEntity } from '../../domain/entities/user.entity'
import { httpClient } from '../http/http-client'
import type { 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  UsersListResponse
} from '../dtos/api.dto'
import { UserRole as ApiUserRole } from '../dtos/api.dto'

export class HttpUserRepository implements UserRepository {
  async findAll(params: PaginationParams, filters?: UserFilters): Promise<PaginatedResult<User>> {
    try {
      const queryParams: Record<string, unknown> = {
        page: params.page,
        limit: params.limit
      }

      if (filters) {
        if (filters.search) queryParams.search = filters.search
        if (filters.role) queryParams.role = filters.role
        if (filters.status) queryParams.status = filters.status
      }

      const response = await httpClient.get<UsersListResponse>('/users', queryParams)
      
      const users = response.data.users.map(userDto => this.mapUserResponseToUserEntity(userDto))
      
      return {
        data: users,
        meta: {
          currentPage: response.data.page,
          totalPages: Math.ceil(response.data.total / response.data.limit),
          totalItems: response.data.total,
          itemsPerPage: response.data.limit,
          hasNextPage: response.data.page * response.data.limit < response.data.total,
          hasPreviousPage: response.data.page > 1
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const response = await httpClient.get<UserResponse>(`/users/${id}`)
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

      const response = await httpClient.post<UserResponse>('/users', createData)
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

      const response = await httpClient.patch<UserResponse>(`/users/${id}`, updateData)
      return this.mapUserResponseToUserEntity(response.data)
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error)
      throw new Error('Failed to update user')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(`/users/${id}`)
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error)
      throw new Error('Failed to delete user')
    }
  }

  async count(): Promise<number> {
    try {
      const response = await httpClient.get<{ count: number }>('/users/count')
      return response.data.count
    } catch (error) {
      console.error('Failed to count users:', error)
      return 0
    }
  }

  async search(query: string, params: PaginationParams): Promise<PaginatedResult<User>> {
    return this.findAll(params, { search: query })
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
