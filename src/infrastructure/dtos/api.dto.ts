// DTOs pour l'API NestJS basés sur le Swagger http://localhost:3000/api/docs

// Auth DTOs
export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  access_token: string
  refresh_token: string
  expires_in: number
  user: UserResponseDto
}

export interface RefreshTokenResponseDto {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface LogoutResponseDto {
  message: string
}

export interface UserInfoResponseDto {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

// User DTOs
export interface UserResponseDto {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface CreateUserDto {
  email: string
  name: string
  password: string
  role?: UserRole
}

export interface UpdateUserDto {
  email?: string
  name?: string
  role?: UserRole
}

// User Role Enum
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator', 
  USER = 'user'
}

// Error DTOs
export interface ApiErrorResponseDto {
  message: string
  error: string
  statusCode: number
  timestamp: string
  path: string
}

export interface ValidationErrorDto extends ApiErrorResponseDto {
  details: Array<{
    field: string
    message: string
  }>
}

// Pagination DTOs (génériques)
export interface PaginationDto {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponseDto<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Types pour compatibilité avec le domain
export type UserDto = UserResponseDto
