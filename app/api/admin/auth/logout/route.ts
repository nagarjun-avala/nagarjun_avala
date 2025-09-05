import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// app/api/admin/auth/logout/route.ts
export async function POST() {
    try {
        const token = (await cookies()).get('admin-token')?.value;

        if (token) {
            // Invalidate session in database
            await db.adminSession.deleteMany({
                where: { token }
            });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.delete('admin-token');

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}