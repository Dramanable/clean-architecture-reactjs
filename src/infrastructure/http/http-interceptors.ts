import { httpClient } from './http-client'
import { API_ENDPOINTS } from '../config/api-endpoints'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

// Intercepteur pour gérer les erreurs d'authentification avec refresh token
export function setupHttpInterceptors() {
  console.log('🔧 Setting up HTTP interceptors...')
  console.log('🔍 httpClient object:', httpClient)
  
  // Sauvegarder les méthodes originales
  const originalGet = httpClient.get.bind(httpClient)
  const originalPost = httpClient.post.bind(httpClient)
  const originalPut = httpClient.put.bind(httpClient)
  const originalDelete = httpClient.delete.bind(httpClient)
  
  // Fonction générique pour wrapper les appels HTTP
  const wrapWithRetry = async <T>(
    originalCall: () => Promise<T>,
    endpoint: string,
    methodName: string
  ): Promise<T> => {
    console.log(`🌐 HTTP ${methodName.toUpperCase()} intercepted:`, endpoint)
    try {
      return await originalCall()
    } catch (error: unknown) {
      console.log(`❌ HTTP ${methodName.toUpperCase()} failed:`, endpoint, 'Error:', error)
      
      // Vérifier si c'est une erreur avec un status
      const hasStatus = error && typeof error === 'object' && 'status' in error
      const status = hasStatus ? (error as { status: number }).status : 'no status'
      console.log('🔍 Error status check:', status, 'hasStatus:', hasStatus)
      
      // Si erreur 401 (Unauthorized) et ce n'est pas la route de login
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        // Ne pas essayer de refresh sur les endpoints d'auth (login, refresh)
        if (endpoint.includes('/auth/login') || endpoint.includes('/auth/refresh')) {
          console.log('401 on auth endpoint, skipping refresh:', endpoint)
          throw error
        }
        
        console.warn('🔄 Authentication expired, attempting token refresh for endpoint:', endpoint)
        
        try {
          // Éviter les appels multiples simultanés de refresh
          if (!isRefreshing) {
            console.log('🚀 Starting token refresh process...')
            isRefreshing = true
            refreshPromise = attemptTokenRefresh()
          } else {
            console.log('⏳ Token refresh already in progress, waiting...')
          }
          
          if (refreshPromise) {
            await refreshPromise
          }
          
          // Réessayer la requête originale avec les nouveaux tokens
          console.log('🔄 Retrying original request after refresh:', endpoint)
          return await originalCall()
        } catch (refreshError) {
          console.error('❌ Token refresh failed, redirecting to login...', refreshError)
          handleAuthFailure()
          throw error
        } finally {
          isRefreshing = false
          refreshPromise = null
        }
      }
      
      throw error
    }
  }
  
  // Override des méthodes HTTP
  httpClient.get = async <T>(endpoint: string, params?: Record<string, unknown>) => {
    return wrapWithRetry(() => originalGet<T>(endpoint, params), endpoint, 'get')
  }
  
  httpClient.post = async <T>(endpoint: string, data?: unknown) => {
    return wrapWithRetry(() => originalPost<T>(endpoint, data), endpoint, 'post')
  }
  
  httpClient.put = async <T>(endpoint: string, data?: unknown) => {
    return wrapWithRetry(() => originalPut<T>(endpoint, data), endpoint, 'put')
  }
  
  httpClient.delete = async <T>(endpoint: string) => {
    return wrapWithRetry(() => originalDelete<T>(endpoint), endpoint, 'delete')
  }
}

async function attemptTokenRefresh(): Promise<void> {
  try {
    console.log('🔄 Calling refresh token API...')
    console.log('🔍 Refresh endpoint:', API_ENDPOINTS.AUTH.REFRESH)
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'GET', // Selon la configuration API, c'est un GET
      credentials: 'include' // Inclure les cookies
    })
    
    console.log('📡 Refresh token response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Refresh token failed with status:', response.status, 'Body:', errorText)
      throw new Error(`Refresh failed: ${response.status} - ${errorText}`)
    }
    
    // Pas de stockage localStorage - les cookies sont automatiquement mis à jour par le serveur
    console.log('✅ Token refresh successful')
  } catch (error) {
    console.error('❌ Token refresh failed:', error)
    throw error
  }
}

function handleAuthFailure(): void {
  // Nettoyer seulement les headers d'authentification
  httpClient.removeAuthToken()
  
  // Rediriger vers la page de login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// Fonction de test accessible depuis la console pour tester le refresh token
declare global {
  interface Window {
    testRefreshToken: () => Promise<void>
  }
}

window.testRefreshToken = async () => {
  console.log('🧪 Testing API call via httpClient that should trigger refresh...')
  try {
    // Import du httpClient pour le test
    const { httpClient } = await import('./http-client')
    
    // Tester un appel qui devrait déclencher l'intercepteur
    const response = await httpClient.post('/users/search', {
      searchTerm: '',
      page: 1, 
      limit: 10
    })
    console.log('✅ httpClient call successful:', response)
  } catch (error) {
    console.error('❌ httpClient call failed:', error)
  }
}

// Auto-configuration des intercepteurs au chargement du module
setupHttpInterceptors()
