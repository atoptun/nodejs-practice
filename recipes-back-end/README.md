# start

Стартова версія проєкту для теми REST API: Prisma-схема, міграції та скрипт заповнення БД. [`app.ts`](./app.ts) **порожній** — відправна точка для написання API.

## Файли

- [`package.json`](./package.json) - базові залежності (`express`, `prisma`, `dotenv`) і скрипт `dev`.
- [`prisma/schema.prisma`](./prisma/schema.prisma) - моделі БД для предметної області.
- [`prisma/migrations/20260405184100_init/migration.sql`](./prisma/migrations/20260405184100_init/migration.sql) - початкова міграція.
- [`prisma/client.ts`](./prisma/client.ts) - ініціалізація Prisma Client.
- [`seed.ts`](./seed.ts) - скрипт первинного наповнення БД.
- [`prisma.config.ts`](./prisma.config.ts) - конфіг Prisma CLI.
- [`.env.example`](./.env.example) - приклад змінних середовища.
