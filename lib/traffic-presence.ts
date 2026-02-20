type VisitorRecord = {
  firstSeen: number;
  lastSeen: number;
  path: string;
};

type TrafficStore = {
  visitors: Map<string, VisitorRecord>;
};

const VISITOR_TTL_MS = 1000 * 60 * 60 * 24 * 370;
const ACTIVE_WINDOW_MS = 1000 * 60 * 5;

function getStore(): TrafficStore {
  const globalStore = globalThis as typeof globalThis & { __trafficStore?: TrafficStore };

  if (!globalStore.__trafficStore) {
    globalStore.__trafficStore = { visitors: new Map() };
  }

  return globalStore.__trafficStore;
}

function cleanup(now: number) {
  const store = getStore();

  for (const [sessionId, visitor] of store.visitors.entries()) {
    if (now - visitor.lastSeen > VISITOR_TTL_MS) {
      store.visitors.delete(sessionId);
    }
  }
}

export function registerVisitorPing(sessionId: string, path: string, now = Date.now()) {
  const store = getStore();
  cleanup(now);

  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return;
  }

  const current = store.visitors.get(sessionId);

  if (!current) {
    store.visitors.set(sessionId, {
      firstSeen: now,
      lastSeen: now,
      path,
    });
    return;
  }

  store.visitors.set(sessionId, {
    ...current,
    lastSeen: now,
    path,
  });
}

export function getTrafficSnapshot(now = Date.now()) {
  const store = getStore();
  cleanup(now);

  let activeUsers = 0;
  let weeklyVisits = 0;
  let yearlyVisits = 0;

  for (const visitor of store.visitors.values()) {
    if (now - visitor.lastSeen <= ACTIVE_WINDOW_MS) {
      activeUsers += 1;
    }

    if (now - visitor.firstSeen <= 1000 * 60 * 60 * 24 * 7) {
      weeklyVisits += 1;
    }

    if (now - visitor.firstSeen <= 1000 * 60 * 60 * 24 * 365) {
      yearlyVisits += 1;
    }
  }

  return {
    activeUsers,
    weeklyVisits,
    yearlyVisits,
    conversionRate: yearlyVisits > 0 ? Number(((weeklyVisits / yearlyVisits) * 100).toFixed(2)) : 0,
  };
}
