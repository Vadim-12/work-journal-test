# work-journal-test

Журнал работ на строительном объекте: прораб фиксирует дату, вид работ, объём и исполнителя.

## Стек

- **Frontend:** React, TypeScript, Vite, TanStack Query, Axios, CSS Modules
- **Backend:** NestJS, TypeORM, class-validator
- **БД:** MySQL 8
- **Запуск:** Docker Compose

## Запуск (Docker)

Ничего настраивать не нужно — переменные уже прописаны в `docker-compose.yml`.  
`npm install` на хосте **не требуется** — зависимости ставятся при сборке образов.

```bash
docker compose up --build -d
```

- UI: http://localhost:8080
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Локальная разработка

Нужен только если запускаете backend/frontend **без Docker**.  
`npm install` — в **обоих** каталогах (`backend` и `frontend`).

MySQL:

```bash
docker compose up mysql -d
```

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Dev-сервер фронта: http://localhost:5173, запросы к API проксируются на `:3000`.

## Тесты

Только backend. На свежем клоне сначала `npm install`:

```bash
cd backend
npm install
npm run test:all
```

## API

| Метод  | Путь                                                |
| ------ | --------------------------------------------------- |
| GET    | `/work-types`                                       |
| GET    | `/journal-entries?dateFrom=&dateTo=&sort=asc\|desc` |
| POST   | `/journal-entries`                                  |
| PATCH  | `/journal-entries/:id`                              |
| DELETE | `/journal-entries/:id`                              |

Пример:

```bash
curl -X POST http://localhost:3000/journal-entries \
  -H 'Content-Type: application/json' \
  -d '{"performedAt":"2026-05-20","workTypeId":1,"volume":24,"executorName":"Иванов И.И."}'
```

## Переменные окружения

Для Docker настройка не требуется.

Для локального backend скопируйте `backend/.env.example` → `backend/.env`. Основные: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`.

Для локальной разработки TypeORM включён с `DB_SYNCHRONIZE=true`. На проде лучше миграции и `DB_SYNCHRONIZE=false`.

## Структура

```
backend/     — NestJS API
frontend/    — React SPA
docker-compose.yml
```
