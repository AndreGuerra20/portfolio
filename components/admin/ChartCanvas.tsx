"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart?: any;
  }
}

type ChartCanvasProps = {
  labels: string[];
  temperatureData: number[];
  humidityData: number[];
  title: string;
};

export function ChartCanvas({ labels, temperatureData, humidityData, title }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart) return;

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) return;

    const chart = new window.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Temperatura (°C)",
            data: temperatureData,
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34, 211, 238, 0.15)",
            borderWidth: 2,
            pointRadius: 1,
            tension: 0.35,
            fill: true,
          },
          {
            label: "Humidade (%)",
            data: humidityData,
            borderColor: "#a78bfa",
            backgroundColor: "rgba(167, 139, 250, 0.12)",
            borderWidth: 2,
            pointRadius: 1,
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#cbd5e1" },
          },
          title: {
            display: true,
            text: title,
            color: "#f8fafc",
          },
        },
        scales: {
          x: {
            ticks: { color: "#94a3b8", maxTicksLimit: 8 },
            grid: { color: "rgba(148, 163, 184, 0.15)" },
          },
          y: {
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(148, 163, 184, 0.15)" },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [labels, temperatureData, humidityData, title]);

  return <canvas ref={canvasRef} />;
}
