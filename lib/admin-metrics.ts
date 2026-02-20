import { getTrafficSnapshot } from "@/lib/traffic-presence";

export type SensorPoint = {
  iso: string;
  temperature: number;
  humidity: number;
};

type SupabaseReading = {
  id: number;
  created_at: string;
  temperature: number;
  humidity: number;
};

const SUPABASE_URL =
  process.env.SUPABASE_SENSOR_URL ??
  "https://snfmmqbhnhhpsxikeprn.supabase.co/rest/v1/SensorReadings?select=*";
const SUPABASE_API_KEY =
  process.env.SUPABASE_SENSOR_API_KEY ??
  "sb_publishable_vMEhNtBhOcMMMmoUG-O_GQ__Oe8lKSU";

function toPoint(reading: SupabaseReading): SensorPoint {
  return {
    iso: reading.created_at,
    temperature: Number(reading.temperature),
    humidity: Number(reading.humidity),
  };
}

function sortByDate(points: SensorPoint[]) {
  return [...points].sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());
}

function groupByHour(points: SensorPoint[]) {
  const buckets = new Map<string, { tempTotal: number; humTotal: number; count: number }>();

  for (const point of points) {
    const date = new Date(point.iso);
    const key = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      0,
      0,
      0,
    ).toISOString();

    const current = buckets.get(key) ?? { tempTotal: 0, humTotal: 0, count: 0 };
    current.tempTotal += point.temperature;
    current.humTotal += point.humidity;
    current.count += 1;
    buckets.set(key, current);
  }

  return sortByDate(
    Array.from(buckets.entries()).map(([iso, value]) => ({
      iso,
      temperature: Number((value.tempTotal / value.count).toFixed(2)),
      humidity: Number((value.humTotal / value.count).toFixed(2)),
    })),
  );
}

export async function fetchSensorDashboardData() {
  const response = await fetch(SUPABASE_URL, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed (${response.status})`);
  }

  const payload = (await response.json()) as SupabaseReading[];
  const allPoints = sortByDate(payload.map(toPoint));

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  const weekly = groupByHour(allPoints.filter((point) => new Date(point.iso) >= weekAgo));
  const today = sortByDate(allPoints.filter((point) => new Date(point.iso) >= dayStart));

  return {
    weekly,
    today,
    traffic: getTrafficSnapshot(),
  };
}
