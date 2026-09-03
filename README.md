# Harbor (Харбор)

Платформа для поиска и бронирования жилья для путешествий – SPA на React с Express API и PostgreSQL.

README ориентирован на **Senior Frontend**: здесь архитектура, ключевые решения и то, как устроены основные потоки.

---

## Содержание

- [Обзор](#обзор)
- [Стек](#стек)
- [Архитектура](#архитектура)
- [Структура проекта](#структура-проекта)
- [Ключевые фичи](#ключевые-фичи)
- [State management](#state-management)
- [Работа с данными](#работа-с-данными)
- [Роутинг и layouts](#роутинг-и-layouts)
- [Стилизация](#стилизация)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [Сборка и деплой](#сборка-и-деплой)
- [Скрипты](#скрипты)

---

## Обзор

Harbor – полнофункциональный frontend pet-project уровня production MVP:

| Область | Реализация |
|---------|------------|
| Каталог | ~26 объектов в статическом `src/db.json`, изображения WebP с retina |
| Поиск | Виджет + URL sync + фильтры + мобильный step-flow |
| Бронирование | 4-шаговый checkout с валидацией дат и конфликтов |
| Пользователь | JWT auth, профиль с табами, поездки, избранное |
| i18n | ru (default) / en – UI + overlay локализации объектов |
| Backend | Express + PostgreSQL для auth, favorites, bookings, host applications |

**Гибридная модель данных:** каталог объектов живёт в JSON и бандлится на сборке; пользовательские данные – через REST API.

---

## Стек

### Frontend

| | |
|---|---|
| **React** 19 + **TypeScript** 6 | Strict mode, `verbatimModuleSyntax` |
| **Vite** 8 | HMR, proxy `/api` → backend |
| **React Router** 7 | Nested layouts через `<Outlet />` |
| **SCSS Modules** | Design tokens + responsive mixins |
| **date-fns** 4 | Календари, диапазоны дат |
| **lucide-react** + **vite-plugin-svgr** | Иконки и inline SVG |

> `axios` и `json-server` есть в `package.json`, но в коде не используются – все запросы через native `fetch`.

### Backend (monorepo внутри `src/harbor-backend/`)

| | |
|---|---|
| **Express** 5 + **pg** | Raw SQL, без ORM |
| **PostgreSQL** 16 | Docker локально, managed DB на prod |
| **JWT** + **bcryptjs** | Сессии 24h |

---

## Архитектура

```
┌─────────────────────────────────────────────────────────┐
│  Providers (Language → Auth → Search → Favorites)       │
│  └── AppShell (skip link, document title)               │
│       └── Routes / MainLayout / AuthLayout              │
│            ├── pages/          – route-level screens    │
│            ├── components/                              │
│            │   ├── layout/     – Header, Footer, Shell  │
│            │   ├── features/   – search, profile, auth  │
│            │   ├── blocks/     – секции HomePage        │
│            │   └── ui/         – design system          │
│            ├── context/        – React Context            │
│            ├── hooks/          – media, debounce, etc.  │
│            └── utils/          – API clients, filters   │
└─────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
   src/db.json (static)          Express API → PostgreSQL
   public/images/properties/     auth, favorites, bookings
```

### Принципы организации

- **Feature slices** – доменная логика в `components/features/` (search, profile)
- **UI kit** – переиспользуемые компоненты в `components/ui/` + страница `/ui-kit`
- **Page containers** – `PageLayout` с вариантами контейнера (`default | narrow | flush | none`)
- **Context + localStorage** – cross-page state без Redux/Zustand
- **Optimistic UI** – избранное обновляется локально, синхронизируется с сервером

---

## Структура проекта

```
Harbor/
├── src/
│   ├── pages/                  # Экраны по роутам
│   ├── components/
│   │   ├── layout/             # AppShell, MainLayout, Header, Footer
│   │   ├── features/           # search/, profile/, auth/
│   │   ├── blocks/             # PropertiesSection, TravelIdeas, …
│   │   └── ui/                 # Button, DatePicker, Filter, PropertyCard, …
│   ├── context/                # Language, Auth, Search, Favorites
│   ├── hooks/                  # useDebounce, useClickOutside, useIsMobile, …
│   ├── utils/                  # API clients, searchFilters, authStorage
│   ├── i18n/                   # ru/en translations + propertyLocales
│   ├── types/                  # property, search, favorites
│   ├── styles/                 # variables.scss, mixins.scss
│   ├── config/api.ts           # API_URL
│   ├── db.json                 # Статический каталог объектов
│   └── harbor-backend/         # Express API
├── public/images/properties/   # WebP изображения по id объекта
├── scripts/                    # retina images, db merge, deploy checks
├── database/docker-init.sql    # Схема PostgreSQL
└── deploy/                     # nginx + VM production setup
```

---

## Ключевые фичи

### Поиск

- Виджет: город, даты, гости – состояние в `SearchContext`
- Синхронизация с URL: `?city=&checkIn=&checkOut=&adults=&children=&infants=&pets=`
- Фильтры: цена, тип жилья, amenities, рейтинг (`FilterSidebar`, `searchFilters.ts`)
- **MobileSearchFlow** – полноэкранный step-by-step flow на `< 768px`
- Debounced autocomplete городов (`useDebounce`, 300ms)

### Property Details + Booking

- Галерея с модальным просмотром (`ImageGallery`, `GalleryModal`)
- `ReservationCard` – выбор дат, расчёт цены, переход на `/property/:id/book`
- **BookingRequestPage** – 4 шага: срок оплаты → карта → сообщение хосту → review
- Проверка доступности: `bookedDates` в db.json + серверная проверка конфликтов
- Платежи **симулированы** (saved cards, promo codes – localStorage)

### Auth & Profile

- Login / Register с `remember me` и redirect param
- JWT в `localStorage` или `sessionStorage` (`authStorage.ts`)
- **ProfilePage** – табы: поездки, прошлые, личные данные, платежи, безопасность
- Поездки и отмена бронирований через `bookingsApi.ts`

### Избранное

- Optimistic toggle + серверная синхронизация
- Очередь sync через Promise chain (без race conditions)
- Гость кликает ❤️ → модалка логина → после auth автоматически добавляется pending favorite

### i18n

- Переключатель ru/en в хедере
- UI-строки: `src/i18n/translations/{ru,en}/`
- Контент объектов: overlay в `i18n/propertyLocales/en.ts` (`localizeProperty.ts`)

### Прочее

- Travel ideas (`/ideas/:slug`), новости, info pages (privacy, terms, host resources)
- Форма «Сдайте жильё» → `POST /host-applications`
- Skip-to-content link, `useDocumentTitle` для i18n page titles

---

## State management

Redux/Zustand **не используются**. Четыре React Context провайдера:

| Context | Ответственность | Persistence |
|---------|-----------------|-------------|
| `LanguageContext` | ru/en, `document.documentElement.lang` | localStorage |
| `AuthContext` | JWT session, user, avatar | localStorage / sessionStorage |
| `SearchContext` | city, dates, guests, URL hydration | sessionStorage |
| `FavoritesContext` | favorite IDs, modal, server sync | localStorage per user |

```tsx
// App.tsx – порядок провайдеров
<LanguageProvider>
  <AuthProvider>
    <SearchProvider>
      <FavoritesProvider>
        <AppShell>...</AppShell>
      </FavoritesProvider>
    </SearchProvider>
  </AuthProvider>
</LanguageProvider>
```

### Пример: очередь синхронизации избранного

```ts
// FavoritesContext.tsx – сериализованная очередь без гонок
const syncQueueRef = useRef(Promise.resolve());

const enqueueFavoriteSync = useCallback((task: () => Promise<void>) => {
  syncQueueRef.current = syncQueueRef.current.then(task).catch(() => undefined);
  return syncQueueRef.current;
}, []);
```

---

## Работа с данными

### Статический каталог (`db.json`)

Каталог импортируется на этапе сборки. В dev – HMR через `useSyncExternalStore`:

```ts
// loadProperties.ts
export const usePropertiesFromDb = (): Property[] => {
  useDbRevision();
  return getProperties();
};

if (import.meta.hot) {
  import.meta.hot.accept('../db.json', (mod) => applyDbModule(mod));
}
```

### API layer

```ts
// config/api.ts
export const API_URL = import.meta.env.VITE_API_URL ?? '/api';
```

| Модуль | Эндпоинты |
|--------|-----------|
| `favoritesApi.ts` | `GET/POST/DELETE /favorites` |
| `bookingsApi.ts` | `GET/POST/DELETE /bookings` |
| `profileApi.ts` | `PUT /users/me/password` |
| Login/Register | `POST /login`, `POST /register` |

Все запросы – native `fetch` с Bearer JWT. Ошибки – `apiError.ts` (`readApiJson`, 502/503 detection).

**Локально:** Vite proxy `/api` → `http://localhost:5001` (см. `vite.config.ts`).

### ResponsiveImage + retina pipeline

```tsx
// ResponsiveImage – auto @2x WebP через <picture>
<ResponsiveImage src="/images/properties/1/card.webp" alt="..." />
```

`npm run prebuild` → `scripts/generate-retina-images.mjs` (Sharp) генерирует `@2x.webp`.

---

## Роутинг и layouts

```
Routes
├── MainLayout (search + footer)
│   ├── /                    HomePage
│   ├── /search              SearchResultsPage
│   ├── /favorites           FavoritesPage
│   ├── /ideas/:slug         TripIdeaPage
│   └── /about, /news, …     Info pages
├── MainLayout (no search)
│   ├── /property/:id        PropertyDetailsPage
│   ├── /profile             ProfilePage
│   └── /ui-kit              UiKitPage
├── MainLayout (no search, no footer)
│   └── /property/:id/book   BookingRequestPage
└── /login, /register        AuthLayout (standalone)
```

`MainLayout` рендерит Header (с опциональным SearchBar) + `<Outlet />` + Footer.

---

## Стилизация

- **SCSS Modules** – `Component.module.scss` рядом с компонентом
- **Design tokens** – `src/styles/variables.scss` (цвета, spacing, размеры header/search)
- **Responsive mixins** – `respond-to(mobile|tablet|tablet-down|desktop|wide)` в `mixins.scss`
- **Brand color** – `#2CB2FA`
- **Tailwind CSS не используется** – только `cn()` (clsx + tailwind-merge) для условных классов

Breakpoints (hooks):

| Hook | Breakpoint |
|------|------------|
| `useIsMobile` | `< 768px` |
| `useIsTabletDown` | `< 1024px` |

---

## Быстрый старт

### Требования

- Node.js 20+
- Docker (PostgreSQL)

### Запуск одной командой

```bash
npm install
npm start          # = npm run dev:all
```

`dev:all` выполняет:

1. `docker-compose up -d` – Postgres на порту **5433**
2. Backend на **5001** (`tsx watch`)
3. Ожидание `/health` (`scripts/wait-for-backend.mjs`)
4. Vite dev server на **5173**

### По отдельности

```bash
npm run db:up       # только Postgres
npm run backend     # только API
npm run dev         # только frontend (нужен запущенный backend)
```

### Backend env

```bash
cp src/harbor-backend/.env.example src/harbor-backend/.env
```

Frontend env для локальной разработки **не нужен** – proxy работает из коробки.

---

## Переменные окружения

### Frontend (`.env.example`)

| Переменная | Локально | Production |
|------------|----------|------------|
| `VITE_API_URL` | не задавать | `https://harbor-api.onrender.com` |
| `VITE_BASE_PATH` | `/` (default) | `/harbor/` для GitHub Pages |

### Backend (`src/harbor-backend/.env.example`)

| Переменная | Назначение |
|------------|------------|
| `PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, `PGPORT` | Локальный Docker Postgres |
| `DATABASE_URL` | Managed Postgres (Render / Neon / Supabase) |
| `JWT_SECRET` | Обязателен в production (≥32 символов) |
| `CORS_ORIGINS` | URL фронтенда через запятую |

---

## Сборка и деплой

```bash
npm run build       # tsc + vite build (+ retina images via prebuild)
npm run preview     # preview на :4173
npm run lint        # ESLint
```

### Поддерживаемые платформы

| Платформа | Конфиг |
|-----------|--------|
| Vercel | `vercel.json` |
| Netlify | `netlify.toml` |
| Render | `render.yaml` (Postgres + API + static) |
| GitHub Pages | `.github/workflows/deploy.yml` |
| Yandex Cloud VM | `docker-compose.prod.yml` + `deploy/setup-vm.sh` |

Pre-deploy проверки:

```bash
npm run check:deploy:backend
npm run check:deploy:frontend
```

---

## Скрипты

| Команда | Назначение |
|---------|------------|
| `npm run images:retina` | Генерация `@2x.webp` через Sharp |
| `node scripts/merge-db.mjs` | Merge db-файлов → `src/db.json` |
| `node scripts/enrich-properties.mjs` | Добавление `propertyType`, `amenityIds` |
| `node scripts/update-db-images.mjs` | Нормализация путей к изображениям |

---

## Что стоит посмотреть в коде

| Файл | Почему интересно |
|------|------------------|
| `src/context/FavoritesContext.tsx` | Optimistic UI + sync queue + pending favorite after login |
| `src/utils/loadProperties.ts` | HMR для db.json через `useSyncExternalStore` |
| `src/components/features/search/MobileSearchFlow/` | Mobile-first search UX |
| `src/pages/BookingRequestPage/` | Multi-step form с валидацией |
| `src/components/ui/ResponsiveImage/` | Retina-ready `<picture>` |
| `src/utils/searchFilters.ts` | Client-side filtering + date availability |
| `src/i18n/` | Структура i18n + property localization overlay |

---

## Ограничения (осознанные)

- Платежи – client-side mock, без реального payment gateway
- Каталог объектов – статический JSON, не CRUD через API
- `axios` / `json-server` в dependencies – legacy, не используются
- Часть компонентов дублируется (старые `components/Header/` vs `components/layout/Header/`) – активные импорты идут из `layout/` и `features/`
