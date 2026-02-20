export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminSessionFromCookie } from "@/lib/admin-auth";
import { fetchSensorDashboardData } from "@/lib/admin-metrics";

export async function GET() {
    const session = getAdminSessionFromCookie();

    if (!session) {
        return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    try {
        const metrics = await fetchSensorDashboardData();
        return NextResponse.json({
            user: session.email,
            weekly: metrics.weeklyReadings,
            today: metrics.dailyReadings,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Erro ao carregar os dados da supabase:", error);
        return NextResponse.json({ message: "Falha ao obter os dados de sensores na supabase." }, { status: 502 });
    };
}