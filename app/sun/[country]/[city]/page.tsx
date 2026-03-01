"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCityBySlug,
  getAllCountrySlugs,
  getCitiesByCountry,
} from "@/lib/cities";
import {
  getSunTimes,
  getMonthlyData,
  formatTime12,
  formatDayLength,
} from "@/lib/sunCalculations";
import { getTimezoneOffset } from "@/lib/cities";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

interface Props {
  params: { country: string; city: string };
}

export async function generateStaticParams() {
  const params: { country: string; city: string }[] = [];
  for (const countrySlug of getAllCountrySlugs()) {
    const cities = getCitiesByCountry(countrySlug);
    for (const city of cities) {
      params.push({ country: countrySlug, city: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.country, params.city);
  if (!city) return {};

  const now = new Date();
  const offset = getTimezoneOffset(city.timezone, now);
  const times = getSunTimes(now, city.lat, city.lng, offset);
  const sunrise = formatTime12(times.sunrise);
  const sunset = formatTime12(times.sunset);

  const locationStr = city.state ? `${city.name}, ${city.state}` : city.name;

  return {
    title: `Sunrise & Sunset Times in ${locationStr} Today`,
    description: `Today's sunrise in ${city.name} is ${sunrise} and sunset is ${sunset}. Day length: ${formatDayLength(times.dayLength)}. Includes golden hour, twilight times, and monthly sun calendar.`,
    openGraph: {
      title: `Sunrise & Sunset in ${locationStr}`,
      description: `Sunrise: ${sunrise} · Sunset: ${sunset} · Day length: ${formatDayLength(times.dayLength)}`,
    },
  };
}

function TwilightBar({ times }: { times: ReturnType<typeof getSunTimes> }) {
  // Represent a 24-hour day as a percentage bar
  const toPercent = (date: Date | null) => {
    if (!date) return 0;
    return ((date.getUTCHours() * 60 + date.getUTCMinutes()) / 1440) * 100;
  };

  const phases = [
    { start: 0, end: toPercent(times.astronomicalDawn), color: "#061220", label: "Night" },
    { start: toPercent(times.astronomicalDawn), end: toPercent(times.nauticalDawn), color: "#1a2f45", label: "Astro" },
    { start: toPercent(times.nauticalDawn), end: toPercent(times.civilDawn), color: "#2d5a7b", label: "Nautical" },
    { start: toPercent(times.civilDawn), end: toPercent(times.sunrise), color: "#4a8fa8", label: "Civil" },
    { start: toPercent(times.sunrise), end: toPercent(times.goldenHourMorningEnd), color: "#f5a623", label: "Golden" },
    { start: toPercent(times.goldenHourMorningEnd), end: toPercent(times.goldenHourEveningStart), color: "#87ceeb", label: "Day" },
    { start: toPercent(times.goldenHourEveningStart), end: toPercent(times.sunset), color: "#f5a623", label: "Golden" },
    { start: toPercent(times.sunset), end: toPercent(times.civilDusk), color: "#4a8fa8", label: "Civil" },
    { start: toPercent(times.civilDusk), end: toPercent(times.nauticalDusk), color: "#2d5a7b", label: "Nautical" },
    { start: toPercent(times.nauticalDusk), end: toPercent(times.astronomicalDusk), color: "#1a2f45", label: "Astro" },
    { start: toPercent(times.astronomicalDusk), end: 100, color: "#061220", label: "Night" },
  ];

  return (
    <div style={{ width: "100%", height: "40px", borderRadius: "8px", overflow: "hidden", display: "flex", marginBottom: "8px" }}>
      {phases.map((phase, i) => (
        <div
          key={i}
          style={{
            background: phase.color,
            width: `${Math.max(0, phase.end - phase.start)}%`,
            height: "100%",
            transition: "width 0.3s",
          }}
          title={phase.label}
        />
      ))}
    </div>
  );
}

function TimeCard({ icon, label, time, color = "#f5a623" }: { icon: string; label: string; time: string; color?: string }) {
  return (
    <div className="glass-card" style={{ padding: "20px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{icon}</div>
      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color, fontWeight: 600 }}>{time}</div>
    </div>
  );
}

export default function CityPage({ params }: Props) {
  const city = getCityBySlug(params.country, params.city);
  if (!city) notFound();

  const now = new Date();
  const offset = getTimezoneOffset(city.timezone, now);
  const times = getSunTimes(now, city.lat, city.lng, offset);

  // Monthly data for calendar
  const monthlyData = getMonthlyData(
    now.getFullYear(),
    now.getMonth(),
    city.lat,
    city.lng,
    offset
  );

  const monthName = now.toLocaleString("en-US", { month: "long" });
  const locationStr = city.state ? `${city.name}, ${city.state}` : `${city.name}, ${city.country}`;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #061220 0%, #0a1628 100%)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href={`/sun/${city.countrySlug}`} style={{ color: "inherit", textDecoration: "none" }}>{city.country}</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>{city.name}</span>
        </nav>

        {/* Hero */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            color: "white",
            marginBottom: "6px",
            fontWeight: 600,
            lineHeight: 1.2
          }}>
            Sunrise &amp; Sunset in{" "}
            <span style={{ color: "#f5a623", fontStyle: "italic" }}>{city.name}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
            {locationStr} · Today, {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Main times grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "32px"
        }}>
          <TimeCard icon="🌅" label="Sunrise" time={formatTime12(times.sunrise)} color="#f5a623" />
          <TimeCard icon="🌇" label="Sunset" time={formatTime12(times.sunset)} color="#ff6b35" />
          <TimeCard icon="☀️" label="Solar Noon" time={formatTime12(times.solarNoon)} color="#87ceeb" />
          <TimeCard icon="⏱️" label="Day Length" time={formatDayLength(times.dayLength)} color="#a8d8f0" />
        </div>

        {/* Twilight bar */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "white", marginBottom: "16px", fontWeight: 300 }}>
            Today's Light Timeline
          </h2>
          <TwilightBar times={times} />
          {/* Hour labels */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>
            {["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.75rem" }}>
            {[
              { color: "#061220", label: "Night" },
              { color: "#1a2f45", label: "Astronomical" },
              { color: "#2d5a7b", label: "Nautical" },
              { color: "#4a8fa8", label: "Civil" },
              { color: "#f5a623", label: "Golden Hour" },
              { color: "#87ceeb", label: "Daylight" },
            ].map((p) => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.6)" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: p.color, border: "1px solid rgba(255,255,255,0.2)" }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Twilight & Golden Hour detail */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
          {/* Golden Hour */}
          <div className="glass-card" style={{ padding: "24px", borderColor: "rgba(245,166,35,0.2)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#f5a623", marginBottom: "16px", fontWeight: 400 }}>
              ✨ Golden Hour
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>Morning</div>
                <div style={{ color: "white" }}>{formatTime12(times.sunrise)} — {formatTime12(times.goldenHourMorningEnd)}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>Evening</div>
                <div style={{ color: "white" }}>{formatTime12(times.goldenHourEveningStart)} — {formatTime12(times.sunset)}</div>
              </div>
            </div>
          </div>

          {/* Twilight detail */}
          <div className="glass-card" style={{ padding: "24px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "white", marginBottom: "16px", fontWeight: 400 }}>
              🌆 Twilight
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#4a8fa8" }}>Civil</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{formatTime12(times.civilDawn)} / {formatTime12(times.civilDusk)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#2d5a7b" }}>Nautical</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{formatTime12(times.nauticalDawn)} / {formatTime12(times.nauticalDusk)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#1a2f45" }}>Astronomical</span>
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{formatTime12(times.astronomicalDawn)} / {formatTime12(times.astronomicalDusk)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "white", marginBottom: "24px", fontWeight: 300 }}>
            📅 {monthName} {now.getFullYear()} — Sun Calendar
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 400 }}>Date</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 400 }}>🌅 Sunrise</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 400 }}>🌇 Sunset</th>
                  <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 400 }}>⏱️ Day Length</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map(({ date, times: t }, i) => {
                  const isToday = date.getUTCDate() === now.getDate();
                  return (
                    <tr
                      key={i}
                      style={{
                        background: isToday ? "rgba(245,166,35,0.08)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td style={{ padding: "10px 12px", color: isToday ? "#f5a623" : "rgba(255,255,255,0.8)", fontWeight: isToday ? 600 : 400 }}>
                        {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
                        {isToday && <span style={{ fontSize: "0.7rem", marginLeft: "6px", background: "#f5a623", color: "#061220", borderRadius: "4px", padding: "1px 5px" }}>TODAY</span>}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "rgba(255,255,255,0.7)" }}>{formatTime12(t.sunrise)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "rgba(255,255,255,0.7)" }}>{formatTime12(t.sunset)}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>{formatDayLength(t.dayLength)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO text block */}
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", fontWeight: 300, marginBottom: "10px" }}>
            About Sunrise &amp; Sunset in {city.name}
          </h2>
          <p>
            Today in {locationStr}, the sun rises at {formatTime12(times.sunrise)} and sets at {formatTime12(times.sunset)},
            giving {formatDayLength(times.dayLength)} of daylight. Solar noon — when the sun reaches its highest point in the sky — occurs at {formatTime12(times.solarNoon)}.
          </p>
          <p style={{ marginTop: "10px" }}>
            The golden hour for photographers begins at sunrise and lasts until {formatTime12(times.goldenHourMorningEnd)} in the morning,
            and resumes from {formatTime12(times.goldenHourEveningStart)} until sunset in the evening.
            Civil twilight begins at {formatTime12(times.civilDawn)} — when there is enough light for outdoor activities without artificial lighting.
          </p>
        </div>

        {/* Coordinates */}
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          {city.name} · {city.lat.toFixed(4)}°N, {city.lng.toFixed(4)}°E · Timezone: {city.timezone}
        </div>
      </div>
    </div>
  );
}
