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
- [ ] Live exchange rates.
- [ ] Break-even calculations and comparisons.
- [ ] La Marzocco API integration.
- [ ] Historical brewing data.
- [ ] Optional account and database synchronization.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Recharts
- **Localization:** i18next
- **Backend:** Node.js, Express (in development)
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
npm run dev -w frontend
```

### Tests and build

```bash
npm test
npm run lint -w frontend
npm run build -w frontend
```

## Data and limitations

User data is stored in the browser using `localStorage`. It can be reset in Settings but is not synced between devices or backed up.

Currency conversion currently uses mock exchange rates. Historical charts and forecasts are calculated estimates, not recorded brewing history.

## License

Brew-even is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

You may use, modify, and distribute the source code for noncommercial purposes. Commercial use requires separate permission from the copyright holder.
