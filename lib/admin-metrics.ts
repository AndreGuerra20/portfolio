// Sensor data type definition
export type SensorReading = {
    iso: string;
    temperature: number;
    humidity: number;
}

type SupabaseResponse = {
    id: number;
    created_at: string;
    temperature: number;
    humidity: number;
}

const SUPABASE_SENSOR_URL = process.env.SUPABASE_SENSOR_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

function toSensorData(data: SupabaseResponse): SensorReading {
    return {
        iso: data.created_at,
        temperature: Number(data.temperature),
        humidity: Number(data.humidity),
    };
}

function sortByDate(reads: SensorReading[]) {
    return [...reads].sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());
}

function groupByHour(reads: SensorReading[]) {
    const buckets = new Map<string, { tempTotal: number; humTotal: number; count: number }>();

  for (const read of reads) {
    const date = new Date(read.iso);
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
    current.tempTotal += read.temperature;
    current.humTotal += read.humidity;
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
    const response = await fetch(SUPABASE_SENSOR_URL!, {
        headers: {
            apikey: SUPABASE_API_KEY!,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Pedido a Supabase falhou: (${response.status})`);
    }

    const payload = (await response.json()) as SupabaseResponse[];
    const allReadings = sortByDate(payload.map(toSensorData));

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);

    const weeklyReadings = groupByHour(allReadings.filter((reading) => new Date(reading.iso) >= weekAgo));
    const dailyReadings = sortByDate(allReadings.filter((reading) => new Date(reading.iso) >= dayStart));

    return { weeklyReadings, dailyReadings };
}