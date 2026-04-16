import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, method } = body;

    if (!applicationId || !method) {
      return NextResponse.json({ error: "Application ID and method required" }, { status: 400 });
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

    const methodLabel = method === "whatsapp" ? "WhatsApp" : method === "email" ? "Email" : "Manual";

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "DOCUMENTS_SUBMITTED" as never },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: application.status as never,
        toStatus: "DOCUMENTS_SUBMITTED" as never,
        note: `Documents received via ${methodLabel} and confirmed by admin.`,
        updatedById: admin?.id || application.applicantId,
      },
    });

    await sendStatusUpdateEmail({
      to: application.email,
      fullName: application.fullName,
      referenceNumber: application.referenceNumber,
      status: "DOCUMENTS_SUBMITTED",
      note: `Your documents submitted via ${methodLabel} have been received and confirmed by our team.`,
    });

    return NextResponse.json({ success: true, message: "Documents confirmed successfully." });
  } catch (error) {
    console.error("Confirm documents error:", error);
    return NextResponse.json({ error: "Failed to confirm documents" }, { status: 500 });
  }
}
