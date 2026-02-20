import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { buildTrafficMetrics, generateTodaySensorData, generateWeeklySensorData } from "@/lib/admin-metrics";

export async function GET() {
  const session = getAdminSessionFromCookies();

  if (!session) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  return NextResponse.json({
    user: session.email,
    weekly: generateWeeklySensorData(),
    today: generateTodaySensorData(),
    traffic: buildTrafficMetrics(),
    generatedAt: new Date().toISOString(),
  });
}
