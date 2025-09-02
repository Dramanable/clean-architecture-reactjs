export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  lastLoginAt?: Date
  hasRole(role: string): boolean
  hasPermission(permission: string): boolean
  isAdmin(): boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

export class AuthEntity implements AuthUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: string,
    public readonly avatar?: string,
    public readonly lastLoginAt?: Date
  ) {
    this.validate()
  }

  hasRole(role: string): boolean {
    return this.role === role
  }

  hasPermission(permission: string): boolean {
    // Système de permissions simple basé sur les rôles
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'], // Admin a toutes les permissions
      moderator: ['users.read', 'users.update', 'content.moderate'],
      user: ['profile.read', 'profile.update']
    }

    const permissions = rolePermissions[this.role] || []
    return permissions.includes('*') || permissions.includes(permission)
  }

  isAdmin(): boolean {
    return this.role === 'admin'
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('User ID is required')
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Valid email is required')
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name is required')
    }
    if (!this.role || this.role.trim().length === 0) {
      throw new Error('Role is required')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
