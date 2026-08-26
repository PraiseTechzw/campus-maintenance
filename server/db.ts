import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertMaintenanceRequest, InsertUser, maintenanceRequests, maintenanceUpdates, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { name: values.name, email: values.email, loginMethod: values.loginMethod, lastSignedIn: values.lastSignedIn };
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

const teamFor = (category: InsertMaintenanceRequest["category"]) => category === "ICT" ? "ICT" : category === "Security" ? "Security" : "Physical Maintenance" as const;

export async function createRequest(input: Omit<InsertMaintenanceRequest, "reference" | "team">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(maintenanceRequests).values({ ...input, reference: `TMP-${Date.now()}`, team: teamFor(input.category) });
  const insertId = Number((result as unknown as { insertId: number }).insertId);
  const reference = `CM-${2400 + insertId}`;
  await db.update(maintenanceRequests).set({ reference }).where(eq(maintenanceRequests.id, insertId));
  await db.insert(maintenanceUpdates).values({ requestId: insertId, authorId: input.reporterId, action: input.category === "Security" ? "Security incident submitted" : "Request submitted" });
  return { id: insertId, reference };
}

export async function listRequests(userId: number, canSeeAll: boolean) {
  const db = await getDb();
  if (!db) return [];
  const rows = canSeeAll
    ? await db.select().from(maintenanceRequests).orderBy(desc(maintenanceRequests.updatedAt))
    : await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.reporterId, userId)).orderBy(desc(maintenanceRequests.updatedAt));
  const ids = rows.map((row) => row.id);
  const updates = ids.length ? await db.select().from(maintenanceUpdates).where(inArray(maintenanceUpdates.requestId, ids)).orderBy(desc(maintenanceUpdates.createdAt)) : [];
  return rows.map((row) => ({ ...row, updates: updates.filter((update) => update.requestId === row.id).reverse() }));
}

export async function updateRequest(id: number, changes: Partial<InsertMaintenanceRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(maintenanceRequests).set(changes).where(eq(maintenanceRequests.id, id));
}

export async function addUpdate(requestId: number, authorId: number, action: string, note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(maintenanceUpdates).values({ requestId, authorId, action, note: note ?? null });
}

export async function getRequest(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, id)).limit(1);
  return rows[0];
}
