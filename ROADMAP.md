# SpaceCase — roadmap к production

Работаем по фазам; отмечайте чекбоксы по мере выполнения.

## Фаза A — блокеры и стабильность

| # | Задача | Статус | Файлы / заметки |
|---|--------|--------|-----------------|
| A1 | Объединить `next.config` (images + reactCompiler) | ☑ | `frontend/next.config.ts` (удалён `next.config.mjs`) |
| A2 | Унифицировать `searchParams` (async) на странице configure | ☑ | `frontend/src/app/configure/upload/page.tsx` |
| A3 | Обработка ошибок загрузки заказа (Error UI) | ☑ | `frontend/src/app/order/error.tsx` |
| A4 | Убрать отладочный вывод из NASA-клиента | ☑ | `logger.debug` в `backend/app/infrastructure/nasa/client.py` |
| A5 | Строгая валидация `shippingOption` на API | ☑ | `Literal["standard","express"]` в `backend/app/api/v1/orders.py` |

## Фаза B — доверие и конверсия

| # | Задача | Статус | Файлы / заметки |
|---|--------|--------|-----------------|
| B1 | Polling / «Подтверждаем оплату» на success | ☑ | `OrderSuccessContent.tsx`, `page.tsx` |
| B2 | Ошибки и retry на лендинге (Try Now) | ☑ | `TryNowSection.tsx` |
| B3 | Open Graph + `metadataBase` | ☑ | `layout.tsx` — задайте `NEXT_PUBLIC_SITE_URL` в проде |
| B4 | APOD: `remotePatterns` или `<img>` для не-nasa.gov URL | ☑ | `next.config.ts` + нативный `<img>` в модалке |

## Фаза C — наблюдаемость и тесты

| # | Задача | Статус | Файлы / заметки |
|---|--------|--------|-----------------|
| C1 | Sentry (frontend + backend) | ☑ | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`; опционально `SENTRY_AUTH_TOKEN` для source maps |
| C2 | Playwright: критический путь | ☑ | `npm run test:e2e` (build + e2e), порт **3001** |
| C3 | Pytest: health + APOD mock | ☑ | `cd backend && uv run pytest` |

## Фаза D — полировка

| # | Задача | Статус | Файлы / заметки |
|---|--------|--------|-----------------|
| D1 | Адаптив / микровзаимодействия | ☐ | Scanner, configure |
| D2 | Защита `GET /orders/{id}` (токен / маскирование) | ☐ | `backend/`, success URL |
| D3 | Production DB (PostgreSQL), CORS, env checklist | ☐ | деплой-док |

---

**Текущий фокус:** Фаза D.
