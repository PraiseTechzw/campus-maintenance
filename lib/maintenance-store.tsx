import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { campusRoles, campusTeamFor } from "@/lib/campus-domain";

export type Role = "student" | "ict" | "maintenance" | "security" | "administrator";
export type Team = "ICT" | "Physical Maintenance" | "Security";
export type Category = "ICT" | "Plumbing" | "Electrical" | "Building" | "Cleaning" | "Security";
export type Status = "Submitted" | "Assigned" | "In Progress" | "Resolved";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Activity = { id: string; action: string; author: string; time: string; note?: string };
export type Request = { id: string; serverId?: number; title: string; category: Category; location: string; description: string; priority: Priority; status: Status; reporter: string; team: Team; assignee?: string; time: string; activity: Activity[]; acknowledged?: boolean; satisfaction?: 1 | 2 | 3; attachmentUri?: string; arrivalTime?: string; slaDueAt?: string };

export const roles: Record<Role, { label: string; summary: string; initials: string; team?: Team }> = campusRoles;


type Store = { role: Role; requests: Request[]; visible: Request[]; isLiveData: boolean; create: (v: Pick<Request, "title" | "category" | "location" | "description" | "priority"> & { attachmentUri?: string }, saved?: { id: number; reference: string; slaDueAt: Date | string }) => string; assign: (id: string, team: Team, assignee: { userId: number; name: string }) => Promise<void>; status: (id: string, value: Status, note?: string) => Promise<void>; note: (id: string, text: string) => Promise<void>; acknowledge: (id: string) => Promise<void>; rate: (id: string, value: 1 | 2 | 3) => Promise<void>; setArrival: (id: string, value: string) => Promise<void> };
const Context = createContext<Store | null>(null);
export const teamFor = (category: Category): Team => campusTeamFor(category);
const timeLabel = (value: Date | string | null | undefined) => value ? new Date(value).toLocaleString() : "Recently";
const serverRequest = (item: any): Request => ({ id: item.reference, serverId: item.id, title: item.title, category: item.category, location: item.location, description: item.description, priority: item.priority, status: item.status, reporter: item.reporterName, team: item.team, assignee: item.assigneeName ?? undefined, time: timeLabel(item.updatedAt ?? item.createdAt), activity: (item.updates ?? []).map((update: any) => ({ id: String(update.id), action: update.action, author: update.authorName, time: timeLabel(update.createdAt), note: update.note ?? undefined })), acknowledged: item.acknowledged, satisfaction: item.satisfaction ?? undefined, attachmentUri: item.attachmentUrl ?? undefined, arrivalTime: item.arrivalTime ?? undefined, slaDueAt: item.slaDueAt ? new Date(item.slaDueAt).toISOString() : undefined });

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student"); const [requests, setRequests] = useState<Request[]>([]); const { isAuthenticated, user } = useAuth(); const profile = trpc.campusIdentity.profile.useQuery(undefined, { enabled: isAuthenticated }); const liveRequests = trpc.maintenance.list.useQuery(undefined, { enabled: isAuthenticated, retry: false }); const liveUpdate = trpc.maintenance.addUpdate.useMutation(); const liveAssign = trpc.maintenance.assign.useMutation(); const liveArrival = trpc.maintenance.setArrival.useMutation(); const liveAcknowledge = trpc.maintenance.acknowledge.useMutation(); const liveRating = trpc.maintenance.rate.useMutation();
  useEffect(() => { const value = profile.data?.operationalRole; if (value && value in roles) setRole(value as Role); }, [profile.data?.operationalRole]);
  useEffect(() => { if (isAuthenticated && liveRequests.data) setRequests(liveRequests.data.map(serverRequest)); if (!isAuthenticated) setRequests([]); }, [isAuthenticated, liveRequests.data]);
  const actor = () => user?.name?.trim() || user?.email || "Institution account";
  const create: Store["create"] = (v, saved) => { if (!saved) throw new Error("A verified server record is required"); const id = saved.reference; const entry: Request = { ...v, id, serverId: saved.id, status: "Submitted", reporter: actor(), team: teamFor(v.category), slaDueAt: new Date(saved.slaDueAt).toISOString(), time: "Just now", activity: [{ id: `${id}-new`, action: "Request submitted", author: actor(), time: "Just now" }] }; setRequests((all) => [entry, ...all]); return id; };
  const assign: Store["assign"] = async (id, team, assignee) => { const request = requests.find((item) => item.id === id); if (!isAuthenticated || !request?.serverId) throw new Error("Sign in with an administrator account before assigning work"); await liveAssign.mutateAsync({ id: request.serverId, team, assigneeUserId: assignee.userId, assigneeName: assignee.name }); await liveRequests.refetch(); };
  const serverRequestId = (id: string) => { const request = requests.find((item) => item.id === id); if (!isAuthenticated || !request?.serverId) throw new Error("Sign in with your institution account before updating maintenance work"); return request.serverId; };
  const status: Store["status"] = async (id, value, noteValue) => { const action = value === "In Progress" ? "Work started" : value === "Resolved" ? "Resolved" : `Status changed to ${value}`; await liveUpdate.mutateAsync({ id: serverRequestId(id), action, note: noteValue, status: value }); await liveRequests.refetch(); };
  const note: Store["note"] = async (id, text) => { await liveUpdate.mutateAsync({ id: serverRequestId(id), action: "Progress update", note: text }); await liveRequests.refetch(); };
  const acknowledge: Store["acknowledge"] = async (id) => { await liveAcknowledge.mutateAsync({ id: serverRequestId(id) }); await liveRequests.refetch(); };
  const rate: Store["rate"] = async (id, value) => { await liveRating.mutateAsync({ id: serverRequestId(id), satisfaction: value }); await liveRequests.refetch(); };
  const setArrival: Store["setArrival"] = async (id, value) => { await liveArrival.mutateAsync({ id: serverRequestId(id), arrivalTime: value }); await liveRequests.refetch(); };
  const visible = useMemo(() => requests, [requests]);
  return <Context.Provider value={{ role, requests, visible, isLiveData: isAuthenticated && Boolean(liveRequests.data), create, assign, status, note, acknowledge, rate, setArrival }}>{children}</Context.Provider>;
}
export const useMaintenance = () => { const value = useContext(Context); if (!value) throw new Error("MaintenanceProvider is missing"); return value; };
