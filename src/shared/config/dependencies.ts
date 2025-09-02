import { InMemoryUserRepository } from '../../infrastructure/repositories/in-memory-user.repository'
import { HttpUserRepository } from '../../infrastructure/repositories/http-user.repository'
import { InMemoryAuthRepository } from '../../infrastructure/repositories/in-memory-auth.repository'
import { HttpAuthRepository } from '../../infrastructure/repositories/http-auth.repository'
import { UserService } from '../../application/services/user.service'
import { AuthService } from '../../application/services/auth.service'

// Configuration - peut être basée sur des variables d'environnement
const USE_HTTP_API = import.meta.env.VITE_USE_HTTP_API === 'true' || false

// Repositories
export const userRepository = USE_HTTP_API 
  ? new HttpUserRepository() 
  : new InMemoryUserRepository()

export const authRepository = USE_HTTP_API 
  ? new HttpAuthRepository() 
  : new InMemoryAuthRepository()

// Services
export const userService = new UserService(userRepository)
export const authService = new AuthService(authRepository)

// Types pour l'injection de dépendances
export type { UserService }
export type { AuthService }
