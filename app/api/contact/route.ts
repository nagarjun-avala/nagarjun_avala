// src/pages/api/contact.ts

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔒 Send email or save to DB here
    console.log("Contact Form Submission:", { name, email, message });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
