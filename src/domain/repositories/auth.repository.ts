import type { AuthUser, LoginCredentials, AuthResponse } from '../entities/auth.entity'

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>
  logout(): Promise<void>
  refreshToken(refreshToken?: string): Promise<AuthResponse>
  getCurrentUser(): Promise<AuthUser | null>
  validateToken(token?: string): Promise<boolean>
}
