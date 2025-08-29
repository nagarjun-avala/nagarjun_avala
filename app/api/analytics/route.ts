
// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const [
            totalVisitors,
            totalMessages,
            totalProjects,
            totalBlogPosts,
            recentVisitors,
            topCountries,
            recentMessages
        ] = await Promise.all([
            db.visitor.count(),
            db.contactSubmission.count(),
            db.project.count({ where: { isActive: true } }),
            db.blogPost.count({ where: { isPublished: true } }),

            db.visitor.findMany({
                where: {
                    lastVisit: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                },
                orderBy: { lastVisit: 'desc' },
                take: 10
            }),

            db.visitor.groupBy({
                by: ['country'],
                _count: { country: true },
                where: { country: { not: null } },
                orderBy: { _count: { country: 'desc' } },
                take: 5
            }),

            db.contactSubmission.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    status: true
                }
            })
        ]);

        return NextResponse.json({
            overview: {
                totalVisitors,
                totalMessages,
                totalProjects,
                totalBlogPosts
            },
            visitors: {
                recent: recentVisitors,
                topCountries: topCountries.map(c => ({
                    country: c.country,
                    count: c._count.country
                }))
            },
            messages: recentMessages,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Analytics API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}