# World Cup Path

Your complete 2026 World Cup companion. Follow your national team, track group standings, explore qualification scenarios, predict knockout rivals, and visualize your team's path to the Final.

## Features

- **Team Selection** - Choose your country from all 32 World Cup teams
- **Dashboard** - Team overview with key stats, next match, and last result
- **Matches** - All matches filtered by played/upcoming, grouped by date
- **Standings** - Full group tables with position highlighting
- **Possible Rivals** - Knockout opponents depending on group finish
- **Predictions** - Probability engine for qualification and winner chances
- **Tournament Fixture** - Full match schedule with stage and team filters
- **Team Comparison** - Side-by-side stats comparison with any other team
- **PWA Ready** - Installable, works offline, mobile-first design

## Screenshots

*Screenshots to be added*

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| State | Zustand (persisted) |
| Data | React Query |
| Charts | Recharts |
| Icons | Lucide React |
| Validation | Zod |
| HTTP | Axios |
| Caching | Node Cache |
| PWA | Service Worker + Manifest |

## Architecture

```
/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # React Query hooks
│   │   ├── lib/          # Utilities (api, engines)
│   │   ├── config/       # Tournament configuration
│   │   ├── store/        # Zustand state
│   │   └── types/        # TypeScript types
│   └── public/           # PWA assets
├── server/          # Express API
│   └── src/
│       ├── routes/       # API endpoints
│       ├── services/     # Cache, prediction, bracket
│       └── types/        # TypeScript types
└── package.json     # Root orchestration
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone <repo-url>
cd world-cup-path
npm run setup
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` and add your football-data.org API key:

```
FOOTBALL_DATA_API_KEY=your_api_key_here
```

Get a free API key at https://www.football-data.org/client/register

### 3. Run in development

```bash
npm run dev
```

This starts both:
- Server at `http://localhost:3001`
- Client at `http://localhost:5173`

### 4. Production build

```bash
npm run build
npm start
```

The server serves the built React app on `http://localhost:3001`.

## Render Deployment

### One-click deploy

1. Push your repository to GitHub
2. Create a new **Web Service** on Render
3. Connect your repository
4. Use these settings:

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Environment | `Node` |

5. Add environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
FOOTBALL_DATA_API_KEY=<your-key>
```

### render.yaml (optional)

A `render.yaml` file is included for Infrastructure-as-Code deployment.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FOOTBALL_DATA_API_KEY` | Yes | football-data.org API key |
| `NODE_ENV` | No | Set to `production` for deployment |
| `PORT` | No | Server port (default: 3001) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/worldcup/summary` | Full tournament data |
| GET | `/api/worldcup/teams` | All teams |
| GET | `/api/worldcup/team/:id` | Team details + predictions |
| GET | `/api/worldcup/matches` | Matches with filters |
| GET | `/api/worldcup/standings` | Group standings |
| GET | `/api/worldcup/predictions` | All team predictions |

## Prediction Model

The prediction engine uses a transparent scoring model:

- **Base rating**: 50 points
- **Points**: +3 per point
- **Goal difference**: +1.5 per unit
- **Goals scored**: +0.8 per goal
- **Recent form**: +2 per win, +1 per draw
- **Wins**: +5 per win, **Losses**: -4 per loss

Probabilities are normalized so all teams sum to 100%. Estimates are based solely on current tournament data and are not official odds.

## License

MIT
