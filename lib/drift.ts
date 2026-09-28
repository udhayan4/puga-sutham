export const DRIFT_CONE_SPREAD_DEGREES = 30; // +/- 30 degrees drift spread

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

function toDeg(radians: number): number {
    return (radians * 180) / Math.PI;
}

// Distance using Haversine formula (in km)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Bearing from point 1 (fire) to point 2 (site) in degrees (0 = North, 90 = East, etc)
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = toRad(lon2 - lon1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const y = Math.sin(dLon) * Math.cos(rLat2);
    const x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);

    let brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
}

export function calculateDriftRisk(
    fireLat: number,
    fireLon: number,
    siteLat: number,
    siteLon: number,
    meteorologicalWindDir: number, // direction wind is coming *from*
    windSpeedKmh: number
) {
    // 1. Calculate bearing from fire to site
    const bearingToSite = calculateBearing(fireLat, fireLon, siteLat, siteLon);

    // 2. Calculate the direction the smoke is going (opposite of where wind comes from)
    const smokeHeading = (meteorologicalWindDir + 180) % 360;

    // 3. Find the shortest difference between the two angles
    let diff = Math.abs(bearingToSite - smokeHeading);
    if (diff > 180) {
        diff = 360 - diff;
    }

    // 4. Check if within cone
    const isWithinDriftCone = diff <= DRIFT_CONE_SPREAD_DEGREES;

    // 5. Estimate arrival time
    let estimatedArrivalMinutes = null;
    if (isWithinDriftCone && windSpeedKmh > 0) {
        const distanceKm = calculateDistance(fireLat, fireLon, siteLat, siteLon);
        estimatedArrivalMinutes = Math.round((distanceKm / windSpeedKmh) * 60);
    }

    return {
        bearingToSite,
        isWithinDriftCone,
        estimatedArrivalMinutes,
    };
}

/**
 * Generates the geographic polygon points [lat, lon] for a smoke drift cone
 * projected from a fire origin given wind direction (where wind comes from) and speed/time window.
 */
export function getDriftConePolygon(
    fireLat: number,
    fireLon: number,
    meteorologicalWindDir: number,
    distanceKm: number,
    spreadDegrees: number = DRIFT_CONE_SPREAD_DEGREES
): [number, number][] {
    const smokeHeading = (meteorologicalWindDir + 180) % 360;
    const leftHeading = (smokeHeading - spreadDegrees + 360) % 360;
    const rightHeading = (smokeHeading + spreadDegrees) % 360;

    const computeDestinationPoint = (lat: number, lon: number, brngDeg: number, dist: number): [number, number] => {
        const R = 6371; // Earth radius in km
        const d = dist / R;
        const brng = toRad(brngDeg);
        const lat1 = toRad(lat);
        const lon1 = toRad(lon);

        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
        const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));

        return [toDeg(lat2), toDeg(lon2)];
    };

    // Construct arc points from left heading to right heading
    const points: [number, number][] = [[fireLat, fireLon]];
    const steps = 7;
    const stepAngle = (spreadDegrees * 2) / steps;

    for (let i = 0; i <= steps; i++) {
        const angle = (leftHeading + i * stepAngle) % 360;
        points.push(computeDestinationPoint(fireLat, fireLon, angle, distanceKm));
    }

    return points;
}

