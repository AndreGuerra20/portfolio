export type SensorPoint = {
  iso: string;
  temperature: number;
  humidity: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function bounded(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function generateWeeklySensorData() {
  const now = new Date();
  const points: SensorPoint[] = [];

  for (let hourOffset = 7 * 24; hourOffset >= 0; hourOffset -= 2) {
    const date = new Date(now.getTime() - hourOffset * 60 * 60 * 1000);
    const seed = date.getHours() + date.getDate() * 31;

    const baseTemperature = 20 + Math.sin((date.getHours() / 24) * Math.PI * 2) * 4;
    const temperature = bounded(baseTemperature + seededRandom(seed) * 1.6, 14, 32);
    const humidity = bounded(55 + Math.cos((date.getHours() / 24) * Math.PI * 2) * 16 + seededRandom(seed + 11) * 4, 30, 85);

    points.push({
      iso: date.toISOString(),
      temperature: Number(temperature.toFixed(1)),
      humidity: Number(humidity.toFixed(1)),
    });
  }

  return points;
}

export function generateTodaySensorData() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const points: SensorPoint[] = [];

  for (let minuteOffset = 0; minuteOffset <= (now.getHours() * 60 + now.getMinutes()); minuteOffset += 30) {
    const date = new Date(start.getTime() + minuteOffset * 60 * 1000);
    const seed = minuteOffset + date.getDate() * 13;

    const variation = Math.sin((minuteOffset / (24 * 60)) * Math.PI * 2);
    const temperature = bounded(21 + variation * 4 + seededRandom(seed) * 1.3, 15, 33);
    const humidity = bounded(52 - variation * 7 + seededRandom(seed + 29) * 5, 25, 90);

    points.push({
      iso: date.toISOString(),
      temperature: Number(temperature.toFixed(1)),
      humidity: Number(humidity.toFixed(1)),
    });
  }

  return points;
}

export function buildTrafficMetrics() {
  const activeUsers = 4 + Math.floor(Math.random() * 19);
  const weeklyVisits = 820 + Math.floor(Math.random() * 1200);
  const yearlyVisits = 35000 + Math.floor(Math.random() * 48000);
  const conversionRate = Number((1.6 + Math.random() * 2.8).toFixed(2));

  return {
    activeUsers,
    weeklyVisits,
    yearlyVisits,
    conversionRate,
  };
}
