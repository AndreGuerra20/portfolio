import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { registerVisitorPing } from "@/lib/traffic-presence";

const VISITOR_COOKIE = "visitor_session_id";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body.path === "string" ? body.path : "/";

  let sessionId = request.cookies.get(VISITOR_COOKIE)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }

  registerVisitorPing(sessionId, path);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(VISITOR_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
