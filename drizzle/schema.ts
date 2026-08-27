import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const maintenanceRequests = mysqlTable("maintenance_requests", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  reporterId: int("reporterId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["ICT", "Plumbing", "Electrical", "Building", "Cleaning", "Security"]).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priority: mysqlEnum("priority", ["Low", "Medium", "High", "Urgent"]).notNull(),
  status: mysqlEnum("status", ["Submitted", "Assigned", "In Progress", "Resolved"]).default("Submitted").notNull(),
  team: mysqlEnum("team", ["ICT", "Physical Maintenance", "Security"]).notNull(),
  assigneeName: varchar("assigneeName", { length: 160 }),
  assigneeUserId: int("assigneeUserId"),
  arrivalTime: varchar("arrivalTime", { length: 80 }),
  slaDueAt: timestamp("slaDueAt"),
  attachmentKey: varchar("attachmentKey", { length: 512 }),
  attachmentUrl: text("attachmentUrl"),
  acknowledged: boolean("acknowledged").default(false).notNull(),
  satisfaction: int("satisfaction"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const maintenanceUpdates = mysqlTable("maintenance_updates", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  authorId: int("authorId").notNull(),
  action: varchar("action", { length: 160 }).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const campusUserProfiles = mysqlTable("campus_user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  operationalRole: varchar("operationalRole", { length: 32 }).default("student").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  assignments: boolean("assignments").default(true).notNull(),
  arrivals: boolean("arrivals").default(true).notNull(),
  urgent: boolean("urgent").default(true).notNull(),
  resolutions: boolean("resolutions").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const campusBuildings = mysqlTable("campus_buildings", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  area: varchar("area", { length: 160 }),
  latitude: varchar("latitude", { length: 32 }).notNull(),
  longitude: varchar("longitude", { length: 32 }).notNull(),
  accessNote: text("accessNote"),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const campusSlaPolicies = mysqlTable("campus_sla_policies", {
  id: int("id").autoincrement().primaryKey(),
  priority: varchar("priority", { length: 16 }).notNull().unique(),
  targetHours: int("targetHours").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const campusStaffPermissions = mysqlTable("campus_staff_permissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  manageUsers: boolean("manageUsers").default(false).notNull(),
  manageRequests: boolean("manageRequests").default(false).notNull(),
  manageLocations: boolean("manageLocations").default(false).notNull(),
  manageServiceLevels: boolean("manageServiceLevels").default(false).notNull(),
  manageEscalations: boolean("manageEscalations").default(false).notNull(),
  viewAnalytics: boolean("viewAnalytics").default(false).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const campusEscalationRules = mysqlTable("campus_escalation_rules", {
  id: int("id").autoincrement().primaryKey(),
  priority: varchar("priority", { length: 16 }).notNull().unique(),
  thresholdMinutes: int("thresholdMinutes").notNull(),
  notifyRole: varchar("notifyRole", { length: 32 }).notNull(),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MaintenanceRequestRecord = typeof maintenanceRequests.$inferSelect;
export type MaintenanceUpdateRecord = typeof maintenanceUpdates.$inferSelect;
export type InsertMaintenanceRequest = typeof maintenanceRequests.$inferInsert;
export type CampusUserProfile = typeof campusUserProfiles.$inferSelect;
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type CampusBuilding = typeof campusBuildings.$inferSelect;
export type CampusSlaPolicy = typeof campusSlaPolicies.$inferSelect;
export type CampusStaffPermission = typeof campusStaffPermissions.$inferSelect;
export type CampusEscalationRule = typeof campusEscalationRules.$inferSelect;
