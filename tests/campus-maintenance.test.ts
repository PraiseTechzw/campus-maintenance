import { describe, expect, it } from "vitest";
import { languageOptions, translations } from "../lib/i18n";
import { campusRoles as roles, campusTeamFor as teamFor } from "../lib/campus-domain";

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

describe("Campus Maintenance language catalog", () => {
  it("makes English, Shona, and Ndebele available", () => {
    expect(languageOptions.map((option) => option.code)).toEqual(["en", "sn", "nd"]);
  });

  it("contains the core navigation and request actions in every supported language", () => {
    for (const language of ["en", "sn", "nd"] as const) {
      expect(translations[language].home).toBeTruthy();
      expect(translations[language].requests).toBeTruthy();
      expect(translations[language].reportIssue).toBeTruthy();
      expect(translations[language].submitRequest).toBeTruthy();
      expect(translations[language].resolved).toBeTruthy();
      expect(translations[language].security).toBeTruthy();
    }
  });
});
