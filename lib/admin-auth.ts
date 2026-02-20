import crypto from "crypto";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/admin-constants";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;
const MAX_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 1000 * 60 * 15;

const attempts = new Map<string, { count: number; firstAttemptAt: number; lockedUntil?: number }>();

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "change-me-in-production";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "admin@portfolio.local";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "ChangeThisPassword123!";
}

function timingSafeEqualString(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function encode(payload: object) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decode<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function isLoginBlocked(ip: string) {
  const current = attempts.get(ip);

  if (!current) return false;
  if (!current.lockedUntil) return false;

  if (current.lockedUntil <= Date.now()) {
    attempts.delete(ip);
    return false;
  }

  return true;
}

export function registerLoginFailure(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);

  if (!current || now - current.firstAttemptAt > LOCK_WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttemptAt: now });
    return;
  }

  current.count += 1;

  if (current.count >= MAX_ATTEMPTS) {
    current.lockedUntil = now + LOCK_WINDOW_MS;
  }

  attempts.set(ip, current);
}

export function clearLoginFailures(ip: string) {
  attempts.delete(ip);
}

export function verifyAdminCredentials(email: string, password: string) {
  return timingSafeEqualString(email, getAdminEmail()) && timingSafeEqualString(password, getAdminPassword());
}

export function createSessionToken(email: string) {
  const payload = {
    email,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const encoded = encode(payload);
  const signature = sign(encoded);

  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token || !token.includes(".")) return null;

  const [encoded, receivedSignature] = token.split(".");
  const expectedSignature = sign(encoded);

  if (!timingSafeEqualString(receivedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = decode<{ email: string; exp: number }>(encoded);

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export function clearAdminSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function getAdminSessionFromCookies() {
  const token = cookies().get(COOKIE_NAME)?.value;

  return verifySessionToken(token);
}

