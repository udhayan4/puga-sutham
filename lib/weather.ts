export const KEELADI_LAT = 9.855924;
export const KEELADI_LON = 78.193178;

export async function fetchCurrentWind(lat: number = KEELADI_LAT, lon: number = KEELADI_LON) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m`;

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
        throw new Error(`Failed to fetch wind data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        windSpeedKmh: data?.current?.wind_speed_10m ?? 14,
        windDirectionDeg: data?.current?.wind_direction_10m ?? 220,
        recordedAt: data?.current?.time ?? new Date().toISOString(),
    };
}
