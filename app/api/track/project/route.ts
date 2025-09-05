// app/api/track/project/route.ts - Project view tracking
export async function POST(req: Request) {
    try {
        const { projectId, projectSlug } = await req.json();
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

        // Update project view count
        await db.project.update({
            where: { id: projectId },
            data: {
                views: { increment: 1 }
            }
        });

        return NextResponse.json({ success: true, tracked: true });
    } catch (error) {
        console.error("❌ Project tracking error:", error);
        return NextResponse.json({ error: "Failed to track project view" }, { status: 500 });
    }
}