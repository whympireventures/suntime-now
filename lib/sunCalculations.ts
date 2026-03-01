/**
 * Sun Calculations Engine
 * Based on NOAA Solar Calculator algorithms
 * https://gml.noaa.gov/grad/solcalc/
 */

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date | null;
  dayLength: number; // minutes
  civilDawn: Date | null;
  civilDusk: Date | null;
  nauticalDawn: Date | null;
  nauticalDusk: Date | null;
  astronomicalDawn: Date | null;
  astronomicalDusk: Date | null;
  goldenHourMorningEnd: Date | null;
  goldenHourEveningStart: Date | null;
}

export interface SunPosition {
  altitude: number; // degrees above horizon
  azimuth: number;  // degrees from north
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function calcJulianDay(date: Date): number {
  const A = Math.floor((date.getUTCMonth() + 1 + 9) / 12);
  const y = date.getUTCFullYear() + 4800 - A;
  const m = (date.getUTCMonth() + 1) + 12 * A - 3;
  let JDN =
    date.getUTCDate() +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  const JD =
    JDN +
    (date.getUTCHours() - 12) / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400;
  return JD;
}

function calcGeomMeanLongSun(t: number): number {
  let L0 = 280.46646 + t * (36000.76983 + t * 0.0003032);
  while (L0 > 360) L0 -= 360;
  while (L0 < 0) L0 += 360;
  return L0;
}

function calcGeomMeanAnomalySun(t: number): number {
  return 357.52911 + t * (35999.05029 - 0.0001537 * t);
}

function calcEccentricityEarthOrbit(t: number): number {
  return 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
}

function calcSunEqOfCenter(t: number): number {
  const m = toRad(calcGeomMeanAnomalySun(t));
  return (
    Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * m) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * m) * 0.000289
  );
}

function calcSunTrueLong(t: number): number {
  return calcGeomMeanLongSun(t) + calcSunEqOfCenter(t);
}

function calcSunApparentLong(t: number): number {
  const o = calcSunTrueLong(t);
  const omega = 125.04 - 1934.136 * t;
  return o - 0.00569 - 0.00478 * Math.sin(toRad(omega));
}

function calcMeanObliquityOfEcliptic(t: number): number {
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  return 23.0 + (26.0 + seconds / 60.0) / 60.0;
}

function calcObliquityCorrection(t: number): number {
  const e0 = calcMeanObliquityOfEcliptic(t);
  const omega = 125.04 - 1934.136 * t;
  return e0 + 0.00256 * Math.cos(toRad(omega));
}

function calcSunDeclination(t: number): number {
  const e = toRad(calcObliquityCorrection(t));
  const lambda = toRad(calcSunApparentLong(t));
  return toDeg(Math.asin(Math.sin(e) * Math.sin(lambda)));
}

function calcEquationOfTime(t: number): number {
  const epsilon = toRad(calcObliquityCorrection(t));
  const l0 = toRad(calcGeomMeanLongSun(t));
  const e = calcEccentricityEarthOrbit(t);
  const m = toRad(calcGeomMeanAnomalySun(t));
  let y = Math.tan(epsilon / 2);
  y *= y;
  const sin2l0 = Math.sin(2 * l0);
  const sinm = Math.sin(m);
  const cos2l0 = Math.cos(2 * l0);
  const sin4l0 = Math.sin(4 * l0);
  const sin2m = Math.sin(2 * m);
  return toDeg(
    y * sin2l0 -
    2 * e * sinm +
    4 * e * y * sinm * cos2l0 -
    0.5 * y * y * sin4l0 -
    1.25 * e * e * sin2m
  ) * 4; // in minutes
}

function calcHourAngleSunrise(lat: number, solarDec: number, zenith: number = 90.833): number {
  const latRad = toRad(lat);
  const sdRad = toRad(solarDec);
  const HA = Math.acos(
    Math.cos(toRad(zenith)) / (Math.cos(latRad) * Math.cos(sdRad)) -
    Math.tan(latRad) * Math.tan(sdRad)
  );
  return HA;
}

