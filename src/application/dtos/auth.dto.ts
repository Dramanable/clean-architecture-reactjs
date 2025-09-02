export interface LoginDto {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponseDto {
  user: {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
    lastLogin?: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}
