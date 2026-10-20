# start

Відправна точка для того ж підходу, що й у [`finish`](../finish/): HTML-сторінки з сервера, дані в SQLite через Prisma. Тут **немає** готового логіну й сесій — лише каркас, на який навішується власна логіка.

У [`app.ts`](./app.ts) зараз мінімум: парсинг форм, EJS, **404** і **500**; контентних маршрутів немає.

## Файли

- [`app.ts`](./app.ts) — точка входу, порт `3000`.
- [`package.json`](./package.json) — скрипти `start` / `dev`, Prisma (`prisma:generate`, `prisma:migrate`, `prisma:studio`).
- [`lib/prisma.ts`](./lib/prisma.ts) — `PrismaClient` з адаптером `@prisma/adapter-better-sqlite3`, клієнт з [`generated/prisma`](./prisma/schema.prisma) (після `prisma generate`).
- [`prisma/schema.prisma`](./prisma/schema.prisma) — datasource SQLite; **моделей поки немає** (додавання `User` тощо — частина завдання).
- [`prisma.config.ts`](./prisma.config.ts) — конфіг Prisma CLI.
- [`.env.example`](./.env.example) — `DATABASE_URL` для SQLite.
- [`views/404.ejs`](./views/404.ejs), [`views/error.ejs`](./views/error.ejs) — шаблони для 404 і помилки сервера.
- [`tsconfig.json`](./tsconfig.json) — налаштування TypeScript.

## Запуск

```powershell
cd start
npm install
copy .env.example .env
```

Після того як з’являться моделі в [`prisma/schema.prisma`](./prisma/schema.prisma): `npx prisma generate`, потім `npx prisma migrate dev`. Далі:

```powershell
npm run dev
```
