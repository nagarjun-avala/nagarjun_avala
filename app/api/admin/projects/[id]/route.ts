import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export async function PUT(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const data = await req.json();
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

export async function DELETE(req: Request, { params }: Params) {
    const { id } = params;

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
