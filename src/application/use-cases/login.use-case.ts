import type { AuthRepository } from '../../domain/repositories/auth.repository'
import type { LoginDto, AuthResponseDto } from '../dtos/auth.dto'

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    // Validation des données d'entrée
    this.validateCredentials(dto)

    // Appel au repository
    const authResponse = await this.authRepository.login({
      email: dto.email,
      password: dto.password,
      rememberMe: dto.rememberMe
    })

    // Transformation en DTO de sortie
    return {
      user: {
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        role: authResponse.user.role,
        avatar: authResponse.user.avatar,
        lastLogin: authResponse.user.lastLoginAt?.toISOString()
      },
      tokens: {
        accessToken: authResponse.tokens.accessToken,
        refreshToken: authResponse.tokens.refreshToken,
        expiresIn: authResponse.tokens.expiresIn
      }
    }
  }

  private validateCredentials(dto: LoginDto): void {
    if (!dto.email || dto.email.trim() === '') {
      throw new Error('Email is required')
    }
    
    if (!dto.password || dto.password.trim() === '') {
      throw new Error('Password is required')
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(dto.email)) {
      throw new Error('Invalid email format')
    }

    // Validation de la longueur du mot de passe
    if (dto.password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }
  }
}
