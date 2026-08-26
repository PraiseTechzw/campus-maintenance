export type CampusRole = "student" | "ict" | "maintenance" | "security" | "administrator";
export type CampusTeam = "ICT" | "Physical Maintenance" | "Security";
export type CampusCategory = "ICT" | "Plumbing" | "Electrical" | "Building" | "Cleaning" | "Security";

export const campusRoles: Record<CampusRole, { label: string; summary: string; initials: string; team?: CampusTeam; name: string }> = {
  student: { label: "Student", summary: "Report campus issues and follow every update.", initials: "ST", name: "Amara N." },
  ict: { label: "ICT Technician", summary: "Diagnose and resolve technology requests assigned to ICT.", initials: "IT", team: "ICT", name: "Jordan M." },
  maintenance: { label: "Physical-Maintenance Technician", summary: "Handle facilities, plumbing, electrical, and building work.", initials: "PM", team: "Physical Maintenance", name: "Thabo K." },
  security: { label: "Security Officer", summary: "Acknowledge, manage, and document safety incidents.", initials: "SO", team: "Security", name: "Nandi S." },
  administrator: { label: "Administrator", summary: "Oversee requests, routing, workload, and service quality.", initials: "AD", name: "Campus Administrator" },
};

export const campusTeamFor = (category: CampusCategory): CampusTeam => category === "ICT" ? "ICT" : category === "Security" ? "Security" : "Physical Maintenance";
