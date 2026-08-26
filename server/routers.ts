import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";
import { computeAdminAnalytics } from "../lib/analytics";

const category = z.enum(["ICT", "Plumbing", "Electrical", "Building", "Cleaning", "Security"]);
const priority = z.enum(["Low", "Medium", "High", "Urgent"]);
const team = z.enum(["ICT", "Physical Maintenance", "Security"]);
const status = z.enum(["Submitted", "Assigned", "In Progress", "Resolved"]);
const attachment = z.object({ base64: z.string().max(7_000_000), mimeType: z.string().max(100), fileName: z.string().max(120) }).optional();
const campusRole = z.enum(["student", "ict", "maintenance", "security", "administrator"]);
const preferences = z.object({ assignments: z.boolean(), arrivals: z.boolean(), urgent: z.boolean(), resolutions: z.boolean() });
const buildingInput = z.object({ code: z.string().trim().min(2).max(32), name: z.string().trim().min(2).max(160), area: z.string().trim().max(160).optional(), latitude: z.string().trim().min(3).max(32), longitude: z.string().trim().min(3).max(32), accessNote: z.string().trim().max(2000).optional(), active: z.boolean().default(true) });
const slaPolicyInput = z.object({ priority, targetHours: z.number().int().min(1).max(8760) });
async function operationalProfile(userId: number, isPlatformAdmin: boolean) { return db.getCampusProfile(userId, isPlatformAdmin); }
async function requireAdministrator(userId: number, isPlatformAdmin: boolean) { const profile = await operationalProfile(userId, isPlatformAdmin); if (!isPlatformAdmin && profile.operationalRole !== "administrator") throw new Error("Administrator role required"); return profile; }
async function requestAccess(userId: number, isPlatformAdmin: boolean, requestId: number) { const profile = await operationalProfile(userId, isPlatformAdmin); const access = await db.canAccessRequest(requestId, userId, profile.operationalRole, isPlatformAdmin); if (!access.request) throw new Error("Maintenance request not found"); if (!access.allowed) throw new Error("You are not permitted to access this maintenance request"); return { profile, request: access.request }; }

