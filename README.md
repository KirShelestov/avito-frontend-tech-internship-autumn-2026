# Система бронирования переговорных

Тестовое задание Frontend (осенняя волна 2026).

## Структура репозитория

| Папка | Описание |
| --- | --- |
| [`client/`](./client) | Веб-приложение (React + TypeScript + Vite). **Основная часть задания.** |
| [`server/`](./server) | Предоставленный mock-backend: REST API + WebSocket + тестовые данные. |
| [`images/`](./images) | Макеты интерфейса из Figma. |
| [`Frontend-trainee-assignment-autumn-2026.md`](./Frontend-trainee-assignment-autumn-2026.md) | Текст задания. |

## Быстрый запуск

Требуется Node.js 20+.

```bash
# терминал 1: бэкенд
cd server && npm ci && npm run dev      # http://localhost:3000

# терминал 2: клиент
cd client && npm ci && cp .env.example .env && npm run dev   # http://localhost:5173
```

Подробности по клиенту в [`client/README.md`](./client/README.md).
