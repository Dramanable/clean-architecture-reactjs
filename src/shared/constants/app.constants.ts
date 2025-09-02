// Constantes de l'application

export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  SETTINGS: '/api/settings',
} as const

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  USERS: '/users',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

export const QUERY_KEYS = {
  USERS: 'users',
  USER: 'user',
  SETTINGS: 'settings',
} as const

export const LOCAL_STORAGE_KEYS = {
  THEME: 'app-theme',
  USER_PREFERENCES: 'user-preferences',
  AUTH_TOKEN: 'auth-token',
} as const

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const
