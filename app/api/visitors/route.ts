// app/api/visitors/route.ts (updated)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientInfo } from "@/utils/analytics";

type GeoLocation = {
    country: string | null;
    region: string | null;
    city: string | null;
};

const geoCache = new Map<string, { location: GeoLocation; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getGeoLocation(ip: string): Promise<GeoLocation> {
    if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168")) {
        return { country: "Local", region: null, city: null };
    }

    const now = Date.now();
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

        geoCache.set(ip, { location, expiry: now + CACHE_TTL });
        return location;
    } catch (err) {
        console.error("🌍 Geo lookup failed:", err);
        return { country: null, region: null, city: null };
    }
}

export async function POST(req: Request) {
    try {
        const clientInfo = getClientInfo(req);
        console.log("Visitor tracking:", clientInfo.ip, clientInfo.device, clientInfo.browser);

        let visitor = await db.visitor.findUnique({ where: { ip: clientInfo.ip } });
        const isNewVisitor = !visitor;

        if (visitor) {
            visitor = await db.visitor.update({
                where: { ip: clientInfo.ip },
                data: {
                    visits: { increment: 1 },
                    lastVisit: new Date(),
                    userAgent: clientInfo.userAgent
                },
            });
        } else {
            const location = await getGeoLocation(clientInfo.ip);
            visitor = await db.visitor.create({
                data: {
                    ip: clientInfo.ip,
                    visits: 1,
                    userAgent: clientInfo.userAgent,
                    lastVisit: new Date(),
                    ...location
                },
            });
        }

        // Get analytics for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalVisitors, todayVisitors] = await Promise.all([
            db.visitor.count(),
            db.visitor.count({
                where: { lastVisit: { gte: today } }
            })
        ]);

        return NextResponse.json({
            totalVisitors,
            todayVisitors,
            thisVisitor: visitor.visits,
            isNewVisitor,
            location: {
                country: visitor.country,
                region: visitor.region,
                city: visitor.city,
            },
            device: clientInfo.device,
            browser: clientInfo.browser
        });
    } catch (error) {
        console.error("❌ Visitor API error:", error);
        return NextResponse.json(
            { error: "Failed to update visitor" },
            { status: 500 }
        );
    }
}