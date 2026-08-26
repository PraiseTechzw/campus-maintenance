import { describe, expect, it } from "vitest";
import { campusRoles } from "../lib/campus-domain";
import { formatSlaDeadline, slaState } from "../lib/sla";

describe("production readiness domain rules", () => {
  it("keeps role metadata free of embedded staff identities", () => {
    expect(Object.values(campusRoles).every((role) => !("name" in role))).toBe(true);
  });

  it("uses only persisted deadlines for SLA state and presentation", () => {
    expect(slaState(undefined, "Submitted")).toBe("none");
    expect(formatSlaDeadline(undefined)).toBe("SLA target pending");
  });
});
