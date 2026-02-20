import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function POST() {
    // Clear the admin session cookie to log out the user
    clearAdminSessionCookie();
    return NextResponse.json({ ok: true });
}