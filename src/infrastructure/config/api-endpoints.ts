// Configuration des endpoints API basée sur le Swagger du serveur NestJS

export const API_ENDPOINTS = {
  // Base API configuration
  BASE_URL: 'http://localhost:3000/api/v1',
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',           // POST - { email, password } -> { accessToken, user }
    LOGOUT: '/auth/logout',         // GET - {} -> {}
    REFRESH: '/auth/refresh',       // GET - {} -> { accessToken }
    ME: '/auth/me'                  // GET - {} -> UserResponse
  },

  // User management endpoints  
  USERS: {
    LIST: '/users',                 // GET - { page, limit, role } -> { users, total, page, limit }
    SEARCH: '/users/search',        // POST - SearchUsersDto -> { users, pagination }
    CREATE: '/users',               // POST - CreateUserRequest -> UserResponse
    GET_BY_ID: (id: string) => `/users/${id}`,  // GET - UserResponse
    UPDATE: (id: string) => `/users/${id}`,     // PUT - UpdateUserRequest -> UserResponse  
    DELETE: (id: string) => `/users/${id}`,     // DELETE - {}
    COUNT: '/users/count'           // GET - { count: number }
  }
} as const

// Types pour la recherche d'utilisateurs selon le Swagger
export interface SearchUsersQuery {
  searchTerm?: string
  roles?: string[]
  isActive?: boolean
  createdAfter?: string
  createdBefore?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Types pour les paramètres de pagination
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
