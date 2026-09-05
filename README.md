# elsewhere — World clock & time converter

A world clock and time-zone converter built from Figma designs, using React, TypeScript, Tailwind CSS v4, and Vite. Everything runs client-side: no backend, no API keys.

## Features

- **World clock** — your local time (auto-detected, with real sunrise/sunset), plus a saved list of cities in grid or list view.
- **Time converter** — compare any two cities, override either one's time to explore a scenario, and browse a 24-hour conversion matrix with sleeping/waking/business-hours/evening categorization and call-suitability hints.
- 12H/24H format toggle, dark mode, and your saved cities/preferences persist in `localStorage`.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build   # type-check + production build
```
