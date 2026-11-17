import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const datasourceUrl = process.env.STORE_TEMPLATE_HOSTED_DEMO === "true"
  ? "postgresql://127.0.0.1:5432/store_template_demo"
  : env("DATABASE_URL_UNPOOLED");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl,
  },
});
