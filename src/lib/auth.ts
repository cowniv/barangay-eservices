import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import type { Role } from "./workflow";

const COOKIE = "brgy_session";
const SESSION_HOURS = 8;

export type StaffUser = { id: string; name: string; username: string; role: Role };

export async function createSession(staffId: string) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600_000);
  await db.session.create({ data: { id, staffId, expiresAt } });
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (id) await db.session.deleteMany({ where: { id } });
  jar.delete(COOKIE);
}

export async function getStaff(): Promise<StaffUser | null> {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id) return null;
  const session = await db.session.findUnique({ where: { id }, include: { staff: true } });
  if (!session || session.expiresAt < new Date()) return null;
  const { staff } = session;
  return { id: staff.id, name: staff.name, username: staff.username, role: staff.role as Role };
}

export async function requireStaff(): Promise<StaffUser> {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  return staff;
}
