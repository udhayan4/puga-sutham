import { NextResponse } from "next/server";
import { fetchCurrentWind } from "../../../lib/weather";
import { redis } from "../../../lib/redis";

import { DEMO_DATASET } from "../../../lib/demo-data";

export const dynamic = "force-static";
export const revalidate = 60;

const CACHE_KEY = "wind_data_current";
const CACHE_TTL_SECONDS = 900; // 15 mins

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        if (searchParams.get("demo") === "true") {
            return NextResponse.json({
                success: true,
                demo: true,
                data: DEMO_DATASET.wind
            });
        }

        const latParam = searchParams.get("lat");
        const lonParam = searchParams.get("lon");
        const lat = latParam ? parseFloat(latParam) : undefined;
        const lon = lonParam ? parseFloat(lonParam) : undefined;

        const dynamicKey = lat && lon ? `${CACHE_KEY}_${lat.toFixed(2)}_${lon.toFixed(2)}` : CACHE_KEY;

        // Attempt to get from cache first
        try {
            const cached = await redis.get(dynamicKey);
            if (cached) {
                return NextResponse.json({ success: true, data: typeof cached === "string" ? JSON.parse(cached) : cached });
            }
        } catch (redisError) {
            console.warn("Redis is not available or failed:", redisError);
        }

        // Fetch fresh data for given coordinates
        const rawData = await fetchCurrentWind(lat, lon);

        try {
            await redis.setex(dynamicKey, CACHE_TTL_SECONDS, JSON.stringify(rawData));
        } catch (redisError) {
            console.warn("Redis set failed:", redisError);
        }

        return NextResponse.json({ success: true, data: rawData });
    } catch (error) {
        console.error("Error in /api/wind:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to fetch wind data" } },
            { status: 500 }
        );
    }
}
