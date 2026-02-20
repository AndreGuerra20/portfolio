import { NextRequest, NextResponse } from "next/server";
import { 
    clearLoginAttempts,
    createSession,
    isLoginBlocked,
    registerLoginFailure,
    setAdminSessionCookie,
    verifyAdminCredentials,
} from "@/lib/admin-auth";

function getClientIp(request: NextRequest) {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.ip ||
        "unknown"
    )
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);

    // Verify if the IP is currently blocked
    if (isLoginBlocked(ip)) {
        return NextResponse.json({ message: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
    }

    // Parse JSON body
    const body = await request.json().catch(() => null);

    // Validate input
    if (!body?.email || !body?.password) {
        return NextResponse.json({ message: "Email e password são obrigatórios." }, { status: 400 });
    }

    // Verify credentials
    const isValid = verifyAdminCredentials(body.email, body.password);

    if (!isValid) {
        registerLoginFailure(ip);
        return NextResponse.json({ message: "Credenciais inválidas." }, { status: 401 });
    }

    // Clear any previous failed attempts on successful login
    clearLoginAttempts(ip);

    // Create session and set cookie
    const sessionToken = createSession(body.email);
    setAdminSessionCookie(sessionToken);

    return NextResponse.json({ ok: true });
}

