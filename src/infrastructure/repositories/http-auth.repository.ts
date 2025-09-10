import type { AuthRepository } from '../../domain/repositories/auth.repository'
import type { AuthUser, LoginCredentials, AuthResponse, AuthTokens } from '../../domain/entities/auth.entity'
import { AuthEntity } from '../../domain/entities/auth.entity'
import { httpClient } from '../http/http-client'
import type { 
  UserResponse, 
  UserRole,
  LoginRequest,
  LoginResponse
} from '../dtos/api.dto'
import { InvalidCredentialsError, AuthenticationError } from '../../domain/exceptions/authentication.error'
import { API_ENDPOINTS } from '../config/api-endpoints'
import i18n from '../../i18n'

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const loginRequest: LoginRequest = { 
        email: credentials.email, 
        password: credentials.password 
      }
      
      const response = await httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, loginRequest)
      
      // Pas de stockage localStorage - l'authentification se fait par cookies seulement
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
      throw new AuthenticationError(i18n.t('errors.loginFailed', { message: httpError.message || i18n.t('errors.unknownError') }))
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.get(API_ENDPOINTS.AUTH.LOGOUT)
      // Pas de nettoyage localStorage - l'authentification se fait par cookies seulement
      httpClient.removeAuthToken()
    } catch (error: unknown) {
      // Même si la déconnexion côté serveur échoue, on nettoie côté client
      httpClient.removeAuthToken()
      const httpError = error as { message?: string }
      throw new AuthenticationError(i18n.t('errors.logoutFailed', { message: httpError.message || i18n.t('errors.unknownError') }))
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // L'endpoint /auth/me renvoie une structure { user: { id, email, name, role } }
      const response = await httpClient.get<{ user: { id: string; email: string; name: string; role: string } }>(API_ENDPOINTS.AUTH.ME)
      
      // Mapper la réponse au format UserResponse attendu
      const userResponse: UserResponse = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role as UserRole,
        isActive: true, // Valeur par défaut (si l'utilisateur peut se connecter, il est actif)
        createdAt: new Date().toISOString(), // Non fourni par /auth/me
        updatedAt: new Date().toISOString()  // Non fourni par /auth/me
      }
      
      return this.mapUserResponseToAuthUser(userResponse)
    } catch (error: unknown) {
      const httpError = error as { status?: number }
      if (httpError.status === 401) {
        return null
      }
      const errorMessage = (error as { message?: string }).message
      throw new AuthenticationError(i18n.t('errors.userFetchFailed', { message: errorMessage || i18n.t('errors.unknownError') }))
    }
  }

  async refreshToken(refreshToken?: string): Promise<AuthResponse> {
    try {
      const response = await httpClient.get<{accessToken: string}>(API_ENDPOINTS.AUTH.REFRESH)
      
      // Pas de stockage localStorage - l'authentification se fait par cookies seulement
      // Le serveur met à jour les cookies automatiquement
      
      // Récupérer les infos utilisateur à jour
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw new AuthenticationError(i18n.t('errors.userInfoUnavailable'))
      }
      
      return {
        user: currentUser,
        tokens: {
          accessToken: response.data.accessToken || '', // Token fourni mais pas stocké
          refreshToken: refreshToken || '', // Le serveur ne renvoie pas de refresh token
          expiresIn: 3600 // Valeur par défaut, pourrait être configurée
        }
      }
    } catch (error: unknown) {
      // Pas de nettoyage localStorage - seul nettoyage des headers si nécessaire
      httpClient.removeAuthToken()
      const errorMessage = (error as { message?: string }).message
      throw new AuthenticationError(i18n.t('errors.refreshFailed', { message: errorMessage || i18n.t('errors.unknownError') }))
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      // Pour l'authentification par cookies, on essaie d'appeler /auth/me
      const user = await this.getCurrentUser()
      return user !== null
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
