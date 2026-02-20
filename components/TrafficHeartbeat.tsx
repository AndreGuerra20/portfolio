"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/base-path";

const PING_INTERVAL_MS = 1000 * 60;

export function TrafficHeartbeat() {
  useEffect(() => {
    async function ping() {
      await fetch(withBasePath("/api/traffic/ping"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: window.location.pathname }),
        keepalive: true,
      }).catch(() => null);
    }

    ping();
    const interval = window.setInterval(ping, PING_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        ping();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
