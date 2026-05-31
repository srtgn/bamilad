import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 config. Env vars are NOT loaded automatically in v7, hence dotenv above.
// In v7 the datasource URL lives here (no longer in schema.prisma); the runtime
// PrismaClient connects via the pg driver adapter (see lib/prisma.ts).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
