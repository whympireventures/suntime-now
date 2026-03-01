import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCitiesByCountry, getAllCountrySlugs, fromSlug } from "@/lib/cities";
import { getSunTimes, formatTime12, getTimezoneOffset } from "@/lib/sunCalculations";

interface Props {
  params: { country: string };
}

export async function generateStaticParams() {
  return getAllCountrySlugs().map((countrySlug) => ({ country: countrySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const countryName = fromSlug(params.country);
  return {
    title: `Sunrise & Sunset Times in ${countryName}`,
    description: `Find today's sunrise and sunset times for cities in ${countryName}. Includes golden hour, twilight, and monthly sun calendars.`,
  };
}

export default function CountryPage({ params }: Props) {
  const cities = getCitiesByCountry(params.country);
  if (cities.length === 0) notFound();

  const countryName = cities[0].country;
  const now = new Date();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #061220 0%, #0a1628 100%)" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "60px 24px" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>{countryName}</span>
        </nav>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: "white",
          marginBottom: "8px",
          fontWeight: 600
        }}>
          Sunrise & Sunset Times in{" "}
          <span style={{ color: "#f5a623", fontStyle: "italic" }}>{countryName}</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "48px", fontSize: "1.1rem" }}>
          Today's sun times for {cities.length} cities
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "12px"
        }}>
          {cities.map((city) => {
            const offset = getTimezoneOffset(city.timezone, now);
            const times = getSunTimes(now, city.lat, city.lng, offset);
            return (
              <Link
                key={city.id}
                href={`/sun/${city.countrySlug}/${city.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(245,166,35,0.4)"; el.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <div style={{ fontWeight: 500, color: "white", marginBottom: "2px" }}>{city.name}</div>
                  {city.state && <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>{city.state}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                    <span>🌅 {formatTime12(times.sunrise)}</span>
                    <span>🌇 {formatTime12(times.sunset)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
