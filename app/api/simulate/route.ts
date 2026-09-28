import { NextRequest, NextResponse } from "next/server";
import { calculateDriftRisk, getDriftConePolygon, calculateDistance, calculateBearing } from "../../../lib/drift";
import { KEELADI_LAT, KEELADI_LON } from "../../../lib/weather";
import { PROTECTED_AREAS } from "../../../lib/protected-areas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fireLat,
      fireLon,
      windSpeedKmh,
      windDirectionDeg,
      predictionMinutes = 60,
      customTargetLat,
      customTargetLon,
    } = body;

    const lat = Number(fireLat);
    const lon = Number(fireLon);
    const speed = Number(windSpeedKmh) || 15;
    const direction = Number(windDirectionDeg) || 0;
    const duration = Number(predictionMinutes) || 60;

    const targetLat = customTargetLat ? Number(customTargetLat) : KEELADI_LAT;
    const targetLon = customTargetLon ? Number(customTargetLon) : KEELADI_LON;

    // 1. Calculate trajectory distance traveled in duration minutes
    const travelDistanceKm = (speed * (duration / 60));

    // 2. Generate drift cone polygon
    const conePolygon = getDriftConePolygon(lat, lon, direction, Math.max(travelDistanceKm, 2));

    // 3. Smoke heading (wind moves from direction -> travels opposite)
    const smokeHeading = (direction + 180) % 360;

    // 4. Target evaluation
    const targetRisk = calculateDriftRisk(lat, lon, targetLat, targetLon, direction, speed);
    const targetDistance = calculateDistance(lat, lon, targetLat, targetLon);
    const targetBearing = calculateBearing(lat, lon, targetLat, targetLon);

    // 5. Evaluate all protected areas
    const affectedProtectedAreas = PROTECTED_AREAS.map(area => {
      const risk = calculateDriftRisk(lat, lon, area.latitude, area.longitude, direction, speed);
      const distance = calculateDistance(lat, lon, area.latitude, area.longitude);
      return {
        ...area,
        distanceKm: Math.round(distance * 10) / 10,
        isWithinDriftCone: risk.isWithinDriftCone,
        estimatedArrivalMinutes: risk.estimatedArrivalMinutes,
      };
    }).filter(a => a.isWithinDriftCone || a.distanceKm <= travelDistanceKm);

    // 6. Generate granular prediction timeline milestones (Now, +10, +20, +30, +40, +60 min)
    const milestones = [10, 20, 30, 40, 60]
      .filter(m => m <= duration)
      .map(mins => {
        const distKm = Math.round((speed * (mins / 60)) * 10) / 10;
        let severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = "LOW";
        if (mins <= 20) severity = "MODERATE";
        if (mins <= 35) severity = "HIGH";
        if (mins >= 40) severity = "CRITICAL";

        return {
          minutes: mins,
          label: `+${mins} min`,
          distanceKm: distKm,
          severity,
          summary: mins <= 10 
            ? "Smoke plume expands along primary wind corridor"
            : mins <= 25
            ? "Moderate atmospheric particulate dispersion zone"
            : mins <= 40
            ? "High ground-level concentration envelope"
            : "Critical multi-kilometer exposure perimeter"
        };
      });

    return NextResponse.json({
      success: true,
      simulation: true,
      data: {
        origin: { latitude: lat, longitude: lon },
        target: { latitude: targetLat, longitude: targetLon, distanceKm: Math.round(targetDistance * 10) / 10, bearing: Math.round(targetBearing) },
        wind: { speedKmh: speed, directionDeg: direction, smokeHeadingDeg: Math.round(smokeHeading) },
        predictionMinutes: duration,
        travelDistanceKm: Math.round(travelDistanceKm * 10) / 10,
        targetRisk,
        conePolygon,
        milestones,
        affectedProtectedAreas
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to run simulation" } },
      { status: 400 }
    );
  }
}
