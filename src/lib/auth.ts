import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import type { Role } from "./workflow";

const COOKIE = "brgy_session";
const SESSION_HOURS = 8;

