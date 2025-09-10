import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend) // Charge les traductions depuis des fichiers
  .use(LanguageDetector) // Détecte automatiquement la langue
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    fallbackLng: 'fr', // Langue par défaut
    debug: false, // Mode debug (mettre à true pendant le développement si nécessaire)
    
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },

    // Configuration du backend pour charger les traductions
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Espaces de noms par défaut
    defaultNS: 'translation',
    ns: ['translation'],

    // Langues supportées
    supportedLngs: ['fr', 'en'],

    // Options du détecteur de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  })

export default i18n