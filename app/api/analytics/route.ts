import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { DEMO_DATASET } from "../../../lib/demo-data";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDemo = searchParams.get("demo") === "true";
    const range = searchParams.get("range") || "24h"; // 24h, 7d, 30d

    if (isDemo) {
      return NextResponse.json({
        success: true,
        demo: true,
        data: {
          hasEnoughData: true,
          totalIncidents: 14,
          activeFiresCount: DEMO_DATASET.fires.length,
          smokeReportsCount: DEMO_DATASET.smokeReports.length,
          clearReportsCount: DEMO_DATASET.clearReports.length,
          verifiedReportsCount: 2,
          avgEtaMinutes: 28,
          avgWindSpeed: 16.5,
          riskDistribution: {
            critical: 2,
            high: 4,
            moderate: 5,
            low: 3
          },
          incidentsOverTime: [
            { time: "06:00", fires: 0, reports: 0, riskScore: 12 },
            { time: "08:00", fires: 1, reports: 0, riskScore: 35 },
            { time: "10:00", fires: 2, reports: 1, riskScore: 68 },
            { time: "12:00", fires: 2, reports: 2, riskScore: 82 },
            { time: "14:00", fires: 3, reports: 2, riskScore: 75 },
            { time: "Now", fires: 2, reports: 2, riskScore: 78 }
          ],
          windTrend: [
            { time: "06:00", speed: 12, direction: 210 },
            { time: "08:00", speed: 14, direction: 215 },
            { time: "10:00", speed: 16, direction: 220 },
            { time: "12:00", speed: 18, direction: 225 },
            { time: "14:00", speed: 19, direction: 225 },
            { time: "Now", speed: 18, direction: 225 }
          ]
        }
      });
    }

    if (!db) {
      return NextResponse.json({
        success: true,
        data: { hasEnoughData: false, message: "Not enough historical data yet." }
      });
    }

    // Live Turso queries for real historical data
    let timeFilterMs = 24 * 60 * 60 * 1000;
    if (range === "7d") timeFilterMs = 7 * 24 * 60 * 60 * 1000;
    if (range === "30d") timeFilterMs = 30 * 24 * 60 * 60 * 1000;

    const sinceIso = new Date(Date.now() - timeFilterMs).toISOString();

    const [firesRes, reportsRes, windRes] = await Promise.all([
      db.execute({ sql: `SELECT * FROM fire_events WHERE detected_at > ? ORDER BY detected_at ASC`, args: [sinceIso] }),
      db.execute({ sql: `SELECT * FROM citizen_reports WHERE submitted_at > ? ORDER BY submitted_at ASC`, args: [sinceIso] }),
      db.execute({ sql: `SELECT * FROM wind_readings WHERE recorded_at > ? ORDER BY recorded_at ASC`, args: [sinceIso] })
    ]);

    const fires = firesRes.rows;
    const reports = reportsRes.rows;
    const winds = windRes.rows;

    const totalDataPoints = fires.length + reports.length + winds.length;
    if (totalDataPoints < 3) {
      return NextResponse.json({
        success: true,
        data: {
          hasEnoughData: false,
          totalDataPoints,
          message: "Not enough historical data yet. As sensors and satellite passes record observations, trend charts will populate automatically."
        }
      });
    }

    const smokeCount = reports.filter((r: any) => r.classification === "smoke").length;
    const clearCount = reports.filter((r: any) => r.classification === "clear").length;
    const verifiedCount = reports.filter((r: any) => Number(r.confidence_score) >= 0.85).length;

    const avgWindSpeed = winds.length > 0 
      ? Math.round((winds.reduce((acc: number, w: any) => acc + Number(w.wind_speed_kmh), 0) / winds.length) * 10) / 10
      : 0;

    // Transform wind readings into chart trend
    const windTrend = winds.map((w: any) => ({
      time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(w.recorded_at as string)),
      speed: Number(w.wind_speed_kmh),
      direction: Number(w.wind_direction_deg)
    }));

    return NextResponse.json({
      success: true,
      data: {
        hasEnoughData: true,
        activeFiresCount: fires.length,
        smokeReportsCount: smokeCount,
        clearReportsCount: clearCount,
        verifiedReportsCount: verifiedCount,
        avgWindSpeed,
        windTrend,
        reports
      }
    });

  } catch (error) {
    console.error("Error in /api/analytics:", error);
    return NextResponse.json({ success: false, error: { message: "Failed to query analytics" } }, { status: 500 });
  }
}
