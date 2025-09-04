// DTOs pour l'API NestJS basés sur le Swagger officiel

// Auth DTOs
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: UserResponse
}

export interface RefreshTokenResponse {
  accessToken: string
}

// User DTOs
export interface UserResponse {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  name: string
  role?: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  isActive?: boolean
}

// User Role Enum - selon le Swagger
export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// Users List Response - selon le Swagger
export interface UsersListResponse {
  users: UserResponse[]
  total: number
  page: number
  limit: number
}

// Error DTOs
export interface ApiErrorResponse {
  message: string
  error: string
  statusCode: number
  timestamp: string
  path: string
}

// Types pour compatibilité avec le domain
export type UserDto = UserResponse
export type LoginDto = LoginRequest
export type LoginResponseDto = LoginResponse
export type CreateUserDto = CreateUserRequest
export type UpdateUserDto = UpdateUserRequest
