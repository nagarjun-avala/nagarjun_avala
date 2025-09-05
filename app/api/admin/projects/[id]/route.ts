import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
    // Extract id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    try {
        const data = await request.json();
        const project = await db.project.update({
            where: { id },
            data,
        });
        return NextResponse.json(project);
    } catch {
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    try {
        await db.project.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
