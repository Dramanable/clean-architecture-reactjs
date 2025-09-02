// Types partagés pour l'application

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt?: Date
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterOptions {
  [key: string]: unknown
}

export interface QueryParams {
  page?: number
  limit?: number
  sort?: SortOptions
  filters?: FilterOptions
  search?: string
}
