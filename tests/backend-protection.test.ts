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

  it("requires an authenticated account before changing staff permissions", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.campusIdentity.savePermissions({ userId: 42, manageUsers: false, manageRequests: false, manageLocations: false, manageServiceLevels: false, manageEscalations: false, viewAnalytics: false })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated account before changing escalation rules", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.serviceConfiguration.saveEscalationRule({ priority: "High", thresholdMinutes: 30, notifyRole: "administrator", active: true })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated account before importing staff or reading audit history", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.campusIdentity.bulkProvision({ rows: [{ email: "staff@example.edu", operationalRole: "ict", manageUsers: false, manageRequests: true, manageLocations: false, manageServiceLevels: false, manageEscalations: false, viewAnalytics: false }] })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.campusIdentity.auditLog({ limit: 10 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("requires an authenticated account before reading live governance metrics", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.governance.overview()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
