import { useTranslation } from 'react-i18next'

export function useI18n() {
  const { t, i18n } = useTranslation()
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  
  const currentLanguage = i18n.language
  
  const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const locale = currentLanguage === 'en' ? 'en-US' : 'fr-FR'
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj)
  }
  
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    const locale = currentLanguage === 'en' ? 'en-US' : 'fr-FR'
    return new Intl.NumberFormat(locale, options).format(number)
  }
  
  return {
    t,
    changeLanguage,
    currentLanguage,
    formatDate,
    formatNumber,
    isLoading: !i18n.isInitialized
  }
}

// Helper pour les rôles utilisateur
export function useUserRoleTranslation() {
  const { t } = useTranslation()
  
  const translateRole = (role: string): string => {
    // Normaliser le rôle pour la traduction
    const normalizedRole = role.toLowerCase().replace('_', '')
    
    switch (normalizedRole) {
      case 'superadmin':
      case 'admin':
        return t('roles.admin')
      case 'manager':
        return t('roles.manager')
      case 'user':
        return t('roles.user')
      case 'moderator':
        return t('roles.moderator')
      default:
        return t('roles.user') // Rôle par défaut
    }
  }
  
  const translateStatus = (status: string): string => {
    const normalizedStatus = status.toLowerCase()
    
    switch (normalizedStatus) {
      case 'active':
      case 'true':
        return t('users.active')
      case 'inactive':
      case 'false':
        return t('users.inactive')
      default:
        return status
    }
  }
  
  return {
    translateRole,
    translateStatus
  }
}

// Helper pour le formatage des données
export function useFormatters() {
  const { formatDate, formatNumber } = useI18n()
  
  return {
    formatDate,
    formatNumber
  }
}
