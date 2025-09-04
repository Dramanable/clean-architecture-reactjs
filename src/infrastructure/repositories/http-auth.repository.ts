import type { AuthRepository } from '../../domain/repositories/auth.repository'
import type { AuthUser, LoginCredentials, AuthResponse, AuthTokens } from '../../domain/entities/auth.entity'
import { AuthEntity } from '../../domain/entities/auth.entity'
import { httpClient } from '../http/http-client'
import type { LoginRequest, LoginResponse, UserResponse } from '../dtos/api.dto'
import { InvalidCredentialsError, AuthenticationError } from '../../domain/exceptions/authentication.error'
import { API_ENDPOINTS } from '../config/api-endpoints'

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const loginRequest: LoginRequest = { 
        email: credentials.email, 
        password: credentials.password 
      }
      
      const response = await httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, loginRequest)
      
      // Stocker l'access token si nécessaire (pour les headers futurs ou fallback)
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        httpClient.setAuthToken(response.data.accessToken)
      }
      
      const authUser = this.mapUserResponseToAuthUser(response.data.user)
      const tokens = this.mapLoginResponseToTokens(response.data)
      
      return {
        user: authUser,
        tokens
      }
    } catch (error: unknown) {
      const httpError = error as { status?: number; message?: string }
      if (httpError.status === 401) {
        throw new InvalidCredentialsError()
      }
      throw new AuthenticationError(`Erreur lors de la connexion: ${httpError.message || 'Erreur inconnue'}`)
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT, {})
      localStorage.removeItem('accessToken')
      httpClient.removeAuthToken()
    } catch (error: unknown) {
      // Même si la déconnexion côté serveur échoue, on nettoie côté client
      localStorage.removeItem('accessToken')
      httpClient.removeAuthToken()
      const httpError = error as { message?: string }
      throw new AuthenticationError(`Erreur lors de la déconnexion: ${httpError.message || 'Erreur inconnue'}`)
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Essayer d'abord avec un endpoint /me s'il existe, sinon utiliser les infos du token
      const response = await httpClient.get<UserResponse>(API_ENDPOINTS.AUTH.ME)
      return this.mapUserResponseToAuthUser(response.data)
    } catch (error: unknown) {
      const httpError = error as { status?: number }
      if (httpError.status === 401) {
        return null
      }
      const errorMessage = (error as { message?: string }).message
      throw new AuthenticationError(`Erreur lors de la récupération de l'utilisateur: ${errorMessage || 'Erreur inconnue'}`)
    }
  }

  async refreshToken(refreshToken?: string): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<{accessToken: string}>(API_ENDPOINTS.AUTH.REFRESH, {})
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        httpClient.setAuthToken(response.data.accessToken)
      }
      
      // Récupérer les infos utilisateur à jour
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw new AuthenticationError('Impossible de récupérer les informations utilisateur après le refresh')
      }
      
      return {
        user: currentUser,
        tokens: {
          accessToken: response.data.accessToken,
          refreshToken: refreshToken || '', // Le serveur ne renvoie pas de refresh token
          expiresIn: 3600 // Valeur par défaut, pourrait être configurée
        }
      }
    } catch (error: unknown) {
      localStorage.removeItem('accessToken')
      httpClient.removeAuthToken()
      const errorMessage = (error as { message?: string }).message
      throw new AuthenticationError(`Erreur lors du rafraîchissement du token: ${errorMessage || 'Erreur inconnue'}`)
    }
  }

  async validateToken(_token?: string): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser()
      return currentUser !== null
    } catch {
      return false
    }
  }

  private mapUserResponseToAuthUser(userResponse: UserResponse): AuthUser {
    return new AuthEntity(
      userResponse.id,
      userResponse.email,
      userResponse.name,
      this.mapApiRoleToDomainRole(userResponse.role),
      undefined, // avatar pas dans l'API
      new Date(userResponse.updatedAt) // lastLoginAt approximé
    )
  }

  private mapLoginResponseToTokens(loginResponse: LoginResponse): AuthTokens {
    return {
      accessToken: loginResponse.accessToken,
      refreshToken: '', // Le serveur ne renvoie pas de refresh token selon le Swagger
      expiresIn: 3600 // Valeur par défaut, pourrait être configurée
    }
  }

  private mapApiRoleToDomainRole(role: string): string {
    // Mapping entre les rôles de l'API et du domain pour AuthEntity
    switch (role) {
      case 'SUPER_ADMIN':
        return 'admin'
      case 'MANAGER':
        return 'moderator'
      case 'USER':
        return 'user'
      default:
        return 'user'
    }
  }
}
