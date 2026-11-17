
# Brew-even ☕

A home espresso cost calculator for tracking equipment investments, consumables, cost per cup, and the journey towards break-even.

**Live preview:** [brew-even.vercel.app](https://brew-even.vercel.app)

## Features

- Calculate total investment and average cost per cup.
- Track coffee bean and water costs based on brew settings.
- Add, edit, and remove equipment with purchase prices, currencies, and dates.
- Visualize estimated historical costs and future projections.
- Save settings and equipment locally in the browser.
- Switch between four languages, currencies, and light/dark themes.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Recharts
- **Localization:** i18next
- **Backend:** Node.js, Express (in development)
- **Deployment:** Vercel
- **Architecture:** npm workspaces (`frontend`, `backend`, `shared`)

## Getting started

```bash
git clone https://github.com/niloscar/brew-even.git
cd brew-even
npm install
cp frontend/.env.example frontend/.env
npm run dev -w frontend
```

### Tests and build

```bash
node --experimental-strip-types --test frontend/src/lib/*.test.ts
npm run lint -w frontend
npm run build -w frontend
```

## Data and limitations

User data is stored in the browser using `localStorage`. It can be reset in Settings but is not synced between devices or backed up.

Currency conversion currently uses mock exchange rates. Historical charts and forecasts are calculated estimates, not recorded brewing history.

## Roadmap

- [x] Local data persistence
- [ ] Live exchange rates
- [ ] Break-even calculations and comparisons
- [ ] La Marzocco API integration
- [ ] Historical brewing data
- [ ] Optional account and database synchronization

## Status

**Under active development.**
