import { describe, expect, it } from "vitest";
import { roles, teamFor } from "../lib/maintenance-store";

describe("Campus Maintenance role routing", () => {
  it("supports the five required campus workspaces", () => {
    expect(Object.keys(roles)).toEqual(["student", "ict", "maintenance", "security", "administrator"]);
  });

  it("routes ICT and security reports to the correct specialist teams", () => {
    expect(teamFor("ICT")).toBe("ICT");
    expect(teamFor("Security")).toBe("Security");
  });

  it("routes facilities categories to the physical-maintenance team", () => {
    expect(teamFor("Plumbing")).toBe("Physical Maintenance");
    expect(teamFor("Electrical")).toBe("Physical Maintenance");
    expect(teamFor("Building")).toBe("Physical Maintenance");
    expect(teamFor("Cleaning")).toBe("Physical Maintenance");
  });
});
