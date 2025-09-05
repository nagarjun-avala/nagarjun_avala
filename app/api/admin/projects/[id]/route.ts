import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export async function PUT(req: Request, context: Params) {
    const { params } = context;
    try {
        const data = await req.json();
        const project = await db.project.update({
            where: { id: params.id },
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

export async function DELETE(req: Request, context: Params) {
    const { params } = context;
    try {
        await db.project.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