function calcSunriseSetUTC(
  rise: boolean,
  JD: number,
  lat: number,
  lng: number,
  zenith: number = 90.833
): number {
  const t = (JD - 2451545.0) / 36525.0;
  const eqTime = calcEquationOfTime(t);
  const solarDec = calcSunDeclination(t);
  let hourAngle: number;
  try {
    hourAngle = toDeg(calcHourAngleSunrise(lat, solarDec, zenith));
  } catch {
    return NaN;
  }
  if (!rise) hourAngle = -hourAngle;
  const delta = lng + hourAngle;
  return 720 - 4 * delta - eqTime; // in minutes
}

function minutesToDate(minutes: number, date: Date, offsetMinutes: number): Date | null {
  if (isNaN(minutes)) return null;
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCMinutes(minutes + offsetMinutes);
  return d;
}

/**
 * Main function: calculate all sun times for a given date, lat/lng, and UTC offset
 */
export function getSunTimes(
  date: Date,
  lat: number,
  lng: number,
  timezoneOffsetMinutes: number = 0
): SunTimes {
  const JD = calcJulianDay(date);

  const sunriseUTC = calcSunriseSetUTC(true, JD, lat, lng, 90.833);
  const sunsetUTC = calcSunriseSetUTC(false, JD, lat, lng, 90.833);
  const civilDawnUTC = calcSunriseSetUTC(true, JD, lat, lng, 96);
  const civilDuskUTC = calcSunriseSetUTC(false, JD, lat, lng, 96);
  const nauticalDawnUTC = calcSunriseSetUTC(true, JD, lat, lng, 102);
  const nauticalDuskUTC = calcSunriseSetUTC(false, JD, lat, lng, 102);
  const astroDawnUTC = calcSunriseSetUTC(true, JD, lat, lng, 108);
  const astroDuskUTC = calcSunriseSetUTC(false, JD, lat, lng, 108);
  const goldenMornEndUTC = calcSunriseSetUTC(true, JD, lat, lng, 84);
  const goldenEveStartUTC = calcSunriseSetUTC(false, JD, lat, lng, 84);

  const solarNoonMinutes = 720 - 4 * lng - calcEquationOfTime(
    (JD - 2451545.0) / 36525.0
  );

  const sunrise = minutesToDate(sunriseUTC, date, timezoneOffsetMinutes);
  const sunset = minutesToDate(sunsetUTC, date, timezoneOffsetMinutes);

  let dayLength = 0;
  if (sunrise && sunset) {
    dayLength = (sunset.getTime() - sunrise.getTime()) / 60000;
  }

  return {
    sunrise,
    sunset,
    solarNoon: minutesToDate(solarNoonMinutes, date, timezoneOffsetMinutes),
    dayLength,
    civilDawn: minutesToDate(civilDawnUTC, date, timezoneOffsetMinutes),
    civilDusk: minutesToDate(civilDuskUTC, date, timezoneOffsetMinutes),
    nauticalDawn: minutesToDate(nauticalDawnUTC, date, timezoneOffsetMinutes),
    nauticalDusk: minutesToDate(nauticalDuskUTC, date, timezoneOffsetMinutes),
    astronomicalDawn: minutesToDate(astroDawnUTC, date, timezoneOffsetMinutes),
    astronomicalDusk: minutesToDate(astroDuskUTC, date, timezoneOffsetMinutes),
    goldenHourMorningEnd: minutesToDate(goldenMornEndUTC, date, timezoneOffsetMinutes),
    goldenHourEveningStart: minutesToDate(goldenEveStartUTC, date, timezoneOffsetMinutes),
  };
}

/**
 * Format minutes to h:mm string
 */
export function formatDayLength(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

/**
 * Format a Date to 12-hour time string
 */
export function formatTime12(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a Date to 24-hour time string
 */
export function formatTime24(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get monthly sunrise/sunset data for calendar view
 */
export function getMonthlyData(
  year: number,
  month: number, // 0-indexed
  lat: number,
  lng: number,
  timezoneOffsetMinutes: number = 0
): Array<{ date: Date; times: SunTimes }> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(Date.UTC(year, month, day));
    result.push({ date, times: getSunTimes(date, lat, lng, timezoneOffsetMinutes) });
  }
  return result;
}
