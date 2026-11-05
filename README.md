# Oscars fullstack-starter

En enkel boilerplate för fullstackprojekt med React, TypeScript, Vite, Node.js och Express.

Använder npm workspaces för att hantera frontend, backend och delad kod i ett gemensamt repository.

## Teknikstack

- **Frontend:** React, TypeScript, Vite, Axios, CSS Modules
- **Backend:** Node.js, Express, TypeScript
- **Shared:** Gemensamma typer, konstanter och valideringsscheman
- **Verktyg:** npm workspaces, ESLint, Prettier, concurrently

## Projektstruktur

```text
├── frontend/   # React-applikation
├── backend/    # Express API
├── shared/     # Delad kod och typer
└── docs/       # Dokumentation
```

## Kom igång

```bash
npm install
npm run dev
```

Frontend körs på `http://localhost:5173` och backend på `http://localhost:3000`.

Under utveckling vidarebefordrar Vite anrop till `/api` via en proxy till backend.

## Bygg

```bash
npm run build
```

## Användning

Skapa ett nytt repository utifrån denna mall, uppdatera projektnamnet och börja utveckla.
