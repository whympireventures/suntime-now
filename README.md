# 🌅 SunriseSunset.info

A fast, SEO-optimized sunrise and sunset finder built with Next.js, deployed on Vercel.

## Features
- ✅ Sunrise & sunset times for 44 cities (expand to 50,000+ with SimpleMaps)
- ✅ Golden hour times for photographers
- ✅ Civil, nautical & astronomical twilight
- ✅ Visual light timeline bar
- ✅ Monthly sun calendar
- ✅ Auto-detect user location
- ✅ City search with autocomplete
- ✅ ISR (pages refresh every 24 hours)
- ✅ Auto-generated sitemap
- ✅ SEO metadata per city page

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom CSS
- **Hosting**: Vercel
- **Sun Math**: NOAA Solar Calculator (client-side, no API needed)
- **City Data**: Built-in starter set (expandable)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/sunrise-sunset-app.git
cd sunrise-sunset-app
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Or connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deploys.

---

## 📁 Project Structure
```
app/
  page.tsx                    # Homepage with search & geolocation
  layout.tsx                  # Root layout, nav & footer
  sitemap.ts                  # Auto-generated XML sitemap
  robots.ts                   # robots.txt
  sun/
    [country]/
      page.tsx                # Country index (e.g. /sun/united-states)
      [city]/
        page.tsx              # City page (e.g. /sun/united-states/miami)
lib/
  sunCalculations.ts          # NOAA sun math engine
  cities.ts                   # City database & utilities
```

---

## 🌍 Expanding the City Database

The starter set includes 44 major cities. To scale to 50,000+ cities:

1. Download the **free** world cities CSV from [SimpleMaps](https://simplemaps.com/data/world-cities)
2. Convert to the `City` interface format in `lib/cities.ts`
3. Import as JSON: add `cities.json` to `/data/` and import it

Each city needs: `name`, `slug`, `country`, `countrySlug`, `lat`, `lng`, `timezone`

IANA timezone is critical for accurate local times. SimpleMaps includes timezone data.

---

## 💰 Monetization

### Phase 1: Google AdSense
1. Sign up at [google.com/adsense](https://google.com/adsense)
2. Add your site and get the script tag
3. Add to `app/layout.tsx` in the `<head>`

### Phase 2: Mediavine / Raptive
Apply once you reach 50k+ monthly sessions.

---

## 🔧 Updating Your Domain

1. In `app/sitemap.ts` — update `baseUrl`
2. In `app/robots.ts` — update the sitemap URL
3. In `app/layout.tsx` metadata — update `siteName`

---

## 📈 SEO Notes

- Each city page has unique title, description & OG tags
- Breadcrumb schema is built into the layout
- ISR means fresh data every 24 hours without rebuilding
- Add FAQ schema to city pages for rich results (next step)

---

## 🗺️ URL Structure
```
/                                    # Homepage
/sun/[country]                       # Country page
/sun/[country]/[city]                # City page ← money page
/sitemap.xml                         # Auto-generated
/robots.txt                          # Auto-generated
```

## Next Steps
- [ ] Add 50,000 cities via SimpleMaps CSV
- [ ] Add FAQ schema markup to city pages
- [ ] Add moon phases
- [ ] Golden hour dedicated pages `/golden-hour/[city]`
- [ ] Add AdSense
- [ ] Monthly comparison charts
# sunrise-sunset-app
