
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGES } from './languages'

const path = window.location.pathname.replace(/\/$/, '') || '/'

const language = Object.entries(LANGUAGES)
  .find(([key]) => key === path)?.[1].locale ?? LANGUAGES['/'].locale


const resources = Object.fromEntries(
  Object.values(LANGUAGES).map(({ locale, translation }) => [locale, { translation }])
)

void i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: LANGUAGES['/'].locale,
  supportedLngs: Object.values(LANGUAGES).map(({ locale }) => locale),
  interpolation: {
    escapeValue: false
  }
})

export default i18n
