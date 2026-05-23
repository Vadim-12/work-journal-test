# Журнал работ

Веб-приложение для учёта выполненных работ на строительном объекте (тестовое задание).

Прораб фиксирует, что было сделано на объекте: дата, вид работ, объём, исполнитель. Данные хранятся в MySQL и доступны через REST API.

## Стек и обоснование

| Слой | Технологии | Почему |
|------|------------|--------|
| **Frontend** | React 18, TypeScript, Vite | Требование ТЗ; зрелая экосистема компонентов |
| **Состояние API** | TanStack Query, Axios | Кэш, инвалидация после мутаций, единая обработка ошибок |
| **Стили** | CSS Modules, design tokens | Изоляция стилей по компонентам без runtime-зависимостей |
| **Backend** | NestJS, TypeORM, class-validator | Требование ТЗ; модульная архитектура, DTO-валидация из коробки |
| **БД** | MySQL 8 | Требование ТЗ; надёжное хранение реляционных данных |
| **Документация API** | Swagger (`/api/docs`) | Быстрая проверка эндпоинтов без фронтенда |
| **Инфра** | Docker Compose | Один запуск всего стека |

## Архитектура

```
┌─────────────┐     /api/*      ┌─────────────┐     TypeORM    ┌─────────────┐
│   React     │ ──────────────► │   NestJS    │ ─────────────► │   MySQL 8   │
│  :8080      │                 │   :3000     │                │   :3306     │
└─────────────┘                 └─────────────┘                └─────────────┘
                                      │
                                      ▼
                               Swagger /api/docs
```

## Функциональность (по ТЗ)

### Обязательно
- [x] Список записей: дата, вид работ, объём + единица, ФИО исполнителя
- [x] Фильтрация по диапазону дат и сортировка
- [x] Добавление с валидацией → сохранение в БД
- [x] Удаление записи

### Дополнительно
- [x] Редактирование записи
- [x] Справочник видов работ в БД (seed при первом запуске)

### Полировка
- [x] Валидация диапазона дат в фильтрах (клиент + сервер)
- [x] Запрет даты выполнения в будущем
- [x] Уведомления об успешных операциях
- [x] Индикация удаления строки
- [x] Unit- и e2e-тесты API
- [x] CI (GitHub Actions)

## Быстрый старт

```bash
git clone <url-репозитория>
cd construction-work-journal
docker compose up --build
```

| Сервис | URL |
|--------|-----|
| Приложение | http://localhost:8080 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |

## Локальная разработка

### 1. MySQL

```bash
docker compose up mysql -d
cp .env.example .env   # при необходимости
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173 (прокси `/api` → backend).

## Тесты

```bash
cd backend
npm run test:all    # unit + e2e (e2e на SQLite in-memory, MySQL не нужен)
```

## API (примеры curl)

```bash
# Справочник видов работ
curl http://localhost:3000/work-types

# Список записей (фильтр + сортировка)
curl 'http://localhost:3000/journal-entries?dateFrom=2026-05-01&dateTo=2026-05-31&sort=desc'

# Создать запись
curl -X POST http://localhost:3000/journal-entries \
  -H 'Content-Type: application/json' \
  -d '{"performedAt":"2026-05-20","workTypeId":1,"volume":24,"executorName":"Иванов И.И."}'

# Обновить
curl -X PATCH http://localhost:3000/journal-entries/1 \
  -H 'Content-Type: application/json' \
  -d '{"volume":30}'

# Удалить
curl -X DELETE http://localhost:3000/journal-entries/1
```

## Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `DB_HOST` | `localhost` | Хост MySQL |
| `DB_PORT` | `3306` | Порт MySQL |
| `DB_USER` | `journal` | Пользователь БД |
| `DB_PASSWORD` | `journal` | Пароль БД |
| `DB_NAME` | `work_journal` | Имя базы |
| `DB_SYNCHRONIZE` | `true` | Автосхема TypeORM (для prod — `false` + миграции) |
| `PORT` | `3000` | Порт API |
| `VITE_API_URL` | `/api` | Base URL API для фронтенда |

## Структура проекта

```
construction-work-journal/
├── backend/
│   ├── src/
│   │   ├── journal-entries/   # CRUD записей
│   │   ├── work-types/        # Справочник
│   │   └── common/validators/ # Кастомные валидаторы
│   └── test/                  # e2e-тесты
├── frontend/
│   └── src/
│       ├── components/        # UI + CSS Modules
│       ├── hooks/             # React Query
│       └── styles/            # tokens, global
├── .github/workflows/ci.yml
├── docker-compose.yml
└── README.md
```

## Принятые решения

- **TypeORM `synchronize: true`** — для тестового задания и docker-compose; в production рекомендуются миграции (`DB_SYNCHRONIZE=false`).
- **Справочник в БД**, а не hardcode — проще расширять без деплоя фронтенда.
- **Валидация на клиенте и сервере** — UX + гарантия целостности данных.
- **e2e на SQLite in-memory** — быстрые тесты в CI без поднятия MySQL.

## Сдача

1. Запушить репозиторий на GitHub/GitLab
2. Убедиться, что `docker compose up --build` проходит
3. Приложить ссылку на репозиторий
