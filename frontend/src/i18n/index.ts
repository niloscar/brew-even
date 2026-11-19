
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGES } from './languages'

const path = window.location.pathname.replace(/\/$/, '') || '/'

if (path === '/') {
  let savedPath: string | null = null

  try {
    savedPath = localStorage.getItem('brew-even-language')
  } catch {
    savedPath = null
  }

  const browserPath = (navigator.languages.length ? navigator.languages : [navigator.language])
    .map((language) => language.split('-')[0].toLowerCase())
    .map((language) => Object.entries(LANGUAGES).find(([, { locale }]) => locale.split('-')[0] === language)?.[0])
    .find((path) => path !== undefined)

  const preferredPath =
    savedPath && Object.keys(LANGUAGES).includes(savedPath)
      ? savedPath
      : browserPath ?? '/en'

  window.location.replace(`${preferredPath}${window.location.search}${window.location.hash}`)
}

const language = Object.entries(LANGUAGES)
  .find(([key]) => key === path)?.[1].locale ?? LANGUAGES['/en'].locale


const resources = Object.fromEntries(
  Object.values(LANGUAGES).map(({ locale, translation }) => [locale, { translation }])
)

void i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: LANGUAGES['/en'].locale,
  supportedLngs: Object.values(LANGUAGES).map(({ locale }) => locale),
  interpolation: {
    escapeValue: false
  }
})

export default i18n
