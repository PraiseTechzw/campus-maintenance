import { describe, expect, it } from "vitest";
import { computeGovernanceMetrics } from "../lib/governance-metrics";

describe("governance metrics", () => {
  it("calculates verified SLA compliance and active escalation exposure", () => {
    const now = new Date("2026-08-27T12:00:00Z");
    const result = computeGovernanceMetrics([
      { priority: "High", status: "Resolved", slaDueAt: "2026-08-27T11:00:00Z", resolvedAt: "2026-08-27T10:30:00Z" },
      { priority: "Urgent", status: "In Progress", slaDueAt: "2026-08-27T12:30:00Z" },
      { priority: "Medium", status: "Submitted", slaDueAt: "2026-08-27T11:59:00Z" },
      { priority: "Low", status: "Resolved", slaDueAt: "2026-08-27T10:00:00Z", resolvedAt: "2026-08-27T10:30:00Z" },
    ], [{ priority: "Urgent", thresholdMinutes: 45, active: true }, { priority: "High", thresholdMinutes: 15, active: false }], now);
    expect(result).toMatchObject({ trackedRequests: 4, compliantRequests: 2, complianceRate: 50, breachedRequests: 1, activeRules: 1, escalatingRequests: 1 });
    expect(result.byPriority.find((item) => item.priority === "Urgent")).toMatchObject({ total: 1, escalating: 1, complianceRate: 100 });
  });
});
