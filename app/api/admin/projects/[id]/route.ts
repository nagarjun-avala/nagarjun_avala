import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// app/api/admin/projects/[id]/route.ts
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await req.json();
        const project = await db.project.update({
            where: { id: params.id },
            data
        });
        return NextResponse.json(project);
    } catch {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await db.project.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}