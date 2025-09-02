import type { User } from '../entities/user.entity'

export interface PaginationParams {
  page: number
  limit: number
}

export interface UserFilters {
  role?: string
  status?: string
  search?: string
  createdAfter?: Date
  createdBefore?: Date
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(params: PaginationParams, filters?: UserFilters): Promise<PaginatedResult<User>>
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>
  delete(id: string): Promise<void>
  count(): Promise<number>
  search(query: string, params: PaginationParams): Promise<PaginatedResult<User>>
}
