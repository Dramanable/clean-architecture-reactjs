import { createContext } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/hooks'

// Contexte pour partager les fonctionnalités i18n à travers l'app
interface I18nContextType {
  t: (key: string, options?: Record<string, unknown>) => string
  changeLanguage: (lng: string) => void
  currentLanguage: string
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

export { I18nContext }

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const i18nValues = useI18n()
  
  return (
    <I18nContext.Provider value={i18nValues}>
      {children}
    </I18nContext.Provider>
  )
}
