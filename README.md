# CosmicCase — internal reference

---

## Project Vision

**CosmicCase** is an MVP e-commerce flow for device custom cases: landing and configure flow on **Next.js**, payment via **Stripe Checkout**, orders and related context (including NASA APOD as part of the offer) through **FastAPI**, with persistence on **PostgreSQL**. The goal is end-to-end journey from interest to paid order, with observable behavior and strict configuration via environment variables.

---

## Architecture Map

### Backend (`backend/app/` → composition root [`main.py`](backend/app/main.py))

Layers follow **ports & adapters (hexagonal)** — domain rules stay isolated from HTTP and external SDKs.

| Layer | Path | Role |
|------|------|------|
| **Domain** | `app/domain/` | Entities, domain contracts (**ports**), and errors (`orders`, `apod`). No FastAPI or database dependencies. |
| **Application** | `app/application/` | Use-case orchestration: order services, APOD integration, repositories and providers called through interfaces. |
| **Infrastructure** | `app/infrastructure/` | Implementations: SQLAlchemy models and repositories (`db`), **Stripe**, **NASA APOD HTTP client**, **Resend** for transactional email, order visibility crypto (`security/order_view_token`). |
| **API** | `app/api/v1/` | Thin HTTP surface: `apod` and `orders` routers under the **`/v1`** prefix. |

**Application lifecycle (`main.py`):** CORS (production: explicit origins + optional preview regex; local: LAN regex fallback), optional **Sentry**, `/` and **`/health`**, mount `api_router`, **startup** runs `init_db()` (automatic schema bootstrap for MVP).

### Frontend ([`frontend/package.json`](frontend/package.json))

| Concern | Practice in this project |
|---------|---------------------------|
| **Framework** | **Next.js 16** / **React 19** (`next dev`, `next build`). |
| **UI** | **Tailwind CSS v4**, Radix primitives, react-aria where useful, **Framer Motion**, **Lucide**. |
| **Forms & validation** | **react-hook-form** + **Zod** + `@hookform/resolvers`. |
| **Observability** | **@sentry/nextjs**, wrapped in `next.config.ts` via `withSentryConfig`. |
| **Quality** | **Vitest**, **Playwright** (e2e after production build via `test:e2e`), ESLint / Prettier + `prettier-plugin-tailwindcss`. |

The browser calls the API using **`NEXT_PUBLIC_API_URL`**; routing and page composition live under `src/app/`; configure, checkout, and landing behavior sit in components and hooks under `src/components/` and `src/hooks/`.

---

## Infrastructure & DevOps

### Platform map

| Component | Role |
|-----------|------|
| **Vercel** | **Next.js** hosting: build via `npm run build` ([`frontend/vercel.json`](frontend/vercel.json)). Preview hosts are accounted for in CORS with backend `CORS_ALLOW_ORIGIN_REGEX` (e.g. `*.vercel.app`). |
| **Render** | Typical **FastAPI** target: web service (`uvicorn`), env vars as in [`backend/.env.example`](backend/.env.example); point the health check to **`GET /health`**. Logs: service stdout/stderr in Render’s dashboard plus optional alerting. |
| **Supabase** | **PostgreSQL as managed DB**: **`DATABASE_URL`** as an async SQLAlchemy URL e.g. `postgresql+asyncpg://...` (see `.env.example`). This repo does not ship Supabase Auth / Realtime / client SDK usage — persistence only via a Postgres connection string. |

### Deploy flow (high level)

1. **Frontend:** push → Vercel build → production or preview URLs; set **`NEXT_PUBLIC_API_URL`**, **`NEXT_PUBLIC_SITE_URL`**, optional Sentry (`frontend/.env.example`).
2. **Backend:** image or native build on Render with **`FRONTEND_BASE_URL`**, **`DATABASE_URL`**, **`CORS_ALLOW_ORIGINS`** (or preview regex), **Stripe**, **NASA**, optional **Resend** and **Sentry** (`backend/.env.example`).
3. **Stripe:** webhook URL on the backend, secret **`STRIPE_WEBHOOK_SECRET`** on Render.

### Where logs and errors live

- **Render:** service log stream (uvicorn, stack traces).
- **Vercel:** Build Logs / Functions / Runtime logs.
- **Cross-stack errors:** **Sentry** (DSN on frontend and backend as needed; backend [`main.py`](backend/app/main.py) sets trace sampling `0.1`, `send_default_pii=False`).

---

## Key Features

- **Stripe** — Checkout sessions, standard/express price IDs via env, webhook handling; success/cancel URLs rooted in **`FRONTEND_BASE_URL`**.
- **NASA APOD** — domain port + infrastructure HTTP client; API **`/v1/apod`**; **`NASA_API_KEY`** (`DEMO_KEY` is heavily rate-limited).
- **Order “auth” (capability-style)** — not classic login: a **view token** is issued alongside **SHA-256 stored in the DB**; **`GET /orders/{id}`** requires a valid token (see [`order_view_token.py`](backend/app/infrastructure/security/order_view_token.py)).
- **Email** — optional **Resend** on paid orders (`RESEND_API_KEY`).
- **Tests** — pytest (health, NASA mock, order/security/email behavior), frontend Vitest, Playwright critical path (details in [`ROADMAP.md`](ROADMAP.md)).

---

## Private Roadmap

For task-level status and file anchors, see [`ROADMAP.md`](ROADMAP.md) (phases A–D).

| Phase | Focus |
|------|--------|
| **A** | Stability blockers: Next config, APOD plumbing, order error UX, strict API validation. *(Mostly complete.)* |
| **B** | Trust and conversion: payment confirmation on success, Try Now resilience, OG/metadata, APOD media. *(Mostly complete.)* |
| **C** | Observability and tests: Sentry, Playwright, pytest behavior contracts. *(Mostly complete.)* |
| **D** | Polish: manual responsive pass, secured order viewing, PostgreSQL + CORS + env checklist. |

**Current focus:** release and manual UI polish (phase D1).

---

## Local quick reference

```bash
# Backend (from backend/, using uv — see pyproject.toml)
uv run uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

Never commit secrets or production URLs in git; see **`backend/.env.example`** and **`frontend/.env.example`** for variable names.
