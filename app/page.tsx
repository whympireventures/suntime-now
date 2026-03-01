"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchCities, getPopularCities, type City } from "@/lib/cities";
import { getSunTimes, formatTime12, formatDayLength, getTimezoneOffset } from "@/lib/sunCalculations";

function SunTimesDisplay({ lat, lng, timezone, cityName }: { lat: number; lng: number; timezone: string; cityName: string }) {
  const now = new Date();
  const offset = getTimezoneOffset(timezone, now);
  const times = getSunTimes(now, lat, lng, offset);

  return (
    <div className="glass-card fade-up fade-up-delay-2" style={{ padding: "24px 32px", marginTop: "24px", textAlign: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "8px" }}>
        📍 {cityName} — Today
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sunrise</div>
          <div className="time-display">{formatTime12(times.sunrise)}</div>
        </div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sunset</div>
          <div className="time-display" style={{ color: "#ff6b35" }}>{formatTime12(times.sunset)}</div>
        </div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Daylight</div>
          <div className="time-display" style={{ color: "#87ceeb", fontSize: "2rem" }}>{formatDayLength(times.dayLength)}</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string; timezone: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const popularCities = getPopularCities(12);

  // Search
  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchCities(query));
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  // Auto-detect location
  const detectLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use reverse geocoding via a free API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Your Location";
          const country = data.address?.country || "";
          setUserLocation({ lat: latitude, lng: longitude, name: `${city}, ${country}`, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        } catch {
          setUserLocation({ lat: latitude, lng: longitude, name: "Your Location", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
        }
        setLocationLoading(false);
      },
      () => setLocationLoading(false)
    );
  };

  const selectCity = (city: City) => {
    router.push(`/sun/${city.countrySlug}/${city.slug}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #061220 0%, #0f2035 50%, #0a1628 100%)" }}>
      {/* Hero */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        {/* Live sun indicator */}
        <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "100px", padding: "6px 16px", marginBottom: "32px", fontSize: "0.875rem", color: "#f5a623" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f5a623", animation: "pulse-glow 2s infinite" }}></span>
          Live sun data for 50,000+ cities
        </div>

        <h1 className="fade-up fade-up-delay-1" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 600,
          lineHeight: 1.1,
          marginBottom: "16px",
          color: "white"
        }}>
          When does the sun{" "}
          <span style={{ color: "#f5a623", fontStyle: "italic" }}>rise & set</span>{" "}
          today?
        </h1>

        <p className="fade-up fade-up-delay-2" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.125rem", marginBottom: "40px" }}>
          Precise sunrise, sunset, golden hour and twilight times for any city in the world.
        </p>

        {/* Search */}
        <div className="fade-up fade-up-delay-2" style={{ position: "relative", maxWidth: "520px", margin: "0 auto 16px" }}>
          <input
            className="search-input"
            type="text"
            placeholder="Search any city, e.g. Miami, London, Tokyo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            style={{ paddingRight: "48px" }}
          />
          <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem", pointerEvents: "none" }}>🔍</span>

          {showDropdown && results.length > 0 && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "#0f2035",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              overflow: "hidden",
              zIndex: 100,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
            }}>
              {results.map((city) => (
                <button
                  key={city.id}
                  onMouseDown={() => selectCity(city)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,166,35,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>
                    {city.name}
                    {city.state && <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: "6px", fontSize: "0.875rem" }}>{city.state}</span>}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>{city.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detect location */}
        <button
          onClick={detectLocation}
          disabled={locationLoading}
          className="fade-up fade-up-delay-3"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.6)",
            borderRadius: "100px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "0.875rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f5a623"; e.currentTarget.style.color = "#f5a623"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          {locationLoading ? "⏳ Detecting..." : "📍 Use my location"}
        </button>

        {/* User location result */}
        {userLocation && (
          <SunTimesDisplay
            lat={userLocation.lat}
            lng={userLocation.lng}
            timezone={userLocation.timezone}
            cityName={userLocation.name}
          />
        )}
      </div>

      {/* Popular Cities */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          color: "rgba(255,255,255,0.8)",
          marginBottom: "24px",
          fontWeight: 300,
        }}>
          Popular cities
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px"
        }}>
          {popularCities.map((city) => {
            const now = new Date();
            const offset = getTimezoneOffset(city.timezone, now);
            const times = getSunTimes(now, city.lat, city.lng, offset);
            return (
              <Link
                key={city.id}
                href={`/sun/${city.countrySlug}/${city.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div className="glass-card" style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s",
                  display: "block",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,166,35,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                >
                  <div style={{ fontWeight: 500, color: "white", marginBottom: "4px" }}>{city.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>{city.country}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span>🌅 {formatTime12(times.sunrise)}</span>
                    <span>🌇 {formatTime12(times.sunset)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Feature callouts */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {[
            { icon: "🌅", title: "Sunrise & Sunset", desc: "Precise times down to the minute for every city, every day" },
            { icon: "✨", title: "Golden Hour", desc: "Perfect timing for photographers — warm light windows morning and evening" },
            { icon: "🌙", title: "Twilight Phases", desc: "Civil, nautical and astronomical twilight for hunters, fishermen and pilots" },
            { icon: "📅", title: "Monthly Calendar", desc: "Full month view showing how daylight changes throughout the month" },
          ].map((f) => (
            <div key={f.title} className="glass-card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "6px", color: "white" }}>{f.title}</div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
