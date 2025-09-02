import type { UserRole, UserStatus } from '../../domain/entities/user.entity'

export interface CreateUserDto {
  email: string
  name: string
  role: UserRole
  status?: UserStatus
}

export interface UpdateUserDto {
  name?: string
  role?: UserRole
  status?: UserStatus
}

export interface UserResponseDto {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  lastLogin?: string
  createdAt: string
  updatedAt?: string
}

export interface PaginationDto {
  page: number
  limit: number
}

export interface UserFiltersDto {
  role?: string
  status?: string
  search?: string
  createdAfter?: string
  createdBefore?: string
}

export interface PaginatedResponseDto<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
