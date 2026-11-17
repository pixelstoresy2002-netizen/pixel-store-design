import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { isAdminDemoMode } from "@/lib/demo-admin";

const isDemoAdmin = isAdminDemoMode();

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const demoPrismaProxy = new Proxy({} as PrismaClient, {
  get() {
    throw new Error("Prisma is unavailable in the read-only Admin demo.");
  },
});

export const prisma = isDemoAdmin ? demoPrismaProxy : globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && !isDemoAdmin) {
  globalForPrisma.prisma = prisma;
}
