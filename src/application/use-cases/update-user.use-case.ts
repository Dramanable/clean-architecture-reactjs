import type { UserRepository } from '../../domain/repositories/user.repository'
import type { User } from '../../domain/entities/user.entity'
import { UserError } from '../../domain/exceptions/user.error'
import i18n from '../../i18n'

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, userData: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new UserError(i18n.t('errors.userNotFound'))
    }

    // Valider l'email si fourni et différent de l'actuel
    if (userData.email && userData.email !== existingUser.email) {
      if (!this.isValidEmail(userData.email)) {
        throw new UserError(i18n.t('errors.invalidEmailFormat'))
      }

      const userWithEmail = await this.userRepository.findByEmail(userData.email)
      if (userWithEmail && userWithEmail.id !== id) {
        throw new UserError(i18n.t('errors.emailAlreadyExists'))
      }
    }

    // Valider le nom si fourni
    if (userData.name !== undefined && (!userData.name || userData.name.trim().length < 2)) {
      throw new UserError(i18n.t('errors.nameMinLength'))
    }

    try {
      const updateData = {
        ...userData,
        ...(userData.name && { name: userData.name.trim() }),
        updatedAt: new Date()
      }

      return await this.userRepository.update(id, updateData)
    } catch (error) {
      throw new UserError(i18n.t('errors.userUpdateFailed'))
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
