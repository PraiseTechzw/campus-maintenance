import { describe, expect, it } from "vitest";
import { computeAdminAnalytics } from "../lib/analytics";

describe("administrator analytics", () => {
  it("summarizes workload, resolution rate, and SLA posture from request records", () => {
    const result = computeAdminAnalytics([
      { team: "ICT", priority: "High", status: "Submitted" },
      { team: "Security", priority: "Urgent", status: "Assigned" },
      { team: "Physical Maintenance", priority: "Medium", status: "In Progress" },
      { team: "ICT", priority: "Low", status: "Resolved" },
    ]);
    expect(result.total).toBe(4); expect(result.atRisk).toBe(2); expect(result.active).toBe(1); expect(result.resolved).toBe(1); expect(result.completionRate).toBe(25);
  });

  it("breaks performance down by operational team", () => {
    const result = computeAdminAnalytics([{ team: "Security", priority: "Urgent", status: "Assigned" }]);
    expect(result.teams.find((team) => team.team === "Security")).toMatchObject({ total: 1, attention: 1 });
  });
});
