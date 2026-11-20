
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { LANGUAGES } from './src/i18n/languages.ts'

import type { Plugin } from 'vite'

const SEO_PLACEHOLDER = '<meta name="brew-even-seo" content="placeholder" />'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function localizedHtml(baseUrl: string): Plugin {
  const BASE_URL = baseUrl.replace(/\/$/, '')
  let outDir: string

  return {
    name: 'localized-html',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    async writeBundle() {
      if (!BASE_URL) throw new Error('SITE_URL is missing')

      const indexPath = resolve(outDir, 'index.html')
      const html = await readFile(indexPath, 'utf8')

      if (!html.includes(SEO_PLACEHOLDER)) {
        throw new Error('SEO placeholder not found in index.html')
      }

      const alternateLinks = Object.entries(LANGUAGES).map(([path, { locale }]) =>
        `<link rel="alternate" hreflang="${locale.split('-')[0]}" href="${BASE_URL}${path}" />`
      )

      alternateLinks.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`)

      for (const [path, { locale, translation }] of Object.entries(LANGUAGES)) {
        const title = escapeHtml(translation.meta.title)
        const description = escapeHtml(translation.meta.description)
        const url = `${BASE_URL}${path}`

        const metadata = [
          `<meta name="description" content="${description}" />`,
          `<link rel="canonical" href="${url}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="Brew-even" />`,
          `<meta property="og:title" content="${title}" />`,
          `<meta property="og:description" content="${description}" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta property="og:locale" content="${locale.replace('-', '_')}" />`,
          `<meta property="og:image" content="${BASE_URL}/og-image_light.png" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:type" content="image/png" />`,
          `<meta property="og:image:alt" content="Brew-even | Home Espresso Cost Calculator" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:image" content="${BASE_URL}/og-image_light.png" />`,
          ...alternateLinks
        ].join('\n    ')

        const localized = html
          .replace(/<html lang="[^"]+">/, `<html lang="${locale}">`)
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(SEO_PLACEHOLDER, metadata)

        const outputPath = resolve(outDir, path.slice(1), 'index.html')

        await mkdir(dirname(outputPath), { recursive: true })
        await writeFile(outputPath, localized)
      }

      const rootTitle = escapeHtml(LANGUAGES['/en'].translation.meta.title)
      const rootDescription = escapeHtml(LANGUAGES['/en'].translation.meta.description)

      const rootMetadata = [
        `<meta name="description" content="${rootDescription}" />`,
        `<link rel="canonical" href="${BASE_URL}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="Brew-even" />`,
        `<meta property="og:title" content="${rootTitle}" />`,
        `<meta property="og:description" content="${rootDescription}" />`,
        `<meta property="og:url" content="${BASE_URL}/" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta property="og:image" content="${BASE_URL}/og-image_light.png" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:type" content="image/png" />`,
        `<meta property="og:image:alt" content="Brew-even | Home Espresso Cost Calculator" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:image" content="${BASE_URL}/og-image_light.png" />`,
        ...alternateLinks
      ].join('\n    ')

      const languageLinks = Object.entries(LANGUAGES)
        .map(([path, { label }]) => `<a href="${path}">${escapeHtml(label)}</a>`)
        .join(' · ')

      const rootHtml = html
        .replace(SEO_PLACEHOLDER, rootMetadata)
        .replace(
          '<div id="root"></div>',
          `<div id="root"><noscript><main><h1>Brew-even</h1><p>Choose your language:</p><nav aria-label="Languages">${languageLinks}</nav></main></noscript></div>`
        )

      await writeFile(indexPath, rootHtml)
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), localizedHtml(env.SITE_URL ?? '')],
    server: {
      proxy: {
        '/api': {
          target: env.API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    }
  }
})
