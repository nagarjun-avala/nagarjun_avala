import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type GeoLocation = {
    country: string | null;
    region: string | null;
    city: string | null;
};

// 🔹 Cache entry with TTL
type CacheEntry = {
    location: GeoLocation;
    expiry: number; // timestamp
};

// 🔹 In-memory cache (IP → CacheEntry)
const geoCache = new Map<string, CacheEntry>();

// TTL duration (e.g. 24h = 86400000 ms)
const CACHE_TTL = 24 * 60 * 60 * 1000;

// 🔹 Extract client IP
function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    let ip = forwarded || req.headers.get("x-real-ip") || "unknown";

    // Normalize IPv6-mapped IPv4 (::ffff:127.0.0.1 → 127.0.0.1)
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }

    return ip;
}

// 🔹 Lookup geolocation (cached with TTL)
async function getGeoLocation(ip: string): Promise<GeoLocation> {
    if (
        ip === "unknown" ||
        ip === "127.0.0.1" ||
        ip.startsWith("192.168")
    ) {
        return { country: "Local", region: null, city: null };
    }

    const now = Date.now();

    // Check cache
    const cached = geoCache.get(ip);
    if (cached && cached.expiry > now) {
        return cached.location;
    }

    try {
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!res.ok) throw new Error("Geo API failed");

        const data = await res.json();
        const location: GeoLocation = {
            country: data.country_name ?? null,
            region: data.region ?? null,
            city: data.city ?? null,
        };

        // Cache result with expiry
        geoCache.set(ip, { location, expiry: now + CACHE_TTL });

        return location;
    } catch (err) {
        console.error("🌍 Geo lookup failed:", err);
        return { country: null, region: null, city: null };
    }
}

// 🔹 POST – Track or update visitor
export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        console.log("Visitor IP:", ip);

        let visitor = await db.visitor.findUnique({ where: { ip } });

        if (visitor) {
            visitor = await db.visitor.update({
                where: { ip },
                data: { visits: { increment: 1 } },
            });
        } else {
            const location = await getGeoLocation(ip);
            visitor = await db.visitor.create({
                data: { ip, visits: 1, ...location },
            });
        }

        const totalVisitors = await db.visitor.count();

        return NextResponse.json({
            totalVisitors,
            thisVisitor: visitor.visits,
            location: {
                country: visitor.country,
                region: visitor.region,
                city: visitor.city,
            },
        });
    } catch (error) {
        console.error("❌ Visitor API error:", error);
        return NextResponse.json(
            { error: "Failed to update visitor" },
            { status: 500 }
        );
    }
}

// 🔹 GET – Fetch analytics
export async function GET() {
    try {
        const visitors = await db.visitor.findMany();

        return NextResponse.json({
            totalVisitors: visitors.length,
            visitors,
        });
    } catch (error) {
        console.error("❌ Analytics fetch failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
