# MAXRET FUNDS 🚀
**Intelligent and Transparent Portfolio Recommendation System for Retail Investors**

---

## Deploy to Render

This project includes a Render Blueprint for deploying the React app and API as
a single web service. The backend serves the production frontend build, so the
app and API share one origin.

1. Push the contents of this project folder to a GitHub repository.
2. In Render, choose **New +** → **Blueprint** and connect that repository.
3. Review the `maxret-funds` service and choose **Apply**.
4. After the deploy finishes, open the service URL and verify `/api/health`.

The current authentication store is in memory and is intended for demos; user
accounts are lost when the service restarts or redeploys. Do not use it for
real user accounts without replacing it with persistent storage and production
authentication.

---

## Project Structure

```
maxret-funds/
├── backend/
│   ├── server.js          # Express API server
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js                    # Root component + routing
    │   ├── index.js                  # React entry point
    │   ├── styles/
    │   │   └── globals.css           # Design system + animations
    │   ├── components/
    │   │   ├── Navbar.js             # Sticky navigation
    │   │   ├── InvestmentForm.js     # 3-step investor onboarding form
    │   │   ├── FundCard.js           # Fund display card with scoring
    │   │   ├── ScoreRing.js          # Animated SVG score ring
    │   │   ├── NAVChart.js           # 1-year NAV area chart
    │   │   ├── ProjectionChart.js    # SIP growth projection chart
    │   │   └── SectorChart.js        # Sector allocation donut chart
    │   ├── pages/
    │   │   ├── HomePage.js           # Landing page
    │   │   ├── AnalyzePage.js        # Analysis form page
    │   │   ├── DashboardPage.js      # Results + insights dashboard
    │   │   └── ExplorePage.js        # Browse all funds table
    │   └── utils/
    │       ├── api.js                # Axios API client
    │       └── formatters.js         # Number/color utilities
    └── package.json
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm start
# API running at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
# App running at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze investor profile and return top fund recommendations |
| GET | `/api/funds` | Get all funds (supports `?category=` and `?risk=` filters) |
| GET | `/api/fund/:id` | Get single fund details |
| GET | `/api/fund/:id/nav-history` | Get 1-year NAV history (simulated) |

### POST /api/analyze — Request Body
```json
{
  "age": 28,
  "monthlyIncome": 75000,
  "incomeSource": "salaried",
  "monthlySIP": 15000,
  "lumpsum": 0,
  "existingPortfolio": 0,
  "investmentGoal": "Wealth Creation",
  "investmentHorizon": 10,
  "riskTolerance": "Moderate"
}
```

---

## Scoring Algorithm

Each fund is scored (0–100) against the investor profile across 5 dimensions:

1. **Risk Alignment** (30 pts) — Risk level match between fund and investor
2. **Horizon Fit** (20 pts) — Fund category suitability for investment duration
3. **Return Performance** (25 pts) — 3-year CAGR quality
4. **Sharpe Ratio** (15 pts) — Risk-adjusted return efficiency
5. **Expense Ratio** (10 pts) — Lower cost = higher effective returns
6. **Goal Alignment** (bonus) — Goal-specific matching bonuses

---

## Features

- 🎯 **Multi-step investor onboarding** with real-time validation
- 📊 **AI scoring engine** matching 6 financial dimensions
- 📈 **Interactive charts**: NAV history, SIP projection, sector allocation
- 🏆 **Top 3 fund recommendations** with transparent match explanations
- 💡 **Smart suggestions** for SIP optimization, rebalancing, and compounding
- 🔍 **Fund explorer** with filter + sort capabilities
- ⚡ **Animated UI** with dark theme, micro-interactions

---

## Tech Stack

**Backend**: Node.js, Express, Axios, express-rate-limit

**Frontend**: React 18, Recharts, Framer Motion, CSS Variables

---

## Production Roadmap

To make this production-ready, replace the mock data layer in `server.js` with:
- **AMFI API** for real NAV data
- **MorningStar / Value Research API** for portfolio holdings
- **NSE/BSE APIs** for live market data
- **MongoDB/PostgreSQL** for user profiles and historical analysis
- **JWT authentication** for secure user sessions
- **Redis** for caching frequently-accessed fund data