export const appRouter = router({
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  campusIdentity: router({
    profile: protectedProcedure.query(({ ctx }) => db.getCampusProfile(ctx.user.id, ctx.user.role === "admin")),
    assignRole: protectedProcedure.input(z.object({ userId: z.number(), operationalRole: campusRole })).mutation(async ({ ctx, input }) => {
      await requireAdministrator(ctx.user.id, ctx.user.role === "admin");
      return db.setCampusProfileRole(input.userId, input.operationalRole);
    }),
    directory: protectedProcedure.query(async ({ ctx }) => { await requireAdministrator(ctx.user.id, ctx.user.role === "admin"); return db.listInstitutionAccounts(); }),
  }),
  notificationPreferences: router({
    get: protectedProcedure.query(({ ctx }) => db.getNotificationPreferences(ctx.user.id)),
    save: protectedProcedure.input(preferences).mutation(({ ctx, input }) => db.saveNotificationPreferences(ctx.user.id, input)),
  }),
  campusMap: router({
    buildings: protectedProcedure.query(() => db.listCampusBuildings()),
    building: protectedProcedure.input(z.object({ code: z.string().min(1).max(32) })).query(({ input }) => db.getCampusBuilding(input.code)),
    saveBuilding: protectedProcedure.input(buildingInput).mutation(async ({ ctx, input }) => { await requireAdministrator(ctx.user.id, ctx.user.role === "admin"); return db.saveCampusBuilding(input); }),
  }),
  serviceConfiguration: router({
    slaPolicies: protectedProcedure.query(() => db.listSlaPolicies()),
    saveSlaPolicy: protectedProcedure.input(slaPolicyInput).mutation(async ({ ctx, input }) => { await requireAdministrator(ctx.user.id, ctx.user.role === "admin"); return db.saveSlaPolicy(input); }),
  }),
  maintenance: router({
    list: protectedProcedure.query(async ({ ctx }) => { const profile = await operationalProfile(ctx.user.id, ctx.user.role === "admin"); return db.listRequestsForRole(ctx.user.id, profile.operationalRole, ctx.user.role === "admin"); }),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => { const { request } = await requestAccess(ctx.user.id, ctx.user.role === "admin", input.id); return request; }),
    create: protectedProcedure.input(z.object({ title: z.string().min(3).max(255), category, buildingCode: z.string().trim().min(2).max(32), description: z.string().min(3).max(3000), priority, attachment })).mutation(async ({ ctx, input }) => {
      const [building, policy] = await Promise.all([db.getActiveCampusBuilding(input.buildingCode), db.getSlaPolicy(input.priority)]); if (!building) throw new Error("Select a verified active campus location before submitting a request"); if (!policy) throw new Error(`An SLA target for ${input.priority} priority must be configured before submitting requests`);
      let attachmentKey: string | undefined; let attachmentUrl: string | undefined;
      if (input.attachment) {
        const content = Buffer.from(input.attachment.base64, "base64");
        const stored = await storagePut(`maintenance/${ctx.user.id}/${Date.now()}-${input.attachment.fileName}`, content, input.attachment.mimeType);
        attachmentKey = stored.key; attachmentUrl = stored.url;
      }
      const location = `${building.name}${building.area ? ` · ${building.area}` : ""}`;
      const result = await db.createRequest({ reporterId: ctx.user.id, title: input.title, category: input.category, location, description: input.description, priority: input.priority, attachmentKey, attachmentUrl }, policy.targetHours);
      if (input.priority === "Urgent" || input.category === "Security") await notifyOwner({ title: `Urgent campus request ${result.reference}`, content: `${input.category}: ${input.title} at ${location}` });
      return result;
    }),
    addUpdate: protectedProcedure.input(z.object({ id: z.number(), action: z.string().min(2).max(160), note: z.string().max(2000).optional(), status: status.optional() })).mutation(async ({ ctx, input }) => {
      await requestAccess(ctx.user.id, ctx.user.role === "admin", input.id);
      if (input.status) await db.updateRequest(input.id, { status: input.status });
      await db.addUpdate(input.id, ctx.user.id, input.action, input.note);
      return { success: true };
    }),
    assign: protectedProcedure.input(z.object({ id: z.number(), team, assigneeName: z.string().max(160).optional(), assigneeUserId: z.number().optional() })).mutation(async ({ ctx, input }) => {
      await requireAdministrator(ctx.user.id, ctx.user.role === "admin");
      if (input.assigneeUserId) { const assignee = await operationalProfile(input.assigneeUserId, false); const compatible = (input.team === "ICT" && assignee.operationalRole === "ict") || (input.team === "Physical Maintenance" && assignee.operationalRole === "maintenance") || (input.team === "Security" && assignee.operationalRole === "security"); if (!compatible) throw new Error("The selected assignee does not have a matching operational role"); }
      await db.updateRequest(input.id, { team: input.team, assigneeName: input.assigneeName, assigneeUserId: input.assigneeUserId, status: "Assigned" });
      await db.addUpdate(input.id, ctx.user.id, `Assigned to ${input.team}`, input.assigneeName ? `Assigned to ${input.assigneeName}.` : undefined);
      return { success: true };
    }),
    setArrival: protectedProcedure.input(z.object({ id: z.number(), arrivalTime: z.string().min(2).max(80) })).mutation(async ({ ctx, input }) => {
      const { profile } = await requestAccess(ctx.user.id, ctx.user.role === "admin", input.id); if (!["ict", "maintenance", "security", "administrator"].includes(profile.operationalRole) && ctx.user.role !== "admin") throw new Error("Technician role required");
      await db.updateRequest(input.id, { arrivalTime: input.arrivalTime });
      await db.addUpdate(input.id, ctx.user.id, "Technician arrival updated", `Technician-entered arrival time: ${input.arrivalTime}.`);
      return { success: true };
    }),
    acknowledge: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      const { profile, request } = await requestAccess(ctx.user.id, ctx.user.role === "admin", input.id); if (profile.operationalRole !== "security" && profile.operationalRole !== "administrator" && ctx.user.role !== "admin") throw new Error("Security role required"); if (request.team !== "Security") throw new Error("Only security incidents can be acknowledged");
      await db.updateRequest(input.id, { acknowledged: true }); await db.addUpdate(input.id, ctx.user.id, "Incident acknowledged", "A security officer has acknowledged this incident."); return { success: true };
    }),
    rate: protectedProcedure.input(z.object({ id: z.number(), satisfaction: z.union([z.literal(1), z.literal(2), z.literal(3)]) })).mutation(async ({ ctx, input }) => {
      const { request } = await requestAccess(ctx.user.id, ctx.user.role === "admin", input.id); if (request.reporterId !== ctx.user.id && ctx.user.role !== "admin") throw new Error("Only the reporter can rate a resolution");
      await db.updateRequest(input.id, { satisfaction: input.satisfaction }); await db.addUpdate(input.id, ctx.user.id, "Resolution feedback received"); return { success: true };
    }),
  }),
  analytics: router({
    overview: protectedProcedure.query(async ({ ctx }) => {
      await requireAdministrator(ctx.user.id, ctx.user.role === "admin");
      const requests = await db.listRequestsForRole(ctx.user.id, "administrator", true);
      return computeAdminAnalytics(requests.map((item) => ({
        id: item.reference,
        title: item.title,
        location: item.location,
        team: item.team,
        priority: item.priority,
        status: item.status,
        slaDueAt: item.slaDueAt?.toISOString(),
      })));
    }),
  }),
});

export type AppRouter = typeof appRouter;
