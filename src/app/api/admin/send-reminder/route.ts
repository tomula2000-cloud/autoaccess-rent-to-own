import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendDocumentReminderEmail } from "@/lib/email";
import { sendBulkSMS } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string; id?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        referenceNumber: true,
        status: true,
        applicantId: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    const reminderCount = await prisma.statusLog.count({
      where: {
        applicationId: application.id,
        note: { contains: "reminder" },
      },
    });

    if (reminderCount >= 3) {
      return NextResponse.json({
        success: false,
        message: "Maximum reminders reached for this application. No further reminders will be sent.",
      });
    }

    const firstName = application.fullName.split(" ")[0];

    await sendDocumentReminderEmail({
      to: application.email,
      fullName: application.fullName,
      referenceNumber: application.referenceNumber,
    });

    if (reminderCount < 2) {
      try {
        await sendBulkSMS({
          to: application.phone,
          message: `Dear ${firstName}, your Auto Access application (Ref: ${application.referenceNumber}) is about to expire due to outstanding documents. Please log in urgently to upload them: https://autoaccess.co.za/portal. Check your email to explore other options. Contact us if you need assistance.`,
        });
      } catch (smsError) {
        console.error("Reminder SMS failed:", smsError);
      }
    }

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: application.status as never,
        toStatus: application.status as never,
        note: `Document reminder ${reminderCount + 1} sent by admin${reminderCount < 2 ? " (email and SMS)" : " (email only)"}.`,
        updatedById: admin?.id || application.applicantId,
      },
    });

    return NextResponse.json({
      success: true,
      message: reminderCount < 2
        ? "Reminder email and SMS sent successfully."
        : "Final reminder email sent. No further reminders will be sent for this application.",
    });
  } catch (error) {
    console.error("Send reminder error:", error);
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 });
  }
}
