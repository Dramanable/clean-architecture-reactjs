import type { AuthRepository } from '../../../domain/repositories/auth.repository'

export class LogoutUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    try {
      await this.authRepository.logout()
    } catch (error) {
      // Même si l'appel API échoue, on s'assure du nettoyage côté client
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }
  }
}
