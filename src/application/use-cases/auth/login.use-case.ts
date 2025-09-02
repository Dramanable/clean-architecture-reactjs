import type { AuthRepository } from '../../../domain/repositories/auth.repository'
import type { LoginCredentials, AuthResponse } from '../../../domain/entities/auth.entity'

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validation des entrées
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required')
    }

    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format')
    }

    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    try {
      return await this.authRepository.login(credentials)
    } catch (error) {
      // Logger l'erreur en production
      console.error('Login failed:', error)
      throw error
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
