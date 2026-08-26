export type SlaPriority = "Low" | "Medium" | "High" | "Urgent";
export type SlaStatus = "Submitted" | "Assigned" | "In Progress" | "Resolved";

export const slaHours: Record<SlaPriority, number> = { Urgent: 1, High: 4, Medium: 48, Low: 120 };
export function createSlaDueAt(priority: SlaPriority, from = new Date()) { return new Date(from.getTime() + slaHours[priority] * 60 * 60 * 1000).toISOString(); }
export function slaState(dueAt?: string, status?: SlaStatus, now = new Date()) { if (!dueAt || status === "Resolved") return "none" as const; const minutes = Math.round((new Date(dueAt).getTime() - now.getTime()) / 60000); if (minutes < 0) return "breached" as const; if (minutes <= 60) return "approaching" as const; return "on-track" as const; }
export function formatSlaDeadline(dueAt?: string) { if (!dueAt) return "SLA target pending"; const date = new Date(dueAt); return `Target ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`; }
