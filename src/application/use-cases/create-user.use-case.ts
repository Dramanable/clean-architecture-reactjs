import type { UserRepository } from '../../domain/repositories/user.repository'
import type { CreateUserDto, UserResponseDto } from '../dtos/user.dto'
import { UserEntity, UserStatus } from '../../domain/entities/user.entity'
import { UserId } from '../../domain/value-objects/user-id.vo'

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Créer une nouvelle entité utilisateur
    const userId = UserId.generate()
    const user = new UserEntity(
      userId.getValue(),
      dto.email,
      dto.name,
      dto.role,
      dto.status || UserStatus.ACTIVE,
      new Date()
    )

    // Sauvegarder via le repository
    const savedUser = await this.userRepository.create({
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin
    })

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      status: savedUser.status,
      lastLogin: savedUser.lastLogin?.toISOString(),
      createdAt: savedUser.createdAt.toISOString(),
      updatedAt: savedUser.updatedAt?.toISOString(),
    }
  }
}
