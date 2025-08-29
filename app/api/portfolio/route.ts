// app/api/portfolio/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const [
            profile,
            skills,
            projects,
            experiences,
            blogPosts,
            siteConfig
        ] = await Promise.all([
            // Get active profile
            db.profile.findFirst({
                where: { isActive: true }
            }),

            // Get skills grouped by category
            db.skill.findMany({
                where: { isActive: true },
                orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }]
            }),

            // Get active projects
            db.project.findMany({
                where: { isActive: true },
                orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]
            }),

            // Get experiences
            db.experience.findMany({
                where: { isActive: true },
                orderBy: [{ startDate: 'desc' }]
            }),

            // Get published blog posts
            db.blogPost.findMany({
                where: {
                    isPublished: true
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                    coverImage: true,
                    tags: true,
                    publishedAt: true,
                    readTime: true,
                    views: true
                },
                orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
                take: 6 // Limit to recent posts
            }),

            // Get site configuration
            db.siteConfig.findMany({
                where: { isActive: true }
            })
        ]);

        // Group skills by category
        const skillsByCategory = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {} as Record<string, typeof skills>);

        // Convert site config to key-value pairs
        const config = siteConfig.reduce((acc, item) => {
            let value = item.value;
            if (item.type === 'number') value = parseInt(item.value);
            if (item.type === 'boolean') value = item.value === 'true';
            if (item.type === 'json') {
                try { value = JSON.parse(item.value); } catch { /* keep as string */ }
            }
            acc[item.key] = value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({
            profile,
            skills: skillsByCategory,
            projects,
            experiences,
            blogPosts,
            config,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("❌ Portfolio API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch portfolio data" },
            { status: 500 }
        );
    }
}