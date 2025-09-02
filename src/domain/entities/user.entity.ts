export interface User {
  readonly id: string
  readonly email: string
  readonly name: string
  readonly role: UserRole
  readonly status: UserStatus
  readonly lastLogin?: Date
  readonly createdAt: Date
  readonly updatedAt?: Date
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly lastLogin?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validateUser()
  }

  private validateUser(): void {
    if (!this.id) throw new Error('User ID is required')
    if (!this.email) throw new Error('User email is required')
    if (!this.name) throw new Error('User name is required')
    if (!this.isValidEmail(this.email)) throw new Error('Invalid email format')
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }

  public canManageUsers(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.MODERATOR
  }

  public getDisplayName(): string {
    return this.name
  }

  public getDaysSinceLastLogin(): number | null {
    if (!this.lastLogin) return null
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - this.lastLogin.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
