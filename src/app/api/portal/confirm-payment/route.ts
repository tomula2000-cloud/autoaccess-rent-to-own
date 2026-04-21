import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("autoaccess_portal_email")?.value;

    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const application = await prisma.application.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        applicantId: true,
        referenceNumber: true,
        fullName: true,
        email: true,
        status: true,
        proofOfPaymentUrls: true,
        invoiceNumber: true,
        invoiceTotalDue: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!["INVOICE_ISSUED", "AWAITING_PAYMENT"].includes(application.status)) {
      return NextResponse.json(
        { error: "Invalid application status for payment confirmation" },
        { status: 400 }
      );
    }

    const popUrls = (application.proofOfPaymentUrls as any[]) || [];
    if (popUrls.length === 0) {
      return NextResponse.json(
        { error: "Please upload at least one proof of payment document before confirming." },
        { status: 400 }
      );
    }

    const now = new Date();

    await prisma.application.update({
      where: { id: application.id },
      data: {
        status: "PAYMENT_UNDER_VERIFICATION",
        clientPaymentCompletedAt: now,
        adminSeen: false,
      },
    });

    // Log the status change
    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: application.status,
        toStatus: "PAYMENT_UNDER_VERIFICATION",
        note: `Client confirmed payment completion. ${popUrls.length} proof(s) of payment uploaded.`,
        updatedById: application.applicantId,
      },
    });

    // Send admin notification email (non-blocking)
    try {
      const { sendPaymentCompletedAdminEmail } = await import("@/lib/email");
      await sendPaymentCompletedAdminEmail({
        fullName: application.fullName,
        email: application.email,
        referenceNumber: application.referenceNumber,
        invoiceNumber: application.invoiceNumber || "",
        invoiceTotalDue: application.invoiceTotalDue || "",
        proofOfPaymentCount: popUrls.length,
        completedAt: now,
      });
    } catch (err) {
      console.error("Admin payment alert email failed (non-blocking):", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment confirmation failed:", error);
    return NextResponse.json({ error: "Payment confirmation failed" }, { status: 500 });
  }
}
