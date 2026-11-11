
# Brew-even ☕

A home espresso cost calculator for tracking equipment investments, consumables, cost per cup, and the journey towards break-even.

Brew-even helps home baristas understand the true cost of their espresso setup and, eventually, compare home brewing with alternative coffee habits.

**Live preview:** [brew-even.vercel.app](https://brew-even.vercel.app)

## Features

### Cost tracking
- Calculate total investment and average cost per cup.
- See how brewing another cup affects the average cost.
- Track coffee bean and water costs based on brew settings.
- Add, edit, and remove equipment, including purchase prices, currencies, and acquisition dates.
- Update calculations instantly when values change.

### Cost visualization
- Interactive cost-per-cup chart built with Recharts.
- Selectable historical periods and projected future costs.
- Custom tooltips with localized values.
- Forecasts based on estimated brewing frequency and current costs.

The chart displays a calculated cost curve rather than recorded historical transactions. Forecasts assume a consistent brewing rate and unchanged costs.

### Interface
- Responsive dashboard with light and dark themes.
- Support for English, Swedish, German, and French.
- Currency selection: SEK, USD, EUR, and GBP.
- Locale-aware number and currency formatting.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Charts:** Recharts
- **Localization:** i18next, react-i18next
- **Backend:** Node.js, Express (in development)
- **Code quality:** Oxlint, Prettier
- **Deployment:** Vercel
- **Architecture:** npm workspaces with `frontend`, `backend`, and `shared` packages

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/niloscar/brew-even.git
cd brew-even
npm install
```

Create a frontend environment file:

```bash
cp frontend/.env.example frontend/.env
```

Start the frontend development server:

```bash
npm run dev -w frontend
```

To run the production build and linter:

```bash
npm run build -w frontend
npm run lint -w frontend
```

## Current limitations

Brew-even is still in early development.

- Data is currently initialized from mock values and stored in React state. Changes are not persisted between sessions.
- Currency conversion uses mock exchange rates.
- The historical chart is model-based, not a record of actual brewing activity.
- Coffee machine integrations are not yet functional.
- The backend is not yet connected to the dashboard.

## Roadmap

- [ ] Persist equipment, brew settings, and coffee consumption data.
- [ ] Integrate live exchange rates.
- [ ] Calculate and visualize break-even points.
- [ ] Compare home espresso costs with alternative coffee habits.
- [ ] Integrate with the La Marzocco API to retrieve brewed cup counts automatically.
- [ ] Expand historical tracking and forecasting using recorded data.

## Status

**Under active development.**

Core cost calculations, editable equipment management, multilingual support, and interactive cost visualization are implemented.

The next priorities are data persistence, improved cost tracking, and break-even calculations.
