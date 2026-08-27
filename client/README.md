# BookRoom: клиент

Веб-приложение для бронирования переговорных комнат. Тестовое задание Frontend (осень 2026).

## Стек

- **React 18** + **TypeScript** (strict) + **Vite 5**
- **react-router-dom**: маршрутизация
- **TanStack Query**: серверное состояние и кэш
- **react-hook-form + zod**: формы и валидация
- **Luxon**: работа с датами и таймзонами офисов
- **Radix UI**: доступные примитивы (модалки, поповеры, табы)
- **WebSocket**: real-time обновления
- **Vitest + Testing Library + MSW**: тесты
- **Storybook**: UI-кит и состояния экранов

## Запуск

Требуется Node.js 20+.

```bash
# 1. поднять бэкенд (в соседней папке)
cd ../server
npm ci
npm run dev            # http://localhost:3000

# 2. поднять клиент
cd ../client
npm ci
cp .env.example .env
npm run dev            # http://localhost:5173
```

### Разработка без бэкенда

Поставьте `VITE_USE_MSW=true` в `.env`, и запросы будет обслуживать мок-слой MSW.

## Скрипты

| Команда                           | Назначение                    |
| --------------------------------- | ----------------------------- |
| `npm run dev`                     | dev-сервер Vite               |
| `npm run build`                   | production-сборка в `dist/`   |
| `npm run preview`                 | предпросмотр собранной версии |
| `npm run lint`                    | ESLint                        |
| `npm run format` / `format:check` | Prettier                      |
| `npm run typecheck`               | проверка типов                |
| `npm run check`                   | формат + lint + типы          |

## Переменные окружения

| Переменная     | По умолчанию                    | Описание                                 |
| -------------- | ------------------------------- | ---------------------------------------- |
| `VITE_API_URL` | `http://localhost:3000`         | REST API бэкенда                         |
| `VITE_WS_URL`  | `ws://localhost:3000/api/v1/ws` | WebSocket бэкенда                        |
| `VITE_USE_MSW` | `false`                         | использовать мок-слой MSW вместо бэкенда |

## Архитектура

Слоистая структура (упрощённый Feature-Sliced Design):

```
src/
  app/       инициализация: провайдеры, роутер, тема, глобальные стили
  pages/     экраны под маршруты
  widgets/   крупные самостоятельные блоки (Header, RoomSchedule, ...)
  features/  пользовательские сценарии (создание/отмена брони, real-time, ...)
  entities/  доменные сущности: типы, query-хуки, карточки (room, booking, office)
  shared/    переиспользуемое без доменных знаний: ui-kit, api, lib, config
```

Правило импортов: слой видит только слои ниже (`app → pages → widgets → features → entities → shared`).
