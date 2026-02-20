"use client";

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChartCanvas } from "@/components/admin/ChartCanvas";
import { AUTH_KEY } from "@/lib/admin-auth";

type SensorPoint = {
  iso: string;
  temperature: number;
  humidity: number;
};

type DashboardPayload = {
  weekly: SensorPoint[];
  today: SensorPoint[];
};

type SupabaseReading = {
  created_at: string;
  temperature: number;
  humidity: number;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_SENSOR_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

function buildPayload(readings: SupabaseReading[]): DashboardPayload {
  const points = readings
    .map((reading) => ({
      iso: reading.created_at,
      temperature: Number(reading.temperature),
      humidity: Number(reading.humidity),
    }))
    .sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  return {
    weekly: points.filter((p) => new Date(p.iso) >= weekAgo),
    today: points.filter((p) => new Date(p.iso) >= dayStart),
  };
}

export function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [loadedChartJs, setLoadedChartJs] = useState(false);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const missingEnv = !SUPABASE_URL || !SUPABASE_KEY;

  useEffect(() => {
    if (missingEnv) {
      setError("Variáveis de ambiente SUPABASE_SENSOR_URL e SUPABASE_API_KEY não foram configuradas.");
      return;
    }

    let cancelled = false;

    fetch(SUPABASE_URL!, {
      headers: { apikey: SUPABASE_KEY! },
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Erro ao carregar dados de sensores.");
        return (await response.json()) as SupabaseReading[];
      })
      .then((readings) => {
        if (!cancelled) setData(buildPayload(readings));
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [missingEnv]);

  const weeklyChart = useMemo(() => {
    if (!data) return null;
    return {
      labels: data.weekly.map((p) =>
        new Date(p.iso).toLocaleString("pt-PT", { weekday: "short", day: "2-digit", hour: "2-digit" })
      ),
      temperatureData: data.weekly.map((p) => p.temperature),
      humidityData: data.weekly.map((p) => p.humidity),
    };
  }, [data]);

  const todayChart = useMemo(() => {
    if (!data) return null;
    return {
      labels: data.today.map((p) =>
        new Date(p.iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
      ),
      temperatureData: data.today.map((p) => p.temperature),
      humidityData: data.today.map((p) => p.humidity),
    };
  }, [data]);

  function logout() {
    window.localStorage.removeItem(AUTH_KEY);
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="afterInteractive"
        onLoad={() => setLoadedChartJs(true)}
      />

      <header className="mx-auto flex w-full max-w-7xl flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-400">Área de administração</p>
          <h1 className="mt-1 text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Sessão autenticada com o email: {adminEmail}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400 hover:text-rose-300"
        >
          Terminar sessão
        </button>
      </header>

      {missingEnv ? (
        <p className="mx-auto mt-8 w-full max-w-7xl rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
          Variáveis de ambiente SUPABASE_SENSOR_URL e SUPABASE_API_KEY não foram configuradas.
        </p>
      ) : null}

      {error ? (
        <p className="mx-auto mt-8 w-full max-w-7xl rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-rose-300">
          {error}
        </p>
      ) : null}

      {!data && !missingEnv ? (
        <p className="mx-auto mt-8 w-full max-w-7xl text-slate-400">A carregar métricas...</p>
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
              title="Temperatura e Humidade - últimas 24 horas"
            />
          </article>
        </section>
      ) : null}

      {!loadedChartJs ? (
        <p className="mx-auto mt-4 w-full max-w-7xl text-xs text-amber-300">A carregar Chart.js</p>
      ) : null}
    </main>
  );
}