// Configuration des endpoints API basée sur le Swagger du serveur NestJS

export const API_ENDPOINTS = {
  // Base API configuration
  BASE_URL: 'http://localhost:3000/api/v1',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',           // POST - { email, password } -> { accessToken, user }
    LOGOUT: '/auth/logout',         // POST - {} -> {}
    REFRESH: '/auth/refresh',       // POST - {} -> { accessToken }
    ME: '/auth/me'                  // GET - {} -> UserResponse (à vérifier si existe)
  },

  // User management endpoints  
  USERS: {
    LIST: '/users',                 // GET - ?page&limit&search -> { users, total, page, limit }
    CREATE: '/users',               // POST - CreateUserRequest -> UserResponse
    GET_BY_ID: '/users/:id',        // GET - UserResponse
    UPDATE: '/users/:id',           // PATCH - UpdateUserRequest -> UserResponse
    DELETE: '/users/:id'            // DELETE - {}
  }
} as const

// Types pour les paramètres de pagination selon le Swagger
export interface PaginationQuery {
  page?: number
  limit?: number
  search?: string
}

// Configuration des cookies et authentification
export const AUTH_CONFIG = {
  COOKIE_BASED: true,              // L'authentification utilise les cookies
  STORE_ACCESS_TOKEN: true,        // Stocker le token d'accès pour les headers si nécessaire
  REFRESH_ON_401: true             // Rafraîchir automatiquement sur 401
} as const

// Configuration des headers HTTP
export const HTTP_CONFIG = {
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  CREDENTIALS: 'include' as const, // Toujours inclure les cookies
  TIMEOUT: 10000                   // 10 secondes de timeout
} as const
