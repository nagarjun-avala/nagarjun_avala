// app/api/blog/[slug]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const post = await db.blogPost.findUnique({
            where: {
                slug: params.slug,
                isPublished: true
            }
        });

        if (!post) {
            return NextResponse.json(
                { error: "Blog post not found" },
                { status: 404 }
            );
        }

        // Increment view count
        await db.blogPost.update({
            where: { id: post.id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json(post);

    } catch (error) {
        console.error("❌ Blog API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog post" },
            { status: 500 }
        );
    }
}
