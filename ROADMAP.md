# CosmicCase — path to production

Work in phased batches; tick items off as you complete them.

## Phase A — stability blockers

| #   | Task                                              | Status | Files / notes                                                   |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------- |
| A1  | Consolidate `next.config` (images + reactCompiler) | ☑    | `frontend/next.config.ts` (removed `next.config.mjs`)           |
| A2  | Standardize async `searchParams` on configure page | ☑     | `frontend/src/app/configure/upload/page.tsx`                    |
| A3  | Order load error UX (Error boundary / UI)         | ☑      | `frontend/src/app/order/error.tsx`                              |
| A4  | Remove noisy debug logging from NASA client       | ☑      | `logger.debug` in `backend/app/infrastructure/nasa/client.py`    |
| A5  | Strict `shippingOption` validation on API         | ☑      | `Literal["standard","express"]` in `backend/app/api/v1/orders.py` |

## Phase B — trust & conversion

| #   | Task                                                   | Status | Files / notes                                        |
| --- | ------------------------------------------------------ | ------ | ---------------------------------------------------- |
| B1  | Polling / “Confirming payment” on success               | ☑      | `OrderSuccessContent.tsx`, `page.tsx`                |
| B2  | Errors and retry on landing (Try Now)                 | ☑      | `TryNowSection.tsx`                                  |
| B3  | Open Graph + `metadataBase`                             | ☑      | `layout.tsx` — set `NEXT_PUBLIC_SITE_URL` in prod    |
| B4  | APOD: `remotePatterns` or `<img>` for non-nasa.gov URLs | ☑    | `next.config.ts` + native `<img>` in modal           |

## Phase C — observability & tests

| #   | Task                         | Status | Files / notes                                                                         |
| --- | ---------------------------- | ------ | ------------------------------------------------------------------------------------- |
| C1  | Sentry (frontend + backend)   | ☑      | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`; optional `SENTRY_AUTH_TOKEN` for source maps |
| C2  | Playwright critical path      | ☑      | `npm run test:e2e` (build + e2e), port **3001**                                       |
| C3  | Pytest: health + APOD mock    | ☑      | `cd backend && uv run pytest`                                                         |

## Phase D — polish

| #   | Task                               | Status | Files / notes                                                                               |
| --- | ---------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| D1  | Responsive / micro-interactions    | —      | Manual (layout not tracked as code-only work)                                               |
| D2  | Protect `GET /orders/{id}`         | ☑      | Secret `token` on success URL + SHA-256 in DB; `fetchOrder(id, token)`                     |
| D3  | PostgreSQL, CORS, env              | ☑      | `DATABASE_URL` (any SQLAlchemy URL), comma-separated `CORS_ALLOW_ORIGINS`; checklist below   |

### Pre-launch (env)

- **Frontend (Vercel):** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, optional `NEXT_PUBLIC_SENTRY_DSN`.
- **Backend:** `FRONTEND_BASE_URL`, `DATABASE_URL` (e.g. PostgreSQL), `CORS_ALLOW_ORIGINS=https://your-domain.com`, `STRIPE_*`, `NASA_API_KEY`, optional `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` in CI for source maps.

---

**Current focus:** ship and iterate on UI polish.
