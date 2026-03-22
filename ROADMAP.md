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
| B1 | Polling / «Подтверждаем оплату» на success | ☐ | `frontend/src/app/order/success/` |
| B2 | Ошибки и retry на лендинге (Try Now) | ☐ | `frontend/src/components/landing/TryNowSection.tsx` |
| B3 | Open Graph + `metadataBase` | ☐ | `frontend/src/app/layout.tsx` |
| B4 | APOD: `remotePatterns` или `<img>` для не-nasa.gov URL | ☐ | `next.config`, модалка |

## Фаза C — наблюдаемость и тесты

| # | Задача | Статус | Файлы / заметки |
|---|--------|--------|-----------------|
| C1 | Sentry (frontend + backend) | ☐ | |
| C2 | Playwright: критический путь | ☐ | `frontend/e2e/` |
| C3 | Pytest: health + APOD mock | ☐ | `backend/tests/` |

## Фаза D — полировка

| # | Задача | Статус | Файлы / заметки |
|---|--------|--------|-----------------|
| D1 | Адаптив / микровзаимодействия | ☐ | Scanner, configure |
| D2 | Защита `GET /orders/{id}` (токен / маскирование) | ☐ | `backend/`, success URL |
| D3 | Production DB (PostgreSQL), CORS, env checklist | ☐ | деплой-док |

---

**Текущий фокус:** Фаза A.
