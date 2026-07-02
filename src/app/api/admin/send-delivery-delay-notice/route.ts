import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { sendDeliveryDelayEmail } from "@/lib/email";
import { sendBulkSMS } from "@/lib/sms";

const DELIVERY_NOTICE_START = new Date("2026-06-25T00:00:00+02:00");
const EXCLUDED_REFERENCE = "AA69528";

export async function POST() {
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
      where: {
        status: "PAYMENT_CONFIRMED",
        referenceNumber: { not: EXCLUDED_REFERENCE },
        clientPaymentCompletedAt: { gte: DELIVERY_NOTICE_START },
      },
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

    if (applications.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No clients currently qualify for the delivery delay notice.",
      });
    }

    let sent = 0;
    let failed = 0;
    let alreadySent = 0;

    for (const application of applications) {
      try {
        const alreadyNotified = await prisma.statusLog.count({
          where: {
            applicationId: application.id,
            note: { contains: "Delivery delay notice" },
          },
        });
        if (alreadyNotified > 0) {
          alreadySent++;
          continue;
        }

        const firstName = application.fullName.split(" ")[0];

        await sendDeliveryDelayEmail({
          to: application.email,
          fullName: application.fullName,
          referenceNumber: application.referenceNumber,
        });

        try {
          await sendBulkSMS({
            to: application.phone,
            message: `Hi ${firstName}, Auto Access here. Important delivery update sent to your email and client portal (autoaccess.co.za/portal) regarding this week's delays due to nationwide protests. Please check for details. Questions? WhatsApp 0610490061`,
          });
        } catch (smsError) {
          console.error(`Delivery delay SMS failed for ${application.referenceNumber}:`, smsError);
        }

        await prisma.statusLog.create({
          data: {
            applicationId: application.id,
            fromStatus: application.status as never,
            toStatus: application.status as never,
            note: "Delivery delay notice sent by admin (email, SMS and portal popup).",
            updatedById: admin?.id || application.applicantId,
          },
        });

        sent++;
      } catch (err) {
        console.error(`Delivery delay notice failed for ${application.referenceNumber}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      alreadySent,
      totalQualifying: applications.length,
      message: `Delivery delay notice sent to ${sent} client${sent !== 1 ? "s" : ""}.${alreadySent > 0 ? ` ${alreadySent} already notified.` : ""}${failed > 0 ? ` ${failed} failed.` : ""}`,
    });
  } catch (error) {
    console.error("Delivery delay notice error:", error);
    return NextResponse.json({ error: "Failed to send delivery delay notices" }, { status: 500 });
  }
}
