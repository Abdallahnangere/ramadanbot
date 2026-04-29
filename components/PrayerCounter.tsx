"use client";

import { useEffect, useMemo, useState } from "react";

type Prayer = {
  name: string;
  time: string;
};

const LAGOS_PRAYERS: Prayer[] = [
  { name: "Fajr", time: "05:34" },
  { name: "Dhuhr", time: "12:44" },
  { name: "Asr", time: "16:01" },
  { name: "Maghrib", time: "18:54" },
  { name: "Isha", time: "19:53" }
];

function toDate(time: string, base: Date): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

export default function PrayerCounter() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const next = useMemo(() => {
    for (const prayer of LAGOS_PRAYERS) {
      const dt = toDate(prayer.time, now);
      if (dt > now) return { ...prayer, dt };
    }
    const fajrTomorrow = toDate(LAGOS_PRAYERS[0].time, new Date(now.getTime() + 86400000));
    return { ...LAGOS_PRAYERS[0], dt: fajrTomorrow };
  }, [now]);

  const ms = Math.max(0, next.dt.getTime() - now.getTime());
  const total = Math.floor(ms / 1000);
  const hh = String(Math.floor(total / 3600)).padStart(2, "0");
  const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Live Prayer Counter</h3>
      <p className="muted" style={{ marginTop: 0 }}>
        Location: Lagos, Nigeria (live clock)
      </p>
      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2e5bff", marginBottom: "0.5rem" }}>
        {hh}:{mm}:{ss}
      </div>
      <div className="muted">
        Next prayer: <strong style={{ color: "#12203a" }}>{next.name}</strong> at{" "}
        <strong style={{ color: "#12203a" }}>{next.time}</strong>
      </div>
    </div>
  );
}
