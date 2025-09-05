// app/api/track/event/route.ts - Custom event tracking
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientInfo } from "@/utils/analytics";

export async function POST(req: Request) {
    try {
        const { event, data, page } = await req.json();
        const clientInfo = getClientInfo(req);

        if (clientInfo.isBot) {
            return NextResponse.json({ success: true, tracked: false });
        }

        // Find visitor
        const visitor = await db.visitor.findUnique({
            where: { ip: clientInfo.ip }
        });

        // Create custom event record (you'd need to add this model to schema)
        // For now, we'll log to console and could store in a general events table
        console.log('📊 Custom Event:', {
            event,
            data,
            page,
            visitor: visitor?.id,
            timestamp: new Date()
        });

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error("❌ Event tracking error:", error);
        return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
    }
}
