import { vi } from "vitest";

// Mock Prisma client for tests
vi.mock("@/lib/db", () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
  },
}));
