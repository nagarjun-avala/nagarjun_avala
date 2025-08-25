import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function getClientIp(req: Request) {
    const forwarded = req.headers.get("x-forwarded-for");
    let ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";

    // Normalize IPv6-mapped IPv4 (::ffff:127.0.0.1 → 127.0.0.1)
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }

    return ip;
}


async function getGeoLocation(ip: string) {
    console.log("In get Location", ip)
    try {
        if (ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168")) {
            return { country: "Local", region: null, city: null };
        }
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!res.ok) return {};
        const data = await res.json();
        return {
            country: data.country_name || null,
            region: data.region || null,
            city: data.city || null,
        };
    } catch (err) {
        console.error("Geo lookup failed", err);
        return {};
    }
}

// 🔹 POST – Track/update visitor
export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        console.log("Visitor IP:", ip);

        let visitor = await db.visitor.findUnique({ where: { ip } });
        console.log("Existing visitor:", visitor);

        if (visitor) {
            visitor = await db.visitor.update({
                where: { ip },
                data: { visits: { increment: 1 } },
            });
        } else {
            const location = await getGeoLocation(ip);
            console.log({ location })
            visitor = await db.visitor.create({
                data: { ip, ...location },
            });
        }

        console.log("Location: ", await getGeoLocation(ip), "\nIP: ", ip)

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
        console.error("Visitor API error:", error);
        return NextResponse.json({ error: "Failed to update visitor" }, { status: 500 });
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
    } catch {
        return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
}
