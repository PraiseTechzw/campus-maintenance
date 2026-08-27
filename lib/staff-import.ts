import type { Role } from "./maintenance-store";

export type ImportedStaffRow = {
  email: string;
  displayName?: string;
  operationalRole: Role;
  manageUsers: boolean;
  manageRequests: boolean;
  manageLocations: boolean;
  manageServiceLevels: boolean;
  manageEscalations: boolean;
  viewAnalytics: boolean;
};

export type ImportParseResult = { rows: ImportedStaffRow[]; errors: string[] };

const permissionKeys = ["manageUsers", "manageRequests", "manageLocations", "manageServiceLevels", "manageEscalations", "viewAnalytics"] as const;
const roles: Role[] = ["student", "ict", "maintenance", "security", "administrator"];

function csvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { current += '"'; index += 1; } else quoted = !quoted;
    } else if (char === "," && !quoted) { cells.push(current.trim()); current = ""; } else current += char;
  }
  cells.push(current.trim());
  return cells;
}

function enabled(value?: string) { return ["1", "true", "yes", "y"].includes((value ?? "").trim().toLowerCase()); }

export function parseStaffImportCsv(source: string): ImportParseResult {
  const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return { rows: [], errors: ["The CSV must include a header row and at least one staff row."] };
  const headers = csvLine(lines[0]).map((value) => value.replace(/[^a-zA-Z]/g, "").toLowerCase());
  const headerIndex = (name: string) => headers.indexOf(name.replace(/[^a-zA-Z]/g, "").toLowerCase());
  const emailIndex = headerIndex("email"); const roleIndex = headerIndex("operationalRole"); const nameIndex = headerIndex("displayName");
  if (emailIndex < 0 || roleIndex < 0) return { rows: [], errors: ["Required headers: email, operationalRole. Optional: displayName and permission columns."] };
  const rows: ImportedStaffRow[] = []; const errors: string[] = []; const seen = new Set<string>();
  if (lines.length - 1 > 100) errors.push("A single import can contain at most 100 staff rows.");
  lines.slice(1, 101).forEach((line, offset) => {
    const values = csvLine(line); const lineNumber = offset + 2; const email = (values[emailIndex] ?? "").trim().toLowerCase(); const operationalRole = (values[roleIndex] ?? "").trim().toLowerCase() as Role;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push(`Row ${lineNumber}: enter a valid email address.`); return; }
    if (seen.has(email)) { errors.push(`Row ${lineNumber}: duplicate email ${email}.`); return; }
    seen.add(email);
    if (!roles.includes(operationalRole)) { errors.push(`Row ${lineNumber}: operationalRole must be student, ict, maintenance, security, or administrator.`); return; }
    const permissionValues = Object.fromEntries(permissionKeys.map((key) => [key, enabled(values[headerIndex(key)])])) as Pick<ImportedStaffRow, (typeof permissionKeys)[number]>;
    rows.push({ email, displayName: nameIndex >= 0 ? values[nameIndex]?.trim() || undefined : undefined, operationalRole, ...permissionValues });
  });
  return { rows, errors };
}

export const staffImportTemplate = "email,displayName,operationalRole,manageUsers,manageRequests,manageLocations,manageServiceLevels,manageEscalations,viewAnalytics\nstaff.member@institution.edu,Staff Member,ict,false,true,false,false,false,false";
