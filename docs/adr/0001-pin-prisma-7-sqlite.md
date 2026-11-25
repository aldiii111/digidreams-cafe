# Pin Prisma 7 + SQLite instead of the scaffolded Prisma 8 RC

**Status**: accepted

The scaffold shipped `prisma@8.0.0-rc.35`, whose data-contract PSL workflow (`contract emit`, `db update`, `@prisma/orm-sqlite`) differs from the classic Prisma model the project brief assumes and from what a future reader expects to see. We pinned `prisma@7.10.1`, `@prisma/client@7.10.1`, and `@prisma/adapter-better-sqlite3@7.10.1` — a stable, conventional `schema.prisma` + `migrate` + `seed` flow over local SQLite (verified loading on Node 26). Revisit when Prisma 8 ships stable, at which point the migration is a deliberate upgrade rather than an untested RC.
