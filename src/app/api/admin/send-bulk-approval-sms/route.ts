import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendBulkSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { status: "APPROVED_IN_PRINCIPLE" },
    select: { fullName: true, phone: true, referenceNumber: true },
  });

  if (applications.length === 0) {
    return NextResponse.json({ success: true, sent: 0, message: "No approved applications found." });
  }

  let sent = 0;
  let failed = 0;

  for (const app of applications) {
    if (!app.phone) { failed++; continue; }
    try {
      const firstName = app.fullName.split(" ")[0];
      await sendBulkSMS({
        to: app.phone,
        message: `Dear ${firstName}, great news! Your Auto Access rent-to-own application (Ref: ${app.referenceNumber}) has been approved in principle. Log in to your portal at autoaccess.co.za/portal using your reference number and email to proceed. Need help? Speak to your appointed sales champion on WhatsApp: 074 546 2367.`,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ success: true, sent, failed });
}
