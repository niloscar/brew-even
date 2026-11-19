# Brew-even ☕

A home espresso cost calculator for tracking equipment investments, brewing costs, and how the average cost per cup changes over time.

**Status:** Under active development.

**Live preview:** [breweven.app](https://breweven.app)

## Features

- [x] Calculate total investment and average cost per cup.
- [x] Track coffee bean and water costs based on brew settings.
- [x] Add, edit, and remove equipment with purchase prices, currencies, and dates.
- [x] Visualize estimated historical costs and future projections.
- [x] Save settings and equipment locally in the browser.
- [x] Switch between four languages and four currencies, with light and dark themes.
- [x] Live exchange rates.
- [x] Support development through voluntary contributions using Stripe Checkout.
- [ ] Break-even calculations and comparisons.
- [ ] La Marzocco API integration.
- [ ] Historical brewing data.
- [ ] Optional account and database synchronization.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Recharts
- **Localization:** i18next
- **Backend:** Node.js, Express, Zod
- **Payments:** Stripe Checkout
- **Deployment:** Vercel
- **Architecture:** npm workspaces (`frontend`, `backend`, `shared`)

## Development

Brew-even is developed iteratively using feature branches and pull requests. Core calculations and data persistence are covered by automated tests.

The repository's commit history and pull requests document the development process, technical decisions, and changes made along the way.

## Getting started

```bash
git clone https://github.com/niloscar/brew-even.git
cd brew-even
npm install
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
npm run dev
```

Configure the environment variables:

**Frontend (`frontend/.env`)**
- `SITE_URL` – Frontend URL, typically `http://localhost:5173`.
- `API_URL` – Backend URL, typically `http://localhost:3000`.

**Backend (`backend/.env`)**
- `SITE_URL` – Frontend URL used for Stripe redirects.
- `STRIPE_SECRET_KEY` – Secret API key from Stripe.

Stripe Checkout requires a valid Stripe API key. Other app features can run without Stripe configuration.

### Tests and build

```bash
npm test
npm run lint -w frontend
npm run build
```

## Data and limitations

User data is stored in the browser using `localStorage`. It can be reset in Settings but is not synced between devices or backed up.

Exchange rates are retrieved from the Frankfurter API through the Express backend, using SEK as the base currency. Responses are cached through Vercel's CDN to reduce external API requests. If the service is unavailable, the app uses approximate fallback rates and informs the user.

Historical charts and forecasts are calculated estimates, not recorded brewing history.

Voluntary contributions are processed through Stripe Checkout. Brew-even does not store payment card details.

## License

Brew-even is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

You may use, modify, and distribute the source code for noncommercial purposes. Commercial use requires separate permission from the copyright holder.