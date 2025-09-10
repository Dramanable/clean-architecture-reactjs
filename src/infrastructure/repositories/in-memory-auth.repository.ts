import type { AuthRepository } from '../../domain/repositories/auth.repository'
import type { AuthUser, LoginCredentials, AuthResponse } from '../../domain/entities/auth.entity'
import { AuthEntity } from '../../domain/entities/auth.entity'

// Utilisateurs mock pour la démonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    password: 'user123',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff'
  }
]

export class InMemoryAuthRepository implements AuthRepository {
  private currentUser: AuthUser | null = null
  private accessToken: string | null = null

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simuler une latence réseau
    await this.delay(800)

    // Rechercher l'utilisateur
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Créer l'entité utilisateur
    const authUser = new AuthEntity(
      user.id,
      user.email,
      user.name,
      user.role,
      user.avatar,
      new Date()
    )

    // Générer les tokens
    const tokens = {
      accessToken: this.generateToken(user.id),
      refreshToken: this.generateToken(user.id, true),
      expiresIn: 3600 // 1 heure
    }

    // Stocker la session
    this.currentUser = authUser
    this.accessToken = tokens.accessToken

    // ATTENTION: Stockage localStorage utilisé pour la démo uniquement
    // En production, NE JAMAIS stocker les tokens dans localStorage (vulnérabilité XSS)
    // Utiliser des cookies httpOnly sécurisés côté serveur
    if (credentials.rememberMe) {
      localStorage.setItem('auth_token', tokens.accessToken)
      localStorage.setItem('refresh_token', tokens.refreshToken)
      localStorage.setItem('user_data', JSON.stringify({
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
        avatar: authUser.avatar
      }))
    }

    return {
      user: authUser,
      tokens
    }
  }

  async logout(): Promise<void> {
    await this.delay(200)
    
    this.currentUser = null
    this.accessToken = null
    
    // Nettoyer le localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await this.delay(300)
    
    // En production, valider le refresh token côté serveur
    if (!refreshToken) {
      throw new Error('Invalid refresh token')
    }

    // Pour la démo, on récupère les données du localStorage
    const userData = localStorage.getItem('user_data')
    if (!userData) {
      throw new Error('No user data found')
    }

    const user = JSON.parse(userData)
    const authUser = new AuthEntity(
      user.id,
      user.email,
      user.name,
      user.role,
      user.avatar,
      new Date()
    )

    const tokens = {
      accessToken: this.generateToken(user.id),
      refreshToken: this.generateToken(user.id, true),
      expiresIn: 3600
    }

    this.currentUser = authUser
    this.accessToken = tokens.accessToken

    return {
      user: authUser,
      tokens
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Vérifier d'abord la session en mémoire
    if (this.currentUser) {
      return this.currentUser
    }

    // Sinon, essayer de récupérer depuis localStorage
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUser = new AuthEntity(
          user.id,
          user.email,
          user.name,
          user.role,
          user.avatar,
          new Date()
        )
        this.accessToken = token
        return this.currentUser
      } catch {
        // Si erreur de parsing, nettoyer le localStorage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
      }
    }

    return null
  }

  async validateToken(token: string): Promise<boolean> {
    await this.delay(100)
    
    // En production, valider le token côté serveur
    return token === this.accessToken && this.currentUser !== null
  }

  private generateToken(userId: string, isRefresh = false): string {
    const prefix = isRefresh ? 'refresh' : 'access'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    return `${prefix}_${userId}_${timestamp}_${random}`
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
