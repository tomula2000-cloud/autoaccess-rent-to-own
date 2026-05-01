import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, action } = await req.json();
  if (!userId || !["block", "unblock"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true, isBlocked: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isBlocking = action === "block";

  await prisma.user.update({
    where: { id: userId },
    data: {
      isBlocked: isBlocking,
      blockedAt: isBlocking ? new Date() : null,
    },
  });

  if (isBlocking) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Auto Access <noreply@autoaccess.co.za>",
        replyTo: "admin@autoaccess.co.za",
        to: user.email,
        subject: "Important Notice — Your Auto Access Profile Has Been Suspended",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f4f6fb;padding:32px;">
            <div style="background:#1b2345;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
              <h1 style="color:#c9973a;font-size:22px;margin:0;">Auto Access</h1>
              <p style="color:#ffffff80;font-size:12px;margin:8px 0 0;">Important Account Notice</p>
            </div>
            <div style="background:#ffffff;border-radius:16px;padding:32px;">
              <p style="color:#1b2345;font-size:15px;">Dear ${user.fullName},</p>
              <p style="color:#4d546a;font-size:14px;line-height:1.7;">We are writing to inform you that your Auto Access client profile has been flagged and temporarily suspended due to a high-risk assessment on your account.</p>
              <p style="color:#4d546a;font-size:14px;line-height:1.7;">As a result, access to your client portal has been restricted until further review.</p>
              <div style="background:#fff3f3;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:20px 0;">
                <p style="color:#dc2626;font-size:13px;margin:0;font-weight:600;">Your account access has been suspended.</p>
              </div>
              <p style="color:#4d546a;font-size:14px;line-height:1.7;">If you believe this is an error or would like to discuss your account status, please contact us directly:</p>
              <p style="color:#1b2345;font-size:14px;"><strong>Email:</strong> admin@autoaccess.co.za<br/><strong>Phone:</strong> 087 012 6734<br/><strong>WhatsApp:</strong> 074 546 2367</p>
              <p style="color:#8a9bbf;font-size:12px;margin-top:24px;">Auto Access — Access Holdings (Pty) Ltd</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Block email failed:", emailErr);
    }
  }

  return NextResponse.json({ success: true, isBlocked: isBlocking });
}
