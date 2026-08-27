import { describe, expect, it } from "vitest";
import { parseStaffImportCsv } from "../lib/staff-import";

describe("staff CSV import validation", () => {
  it("parses approved roles and explicit delegated permissions", () => {
    const result = parseStaffImportCsv("email,displayName,operationalRole,manageUsers,manageRequests,manageLocations,manageServiceLevels,manageEscalations,viewAnalytics\ntech@example.edu,Alex,ict,false,yes,false,0,false,true");
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([{ email: "tech@example.edu", displayName: "Alex", operationalRole: "ict", manageUsers: false, manageRequests: true, manageLocations: false, manageServiceLevels: false, manageEscalations: false, viewAnalytics: true }]);
  });

  it("rejects invalid roles and duplicate account rows before import", () => {
    const result = parseStaffImportCsv("email,operationalRole\nuser@example.edu,invalid\nuser@example.edu,ict");
    expect(result.rows).toEqual([]);
    expect(result.errors).toHaveLength(2);
  });
});
