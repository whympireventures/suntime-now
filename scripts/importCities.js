/**
 * Run this ONCE to convert SimpleMaps worldcities.csv → data/cities.json
 * 
 * Usage:
 *   1. Download worldcities.csv from simplemaps.com/data/world-cities
 *   2. Place it in the root of your project
 *   3. Run: node scripts/importCities.js
 *   4. This generates data/cities.json
 *   5. Then update lib/cities.ts to import from that file
 */

const fs = require("fs");
const path = require("path");

// ---- Helpers ----

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// SimpleMaps timezone → IANA mapping (common ones)
// SimpleMaps uses numeric offsets; we map country codes to IANA zones
// For full accuracy, you can use a timezone lookup library
function getTimezone(countryCode, lat, lng) {
  // Major timezone mappings by country
  const countryTimezones = {
    US: getUSTimezone(lng),
    CA: getCATimezone(lng),
    GB: "Europe/London",
    AU: getAUTimezone(lng),
    DE: "Europe/Berlin",
    FR: "Europe/Paris",
    ES: "Europe/Madrid",
    IT: "Europe/Rome",
    NL: "Europe/Amsterdam",
    JP: "Asia/Tokyo",
    CN: "Asia/Shanghai",
    IN: "Asia/Kolkata",
    SG: "Asia/Singapore",
    AE: "Asia/Dubai",
    NZ: "Pacific/Auckland",
    BR: "America/Sao_Paulo",
    MX: "America/Mexico_City",
    AR: "America/Argentina/Buenos_Aires",
    ZA: "Africa/Johannesburg",
    NG: "Africa/Lagos",
    EG: "Africa/Cairo",
    KE: "Africa/Nairobi",
    RU: "Europe/Moscow",
    PK: "Asia/Karachi",
    BD: "Asia/Dhaka",
    TR: "Europe/Istanbul",
    SA: "Asia/Riyadh",
    TH: "Asia/Bangkok",
    MY: "Asia/Kuala_Lumpur",
    ID: "Asia/Jakarta",
    PH: "Asia/Manila",
    KR: "Asia/Seoul",
    TW: "Asia/Taipei",
    HK: "Asia/Hong_Kong",
    VN: "Asia/Ho_Chi_Minh",
    NO: "Europe/Oslo",
    SE: "Europe/Stockholm",
    DK: "Europe/Copenhagen",
    FI: "Europe/Helsinki",
    PL: "Europe/Warsaw",
    PT: "Europe/Lisbon",
    GR: "Europe/Athens",
    CH: "Europe/Zurich",
    AT: "Europe/Vienna",
    BE: "Europe/Brussels",
    IE: "Europe/Dublin",
    CZ: "Europe/Prague",
    HU: "Europe/Budapest",
    RO: "Europe/Bucharest",
    UA: "Europe/Kiev",
    NZ: "Pacific/Auckland",
    IL: "Asia/Jerusalem",
    IR: "Asia/Tehran",
    IQ: "Asia/Baghdad",
    PL: "Europe/Warsaw",
    ZA: "Africa/Johannesburg",
  };

  return countryTimezones[countryCode] || getTimezoneFromOffset(lng);
}

function getUSTimezone(lng) {
  if (lng < -115) return "America/Los_Angeles";
  if (lng < -104) return "America/Denver";
  if (lng < -87) return "America/Chicago";
  return "America/New_York";
}

function getCATimezone(lng) {
  if (lng < -115) return "America/Vancouver";
  if (lng < -104) return "America/Edmonton";
  if (lng < -85) return "America/Winnipeg";
  if (lng < -60) return "America/Toronto";
  return "America/Halifax";
}

function getAUTimezone(lng) {
  if (lng < 130) return "Australia/Perth";
  if (lng < 138) return "Australia/Darwin";
  if (lng < 141) return "Australia/Adelaide";
  return "Australia/Sydney";
}

function getTimezoneFromOffset(lng) {
  // Rough UTC offset from longitude
  const offset = Math.round(lng / 15);
  if (offset === 0) return "UTC";
  if (offset > 0) return `Etc/GMT-${offset}`;
  return `Etc/GMT+${Math.abs(offset)}`;
}

function countryToSlug(name) {
  return toSlug(name);
}

// ---- Main ----

const csvPath = path.join(process.cwd(), "worldcities.csv");
const outPath = path.join(process.cwd(), "data", "cities.json");

if (!fs.existsSync(csvPath)) {
  console.error("❌ worldcities.csv not found in project root.");
  console.error("   Download it from simplemaps.com/data/world-cities");
  process.exit(1);
}

// Ensure output directory exists
fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });

console.log("📖 Reading worldcities.csv...");
const raw = fs.readFileSync(csvPath, "utf-8");
const lines = raw.split("\n").filter((l) => l.trim());

// Parse header
// SimpleMaps columns: city,city_ascii,lat,lng,country,iso2,iso3,admin_name,capital,population,id
const header = parseCSVLine(lines[0]);
console.log("📋 Columns:", header.join(", "));

const idxCity = header.indexOf("city_ascii");
const idxLat = header.indexOf("lat");
const idxLng = header.indexOf("lng");
const idxCountry = header.indexOf("country");
const idxIso2 = header.indexOf("iso2");
const idxAdmin = header.indexOf("admin_name"); // state/province
const idxPop = header.indexOf("population");
const idxCityDisplay = header.indexOf("city");

const cities = [];
const seen = new Set(); // prevent duplicate slugs

let skipped = 0;

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length < 6) { skipped++; continue; }

  const cityName = (cols[idxCityDisplay] || cols[idxCity] || "").trim();
  const cityAscii = (cols[idxCity] || "").trim();
  const lat = parseFloat(cols[idxLat]);
  const lng = parseFloat(cols[idxLng]);
  const country = (cols[idxCountry] || "").trim();
  const iso2 = (cols[idxIso2] || "").trim().toUpperCase();
  const state = (cols[idxAdmin] || "").trim();
  const pop = parseInt(cols[idxPop]) || 0;

  if (!cityAscii || isNaN(lat) || isNaN(lng) || !country) {
    skipped++;
    continue;
  }

  const citySlug = toSlug(cityAscii);
  const countrySlug = countryToSlug(country);
  const key = `${countrySlug}__${citySlug}`;

  // Handle duplicates by appending state
  let finalSlug = citySlug;
  if (seen.has(key) && state) {
    finalSlug = `${citySlug}-${toSlug(state)}`;
  }
  seen.add(key);

  cities.push({
    id: `${iso2.toLowerCase()}-${finalSlug}`,
    name: cityName,
    slug: finalSlug,
    country,
    countryCode: iso2,
    countrySlug,
    state: state || undefined,
    stateSlug: state ? toSlug(state) : undefined,
    lat,
    lng,
    timezone: getTimezone(iso2, lat, lng),
    population: pop || undefined,
  });
}

// Sort by population descending
cities.sort((a, b) => (b.population || 0) - (a.population || 0));

console.log(`✅ Processed ${cities.length} cities (${skipped} skipped)`);
console.log(`📝 Writing to data/cities.json...`);

fs.writeFileSync(outPath, JSON.stringify(cities, null, 2));

console.log(`\n🎉 Done! ${cities.length} cities saved to data/cities.json`);
console.log(`\nNext step: update lib/cities.ts to import from data/cities.json`);
console.log(`  import CITIES_DATA from "@/data/cities.json";`);
console.log(`  export const CITIES: City[] = CITIES_DATA as City[];`);
