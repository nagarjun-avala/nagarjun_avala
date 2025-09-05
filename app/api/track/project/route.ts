import { db } from "@/lib/db";
import { getClientInfo } from "@/utils/analytics";
import { NextResponse } from "next/server";

// app/api/track/project/route.ts - Project view tracking
export async function POST(req: Request) {
    try {
        const { projectId } = await req.json();
        const clientInfo = getClientInfo(req);

        if (clientInfo.isBot) {
            return NextResponse.json({ success: true, tracked: false });
        }

        // Find visitor
        const visitor = await db.visitor.findUnique({
            where: { ip: clientInfo.ip }
        });

        // Track project view
        await db.projectView.create({
            data: {
                projectId,
                visitorId: visitor?.id,
                ip: clientInfo.ip,
                userAgent: clientInfo.userAgent,
                referrer: clientInfo.referrer
            }
        });

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error("❌ Project tracking error:", error);
        return NextResponse.json({ error: "Failed to track project view" }, { status: 500 });
    }
}