import { NextResponse } from "next/server";

// app/api/track/blog/route.ts - Blog view tracking
export async function POST(req: Request) {
    try {
        const { postId, readTime } = await req.json();
        const clientInfo = getClientInfo(req);

        if (clientInfo.isBot) {
            return NextResponse.json({ success: true, tracked: false });
        }

        const visitor = await db.visitor.findUnique({
            where: { ip: clientInfo.ip }
        });

        // Track blog view
        await db.blogView.create({
            data: {
                postId,
                visitorId: visitor?.id,
                ip: clientInfo.ip,
                userAgent: clientInfo.userAgent,
                referrer: clientInfo.referrer,
                readTime: readTime || null
            }
        });

        // Update blog post view count
        await db.blogPost.update({
            where: { id: postId },
            data: {
                views: { increment: 1 }
            }
        });

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error("❌ Blog tracking error:", error);
        return NextResponse.json({ error: "Failed to track blog view" }, { status: 500 });
    }
}