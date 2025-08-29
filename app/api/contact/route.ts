// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
  honeypot: z.string().optional(), // Spam protection
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
    const validatedData = ContactSchema.parse(body);

    // Honeypot spam protection
    if (validatedData.honeypot) {
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400 }
      );
    }

    const { ip, userAgent } = getClientInfo(req);

    // Save to database
    const submission = await db.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        ip,
        userAgent
      }
    });

    // TODO: Send email notification (using Resend, Nodemailer, etc.)
    // await sendEmailNotification(submission);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
      id: submission.id
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("❌ Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}