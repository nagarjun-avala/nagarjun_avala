import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
// import { NextApiRequest } from "next";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const token = (await cookies()).get('admin-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "No token provided" },
                { status: 401 }
            );
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string, role: string };

        // Check session in database
        const session = await db.adminSession.findUnique({
            where: { token: token, userId: decoded.userId },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date() || !session.user.isActive) {
            return NextResponse.json(
                { error: "Invalid or expired session" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            user: {
                id: session.user.id,
                username: session.user.username,
                email: session.user.email,
                role: session.user.role
            }
        });

    } catch (error) {
        console.error("Verify error:", error);
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
        );
    }
}