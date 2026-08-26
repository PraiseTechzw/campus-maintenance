import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

function anonymousContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Campus Maintenance backend protection", () => {
  it("requires an authenticated account before listing live maintenance data", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.maintenance.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated account before reading operational analytics", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.analytics.overview()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated account before accessing verified building records", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.campusMap.buildings()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
