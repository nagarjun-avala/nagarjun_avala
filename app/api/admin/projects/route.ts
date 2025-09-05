// app/api/admin/projects/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const projects = await db.project.findMany({
            orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]
        });
        return NextResponse.json(projects);
    } catch {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const project = await db.project.create({ data });
        return NextResponse.json(project);
    } catch {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}