import crypto from "crypto";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "./admin-constants";

const SESSION_DURATION_MS = 60 * 60 * 1000 * 3; // 3 hour
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 min

const attempts = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>();

function getSecret() {
    return process.env.ADMIN_SESSION_SECRET;
}

function getAdminEmail() {
    return process.env.ADMIN_EMAIL;
}

function getAdminPassword() {
    return process.env.ADMIN_PASSWORD;
}

function timingSafeEqualString(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function encodeBase64(payload: object) {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodeBase64<T>(value: string) {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf-8")) as T;
}

function sign(value: string) {
    const secret = getSecret();
    if (!secret) {
        throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
    }
    return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function isLoginBlocked(ip: string) {
    const current = attempts.get(ip);
    
    // If there's no record or the lockout has expired, allow login attempts
    if (!current) return false;
    if (!current.lockedUntil) return false;

    // If the lockout is still active, block login attempts
    if (current.lockedUntil <= Date.now()) {
        attempts.delete(ip);
        return false;
    }
    return true;
}

export function registerLoginFailure(ip: string) {
    const now = Date.now();
    const current = attempts.get(ip);

    // If there's no record or the lockout has expired, start fresh
    if (!current || now - current.firstAttempt > LOCKOUT_DURATION_MS) {
        attempts.set(ip, { count: 1, firstAttempt: now });
        return;
    }

    current.count += 1;

    // If max attempts reached, set lockout
    if (current.count >= MAX_FAILED_ATTEMPTS) {
        current.lockedUntil = now + LOCKOUT_DURATION_MS;
    }

    attempts.set(ip, current);
}

export function clearLoginAttempts(ip: string) {
    attempts.delete(ip);
}

export function verifyAdminCredentials(email: string, password: string) {
    const AdminEmail = getAdminEmail();
    const AdminPassword = getAdminPassword();
    if (!AdminEmail || !AdminPassword) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set");
    }
    return timingSafeEqualString(email, AdminEmail) && timingSafeEqualString(password, AdminPassword);
}

export function createSession(email: string) {
    const payload = {
        email,
        exp: Date.now() + SESSION_DURATION_MS,
    };
    const encoded = encodeBase64(payload);
    const signature = sign(encoded);
    return `${encoded}.${signature}`;
}

export function verifySession(token?: string | null) {
    // Basic format check
    if (!token || !token.includes(".")) return null;

    // Decode and verify signature 
    const [encoded, signature] = token.split(".");
    const expectedSignature = sign(encoded);

    if (!timingSafeEqualString(signature, expectedSignature)) {
        return null;
    }

    // Decode payload and check expiration
    try {
        const payload = decodeBase64<{ email: string; exp: number }>(encoded);
        if (payload.exp < Date.now()) {
            return null; // Session expired
        }
        return payload;
    } catch {
        return null; // Invalid token format
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

export function getAdminSessionFromCookie() {
    const token = cookies().get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
}