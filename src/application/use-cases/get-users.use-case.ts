import type { UserRepository } from '../../domain/repositories/user.repository'
import type { UserResponseDto, PaginationDto, UserFiltersDto, PaginatedResponseDto } from '../dtos/user.dto'

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    pagination: PaginationDto,
    filters?: UserFiltersDto
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const domainFilters = filters ? {
      role: filters.role,
      status: filters.status,
      search: filters.search,
      createdAfter: filters.createdAfter ? new Date(filters.createdAfter) : undefined,
      createdBefore: filters.createdBefore ? new Date(filters.createdBefore) : undefined,
    } : undefined

    const result = await this.userRepository.findAll(pagination, domainFilters)

    return {
      data: result.data.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      })),
      meta: result.meta
    }
  }
}
