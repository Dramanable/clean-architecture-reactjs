import type { UserRepository, PaginationParams, UserFilters, PaginatedResult } from '../../domain/repositories/user.repository'
import type { User, UserRole, UserStatus } from '../../domain/entities/user.entity'
import { UserEntity } from '../../domain/entities/user.entity'
import { httpClient } from '../http/http-client'
import type { 
  UserResponseDto, 
  CreateUserDto, 
  UpdateUserDto,
  PaginatedResponseDto,
  UserRole as ApiUserRole
} from '../dtos/api.dto'

export class HttpUserRepository implements UserRepository {
  async findAll(params: PaginationParams, filters?: UserFilters): Promise<PaginatedResult<User>> {
    try {
      const queryParams: Record<string, unknown> = {
        page: params.page,
        limit: params.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }

      if (filters) {
        if (filters.search) queryParams.search = filters.search
        if (filters.role) queryParams.role = filters.role
        if (filters.status) queryParams.status = filters.status
        if (filters.createdAfter) queryParams.createdAfter = filters.createdAfter.toISOString()
        if (filters.createdBefore) queryParams.createdBefore = filters.createdBefore.toISOString()
      }

      const response = await httpClient.get<PaginatedResponseDto<UserResponseDto>>('/users', queryParams)
      
      const users = response.data.data.map(userDto => this.mapUserResponseDtoToUserEntity(userDto))
      
      return {
        data: users,
        meta: {
          currentPage: response.data.meta.page,
          totalPages: response.data.meta.totalPages,
          totalItems: response.data.meta.total,
          itemsPerPage: response.data.meta.limit,
          hasNextPage: response.data.meta.hasNextPage,
          hasPreviousPage: response.data.meta.hasPrevPage
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const response = await httpClient.get<UserResponseDto>(`/users/${id}`)
      return this.mapUserResponseDtoToUserEntity(response.data)
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error)
      return null
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await httpClient.get<UserResponseDto>(`/users/email/${email}`)
      return this.mapUserResponseDtoToUserEntity(response.data)
    } catch (error) {
      console.error(`Failed to fetch user by email ${email}:`, error)
      return null
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const createData: CreateUserDto = {
        email: userData.email,
        name: userData.name,
        password: 'defaultPassword123', // Dans un vrai système, ceci serait géré autrement
        role: userData.role as ApiUserRole // Conversion du type enum
      }

      const response = await httpClient.post<UserResponseDto>('/users', createData)
      return this.mapUserResponseDtoToUserEntity(response.data)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw new Error('Failed to create user')
    }
  }

  async update(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    try {
      const updateData: UpdateUserDto = {
        email: userData.email,
        name: userData.name,
        role: userData.role as ApiUserRole // Conversion du type enum
      }

      const response = await httpClient.patch<UserResponseDto>(`/users/${id}`, updateData)
      return this.mapUserResponseDtoToUserEntity(response.data)
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

  private mapUserResponseDtoToUserEntity(userDto: UserResponseDto): UserEntity {
    return new UserEntity(
      userDto.id,
      userDto.email,
      userDto.name,
      userDto.role as UserRole,
      'active' as UserStatus, // Par défaut, on peut ajouter ce champ dans l'API plus tard
      new Date(userDto.createdAt),
      new Date(userDto.updatedAt),
      userDto.lastLoginAt ? new Date(userDto.lastLoginAt) : undefined
    )
  }
}
