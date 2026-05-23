# work-journal-test

Журнал работ на строительном объекте: прораб фиксирует дату, вид работ, объём и исполнителя.

## Стек

- **Frontend:** React, TypeScript, Vite, TanStack Query, Axios, CSS Modules
- **Backend:** NestJS, TypeORM, class-validator
- **БД:** MySQL 8
- **Запуск:** Docker Compose

## Запуск

```bash
docker compose up --build
```

- UI: http://localhost:8080
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Локально

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

```bash
cd backend
npm run test:all
```

## API

| Метод | Путь |
|-------|------|
| GET | `/work-types` |
| GET | `/journal-entries?dateFrom=&dateTo=&sort=` |
| POST | `/journal-entries` |
| PATCH | `/journal-entries/:id` |
| DELETE | `/journal-entries/:id` |

Пример:

```bash
curl -X POST http://localhost:3000/journal-entries \
  -H 'Content-Type: application/json' \
  -d '{"performedAt":"2026-05-20","workTypeId":1,"volume":24,"executorName":"Иванов И.И."}'
```

## Переменные окружения

См. `.env.example`. Основные: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`.

Для локальной разработки TypeORM включён с `DB_SYNCHRONIZE=true`. На проде лучше миграции и `DB_SYNCHRONIZE=false`.

## Структура

```
backend/     — NestJS API
frontend/    — React SPA
docker-compose.yml
```
