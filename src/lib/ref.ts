import { randomBytes } from "node:crypto";

// No 0/O/1/I so people don't misread it over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newReference(date = new Date()): string {
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `BRGY-${date.getFullYear()}-${code}`;
