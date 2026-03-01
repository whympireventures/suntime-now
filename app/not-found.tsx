import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "24px",
      background: "linear-gradient(180deg, #061220 0%, #0a1628 100%)"
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🌑</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "white", marginBottom: "8px" }}>City not found</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>We don't have sun data for that location yet.</p>
      <Link href="/" style={{
        background: "#f5a623",
        color: "#061220",
        padding: "12px 28px",
        borderRadius: "100px",
        fontWeight: 600,
        textDecoration: "none",
        fontFamily: "var(--font-body)"
      }}>
        Search another city
      </Link>
    </div>
  );
}
