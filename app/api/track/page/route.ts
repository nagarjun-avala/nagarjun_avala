// app/api/track/page/route.ts - Page view tracking
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientInfo } from "@/utils/analytics";
import { getGeoLocation } from "@/lib/geoLocation";

export async function POST(req: Request) {
    try {
        const { page, title, timeSpent } = await req.json();
        const clientInfo = getClientInfo(req);

        // Skip bot traffic
        if (clientInfo.isBot) {
            return NextResponse.json({ success: true, tracked: false });
        }

        // Find or create visitor
        let visitor = await db.visitor.findUnique({
            where: { ip: clientInfo.ip }
        });

        if (page === "/") {
            if (!visitor) {
                // Get geolocation for new visitor
                const location = await getGeoLocation(clientInfo.ip, { accuracy: "high" });
                visitor = await db.visitor.create({
                    data: {
                        visits: 1,
                        userAgent: clientInfo.userAgent,
                        lastVisit: new Date(),
                        ...location,
                        ip: clientInfo.ip,
                    }
                });
            } else {
                // Update existing visitor
                await db.visitor.update({
                    where: { id: visitor.id },
                    data: {
                        lastVisit: new Date(),
                        userAgent: clientInfo.userAgent,
                        visits: { increment: 1 }
                    }
                });
            }

            // Create page view record
            await db.pageView.create({
                data: {
                    visitorId: visitor.id,
                    ip: clientInfo.ip,
                    page,
                    title: title?.substring(0, 200),
                    referrer: clientInfo.referrer?.substring(0, 500),
                    userAgent: clientInfo.userAgent,
                    device: clientInfo.device,
                    browser: clientInfo.browser,
                    country: visitor.country,
                    region: visitor.region,
                    city: visitor.city,
                    duration: timeSpent || null
                }
            });
        }

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error("❌ Page tracking error:", error);
        return NextResponse.json({ error: "Failed to track page view" }, { status: 500 });
    }
}