# Quant Compass

# Lovable Prompt 1 — Quant Research SaaS Foundation

Build a professional, production-oriented financial research SaaS frontend for Indian equity markets.

**Product:** Quant Intelligence — an AI-powered quantitative equity research platform for Indian retail traders and professional researchers.

**Design direction**
- Premium institutional research terminal, not a retail trading clone.
- Dark navy/charcoal default theme, restrained accent colors, excellent typography and high information density.
- Clean spacing, clear visual hierarchy and responsive layouts.
- Use realistic but clearly identified mock data until APIs are connected.
- Never imply that mock values are live market prices.

**Technology**
- React, TypeScript and the existing Lovable project conventions.
- Reusable components and strict TypeScript interfaces.
- Use a consistent charting library and a consistent table component.
- Centralize API access in a typed API client.
- Keep mock data behind a replaceable data-provider interface.
- Do not place secrets or provider API keys in frontend code.

**Application shell**
Create a collapsible left sidebar, top navigation, global stock search, market-status area, user menu and theme control.

**Pages**
1. Market Overview
2. Equity Screener
3. Stock Research
4. Factor Rankings
5. Factor Research Lab
6. Watchlists
7. AI Research Copilot
8. Research Reports
9. Settings

**Reusable components**
- Stock table with sorting, pagination and filters
- Price chart
- Factor-score breakdown
- Sector performance table
- Market summary cards
- Watchlist table
- Research report layout
- Data timestamp and data-quality indicator
- Loading skeletons, empty states and error states

**Architecture constraints**
- Define typed models for instruments, daily prices, factor scores and API errors.
- Create a centralized API client with a configurable backend base URL.
- Use a separate mock adapter so each page can switch to real APIs without redesign.
- Keep quantitative calculations out of the frontend.
- Never hardcode real-time prices or claim mock results are actual research.
- Do not build every page as one large component.

First implement the design system, navigation, application shell and reusable components. Then create the page layouts using clearly labelled mock data. Ensure every navigation item works and the app is responsive.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/77330378-002c-4deb-a531-994d83bb8545).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
