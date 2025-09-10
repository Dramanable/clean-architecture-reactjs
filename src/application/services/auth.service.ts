import type { AuthRepository } from '../../domain/repositories/auth.repository'
import type { LoginCredentials, AuthResponse, AuthUser } from '../../domain/entities/auth.entity'
import { LoginUseCase } from '../use-cases/auth/login.use-case'
import { LogoutUseCase } from '../use-cases/auth/logout.use-case'

export class AuthService {
  private loginUseCase: LoginUseCase
  private logoutUseCase: LogoutUseCase

  constructor(private authRepository: AuthRepository) {
    this.loginUseCase = new LoginUseCase(authRepository)
    this.logoutUseCase = new LogoutUseCase(authRepository)
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.loginUseCase.execute(credentials)
  }

  async logout(): Promise<void> {
    return this.logoutUseCase.execute()
  }

  async refreshToken(refreshToken?: string): Promise<AuthResponse> {
    return this.authRepository.refreshToken(refreshToken)
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.authRepository.getCurrentUser()
  }

  async validateToken(token?: string): Promise<boolean> {
    return this.authRepository.validateToken(token)
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.hasRole(role) ?? false
  }

  async hasPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.hasPermission(permission) ?? false
  }
}
