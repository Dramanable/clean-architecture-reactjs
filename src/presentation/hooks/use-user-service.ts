import { UserService } from '../../application/services/user.service'
import { InMemoryUserRepository } from '../../infrastructure/repositories/in-memory-user.repository'

// Instance unique du repository et service (Singleton pattern)
const userRepository = new InMemoryUserRepository()
const userService = new UserService(userRepository)

export const useUserService = () => {
  return userService
}
