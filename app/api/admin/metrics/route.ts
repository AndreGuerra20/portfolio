export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { fetchSensorDashboardData } from "@/lib/admin-metrics";

export async function GET() {
  const session = getAdminSessionFromCookies();

  if (!session) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const metrics = await fetchSensorDashboardData();

    return NextResponse.json({
      user: session.email,
      weekly: metrics.weekly,
      today: metrics.today,
      traffic: metrics.traffic,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao carregar dados do Supabase", error);
    return NextResponse.json(
      { message: "Falha ao obter dados de sensores no Supabase." },
      { status: 502 },
    );
  }
}
