import { httpClient } from './http-client'

// Intercepteur pour gérer les erreurs d'authentification
export function setupHttpInterceptors() {
  // Sauvegarder la méthode request originale
  const originalRequest = httpClient['request'].bind(httpClient)
  
  // Override de la méthode request
  httpClient['request'] = async function<T>(endpoint: string, options: RequestInit = {}) {
    try {
      return await originalRequest<T>(endpoint, options)
    } catch (error: unknown) {
      // Si erreur 401 (Unauthorized), déclencher une déconnexion
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        console.warn('Authentication expired, redirecting to login...')
        
        // Nettoyer les données locales
        localStorage.removeItem('user_data')
        
        // Rediriger vers la page de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      
      throw error
    }
  }
}

// Appeler cette fonction au démarrage de l'application
setupHttpInterceptors()
