import type { User } from '../../domain/entities/user.entity'
import { UserEntity, UserRole, UserStatus } from '../../domain/entities/user.entity'
import type { UserRepository, PaginationParams, UserFilters, PaginatedResult } from '../../domain/repositories/user.repository'

// Mock data pour la démonstration
const mockUsers: User[] = [
  new UserEntity(
    '1',
    'alice.martin@exemple.com',
    'Alice Martin',
    UserRole.ADMIN,
    UserStatus.ACTIVE,
    new Date('2024-01-01'),
    new Date('2024-01-15')
  ),
  new UserEntity(
    '2',
    'bob.dupont@exemple.com',
    'Bob Dupont',
    UserRole.USER,
    UserStatus.ACTIVE,
    new Date('2024-01-02'),
    new Date('2024-01-14')
  ),
  new UserEntity(
    '3',
    'claire.bernard@exemple.com',
    'Claire Bernard',
    UserRole.MODERATOR,
    UserStatus.INACTIVE,
    new Date('2024-01-03'),
    new Date('2024-01-10')
  ),
  new UserEntity(
    '4',
    'david.leroy@exemple.com',
    'David Leroy',
    UserRole.USER,
    UserStatus.ACTIVE,
    new Date('2024-01-04'),
    new Date('2024-01-15')
  ),
]

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [...mockUsers]
  private nextId = 5

  async findById(id: string): Promise<User | null> {
    // Simuler une latence réseau
    await this.delay(100)
    return this.users.find(user => user.id === id) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    await this.delay(100)
    return this.users.find(user => user.email === email) || null
  }

  async findAll(params: PaginationParams, filters?: UserFilters): Promise<PaginatedResult<User>> {
    await this.delay(200)
    
    let filteredUsers = [...this.users]

    // Appliquer les filtres
    if (filters) {
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role)
      }
      if (filters.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        )
      }
      if (filters.createdAfter) {
        filteredUsers = filteredUsers.filter(user => user.createdAt >= filters.createdAfter!)
      }
      if (filters.createdBefore) {
        filteredUsers = filteredUsers.filter(user => user.createdAt <= filters.createdBefore!)
      }
    }

    // Pagination
    const totalItems = filteredUsers.length
    const totalPages = Math.ceil(totalItems / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      data: paginatedUsers,
      meta: {
        currentPage: params.page,
        totalPages,
        totalItems,
        itemsPerPage: params.limit,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      }
    }
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await this.delay(300)
    
    const newUser = new UserEntity(
      this.nextId.toString(),
      userData.email,
      userData.name,
      userData.role,
      userData.status,
      new Date(),
      userData.lastLogin
    )
    
    this.users.push(newUser)
    this.nextId++
    
    return newUser
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    await this.delay(300)
    
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const existingUser = this.users[userIndex]
    const updatedUser = new UserEntity(
      existingUser.id,
      data.email || existingUser.email,
      data.name || existingUser.name,
      data.role || existingUser.role,
      data.status || existingUser.status,
      existingUser.createdAt,
      data.lastLogin || existingUser.lastLogin,
      new Date()
    )

    this.users[userIndex] = updatedUser
    return updatedUser
  }

  async delete(id: string): Promise<void> {
    await this.delay(200)
    
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    this.users.splice(userIndex, 1)
  }

  async count(): Promise<number> {
    await this.delay(50)
    return this.users.length
  }

  async search(query: string, params: PaginationParams): Promise<PaginatedResult<User>> {
    return this.findAll(params, { search: query })
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
