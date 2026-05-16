# 🍡 Dango Grid Bot Platform

Automated grid trading bot for [Dango Exchange](https://dango.exchange) — farm volume, earn DNG airdrop points, and manage your DeFi strategy from a multi-user dashboard.

Built by [Abu Olumi](https://x.com/olumi441)

---

## Stack

- **Next.js 14** (App Router)
- **@left-curve/sdk** — Official Dango TypeScript SDK
- **Supabase** — Auth + PostgreSQL database
- **Recharts** — Grid chart and PnL visualisations
- **Tailwind CSS** — Design system
- **Fonts:** Barlow Condensed + JetBrains Mono

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
dango-grid-platform/
├── app/                     # Next.js App Router pages + API routes
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Bot dashboard (per user)
│   └── api/                 # Bot start/stop/status endpoints
├── components/
│   ├── auth/                # WalletConnect + KeyImport
│   ├── dashboard/           # GridChart, PnLTracker, OrderBook, etc.
│   └── shared/              # Navbar, Footer
├── lib/
│   ├── bot/                 # Bot engine, grid calculator, safety guard
│   ├── dango/               # SDK client factory
│   └── db/                  # Supabase schema + queries
└── ...
```

---

## Pushing to GitHub

```bash
git init
git remote add origin https://github.com/2TheMoom/dango-grid-bot.git
git add .
git commit -m "feat: initial scaffold — landing page + dashboard UI"
git branch -M main
git push -u origin main
```

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Background | `#E9E6DF` | Page background |
| Card | `#F0EDE7` | Panels and cards |
| Navy | `#1F3A8F` | Primary accent |
| Charcoal | `#161719` | Body text |
| Green | `#1A6B3C` | Profit / running stats |
| Crimson | `#B01C2E` | Alerts / loss |

---

## Roadmap

- [x] Landing page + dashboard UI
- [x] Wallet connect + encrypted key import
- [x] Grid chart visualisation
- [x] Strategy editor per user
- [ ] Bot engine (grid calculator + order loop)
- [ ] Supabase auth + per-user DB
- [ ] API routes (start/stop/status)
- [ ] SSE live updates
- [ ] Admin panel (platform health)
- [ ] Rate limit queue

---

*This is non-custodial software. You are solely responsible for your funds.*
