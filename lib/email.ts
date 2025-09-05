// lib/email.ts - Email service integration
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
    name: string;
    email: string;
    message: string;
    ip?: string;
}

export async function sendContactEmail(data: EmailData): Promise<void> {
    try {
        await resend.emails.send({
            from: 'contact@yourdomain.com', // Use your verified domain
            to: 'nagarjun.avala.official@gmail.com',
            subject: `New Contact Form Message from ${data.name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4;">New Contact Form Submission</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.ip ? `<p><strong>IP:</strong> ${data.ip}</p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #06b6d4; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${data.message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">
              This email was sent from your portfolio contact form.
              <br>
              Received at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
        });

        // Send confirmation email to the sender
        await resend.emails.send({
            from: 'noreply@yourdomain.com',
            to: data.email,
            subject: 'Thanks for reaching out!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4;">Thanks for your message!</h2>
          
          <p>Hi ${data.name},</p>
          
          <p>Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as possible, usually within 24 hours.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0;">Your Message:</h4>
            <p style="font-style: italic; color: #666;">"${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}"</p>
          </div>
          
          <p>Best regards,<br>Nagarjun Avala</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">
              This is an automated response from nagarjunavala.com
            </p>
          </div>
        </div>
      `,
        });

    } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Failed to send email');
    }
}