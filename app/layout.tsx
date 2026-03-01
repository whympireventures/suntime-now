import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "Sunrise & Sunset Times — Find Sun Times for Any City",
    template: "%s | SunriseSunset.info",
  },
  description:
    "Find today's sunrise and sunset times for any city in the world. Includes golden hour, twilight phases, day length, and monthly sun calendars.",
  keywords: ["sunrise time", "sunset time", "golden hour", "daylight hours", "sun calculator"],
  openGraph: {
    type: "website",
    siteName: "SunriseSunset.info",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(6,18,32,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" className="flex items-center gap-2 text-white no-underline">
            <span style={{ fontSize: "1.4rem" }}>🌅</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem", color: "#f5a623" }}>
              SunriseSunset
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <Link href="/" className="hover:text-white transition-colors" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
            <Link href="/sun/united-states" className="hover:text-white transition-colors" style={{ color: "inherit", textDecoration: "none" }}>USA</Link>
            <Link href="/sun/canada" className="hover:text-white transition-colors" style={{ color: "inherit", textDecoration: "none" }}>Canada</Link>
            <Link href="/sun/united-kingdom" className="hover:text-white transition-colors" style={{ color: "inherit", textDecoration: "none" }}>UK</Link>
          </div>
        </nav>
        <main style={{ paddingTop: "64px" }}>
          {children}
        </main>
        <footer style={{
          background: "#040e1a",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "40px 24px",
          marginTop: "80px",
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.875rem"
        }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-display)", color: "#f5a623", fontSize: "1.1rem", marginBottom: "8px" }}>
              🌅 SunriseSunset.info
            </p>
            <p>Accurate sunrise, sunset and golden hour times for cities worldwide.</p>
            <p style={{ marginTop: "8px" }}>© {new Date().getFullYear()} SunriseSunset.info</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
