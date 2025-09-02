export interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
}

export interface HttpError {
  message: string
  status: number
  data?: unknown
}

export class HttpClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '') // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization']
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<HttpResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      credentials: 'include' // Inclure les cookies dans toutes les requêtes
    }

    try {
      const response = await fetch(url, config)
      
      let data: unknown
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        const errorData = data as { message?: string }
        const error: HttpError = {
          message: errorData.message || `HTTP Error: ${response.status}`,
          status: response.status,
          data
        }
        throw error
      }

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText
      }
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error // Re-throw HttpError
      }
      
      // Network or other errors
      const httpError: HttpError = {
        message: error instanceof Error ? error.message : 'Network error',
        status: 0
      }
      throw httpError
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<HttpResponse<T>> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<HttpResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Instance globale du client HTTP
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
export const httpClient = new HttpClient(API_BASE_URL)
