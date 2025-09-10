import type { UserRepository, PaginationParams, UserFilters, PaginatedResult } from '../../domain/repositories/user.repository'
import type { User } from '../../domain/entities/user.entity'
import { UpdateUserUseCase } from '../use-cases/update-user.use-case'
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case'

export class UserManagementService {
  private readonly updateUserUseCase: UpdateUserUseCase
  private readonly deleteUserUseCase: DeleteUserUseCase

  constructor(private userRepository: UserRepository) {
    this.updateUserUseCase = new UpdateUserUseCase(userRepository)
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository)
  }

  async getUsers(pagination: PaginationParams, filters?: UserFilters): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(pagination, filters)
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id)
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.userRepository.create(userData)
  }

  async updateUser(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    return this.updateUserUseCase.execute(id, userData)
  }

  async deleteUser(id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id)
  }

  async searchUsers(query: string, pagination: PaginationParams): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(pagination, { searchTerm: query })
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.count()
  }
}
