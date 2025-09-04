import { UserService } from '@/application/services/user.service'
import { HttpUserRepository } from '@/infrastructure/repositories/http-user.repository'

// Hook pour instancier le service avec ses dépendances
export function useUserService() {
  const userRepository = new HttpUserRepository()
  return new UserService(userRepository)
}
