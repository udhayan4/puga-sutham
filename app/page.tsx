import { DataSyncer } from "../components/DataSyncer";
import { DashboardClient } from "../components/DashboardClient";
import { Navigation } from "../components/Navigation";
import { KEELADI_LAT, KEELADI_LON } from "../lib/weather";
import { db } from "../lib/db";
import { calculateRisk } from "../lib/risk";

export const dynamic = "force-static";
export const revalidate = 60;

async function getDashboardData() {
  if (!db) {
    return { fires: [], windReadings: [], smokeReports: [], clearReports: [], currentWind: { windSpeedKmh: 0, windDirectionDeg: 0 } };
  }

  // 1. Get recent fires
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  let firesRes: any = { rows: [] };
  let windRes: any = { rows: [] };
  let reportsRes: any = { rows: [] };

  try {
    firesRes = await db.execute({
      sql: `SELECT * FROM fire_events WHERE detected_at > ?`,
      args: [oneDayAgo]
    });
  } catch (e) {
    console.warn("Could not query fires from DB", e);
  }

  // 2. Get recent wind readings
  try {
    windRes = await db.execute({
      sql: `SELECT recorded_at as recordedAt, wind_speed_kmh as windSpeedKmh, wind_direction_deg as windDirectionDeg FROM wind_readings ORDER BY recorded_at DESC LIMIT 1`,
      args: []
    });
  } catch (e) {
    console.warn("Could not query wind from DB", e);
  }

  const windReading = windRes.rows.length > 0 ? {
    recordedAt: windRes.rows[0].recordedAt as string,
    windSpeedKmh: Number(windRes.rows[0].windSpeedKmh),
    windDirectionDeg: Number(windRes.rows[0].windDirectionDeg)
  } : { windSpeedKmh: 18, windDirectionDeg: 225 };

  // 3. Get verified citizen reports
  try {
    reportsRes = await db.execute({
      sql: `SELECT * FROM citizen_reports WHERE submitted_at > ?`,
      args: [oneDayAgo]
    });
  } catch (e) {
    console.warn("Could not query reports from DB", e);
  }

  const allReports = reportsRes.rows.map((r: any) => ({
    id: r.id as string,
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    classification: r.classification as string,
    confidenceScore: Number(r.confidence_score),
    submittedAt: new Date(r.submitted_at).getTime()
  }));

  const allSmokeReports = allReports.filter((r: any) => r.classification === "smoke");
  const clearReports = allReports.filter((r: any) => r.classification === "clear");

  // Format fires properly
  const mappedFires = firesRes.rows.map((f: any) => ({
    id: f.id as string,
    latitude: Number(f.latitude),
    longitude: Number(f.longitude),
    confidence: Number(f.confidence || 1.0),
    detectedAt: new Date(f.detected_at as string).getTime()
  }));

  return {
    fires: mappedFires,
    smokeReports: allSmokeReports,
    clearReports: clearReports,
    currentWind: windReading
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ lat?: string; lon?: string; region?: string }>;
}) {
  const params = await searchParams;
  const parsedLat = params?.lat ? parseFloat(params.lat) : null;
  const parsedLon = params?.lon ? parseFloat(params.lon) : null;

  const isCustomLocation = parsedLat !== null && parsedLon !== null && !isNaN(parsedLat) && !isNaN(parsedLon);
  const siteLat = isCustomLocation ? parsedLat! : KEELADI_LAT;
  const siteLon = isCustomLocation ? parsedLon! : KEELADI_LON;

  const data = await getDashboardData();

  const riskResult = calculateRisk({
    fires: data.fires,
    smokeReports: data.smokeReports,
    clearReports: data.clearReports,
    windSpeedKmh: data.currentWind.windSpeedKmh,
    windDirectionDeg: data.currentWind.windDirectionDeg,
    siteLat,
    siteLon
  });

  return (
    <main className="min-h-screen bg-white font-sans">
      <DataSyncer />
      <DashboardClient
        initialData={{
          fires: data.fires,
          smokeReports: data.smokeReports,
          clearReports: data.clearReports,
          currentWind: data.currentWind,
          siteLat,
          siteLon,
          isCustomLocation,
          riskResult,
        }}
      />
    </main>
  );
}
