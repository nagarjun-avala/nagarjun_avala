// app/api/admin/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const LoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

function getClientInfo(req: Request) {
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    const ip = forwarded || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    return { ip, userAgent };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = LoginSchema.parse(body);

        // Find admin user
        const user = await db.adminUser.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ],
                isActive: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate session token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        const { ip, userAgent } = getClientInfo(req);

        // Create session record
        await db.adminSession.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                ip,
                userAgent: userAgent.substring(0, 500), // Truncate long user agents
            }
        });

        // Update last login
        await db.adminUser.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Set HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });

        return response;

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input", details: error.errors },
                { status: 400 }
            );
        }

        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}