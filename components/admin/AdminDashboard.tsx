"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChartCanvas } from "@/components/admin/ChartCanvas";

type SensorPoint = {
  iso: string;
  temperature: number;
  humidity: number;
};

type DashboardPayload = {
  user: string;
  weekly: SensorPoint[];
  today: SensorPoint[];
  traffic: {
    activeUsers: number;
    weeklyVisits: number;
    yearlyVisits: number;
    conversionRate: number;
  };
  generatedAt: string;
};

export function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [loadedChartJs, setLoadedChartJs] = useState(false);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({ message: "Erro ao carregar métricas." }));
          throw new Error(payload.message);
        }

        return response.json();
      })
      .then((payload: DashboardPayload) => setData(payload))
      .catch((fetchError: Error) => setError(fetchError.message));
  }, []);

  const weeklyChart = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.weekly.map((point) => new Date(point.iso).toLocaleDateString("pt-PT", { weekday: "short", day: "2-digit", hour: "2-digit" })),
      temperatureData: data.weekly.map((point) => point.temperature),
      humidityData: data.weekly.map((point) => point.humidity),
    };
  }, [data]);

  const todayChart = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.today.map((point) => new Date(point.iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })),
      temperatureData: data.today.map((point) => point.temperature),
      humidityData: data.today.map((point) => point.humidity),
    };
  }, [data]);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="afterInteractive" onLoad={() => setLoadedChartJs(true)} />

      <header className="mx-auto flex w-full max-w-7xl flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-400">Área de administração</p>
          <h1 className="mt-1 text-3xl font-semibold">Dashboard do portfolio</h1>
          <p className="mt-2 text-sm text-slate-400">Sessão autenticada como {adminEmail}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400 hover:text-rose-300"
        >
          Terminar sessão
        </button>
      </header>

      {error ? <p className="mx-auto mt-8 w-full max-w-7xl rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-300">{error}</p> : null}

      {!data ? <p className="mx-auto mt-8 w-full max-w-7xl text-slate-400">A carregar métricas...</p> : null}

      {data ? (
        <section className="mx-auto mt-8 grid w-full max-w-7xl gap-4 md:grid-cols-4">
          <MetricCard label="Utilizadores ativos" value={String(data.traffic.activeUsers)} highlight="Agora" />
          <MetricCard label="Visitas semanais" value={data.traffic.weeklyVisits.toLocaleString("pt-PT")} highlight="Últimos 7 dias" />
          <MetricCard label="Visitas anuais" value={data.traffic.yearlyVisits.toLocaleString("pt-PT")} highlight="Últimos 12 meses" />
          <MetricCard label="Taxa de conversão" value={`${data.traffic.conversionRate}%`} highlight="Sessões -> contacto" />
        </section>
      ) : null}

      {data && loadedChartJs && weeklyChart && todayChart ? (
        <section className="mx-auto mt-6 grid w-full max-w-7xl gap-6 lg:grid-cols-2">
          <article className="h-[380px] rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <ChartCanvas
              labels={weeklyChart.labels}
              temperatureData={weeklyChart.temperatureData}
              humidityData={weeklyChart.humidityData}
              title="Temperatura e humidade - últimos 7 dias"
            />
          </article>
          <article className="h-[380px] rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <ChartCanvas
              labels={todayChart.labels}
              temperatureData={todayChart.temperatureData}
              humidityData={todayChart.humidityData}
              title="Detalhe do dia atual"
            />
          </article>
        </section>
      ) : null}

      {!loadedChartJs ? <p className="mx-auto mt-4 w-full max-w-7xl text-xs text-amber-300">A carregar Chart.js...</p> : null}
    </main>
  );
}

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight: string }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-cyan-300">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{highlight}</p>
    </article>
  );
}
