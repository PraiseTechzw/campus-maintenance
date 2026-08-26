import { type Request, type Team } from "@/lib/maintenance-store";

export type AdminQueueFilters = {
  status: "All" | Request["status"];
  priority: "All" | Request["priority"];
  team: "All" | Team;
  sort: "Newest" | "Oldest" | "Priority" | "Pending";
};

export function filterAndSortRequests(requests: Request[], filters: AdminQueueFilters) {
  const priorityRank = { Urgent: 4, High: 3, Medium: 2, Low: 1 } as const;
  const pendingRank = { Submitted: 4, Assigned: 3, "In Progress": 2, Resolved: 1 } as const;
  const numericId = (id: string) => Number(id.replace(/\D/g, ""));
  return requests
    .filter((item) => (filters.status === "All" || item.status === filters.status) && (filters.priority === "All" || item.priority === filters.priority) && (filters.team === "All" || item.team === filters.team))
    .sort((a, b) => filters.sort === "Priority" ? priorityRank[b.priority] - priorityRank[a.priority] : filters.sort === "Pending" ? pendingRank[b.status] - pendingRank[a.status] : filters.sort === "Oldest" ? numericId(a.id) - numericId(b.id) : numericId(b.id) - numericId(a.id));
}
