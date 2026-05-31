import { Resend } from "resend";

import { siteConfig } from "@/lib/site-config";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;

// Only construct a real client when a real key is present; otherwise we log to
// the server console (handy in local dev where RESEND_API_KEY is a placeholder).
const resend =
  apiKey && apiKey.startsWith("re_") && apiKey !== "re_xxx"
    ? new Resend(apiKey)
    : null;

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    const link = html.match(/href="([^"]+)"/)?.[1];
    console.log(`\n📧 [DEV EMAIL] to=${to} | ${subject}`);
    if (link) console.log(`🔗 ${link}\n`);
    return;
  }
  await resend.emails.send({ from, to, subject, html });
}

function layout(heading: string, body: string, cta?: { label: string; href: string }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:32px;color:#211c17">
    <h1 style="font-size:22px;letter-spacing:4px;color:#8a7b64;text-align:center">${siteConfig.name.toUpperCase()}</h1>
    <h2 style="font-size:20px;margin-top:24px">${heading}</h2>
    <p style="font-size:15px;line-height:1.6;color:#4a4036">${body}</p>
    ${
      cta
        ? `<p style="margin:28px 0"><a href="${cta.href}" style="background:#8a7b64;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:15px">${cta.label}</a></p>
           <p style="font-size:13px;color:#8a7b64;word-break:break-all">${cta.href}</p>`
        : ""
    }
    <hr style="border:none;border-top:1px solid #ece4d9;margin:28px 0" />
    <p style="font-size:12px;color:#a99c87">© ${siteConfig.legalName}</p>
  </div>`;
}

export async function sendVerificationEmail(to: string, link: string) {
  await send(
    to,
    `Verify your ${siteConfig.name} account`,
    layout(
      "Confirm your email",
      `Welcome to ${siteConfig.name}! Please confirm your email address to activate your account and start shopping.`,
      { label: "Verify email", href: link },
    ),
  );
}

export async function sendPasswordResetEmail(to: string, link: string) {
  await send(
    to,
    `Reset your ${siteConfig.name} password`,
    layout(
      "Reset your password",
      "We received a request to reset your password. Choose a new one using the button below. This link expires in 1 hour. If you didn't request this, you can safely ignore this email.",
      { label: "Reset password", href: link },
    ),
  );
}

export async function sendOrderConfirmationEmail(
  to: string,
  data: { orderNumber: string; totalLabel: string; itemsHtml: string },
) {
  await send(
    to,
    `Your ${siteConfig.name} order ${data.orderNumber}`,
    layout(
      "Thank you for your order!",
      `We've received your order <strong>${data.orderNumber}</strong> and it's being prepared. Here's a summary:</p>
       <table style="width:100%;font-size:14px;border-collapse:collapse">${data.itemsHtml}</table>
       <p style="font-size:16px;margin-top:16px"><strong>Total: ${data.totalLabel}</strong>`,
    ),
  );
}
