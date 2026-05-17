import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendBulkSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string } | undefined;
    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await req.json();
    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        fullName: true,
        phone: true,
        referenceNumber: true,
        status: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "APPROVED_IN_PRINCIPLE") {
      return NextResponse.json({ error: "Application is not in APPROVED_IN_PRINCIPLE status" }, { status: 400 });
    }

    if (!application.phone) {
      return NextResponse.json({ error: "No phone number on record" }, { status: 400 });
    }

    const firstName = application.fullName.split(" ")[0];
    await sendBulkSMS({
      to: application.phone,
      message: `Dear ${firstName}, great news! Your Auto Access rent-to-own application (Ref: ${application.referenceNumber}) has been approved in principle. Log in to your portal at autoaccess.co.za/portal using your reference number and email to proceed. Need help? WhatsApp: 074 546 2367.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send approval SMS error:", error);
    return NextResponse.json({ error: "Failed to send approval SMS" }, { status: 500 });
  }
}
