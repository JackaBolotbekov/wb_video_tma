# Telegram Video Mini App

Минимальная Telegram Mini App на TypeScript без базы данных.

## Локальный запуск

```bash
npm install
npm run dev
```

Открой адрес из терминала, обычно `http://localhost:5173`.

## Проверка перед Railway

```bash
npm run build
npm start
```

Railway сам использует:

- build: `npm run build`
- start: `npm start`

## Что внутри

- Загрузка видео через drag-and-drop или кнопку.
- На телефоне кнопка откроет выбор фото/видео.
- Выбор артикула из списка последних активных артикулов.
- Данные не сохраняются на сервере, это только интерфейс.
