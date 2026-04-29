import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendApplicationStatusEmail } from "@/lib/email";
import { sendBulkSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    select: { id: true },
  });

  if (!adminUser) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  const applications = await prisma.application.findMany({
    where: { status: "DOCUMENTS_UNDER_REVIEW" },
    select: { id: true, fullName: true, email: true, phone: true, referenceNumber: true, status: true },
  });

  if (applications.length === 0) {
    return NextResponse.json({ success: true, approved: 0, message: "No applications under review." });
  }

  let approved = 0;
  let failed = 0;

  for (const app of applications) {
    try {
      // Update status
      await prisma.application.update({
        where: { id: app.id },
        data: {
          status: "APPROVED_IN_PRINCIPLE",
          approvalValidUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        },
      });

      // Log status change
      await prisma.statusLog.create({
        data: {
          applicationId: app.id,
          fromStatus: "DOCUMENTS_UNDER_REVIEW",
          toStatus: "APPROVED_IN_PRINCIPLE",
          note: "Bulk approved by admin",
          updatedById: adminUser.id,
        },
      });

      // Send email
      try {
        await sendApplicationStatusEmail({
          to: app.email,
          fullName: app.fullName,
          referenceNumber: app.referenceNumber,
          status: "APPROVED_IN_PRINCIPLE",
        });
      } catch (emailErr) {
        console.error(`Email failed for ${app.referenceNumber}:`, emailErr);
      }

      // Send SMS
      try {
        if (app.phone) {
          const firstName = app.fullName.split(" ")[0];
          await sendBulkSMS({
            to: app.phone,
            message: `Dear ${firstName}, great news! Your Auto Access rent-to-own application (Ref: ${app.referenceNumber}) has been approved in principle. Log in to your portal at autoaccess.co.za/portal using your reference number and email to proceed. Need help? Speak to your appointed sales champion on WhatsApp: 074 546 2367.`,
          });
        }
      } catch (smsErr) {
        console.error(`SMS failed for ${app.referenceNumber}:`, smsErr);
      }

      approved++;
    } catch (err) {
      console.error(`Failed to approve ${app.referenceNumber}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ success: true, approved, failed });
}
