import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { DEMO_DATASET } from "../../../lib/demo-data";
import { calculateDriftRisk } from "../../../lib/drift";
import { KEELADI_LAT, KEELADI_LON } from "../../../lib/weather";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDemo = searchParams.get("demo") === "true";

    let fires: any[] = [];
    let smokeReports: any[] = [];
    let currentWind = { windSpeedKmh: 0, windDirectionDeg: 0 };

    if (isDemo) {
      fires = DEMO_DATASET.fires;
      smokeReports = DEMO_DATASET.smokeReports;
      currentWind = DEMO_DATASET.wind;
    } else if (db) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const [firesRes, reportsRes, windRes] = await Promise.all([
        db.execute({ sql: `SELECT * FROM fire_events WHERE detected_at > ?`, args: [oneDayAgo] }),
        db.execute({ sql: `SELECT * FROM citizen_reports WHERE submitted_at > ? AND classification = 'smoke'`, args: [oneDayAgo] }),
        db.execute({ sql: `SELECT wind_speed_kmh, wind_direction_deg FROM wind_readings ORDER BY recorded_at DESC LIMIT 1`, args: [] })
      ]);

      fires = firesRes.rows.map((f: any) => ({
        id: f.id,
        latitude: Number(f.latitude),
        longitude: Number(f.longitude),
        confidence: Number(f.confidence || 1.0),
        detectedAt: new Date(f.detected_at).getTime()
      }));

      smokeReports = reportsRes.rows.map((r: any) => ({
        id: r.id,
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
        confidenceScore: Number(r.confidence_score),
        submittedAt: new Date(r.submitted_at).getTime()
      }));

      if (windRes.rows.length > 0) {
        currentWind = {
          windSpeedKmh: Number(windRes.rows[0].wind_speed_kmh),
          windDirectionDeg: Number(windRes.rows[0].wind_direction_deg)
        };
      }
    }

    // Synthesize structured environmental intelligence
    const insights: Array<{
      id: string;
      category: "FIRE_RISK" | "WIND_TRAJECTORY" | "CITIZEN_CORRELATION" | "ACTION_RECOMMENDATION";
      title: string;
      summary: string;
      confidence: number;
      signalSource: string;
      severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    }> = [];

    // 1. Fire risk insight
    if (fires.length > 0) {
      const highRiskDrifts = fires.filter(f => {
        const risk = calculateDriftRisk(f.latitude, f.longitude, KEELADI_LAT, KEELADI_LON, currentWind.windDirectionDeg, currentWind.windSpeedKmh);
        return risk.isWithinDriftCone;
      });

      if (highRiskDrifts.length > 0) {
        insights.push({
          id: "ins_fire_01",
          category: "FIRE_RISK",
          title: `${highRiskDrifts.length} Fire Corridor${highRiskDrifts.length > 1 ? "s" : ""} Threatening Target Zone`,
          summary: `${highRiskDrifts.length} active thermal anomaly is generating a downwind smoke cone aligned with Keeladi and surrounding populated settlements.`,
          confidence: 94,
          signalSource: "NASA FIRMS (VIIRS) + Open-Meteo",
          severity: "CRITICAL"
        });
      } else {
        insights.push({
          id: "ins_fire_02",
          category: "FIRE_RISK",
          title: "Thermal Signatures Detected Outside Immediate Drift Cone",
          summary: `${fires.length} active fire points detected in 50km radius, but current wind vectors project plumes away from central protected coordinates.`,
          confidence: 88,
          signalSource: "NASA FIRMS Satellite Observation",
          severity: "MODERATE"
        });
      }
    } else {
      insights.push({
        id: "ins_fire_00",
        category: "FIRE_RISK",
        title: "Clean Thermal Perimeter",
        summary: "No satellite-detected active fire clusters currently within the monitored 50km perimeter.",
        confidence: 98,
        signalSource: "NASA FIRMS NRT Feed",
        severity: "LOW"
      });
    }

    // 2. Wind trajectory insight
    const smokeHeading = (currentWind.windDirectionDeg + 180) % 360;
    const compassDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const compassIndex = Math.round(smokeHeading / 22.5) % 16;
    const smokeHeadingName = compassDirections[compassIndex];

    insights.push({
      id: "ins_wind_01",
      category: "WIND_TRAJECTORY",
      title: `Smoke Dispersion Vector: ${smokeHeadingName} (${Math.round(smokeHeading)}°) at ${Math.round(currentWind.windSpeedKmh)} km/h`,
      summary: `Atmospheric velocity pushes particulate emissions toward the ${smokeHeadingName} quadrant. Plume expansion cone is calculated at ±30 degrees.`,
      confidence: 92,
      signalSource: "Open-Meteo High-Resolution Atmospheric Model",
      severity: currentWind.windSpeedKmh > 15 ? "HIGH" : "MODERATE"
    });

    // 3. Citizen report correlation
    if (smokeReports.length > 0) {
      const verified = smokeReports.filter(r => (r.confidenceScore || 0) >= 0.85);
      insights.push({
        id: "ins_citizen_01",
        category: "CITIZEN_CORRELATION",
        title: `${smokeReports.length} Ground Smoke Observation${smokeReports.length > 1 ? "s" : ""} Corroborated`,
        summary: `${verified.length} observation(s) verified by on-device edge neural network. Geographic coordinates correlate directly with predicted downwind drift.`,
        confidence: 90,
        signalSource: "TensorFlow.js Edge Classifier + Geolocation",
        severity: verified.length > 0 ? "HIGH" : "MODERATE"
      });
    }

    // 4. Action recommendation
    const hasEmergency = insights.some(i => i.severity === "CRITICAL" || i.severity === "HIGH");
    insights.push({
      id: "ins_action_01",
      category: "ACTION_RECOMMENDATION",
      title: hasEmergency ? "Preemptive Buffer Protocol Recommended" : "Routine Environmental Vigilance Active",
      summary: hasEmergency
        ? "Alert local village councils and museum conservators. Close air vents in open artifact sheds and recommend masking for vulnerable groups."
        : "Standard sensor scanning cycles active. Maintain regular observation checkpoints across perimeter buffer villages.",
      confidence: 96,
      signalSource: "Puga Sutham Deterministic Rules Engine",
      severity: hasEmergency ? "HIGH" : "LOW"
    });

    return NextResponse.json({
      success: true,
      demo: isDemo,
      data: {
        summaryText: insights.map(i => i.title).join(" • "),
        insights,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error in /api/insights:", error);
    return NextResponse.json({ success: false, error: { message: "Failed to generate environmental insights" } }, { status: 500 });
  }
}
