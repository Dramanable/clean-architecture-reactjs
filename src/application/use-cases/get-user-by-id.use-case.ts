import type { UserRepository } from '../../domain/repositories/user.repository'
import type { UserResponseDto } from '../dtos/user.dto'

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id)
    
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }
  }
}
