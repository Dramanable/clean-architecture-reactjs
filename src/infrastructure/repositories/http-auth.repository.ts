import type { AuthRepository } from '../../domain/repositories/auth.repository'
import type { AuthUser, LoginCredentials, AuthResponse } from '../../domain/entities/auth.entity'
import { AuthEntity } from '../../domain/entities/auth.entity'
import { httpClient } from '../http/http-client'
import type { 
  LoginDto, 
  LoginResponseDto, 
  RefreshTokenResponseDto,
  UserInfoResponseDto,
  UserResponseDto
} from '../dtos/api.dto'

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const requestData: LoginDto = {
        email: credentials.email,
        password: credentials.password
      }

      const response = await httpClient.post<LoginResponseDto>('/auth/login', requestData)
      
      // Avec les cookies, pas besoin de stocker manuellement le token
      // Le serveur définit automatiquement les cookies httpOnly
      
      // Convertir UserResponseDto en AuthEntity
      const authUser = this.mapUserResponseDtoToAuthEntity(response.data.user)
      
      // Optionnellement stocker les infos utilisateur en local (sans tokens sensibles)
      if (credentials.rememberMe) {
        localStorage.setItem('user_data', JSON.stringify({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role
        }))
      }

      return {
        user: authUser,
        tokens: {
          accessToken: 'cookie-based', // Token géré par cookie
          refreshToken: 'cookie-based', // Token géré par cookie
          expiresIn: response.data.expires_in
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Invalid email or password')
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Nettoyer le localStorage
      localStorage.removeItem('user_data')
      // Les cookies sont automatiquement supprimés côté serveur
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      // Avec les cookies, le refresh est automatique
      const response = await httpClient.post<RefreshTokenResponseDto>('/auth/refresh')
      
      // Récupérer les infos utilisateur actuelles
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw new Error('No user data found after token refresh')
      }

      return {
        user: currentUser,
        tokens: {
          accessToken: 'cookie-based',
          refreshToken: 'cookie-based', 
          expiresIn: response.data.expires_in
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // En cas d'échec, nettoyer la session
      this.logout()
      throw new Error('Token refresh failed')
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Essayer d'abord avec l'API (les cookies sont inclus automatiquement)
      const response = await httpClient.get<UserInfoResponseDto>('/auth/me')
      return this.mapUserResponseDtoToAuthEntity(response.data)
    } catch (error) {
      console.error('Get current user failed:', error)
      // Si l'API échoue, essayer de récupérer depuis localStorage
      const userData = localStorage.getItem('user_data')
      if (userData) {
        try {
          const user = JSON.parse(userData) as UserResponseDto
          return this.mapUserResponseDtoToAuthEntity(user)
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError)
          // Nettoyer les données corrompues
          this.logout()
        }
      }
      
      return null
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      // Avec les cookies, la validation se fait automatiquement
      await httpClient.get('/auth/validate')
      return true
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }

  private mapUserResponseDtoToAuthEntity(userDto: UserResponseDto): AuthEntity {
    return new AuthEntity(
      userDto.id,
      userDto.email,
      userDto.name,
      userDto.role,
      undefined, // avatar n'est pas dans le DTO selon Swagger
      userDto.lastLoginAt ? new Date(userDto.lastLoginAt) : undefined
    )
  }
}
