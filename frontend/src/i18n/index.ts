
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

function syncLanguageFromUrl() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const language = Object.entries(LANGUAGES).find(([key]) => key === path)?.[1]

  if (!language) return

  const { locale, translation } = language
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const url = new URL(path, canonical?.href ?? window.location.origin).href

  void i18n.changeLanguage(locale)

  document.documentElement.lang = locale
  document.title = translation.meta.title

  document.querySelector('meta[name="description"]')?.setAttribute('content', translation.meta.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', translation.meta.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', translation.meta.description)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url)
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale.replace('-', '_'))

  canonical?.setAttribute('href', url)
}

export function navigateToLanguage(path: string) {
  if (!Object.keys(LANGUAGES).includes(path)) return

  try {
    localStorage.setItem('brew-even-language', path)
  } catch {
    // Continue without saving the preference
  }

  if (window.location.pathname.replace(/\/$/, '') === path) return

  window.history.pushState(window.history.state, '', `${path}${window.location.search}${window.location.hash}`)

  syncLanguageFromUrl()
}

window.addEventListener('popstate', syncLanguageFromUrl)

export default i18n
