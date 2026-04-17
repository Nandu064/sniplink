import nodemailer from "nodemailer";
import { APP_NAME, BASE_URL } from "./constants";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const IS_DEV = process.env.NODE_ENV !== "production";

if (!SMTP_USER || !SMTP_PASS) {
  console.warn(
    "\x1b[33m⚠ SMTP credentials not configured. Password reset emails will not be sent.\n" +
      "  Add SMTP_USER and SMTP_PASS to .env.local\x1b[0m"
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const FROM_EMAIL =
  process.env.SMTP_FROM || `${APP_NAME} Support Team <noreply@sniplink.com>`;

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  // Always log the reset URL in dev mode so testing works without SMTP
  if (IS_DEV) {
    console.log("\x1b[36m");
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║          PASSWORD RESET LINK (DEV MODE)         ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║  Email: ${email}`);
    console.log(`║  URL:   ${resetUrl}`);
    console.log("╚══════════════════════════════════════════════════╝");
    console.log("\x1b[0m");
  }

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("⚠ Skipping email send — SMTP not configured.");
    return;
  }

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <span style="font-size: 28px; font-weight: 800; color: #7C3AED; letter-spacing: -0.02em;">${APP_NAME}</span>
                    </td>
                  </tr>
                  <!-- Card -->
                  <tr>
                    <td style="background-color: #ffffff; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                      <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #0f172a;">
                        Reset your password
                      </h1>
                      <p style="margin: 0 0 24px; font-size: 15px; color: #64748b; line-height: 1.6;">
                        We received a request to reset the password for your ${APP_NAME} account. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding-bottom: 24px;">
                            <a href="${resetUrl}" style="display: inline-block; background-color: #7C3AED; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 13px 36px; border-radius: 8px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                        If you didn't request a password reset, you can safely ignore this email — your password won't change.
                      </p>
                      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                      <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
                        If the button doesn't work, paste this link into your browser:<br />
                        <a href="${resetUrl}" style="color: #7C3AED; word-break: break-all;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 24px;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                        &copy; ${new Date().getFullYear()} ${APP_NAME} Support Team. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
