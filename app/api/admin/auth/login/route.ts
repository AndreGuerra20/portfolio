import { NextRequest, NextResponse } from "next/server";
import {
  clearLoginFailures,
  createSessionToken,
  isLoginBlocked,
  registerLoginFailure,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.ip ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isLoginBlocked(ip)) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tenta novamente em alguns minutos." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Email e password são obrigatórios." }, { status: 400 });
  }

  const isValid = verifyAdminCredentials(body.email, body.password);

  if (!isValid) {
    registerLoginFailure(ip);
    return NextResponse.json({ message: "Credenciais inválidas." }, { status: 401 });
  }

  clearLoginFailures(ip);
  const token = createSessionToken(body.email);
  setAdminSessionCookie(token);

  return NextResponse.json({ ok: true });
}
