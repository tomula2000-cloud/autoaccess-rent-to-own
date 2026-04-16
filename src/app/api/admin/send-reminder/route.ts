import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendDocumentReminderEmail } from "@/lib/email";

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
        note: "Document reminder email sent by admin.",
        updatedById: admin?.id || application.applicantId,
      },
    });

    return NextResponse.json({ success: true, message: "Reminder sent successfully." });
  } catch (error) {
    console.error("Send reminder error:", error);
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 });
  }
}
