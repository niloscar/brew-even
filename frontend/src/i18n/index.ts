import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locales/en.json'
import sv from '../locales/sv.json'
import de from '../locales/de.json'
import fr from '../locales/fr.json'

const supportedLngs = ['en-US', 'sv-SE', 'de-DE', 'fr-FR']

const savedLanguage = localStorage.getItem('brew-even-locale')

const browserLanguage = navigator.languages
  .map((language) =>
    supportedLngs.find((supported) =>
      supported.split('-')[0] === language.split('-')[0]
    )
  )
  .find(Boolean)

const language =
  supportedLngs.find((lng) => lng === savedLanguage) ??
  browserLanguage ??
  'en-US'

i18n.on('languageChanged', (language) => {
  localStorage.setItem('brew-even-locale', language)
  document.documentElement.lang = language
})

void i18n.use(initReactI18next).init({
  resources: {
    'de-DE': { translation: de },
    'en-US': { translation: en },
    'fr-FR': { translation: fr },
    'sv-SE': { translation: sv }
  },
  lng: language,
  fallbackLng: 'en-US',
  supportedLngs: ['de-DE', 'en-US', 'fr-FR', 'sv-SE'],
  interpolation: {
    escapeValue: false
  }
})

export default i18n