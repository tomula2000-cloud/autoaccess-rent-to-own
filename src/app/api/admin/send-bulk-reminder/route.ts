import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendDocumentReminderEmail } from "@/lib/email";

const REMINDER_STATUSES = [
  "APPLICATION_RECEIVED",
  "PRE_QUALIFIED",
  "AWAITING_DOCUMENTS",
  "ADDITIONAL_DOCUMENTS_REQUIRED",
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    const applications = await prisma.application.findMany({
      where: { status: { in: REMINDER_STATUSES as never[] } },
      select: {
        id: true,
        email: true,
        fullName: true,
        referenceNumber: true,
        status: true,
        applicantId: true,
      },
    });

    if (applications.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No applications need reminders." });
    }

    let sent = 0;
    let failed = 0;

    for (const application of applications) {
      try {
        await sendDocumentReminderEmail({
          to: application.email,
          fullName: application.fullName,
          referenceNumber: application.referenceNumber,
        });

        await prisma.statusLog.create({
          data: {
            applicationId: application.id,
            fromStatus: application.status as never,
            toStatus: application.status as never,
            note: "Bulk document reminder email sent by admin.",
            updatedById: admin?.id || application.applicantId,
          },
        });

        sent++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      message: `Reminder sent to ${sent} client${sent !== 1 ? "s" : ""}${failed > 0 ? `. ${failed} failed.` : "."}`,
    });
  } catch (error) {
    console.error("Bulk reminder error:", error);
    return NextResponse.json({ error: "Failed to send bulk reminders" }, { status: 500 });
  }
}
