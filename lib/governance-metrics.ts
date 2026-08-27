export type GovernanceRequest = {
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Submitted" | "Assigned" | "In Progress" | "Resolved";
  slaDueAt?: Date | string | null;
  resolvedAt?: Date | string | null;
};

export type GovernanceEscalationRule = {
  priority: string;
  thresholdMinutes: number;
  active: boolean;
};

function asDate(value?: Date | string | null) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function computeGovernanceMetrics(
  requests: GovernanceRequest[],
  escalationRules: GovernanceEscalationRule[],
  now = new Date(),
) {
  const activeRules = escalationRules.filter((rule) => rule.active);
  const ruleFor = (priority: GovernanceRequest["priority"]) => activeRules.find((rule) => rule.priority === priority);
  const tracked = requests.filter((request) => asDate(request.slaDueAt));
  const compliant = tracked.filter((request) => {
    const dueAt = asDate(request.slaDueAt)!;
    if (request.status === "Resolved") {
      const resolvedAt = asDate(request.resolvedAt);
      return Boolean(resolvedAt && resolvedAt.getTime() <= dueAt.getTime());
    }
    return now.getTime() <= dueAt.getTime();
  });
  const breached = tracked.filter((request) => request.status !== "Resolved" && now.getTime() > asDate(request.slaDueAt)!.getTime());
  const escalating = tracked.filter((request) => {
    if (request.status === "Resolved") return false;
    const rule = ruleFor(request.priority);
    const dueAt = asDate(request.slaDueAt)!;
    return Boolean(rule && now.getTime() >= dueAt.getTime() - rule.thresholdMinutes * 60_000);
  });
  const priorities = ["Urgent", "High", "Medium", "Low"] as const;
  const byPriority = priorities.map((priority) => {
    const requestsForPriority = tracked.filter((request) => request.priority === priority);
    const compliantCount = compliant.filter((request) => request.priority === priority).length;
    const escalatingCount = escalating.filter((request) => request.priority === priority).length;
    return { priority, total: requestsForPriority.length, compliant: compliantCount, complianceRate: requestsForPriority.length ? Math.round((compliantCount / requestsForPriority.length) * 100) : 0, escalating: escalatingCount };
  });
  return {
    trackedRequests: tracked.length,
    compliantRequests: compliant.length,
    complianceRate: tracked.length ? Math.round((compliant.length / tracked.length) * 100) : 0,
    breachedRequests: breached.length,
    activeRules: activeRules.length,
    escalatingRequests: escalating.length,
    byPriority,
  };
}
