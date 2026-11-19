import de from '../locales/de.json' with { type: 'json' }
import en from '../locales/en.json' with { type: 'json' }
import fr from '../locales/fr.json' with { type: 'json' }
import sv from '../locales/sv.json' with { type: 'json' }

export const LANGUAGES = {
  '/de': { locale: 'de-DE', label: 'Deutsch', translation: de },
  '/': { locale: 'en-US', label: 'English', translation: en },
  '/fr': { locale: 'fr-FR', label: 'Français', translation: fr },
  '/sv': { locale: 'sv-SE', label: 'Svenska', translation: sv }
} as const