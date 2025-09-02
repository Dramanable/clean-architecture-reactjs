import type { UserRepository } from '../../domain/repositories/user.repository'
import { GetUsersUseCase } from '../use-cases/get-users.use-case'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.use-case'
import { CreateUserUseCase } from '../use-cases/create-user.use-case'
import type { UserResponseDto, CreateUserDto, PaginationDto, UserFiltersDto, PaginatedResponseDto } from '../dtos/user.dto'

export class UserService {
  private readonly getUsersUseCase: GetUsersUseCase
  private readonly getUserByIdUseCase: GetUserByIdUseCase
  private readonly createUserUseCase: CreateUserUseCase

  constructor(userRepository: UserRepository) {
    this.getUsersUseCase = new GetUsersUseCase(userRepository)
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
    this.createUserUseCase = new CreateUserUseCase(userRepository)
  }

  async getUsers(
    pagination: PaginationDto,
    filters?: UserFiltersDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.getUsersUseCase.execute(pagination, filters)
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    return this.getUserByIdUseCase.execute(id)
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto)
  }
}
