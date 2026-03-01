/**
 * City Database — 50 Starter Cities
 * Good geographic spread across US, Canada, UK, Australia, Europe, Asia
 *
 * TO SCALE LATER:
 *   1. Download worldcities.csv from simplemaps.com/data/world-cities
 *   2. Run: node scripts/importCities.js
 *   3. Switch to JSON import (instructions in that file)
 */

export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  countrySlug: string;
  state?: string;
  stateSlug?: string;
  lat: number;
  lng: number;
  timezone: string;
  population?: number;
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const CITIES: City[] = [

  // ── United States (20 cities) ──────────────────────────────────────────────
  { id: "us-new-york",     name: "New York",     slug: "new-york",     country: "United States", countryCode: "US", countrySlug: "united-states", state: "New York",      stateSlug: "new-york",      lat: 40.7128,  lng: -74.0060,  timezone: "America/New_York",   population: 8336817 },
  { id: "us-los-angeles",  name: "Los Angeles",  slug: "los-angeles",  country: "United States", countryCode: "US", countrySlug: "united-states", state: "California",    stateSlug: "california",    lat: 34.0522,  lng: -118.2437, timezone: "America/Los_Angeles", population: 3979576 },
  { id: "us-chicago",      name: "Chicago",      slug: "chicago",      country: "United States", countryCode: "US", countrySlug: "united-states", state: "Illinois",      stateSlug: "illinois",      lat: 41.8781,  lng: -87.6298,  timezone: "America/Chicago",    population: 2693976 },
  { id: "us-houston",      name: "Houston",      slug: "houston",      country: "United States", countryCode: "US", countrySlug: "united-states", state: "Texas",         stateSlug: "texas",         lat: 29.7604,  lng: -95.3698,  timezone: "America/Chicago",    population: 2320268 },
  { id: "us-phoenix",      name: "Phoenix",      slug: "phoenix",      country: "United States", countryCode: "US", countrySlug: "united-states", state: "Arizona",       stateSlug: "arizona",       lat: 33.4484,  lng: -112.0740, timezone: "America/Phoenix",    population: 1680992 },
  { id: "us-philadelphia", name: "Philadelphia", slug: "philadelphia", country: "United States", countryCode: "US", countrySlug: "united-states", state: "Pennsylvania",  stateSlug: "pennsylvania",  lat: 39.9526,  lng: -75.1652,  timezone: "America/New_York",   population: 1584064 },
  { id: "us-san-antonio",  name: "San Antonio",  slug: "san-antonio",  country: "United States", countryCode: "US", countrySlug: "united-states", state: "Texas",         stateSlug: "texas",         lat: 29.4241,  lng: -98.4936,  timezone: "America/Chicago",    population: 1547253 },
  { id: "us-san-diego",    name: "San Diego",    slug: "san-diego",    country: "United States", countryCode: "US", countrySlug: "united-states", state: "California",    stateSlug: "california",    lat: 32.7157,  lng: -117.1611, timezone: "America/Los_Angeles", population: 1423851 },
  { id: "us-dallas",       name: "Dallas",       slug: "dallas",       country: "United States", countryCode: "US", countrySlug: "united-states", state: "Texas",         stateSlug: "texas",         lat: 32.7767,  lng: -96.7970,  timezone: "America/Chicago",    population: 1343573 },
  { id: "us-miami",        name: "Miami",        slug: "miami",        country: "United States", countryCode: "US", countrySlug: "united-states", state: "Florida",       stateSlug: "florida",       lat: 25.7617,  lng: -80.1918,  timezone: "America/New_York",   population: 467963  },
  { id: "us-denver",       name: "Denver",       slug: "denver",       country: "United States", countryCode: "US", countrySlug: "united-states", state: "Colorado",      stateSlug: "colorado",      lat: 39.7392,  lng: -104.9903, timezone: "America/Denver",     population: 715522  },
  { id: "us-seattle",      name: "Seattle",      slug: "seattle",      country: "United States", countryCode: "US", countrySlug: "united-states", state: "Washington",    stateSlug: "washington",    lat: 47.6062,  lng: -122.3321, timezone: "America/Los_Angeles", population: 737000  },
  { id: "us-boston",       name: "Boston",       slug: "boston",       country: "United States", countryCode: "US", countrySlug: "united-states", state: "Massachusetts", stateSlug: "massachusetts", lat: 42.3601,  lng: -71.0589,  timezone: "America/New_York",   population: 695506  },
  { id: "us-las-vegas",    name: "Las Vegas",    slug: "las-vegas",    country: "United States", countryCode: "US", countrySlug: "united-states", state: "Nevada",        stateSlug: "nevada",        lat: 36.1699,  lng: -115.1398, timezone: "America/Los_Angeles", population: 651319  },
  { id: "us-atlanta",      name: "Atlanta",      slug: "atlanta",      country: "United States", countryCode: "US", countrySlug: "united-states", state: "Georgia",       stateSlug: "georgia",       lat: 33.7490,  lng: -84.3880,  timezone: "America/New_York",   population: 498715  },
  { id: "us-portland",     name: "Portland",     slug: "portland",     country: "United States", countryCode: "US", countrySlug: "united-states", state: "Oregon",        stateSlug: "oregon",        lat: 45.5051,  lng: -122.6750, timezone: "America/Los_Angeles", population: 652503  },
  { id: "us-nashville",    name: "Nashville",    slug: "nashville",    country: "United States", countryCode: "US", countrySlug: "united-states", state: "Tennessee",     stateSlug: "tennessee",     lat: 36.1627,  lng: -86.7816,  timezone: "America/Chicago",    population: 689447  },
  { id: "us-minneapolis",  name: "Minneapolis",  slug: "minneapolis",  country: "United States", countryCode: "US", countrySlug: "united-states", state: "Minnesota",     stateSlug: "minnesota",     lat: 44.9778,  lng: -93.2650,  timezone: "America/Chicago",    population: 429954  },
  { id: "us-orlando",      name: "Orlando",      slug: "orlando",      country: "United States", countryCode: "US", countrySlug: "united-states", state: "Florida",       stateSlug: "florida",       lat: 28.5383,  lng: -81.3792,  timezone: "America/New_York",   population: 307573  },
  { id: "us-anchorage",    name: "Anchorage",    slug: "anchorage",    country: "United States", countryCode: "US", countrySlug: "united-states", state: "Alaska",        stateSlug: "alaska",        lat: 61.2181,  lng: -149.9003, timezone: "America/Anchorage",  population: 291538  },

  // ── Canada (7 cities) ──────────────────────────────────────────────────────
  { id: "ca-toronto",       name: "Toronto",       slug: "toronto",       country: "Canada", countryCode: "CA", countrySlug: "canada", state: "Ontario",              stateSlug: "ontario",              lat: 43.6532, lng:  -79.3832, timezone: "America/Toronto",   population: 2930000 },
  { id: "ca-vancouver",     name: "Vancouver",     slug: "vancouver",     country: "Canada", countryCode: "CA", countrySlug: "canada", state: "British Columbia",     stateSlug: "british-columbia",     lat: 49.2827, lng: -123.1207, timezone: "America/Vancouver", population: 675218  },
  { id: "ca-montreal",      name: "Montreal",      slug: "montreal",      country: "Canada", countryCode: "CA", countrySlug: "canada", state: "Quebec",               stateSlug: "quebec",               lat: 45.5017, lng:  -73.5673, timezone: "America/Toronto",   population: 1780000 },
  { id: "ca-calgary",       name: "Calgary",       slug: "calgary",       country: "Canada", countryCode: "CA", countrySlug: "canada", state: "Alberta",              stateSlug: "alberta",              lat: 51.0447, lng: -114.0719, timezone: "America/Edmonton",  population: 1336000 },
  { id: "ca-ottawa",        name: "Ottawa",        slug: "ottawa",        country: "Canada", countryCode: "CA", countrySlug: "canada", state: "Ontario",              stateSlug: "ontario",              lat: 45.4215, lng:  -75.6972, timezone: "America/Toronto",   population: 994837  },
  { id: "ca-edmonton",      name: "Edmonton",      slug: "edmonton",      country: "Canada", countryCode: "CA", countrySlug: "canada", state: "Alberta",              stateSlug: "alberta",              lat: 53.5461, lng: -113.4938, timezone: "America/Edmonton",  population: 932546  },
  { id: "ca-charlottetown", name: "Charlottetown", slug: "charlottetown", country: "Canada", countryCode: "CA", countrySlug: "canada", state: "Prince Edward Island", stateSlug: "prince-edward-island", lat: 46.2382, lng:  -63.1311, timezone: "America/Halifax",   population: 36094   },

  // ── United Kingdom (5 cities) ──────────────────────────────────────────────
  { id: "gb-london",     name: "London",     slug: "london",     country: "United Kingdom", countryCode: "GB", countrySlug: "united-kingdom", state: "England",  stateSlug: "england",  lat: 51.5074, lng: -0.1278, timezone: "Europe/London", population: 8982000 },
  { id: "gb-manchester", name: "Manchester", slug: "manchester", country: "United Kingdom", countryCode: "GB", countrySlug: "united-kingdom", state: "England",  stateSlug: "england",  lat: 53.4808, lng: -2.2426, timezone: "Europe/London", population: 553230  },
  { id: "gb-birmingham", name: "Birmingham", slug: "birmingham", country: "United Kingdom", countryCode: "GB", countrySlug: "united-kingdom", state: "England",  stateSlug: "england",  lat: 52.4862, lng: -1.8904, timezone: "Europe/London", population: 1141816 },
  { id: "gb-edinburgh",  name: "Edinburgh",  slug: "edinburgh",  country: "United Kingdom", countryCode: "GB", countrySlug: "united-kingdom", state: "Scotland", stateSlug: "scotland", lat: 55.9533, lng: -3.1883, timezone: "Europe/London", population: 540000  },
  { id: "gb-glasgow",    name: "Glasgow",    slug: "glasgow",    country: "United Kingdom", countryCode: "GB", countrySlug: "united-kingdom", state: "Scotland", stateSlug: "scotland", lat: 55.8642, lng: -4.2518, timezone: "Europe/London", population: 635130  },

  // ── Australia (4 cities) ───────────────────────────────────────────────────
  { id: "au-sydney",    name: "Sydney",    slug: "sydney",    country: "Australia", countryCode: "AU", countrySlug: "australia", state: "New South Wales",   stateSlug: "new-south-wales",   lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney",    population: 5312000 },
  { id: "au-melbourne", name: "Melbourne", slug: "melbourne", country: "Australia", countryCode: "AU", countrySlug: "australia", state: "Victoria",          stateSlug: "victoria",          lat: -37.8136, lng: 144.9631, timezone: "Australia/Melbourne", population: 5078000 },
  { id: "au-brisbane",  name: "Brisbane",  slug: "brisbane",  country: "Australia", countryCode: "AU", countrySlug: "australia", state: "Queensland",        stateSlug: "queensland",        lat: -27.4698, lng: 153.0251, timezone: "Australia/Brisbane",  population: 2560700 },
  { id: "au-perth",     name: "Perth",     slug: "perth",     country: "Australia", countryCode: "AU", countrySlug: "australia", state: "Western Australia",  stateSlug: "western-australia", lat: -31.9505, lng: 115.8605, timezone: "Australia/Perth",     population: 2085973 },

  // ── Europe (8 cities) ──────────────────────────────────────────────────────
  { id: "fr-paris",     name: "Paris",     slug: "paris",     country: "France",      countryCode: "FR", countrySlug: "france",      lat: 48.8566, lng:  2.3522, timezone: "Europe/Paris",     population: 2161000 },
  { id: "de-berlin",    name: "Berlin",    slug: "berlin",    country: "Germany",     countryCode: "DE", countrySlug: "germany",     lat: 52.5200, lng: 13.4050, timezone: "Europe/Berlin",    population: 3669491 },
  { id: "es-madrid",    name: "Madrid",    slug: "madrid",    country: "Spain",       countryCode: "ES", countrySlug: "spain",       lat: 40.4168, lng: -3.7038, timezone: "Europe/Madrid",    population: 3223334 },
  { id: "it-rome",      name: "Rome",      slug: "rome",      country: "Italy",       countryCode: "IT", countrySlug: "italy",       lat: 41.9028, lng: 12.4964, timezone: "Europe/Rome",      population: 2873494 },
  { id: "nl-amsterdam", name: "Amsterdam", slug: "amsterdam", country: "Netherlands", countryCode: "NL", countrySlug: "netherlands", lat: 52.3676, lng:  4.9041, timezone: "Europe/Amsterdam", population: 872757  },
  { id: "pt-lisbon",    name: "Lisbon",    slug: "lisbon",    country: "Portugal",    countryCode: "PT", countrySlug: "portugal",    lat: 38.7223, lng: -9.1393, timezone: "Europe/Lisbon",    population: 505526  },
  { id: "se-stockholm", name: "Stockholm", slug: "stockholm", country: "Sweden",      countryCode: "SE", countrySlug: "sweden",      lat: 59.3293, lng: 18.0686, timezone: "Europe/Stockholm", population: 975551  },
  { id: "gr-athens",    name: "Athens",    slug: "athens",    country: "Greece",      countryCode: "GR", countrySlug: "greece",      lat: 37.9838, lng: 23.7275, timezone: "Europe/Athens",    population: 664046  },

  // ── Asia & Middle East (6 cities) ─────────────────────────────────────────
  { id: "jp-tokyo",     name: "Tokyo",     slug: "tokyo",     country: "Japan",                countryCode: "JP", countrySlug: "japan",                 lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo",     population: 13960000 },
  { id: "ae-dubai",     name: "Dubai",     slug: "dubai",     country: "United Arab Emirates", countryCode: "AE", countrySlug: "united-arab-emirates",  lat: 25.2048, lng:  55.2708, timezone: "Asia/Dubai",     population: 3331420  },
  { id: "sg-singapore", name: "Singapore", slug: "singapore", country: "Singapore",            countryCode: "SG", countrySlug: "singapore",             lat:  1.3521, lng: 103.8198, timezone: "Asia/Singapore", population: 5850000  },
  { id: "in-mumbai",    name: "Mumbai",    slug: "mumbai",    country: "India",                countryCode: "IN", countrySlug: "india",                  lat: 19.0760, lng:  72.8777, timezone: "Asia/Kolkata",   population: 20667656 },
  { id: "cn-beijing",   name: "Beijing",   slug: "beijing",   country: "China",                countryCode: "CN", countrySlug: "china",                  lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai",  population: 21540000 },
  { id: "th-bangkok",   name: "Bangkok",   slug: "bangkok",   country: "Thailand",             countryCode: "TH", countrySlug: "thailand",               lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok",   population: 10500000 },
];

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export function getCityBySlug(countrySlug: string, citySlug: string): City | undefined {
  return CITIES.find((c) => c.countrySlug === countrySlug && c.slug === citySlug);
}

export function getCitiesByCountry(countrySlug: string): City[] {
  return CITIES
    .filter((c) => c.countrySlug === countrySlug)
    .sort((a, b) => (b.population || 0) - (a.population || 0));
}

export function searchCities(query: string): City[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.state?.toLowerCase().includes(q)
  ).slice(0, 10);
}

export function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    const utc   = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const local = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return (local.getTime() - utc.getTime()) / 60000;
  } catch {
    return 0;
  }
}

export function getAllCountrySlugs(): string[] {
  return [...new Set(CITIES.map((c) => c.countrySlug))];
}

export function getPopularCities(limit = 12): City[] {
  return [...CITIES]
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit);
}
